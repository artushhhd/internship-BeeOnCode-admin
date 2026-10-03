/**
 * Authorization Roles
 */

const generateIds = () => {
  return new Array(100000).fill(undefined).map((_, i) => i + 1);
};

const authRoles = {
  user: ['user'],
  staff: ['staff', 'user'],
  admin: ['admin', 'staff', 'user'],
  superadmin: generateIds(),
  onlyGuest: [],
};

export default authRoles;
