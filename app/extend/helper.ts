import { createHash } from 'crypto';
import _ from 'lodash';

export default {
  md5: (str: string) => {
    return createHash('md5').update(str).digest('hex');
  },
  _,
};
