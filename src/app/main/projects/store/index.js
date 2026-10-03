import { combineReducers } from '@reduxjs/toolkit';
import areas from './areasSlice';
import area from './areaSlice';
import projects from './projectsSlice';
import project from './projectSlice';
import statuses from './statusesSlice';
import status from './statusSlice';
import regions from './regionsSlice';
import region from './regionSlice';
import categories from './categoriesSlice';
import category from './categorySlice';

const reducer = combineReducers({
  areas,
  area,
  projects,
  project,
  statuses,
  status,
  regions,
  region,
  categories,
  category,
});

export default reducer;
