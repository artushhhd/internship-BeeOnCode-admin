import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import IconButton from '@mui/material/IconButton';
import { Outlet } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function RolesSidebarContent({ maximize, setMaximize }) {
  return (
    <div className="flex flex-col flex-auto">
      <IconButton
        className="absolute top-0 right-0 my-16 mx-32 z-10"
        component={NavLinkAdapter}
        to="/administration/roles"
        size="large"
      >
        <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
      </IconButton>
      <IconButton
        className="absolute top-0 left-0 my-16 mx-32 z-10"
        size="large"
        component="button"
        onClick={() => setMaximize(!maximize)}
      >
        <FuseSvgIcon>{`heroicons-outline:chevron-double-${
          maximize ? 'right' : 'left'
        }`}</FuseSvgIcon>
      </IconButton>
      <Outlet />
    </div>
  );
}

export default RolesSidebarContent;
