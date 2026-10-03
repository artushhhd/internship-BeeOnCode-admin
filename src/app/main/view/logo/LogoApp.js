import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import { selectUser } from 'app/store/userSlice';
import { useTranslation } from 'react-i18next';
import LogoHeader from './LogoHeader';
import LogoList from './LogoList';
import reducer from './store';
import { getLogos } from './store/logosSlice';
import Error404Page from '../../404/Error404Page';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../administration/store/permissionsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function LogoApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');

  useDeepCompareEffect(() => {
    dispatch(getLogos());
    dispatch(getPermissionsByPage({ userId, pageName: 'Logo' }));
  }, [dispatch]);

  return canView ? (
    <Root
      header={<LogoHeader pageLayout={pageLayout} />}
      content={<LogoList canManage={canManage} />}
    />
  ) : (
    <Error404Page />
  );
}

export default withReducer('logoApp', reducer)(LogoApp);
