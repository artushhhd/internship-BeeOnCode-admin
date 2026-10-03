import _ from '@lodash';

const AdminModel = (data) =>
  _.defaults(data || {}, {
    avatar: null,
    name: '',
    email: '',
    password: '',
    role_id: '',
  });

export default AdminModel;
