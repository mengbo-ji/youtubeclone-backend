import { Application } from 'egg';

export default (app: Application) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const subscriptionSchema = new Schema({
    user: { // 订阅用户
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channel: { // 订阅频道
      type: Schema.Types.ObjectId,
      ref: 'User',
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

  return mongoose.model('Subscription', subscriptionSchema);
};
