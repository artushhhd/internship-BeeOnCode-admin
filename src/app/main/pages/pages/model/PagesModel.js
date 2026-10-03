import _ from '@lodash';

const PagesModel = (data) =>
  _.defaults(data || {}, {
    translations: [],
    slug: '',
  });

export default PagesModel;
