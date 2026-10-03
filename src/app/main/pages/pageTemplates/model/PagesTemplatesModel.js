import _ from '@lodash';

const PagesTemplatesModel = (data) =>
  _.defaults(data || {}, {
    translations: [],
  });

export default PagesTemplatesModel;
