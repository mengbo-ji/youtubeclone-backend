import RPCClient from '@alicloud/pop-core';

function initVodClient(accessKeyId, accessKeySecret) {
  const regionId = 'cn-shanghai'; // 点播服务接入地域
  const client = new RPCClient({ // 填入AccessKey信息
    accessKeyId,
    accessKeySecret,
    endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
    apiVersion: '2017-03-21',
  });

  return client;
}

/**
 * 扩展 egg.js 应用实例 Application
*/
let vodClient: any = null;
export default {
  get vodClient() {
    if (!vodClient) {
      // eslint-disable-next-line
      // @ts-ignore
      const { accessKeyId, accessKeySecret } = this.config.vod;
      vodClient = initVodClient(accessKeyId, accessKeySecret);
    }
    return vodClient;
  },
};
