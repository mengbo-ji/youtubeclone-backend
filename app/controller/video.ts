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

}
