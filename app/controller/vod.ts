import { Controller } from 'egg';

export default class VodController extends Controller {
  public async createUploadVideo() {
    const query = this.ctx.query;
    this.ctx.validate({
      Title: { type: 'string' },
      FileName: { type: 'string' },
    }, query);

    this.ctx.body = await this.app.vodClient.request(
      'CreateUploadVideo',
      query, {},
    );
  }

  public async refreshUploadVideo() {
    const query = this.ctx.query;
    this.ctx.validate({
      VideoId: { type: 'string' },
    }, query);

    this.ctx.body = await this.app.vodClient.request(
      'RefreshUploadVideo',
      query, {},
    );
  }
}
