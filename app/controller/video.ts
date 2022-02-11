import { Controller } from 'egg';

export default class VideoController extends Controller {
  public async create() {
    const body = this.ctx.request.body;
    const { Video } = this.app.model;

    this.ctx.validate({
      title: { type: 'string' },
      description: { type: 'string' },
      vodVideoId: { type: 'string' },
      cover: { type: 'string' },
    });
    body.user = this.ctx.user._id;
    const video = new Video(body).save();

    this.ctx.state = 201;
    this.ctx.body = {
      video,
    };
  }
}
