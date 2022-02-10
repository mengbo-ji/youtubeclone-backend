import { createHash } from 'crypto';

export default {
  md5: (str: string) => {
    return createHash('md5').update(str).digest('hex');
  },
};
