import { Controller } from 'egg';

export default class VideoController extends Controller {
  public async create() {
    const body = this.ctx.request.body;
    const { Video } = this.app.model;

    this.ctx.validate({
      title: { type: 'string' },
      description: { type: 'string' },
      vodVideoId: { type: 'string' },
      cover: { type: 'string' },
    });
    body.user = this.ctx.user._id;
    const video = await new Video(body).save();
    this.ctx.state = 201;
    this.ctx.body = {
      video,
    };
  }

  public async detail() {
    const { Video, VideoLike, Subscription } = this.app.model;
    const { videoId } = this.ctx.params;
    let video = await Video.findById(videoId).populate('user', '_id username avatar subscribersCount');

    if (!video) {
      this.ctx.throw(404, 'Video Not Found');
    }

    video = video.toJSON();

    video.isLiked = false; // 是否修函
    video.isDisliked = false; // 是否不喜欢
    video.user.isSubscribed = false; // 是否已订阅视频作者

    if (this.ctx.user) {
      const userId = this.ctx.user._id;
      if (await VideoLike.findOne({ user: userId, video: videoId, like: 1 })) {
        video.isLiked = true;
      }
      if (await VideoLike.findOne({ user: userId, video: videoId, like: -1 })) {
        video.isDisliked = true;
      }
      if (await Subscription.findOne({ user: userId, channel: video.user._id })) {
        video.isSubscribed = true;
      }
    }

    this.ctx.body = {
      video,
    };
  }

