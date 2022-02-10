import { Service } from 'egg';
import * as jwt from 'jsonwebtoken';

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
}
