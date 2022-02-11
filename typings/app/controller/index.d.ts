// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportIndex from '../../../app/controller/index';
import ExportUser from '../../../app/controller/user';
import ExportVideo from '../../../app/controller/video';
import ExportVod from '../../../app/controller/vod';

declare module 'egg' {
  interface IController {
    index: ExportIndex;
    user: ExportUser;
    video: ExportVideo;
    vod: ExportVod;
  }
}
