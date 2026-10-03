import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { getTranslationLanguages } from 'app/store/i18nSlice';
import reducer from './store';
import TranslationsList from './TranslationsList';
import Error404Page from '../../404/Error404Page';
import { selectPermission } from '../../administration/store/permissionsSlice';
import TranslationsHeader from './TranslationsHeader';
import { getTranslations } from './store/TranslationsSlice';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function TranslationsApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const { canView, canManage } = useSelector(selectPermission);

  useEffect(() => {
    dispatch(getTranslationLanguages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTranslations());
  }, [dispatch]);

  return canView ? (
    <Root
      header={<TranslationsHeader />}
      content={<TranslationsList canManage={canManage} />}
      ref={pageLayout}
      scroll="content"
    />
  ) : (
    <Error404Page />
  );
}

export default withReducer('StepApp', reducer)(TranslationsApp);
