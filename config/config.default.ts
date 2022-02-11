import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1644398444188_324';

  // add your egg config in here
  config.middleware = [ 'errorHandler' ];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/youtobe-clone',
      options: {
        useUnifiedTopology: true,
      },
      // mongoose global plugins, expected a function or an array of function and options
    },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.jwt = {
    secret: '1f537ec7-463c-430f-bdad-e8da749ec7ba',
    expiresIn: '1d',
  };

  config.cors = {
    origin: '*', // 表示允许的源
  };

  return {
    ...config,
    ...bizConfig,
  };
};
