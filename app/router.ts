import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.prefix('/api/v1'); // 基础路径
  router.post('/user/create', controller.user.create);
};
