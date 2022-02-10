import { Service } from 'egg';
import * as jwt from 'jsonwebtoken';

/**
 * User Service
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
    data.password = this.ctx.helper.md5(data.password);
    const user = new this.User(data);
    await user.save();
    return user;
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
