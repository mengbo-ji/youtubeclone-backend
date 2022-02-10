import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;
  const auth = middleware.auth();

  router.prefix('/api/v1'); // 基础路径
  router.post('/user/create', controller.user.create);
  router.post('/user/update', auth, controller.user.update);
  router.post('/user/login', controller.user.login);
  router.get('/user/current', auth, controller.user.getCurrentUser);

  // 用户订阅
  router.post('/user/:userId/subscribe', auth, controller.user.subscribe);
};
