import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function LogoSidebarContent(props) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col flex-auto">
      <IconButton
        className="absolute top-0 right-0 my-16 mx-32 z-10"
        component={NavLinkAdapter}
        to="/view/logo"
        size="large"
      >
        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
      </IconButton>

      <Outlet />
    </div>
  );
}

export default LogoSidebarContent;
