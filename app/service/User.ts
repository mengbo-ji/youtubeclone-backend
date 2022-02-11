import { Service } from 'egg';
import jwt from 'jsonwebtoken';

/**
 * user Service
 */
export default class User extends Service {
  get User() {
    return this.app.model.User;
  }
  /**
   * find by username
   * @param username - your name
   */
  public findByUsername(username: string) {
    return this.User.findOne({
      username,
    });
  }

  /**
   * find by email
   * @param email - your email
  */
  public findByEmail(email: string) {
    return this.User.findOne({
      email,
    }).select('+password');
  }

  /**
   * create user
   * @param data - object
  */
  public async createUser(data: Record<string, string>) {
    const user = new this.User(data);
    await user.save();
    return user;
  }

  /**
   * updateUser user
   * @param data - object
  */
  public updateUser(data) {
    return this.User.findByIdAndUpdate(this.ctx.user._id, data, {
      new: true, // 返回更新之后的数据
    });
  }

  /**
   * createToken token
   * @param data - object
  */
  public createToken(data) {
    return jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    });
  }

  /**
   * verifyToken token
   * @param token - string
  */
  public verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret);
  }

  /**
   * subscribe
   * @param userId - userId
   * @param channelId - channelId
  */
  public async subscribe(userId, channelId) {
    const { Subscription, User } = this.app.model;
    // 1. 检查是否已经订阅过
    const user = await User.findById(channelId);
    const record = await Subscription.findOne({
      user: userId,
      channel: channelId,
    });
    // 2. 没有订阅，添加订阅
    if (!record) {
      await new Subscription({
        user: userId,
        channel: channelId,
      }).save();
      // 更新订阅数量
      user.subscribersCount++;
      await user.save();
    }
    // 3. 返回用户信息
    return user;
  }

  /**
   * unsubscribe
   * @param userId - userId
   * @param channelId - channelId
  */
  public async unsubscribe(userId, channelId) {
    const { Subscription, User } = this.app.model;
    // 1. 检查是否已经订阅过
    const user = await User.findById(channelId);
    const record = await Subscription.findOne({
      user: userId,
      channel: channelId,
    });
    // 2. 订阅了，删除
    if (record) {
      await record.remove();
      // 更新订阅数量
      user.subscribersCount--;
      await user.save();
    }
    // 3. 返回用户信息
    return user;
  }

}
