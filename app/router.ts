import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;
  const auth = middleware.auth();

  router.prefix('/api') // 基础路径
    .get('/', controller.index.index) // 首页
    .post('/user/create', controller.user.create) // 用户创建
    .post('/user/login', controller.user.login) // 用户登录
    .post('/user/update', auth, controller.user.update) // 用户更新
    .get('/user/current', auth, controller.user.getCurrentUser) // 获取当前用户
    .get('/user/:userId/info', middleware.auth({ required: false }), controller.user.getUserInfo) // 获取当前用户信息
    .post('/user/:userId/subscribe', auth, controller.user.subscribe) // 订阅
    .post('/user/:userId/unsubscribe', auth, controller.user.unsubscribe) // 取消订阅
    .get('/user/:userId/subscribeList', controller.user.getUserSubscribeList) // 获取用户订阅列表
    .get('/vod/CreateUploadVideo', auth, controller.vod.createUploadVideo) // 获取视频上传地址和凭证
    .get('/vod/RefreshUploadVideo', auth, controller.vod.refreshUploadVideo) // 刷新视频上传凭证
    .post('/video/create', auth, controller.video.create) // 创建视频
    .get('/video/:videoId/detail', middleware.auth({ required: false }), controller.video.detail) // 获取视频详
    .get('/video/list', auth, controller.video.getVideoList) // 获取视频列表
    .get('/video/:userId/videoList', controller.video.getUserVideoList) // 获取用户发布的视频列表
    .get('/video/user/feed', auth, controller.video.getUserFeedVideoList) // 获取用户订阅的频道的视频列表
    .post('/video/:videoId/update', auth, controller.video.videoUpdate); // 更新视频
};
