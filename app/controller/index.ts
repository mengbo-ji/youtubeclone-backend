import { Controller } from 'egg';

export default class IndexController extends Controller {
  index() {
    this.ctx.body = 'hi, egg';
  }
}
