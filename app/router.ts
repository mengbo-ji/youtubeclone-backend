import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;
  const auth = middleware.auth();

  router.prefix('/api'); // 基础路径
  router.post('/user/create', controller.user.create);
  router.post('/user/login', controller.user.login);
  router.post('/user/update', auth, controller.user.update);
  router.get('/user/current', auth, controller.user.getCurrentUser);
  router.get('/user/:userId/info', middleware.auth({ required: false }), controller.user.getUserInfo);

  // 用户订阅
  router.post('/user/:userId/subscribe', auth, controller.user.subscribe);
  router.post('/user/:userId/unsubscribe', auth, controller.user.unsubscribe);
  router.get('/user/:userId/subscribeList', controller.user.getUserSubscribeList);
};
