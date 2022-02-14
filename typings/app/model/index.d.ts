// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSubscription from '../../../app/model/subscription';
import ExportUser from '../../../app/model/user';
import ExportVideo from '../../../app/model/video';
import ExportVideoComment from '../../../app/model/videoComment';
import ExportVideoLike from '../../../app/model/videoLike';
import ExportViewHistory from '../../../app/model/viewHistory';

declare module 'egg' {
  interface IModel {
    Subscription: ReturnType<typeof ExportSubscription>;
    User: ReturnType<typeof ExportUser>;
    Video: ReturnType<typeof ExportVideo>;
    VideoComment: ReturnType<typeof ExportVideoComment>;
    VideoLike: ReturnType<typeof ExportVideoLike>;
    ViewHistory: ReturnType<typeof ExportViewHistory>;
  }
}
