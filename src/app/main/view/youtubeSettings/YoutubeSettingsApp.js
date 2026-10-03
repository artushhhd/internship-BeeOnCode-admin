import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import YoutubeSettingsList from './YoutubeSettingsList';
import Error404Page from '../../404/Error404Page';
import { selectPermission } from '../../administration/store/permissionsSlice';
import YoutubeSettingsHeader from './YoutubeSettingsHeader';
import { getYoutubeSettings } from './store/youtubeSettingsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function YoutubeSettingsApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const { canView, canManage } = useSelector(selectPermission);

  useEffect(() => {
    dispatch(getYoutubeSettings());
  }, [dispatch]);

  return canView ? (
    <Root
      header={<YoutubeSettingsHeader pageLayout={pageLayout} canManage={canManage} />}
      content={<YoutubeSettingsList canManage={canManage} />}
      ref={pageLayout}
      scroll="content"
    />
  ) : (
    <Error404Page />
  );
}

export default YoutubeSettingsApp;
