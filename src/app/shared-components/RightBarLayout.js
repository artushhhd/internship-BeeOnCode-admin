import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDispatch, useSelector } from 'react-redux';
import { changeMaximize } from 'app/store/RightBarSlice';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DevMode from 'app/shared-components/DevMode';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';

const RightBarLayout = ({ children, buttonXto, name }) => {
  const { maximize, languages } = useSelector((state) => state.rightBarSlice);
  const dispatch = useDispatch();
  const params = useParams();
  const { t } = useTranslation('navigation');

  return (
    <div className="flex flex-col flex-auto w-full">
      <Box
        className="flex justify-between items-center w-full h-48 px-24 "
        sx={{
          backgroundColor: 'background.default',
        }}
      >
        <Box className="text-base" size="large">
          <IconButton size="large" onClick={() => dispatch(changeMaximize())}>
            <FuseSvgIcon>{`heroicons-outline:chevron-double-${
              maximize ? 'right' : 'left'
            }`}</FuseSvgIcon>
          </IconButton>
          {params.id === 'new' ? `${t(name)} | ${t('ADD')}` : `${t(name)} | ${t('EDIT')} `}
          <DevMode>id: {params.id}</DevMode>
        </Box>
        <Box className="flex justify-end items-center gap-4">
          {languages && <LanguageSwitcher inModal />}
          <IconButton component={NavLinkAdapter} to={buttonXto} size="large">
            <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
          </IconButton>
        </Box>
      </Box>
      {children}
    </div>
  );
};

export default RightBarLayout;
