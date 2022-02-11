import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.vod = {
    accessKeyId: process.env.accessKeyId,
    accessKeySecret: process.env.accessKeySecret,
  };
  return config;
};
