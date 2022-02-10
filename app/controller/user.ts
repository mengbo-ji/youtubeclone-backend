import { Controller } from 'egg';

export default class UserController extends Controller {
  public async create() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const userService = service.user;

    // 1. 数据校验
    ctx.validate({
      username: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'string' },
    }, body);

    if (await userService.findByUsername(body.username)) {
      ctx.throw(422, '用户已存在');
    }
    if (await userService.findByEmail(body.email)) {
      ctx.throw(422, '邮箱已存在');
    }

    // 2. 保存用户
    const user = await userService.createUser(body);

    // 3. 生成token
    const token = userService.createToken({
      userId: user._id,
    });

    // 4. 发送响应
    ctx.body = {
      user: {
        email: user.email,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
        token,
      },
    };
  }

  public async login() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const userService = service.user;
    // 1. 基本数据验证
    ctx.validate({
      email: { type: 'email' },
      password: { type: 'string' },
    }, body);

    const user = await userService.findByEmail(body.email);
    // 2. 校验邮箱是否存在
    if (!user) {
      ctx.throw(422, '邮箱不存在');
    }

    // 3. 校验密码是否正确
    if (ctx.helper.md5(body.password) !== user.password) {
      ctx.throw(422, '密码不正确');
    }

    // 4. 生成Token
    const token = userService.createToken({
      userId: user._id,
    });

    // 5. 响应数据
    ctx.body = {
      user: {
        email: user.email,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
        token,
      },
    };
  }

  public async getCurrentUser() {
    const user = this.ctx.user;
    this.ctx.body = {
      user: {
        email: user.email,
        username: user.username,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
        token: this.ctx.headers.authorization,
      },
    };
  }
}
