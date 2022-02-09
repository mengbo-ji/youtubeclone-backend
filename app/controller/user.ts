import { Controller } from 'egg';

export default class UserController extends Controller {
  public async create() {
    const { ctx } = this;
    ctx.body = 'user create';
  }
}
