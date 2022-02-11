import { Application } from 'egg';

export default (app: Application) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const viewHistorySchema = new Schema({
    user: { // 用户
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    video: { // 视频
      type: Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    createdAt: { // 创建时间
      type: Date,
      default: Date.now,
    },
    updatedAt: { // 更新时间
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model('ViewHistory', viewHistorySchema);
};
