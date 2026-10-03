import _ from '@lodash';

const RoleModel = (data) =>
  _.defaults(data || {}, {
    name1: '',
  });

export default RoleModel;
