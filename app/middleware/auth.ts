import { Context } from 'egg';

export default () => {
  return async function auth(ctx: Context, next: () => Promise<any>) {
    // 1. 获取请求头中的token
    let token = ctx.headers.authorization as string | null;// Bearer空格 token数据
    token = token
      ? token.split('Bearer ')[1]
      : null;

    // 2. 获取token，无效401
    if (!token) {
      ctx.throw(401);
    }

    // 3. token有效，根据userId 获取用户数据挂在到ctx 中给后续中间件使用
    try {
      const data = ctx.service.user.verifyToken(token) as any;
      ctx.user = await ctx.model.User.findById(data.userId);
    } catch (error) {
      ctx.throw(401);
    }

    // 4. next 执行后续中间件
    await next();
  };
};
