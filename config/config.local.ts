import { EggAppConfig, PowerPartial } from 'egg';
import secretConfig from './secret';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.vod = {
    ...secretConfig,
  };
  return config;
};
