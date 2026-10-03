import { combineReducers } from '@reduxjs/toolkit';
import role from './roleSlice';
import roles from './rolesSlice';
import admins from './adminsSlice';
import admin from './adminSlice';
import Permissions from './permissionsSlice';
import FileManager from './fileManagerSlice';
import FolderManager from './folderManagerSlice';

const reducer = combineReducers({
  roles,
  role,
  admins,
  admin,
  Permissions,
  FileManager,
  FolderManager,
});

export default reducer;
