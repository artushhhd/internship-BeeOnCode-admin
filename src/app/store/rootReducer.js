import { combineReducers } from '@reduxjs/toolkit';
import fuse from './fuse';
import i18n from './i18nSlice';
import user from './userSlice';
import devMode from './devModeSlice';
import rightBarSlice from './RightBarSlice';
import nestedDraggable from './nestedDraggableSlice';
import PagesApp from '../main/pages/pages/store/index';
import PageTemplatesApp from '../main/pages/pageTemplates/store/index';
import logoApp from '../main/view/logo/store/index';
import ProjectsApp from '../main/projects/store/index';
import NewsApp from '../main/news/news/store/index';
import dashboardApp from '../main/dashboard/store/index';
import YoutubeSettingsApp from '../main/view/youtubeSettings/store/youtubeSettingsSlice';
import TranslationsApp from '../main/view/translations/store/index';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    fuse,
    i18n,
    user,
    devMode,
    PagesApp,
    PageTemplatesApp,
    nestedDraggable,
    rightBarSlice,
    ProjectsApp,
    logoApp,
    dashboardApp,
    ...NewsApp,
    YoutubeSettingsApp,
    TranslationsApp,
    ...asyncReducers,
  });
  /*
	Reset the redux store when admin logged out
	 */
  if (action.type === 'admin/userLoggedOut') {
    // state = undefined;
  }

  return combinedReducer(state, action);
};

export default createReducer;