  public async getVideoList() {
    const { Video } = this.app.model;
    let { pageNum = 1, pageSize = 10 } = this.ctx.query;
    pageNum = Number(pageNum);
    pageSize = Number(pageSize);

    const getVideoList = Video
      .find()
      .populate('user')
      .sort({
        createAt: -1,
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    const getTotalCount = Video.countDocuments();

    const [ videoList, totalCount ] = await Promise.all([
      getVideoList,
      getTotalCount,
    ]);

    this.ctx.body = {
      videoList,
      totalCount,
    };
  }

  public async getUserVideoList() {
    const { Video } = this.app.model;
    const { userId } = this.ctx.params;
    let { pageNum = 1, pageSize = 10 } = this.ctx.query;
    pageNum = Number(pageNum);
    pageSize = Number(pageSize);

    const getVideoList = Video
      .find({
        user: userId,
      })
      .populate('user')
      .sort({
        createAt: -1,
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    const getTotalCount = Video.countDocuments({
      user: userId,
    });

    const [ videoList, totalCount ] = await Promise.all([
      getVideoList,
      getTotalCount,
    ]);

    this.ctx.body = {
      videoList,
      totalCount,
    };
  }

  public async getUserFeedVideoList() {
    const { Video, Subscription } = this.app.model;
    const userId = this.ctx.user._id;
    let { pageNum = 1, pageSize = 10 } = this.ctx.query;
    pageNum = Number(pageNum);
    pageSize = Number(pageSize);

    const channels = await Subscription.find(userId).populate('channel');

    const getVideoList = Video
      .find({
        user: {
          $in: channels.map(item => item.channel.id),
        },
      })
      .populate('user')
      .sort({
        createAt: -1,
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    const getTotalCount = Video.countDocuments({
      user: {
        $in: channels.map(item => item.channel.id),
      },
    });

    const [ videoList, totalCount ] = await Promise.all([
      getVideoList,
      getTotalCount,
    ]);

    this.ctx.body = {
      videoList,
      totalCount,
    };
  }

  public async videoUpdate() {
    const { Video } = this.app.model;
    const body = this.ctx.body;
    const userId = this.ctx.user._id;
    const { videoId } = this.ctx.params;

    this.ctx.validate({
      title: { type: 'string' },
      description: { type: 'string' },
      vodVideoId: { type: 'string' },
      cover: { type: 'string' },
    });

    const video = await Video.findById(videoId);
    if (!video) {
      this.ctx.throw(404, 'Video Not Found');
    }

    // 视频坐着必须是当前用户
    if (!video.user.equals(userId)) {
      this.ctx.throw(403);
    }

    Object.assign(video, this.ctx.helper._.pick(body, [ 'title', 'description', 'vodVideoId', 'cover' ]));

    await video.save();

    this.ctx.body = {
      video,
    };
  }

  public async createVideoComment() {
    const body = this.ctx.request.body;
    const { Video, VideoComment } = this.app.model;
    const { videoId } = this.ctx.params;

    this.ctx.validate({
      comment: 'string',
    }, body);

    // 获取评论所属视频
    const video = await Video.findById(videoId);
    if (!video) {
      this.ctx.throw(404);
    }

    // 创建评论
    const comment = await new VideoComment({
      content: body.comment,
      user: this.ctx.user._id,
      video: videoId,
    }).save();

    video.commentsCount = await VideoComment.countDocuments({
      video: videoId,
    });

    await video.save();

    // 映射评论所属用户和视频字段
    await comment.populate('user').populate('video').execPopulate();

    this.ctx.body = { comment };
  }

  public async deleteVideoComment() {
    const { Video, VideoComment } = this.app.model;
    const { videoId, commentId } = this.ctx.params;

    const video = await Video.findById(videoId);
    // 校验视频是否存在
    if (!video) {
      this.ctx.throw(404, 'Video Not Found');
    }

    const comment = await VideoComment.findById(commentId);
    // 校验评论是否存在
    if (!comment) {
      this.ctx.throw(404, 'Comment Not Found');
    }

    // 校验评论作者是否是当前登录用户
    if (!comment.user.equals(this.ctx.user._id)) {
      this.ctx.throw(403);
    }

    // 删除评论
    await comment.remove();
    // 更新视频评论数量
    video.commentsCount = await VideoComment.countDocuments({
      video: videoId,
    });
    await video.save();

    this.ctx.status = 204;
  }

  public async videoLike() {
    const { Video, VideoLike } = this.app.model;
    const { videoId } = this.ctx.params;
    const userId = this.ctx.user._id;
    const video = await Video.findById(videoId);

    if (!video) {
      this.ctx.throw(404);
    }

    const doc = await VideoLike.findOne({
      user: userId,
      video: videoId,
    });

    let isLiked = true;

    if (doc && doc.like === 1) {
      // 取消点赞
      await doc.remove();
      isLiked = false;
    } else if (doc && doc.like === -1) {
      doc.like = 1;
      await doc.save();
    } else {
      await new VideoLike({
        user: userId,
        video: videoId,
        like: 1,
      }).save();
    }

    // 更新喜欢视频的数量
    video.likesCount = await VideoLike.countDocuments({
      video: videoId,
      like: 1,
    });

    // 更新不喜欢视频的数量
    video.dislikesCount = await VideoLike.countDocuments({
      video: videoId,
      like: -1,
    });

    await video.save();

    this.ctx.body = {
      video: {
        ...video.toJSON(),
        isLiked,
      },
    };
  }

  public async videoDislike() {
    const { Video, VideoLike } = this.app.model;
    const { videoId } = this.ctx.params;
    const userId = this.ctx.user._id;
    const video = await Video.findById(videoId);

    if (!video) {
      this.ctx.throw(404);
    }

    const doc = await VideoLike.findOne({
      user: userId,
      video: videoId,
    });

    let isDisliked = true;

    if (doc && doc.like === -1) {
      // 取消不喜欢
      await doc.remove();
      isDisliked = false;
    } else if (doc && doc.like === 1) {
      doc.like = -1;
      await doc.save();
    } else {
      await new VideoLike({
        user: userId,
        video: videoId,
        like: -1,
      }).save();
    }

    // 更新喜欢视频的数量
    video.likesCount = await VideoLike.countDocuments({
      video: videoId,
      like: 1,
    });

    // 更新不喜欢视频的数量
    video.dislikesCount = await VideoLike.countDocuments({
      video: videoId,
      like: -1,
    });

    await video.save();

    this.ctx.body = {
      video: {
        ...video.toJSON(),
        isDisliked,
      },
    };

  }

  public async getVideoLikeList() {
    const { Video, VideoLike } = this.app.model;
    let { pageNum = 1, pageSize = 10 } = this.ctx.query;
    pageNum = Number(pageNum);
    pageSize = Number(pageSize);
    const filterDoc = {
      user: this.ctx.user._id,
      like: 1,
    };

    const likes = await VideoLike
      .find(filterDoc)
      .sort({
        createAt: -1,
      })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    const getVideoList = Video
      .find({
        _id: {
          $in: likes.map(item => item.video),
        },
      })
      .populate('user');

    const getTotalCount = Video.countDocuments();

    const [ videoList, totalCount ] = await Promise.all([
      getVideoList,
      getTotalCount,
    ]);

    this.ctx.body = {
      videoList,
      totalCount,
    };
  }

}
