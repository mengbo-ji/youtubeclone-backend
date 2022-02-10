import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;

  router.prefix('/api/v1'); // 基础路径
  router.post('/user/create', controller.user.create);
  router.post('/user/login', controller.user.login);
  router.get('/user/current', middleware.auth(), controller.user.getCurrentUser);
};
