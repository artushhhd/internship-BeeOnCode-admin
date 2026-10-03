import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import RestoreIcon from '@mui/icons-material/Restore';

const NotificationIcon = ({ value }) => {
  switch (value) {
    case 'error': {
      return (
        <FuseSvgIcon className="mr-8 opacity-75" color="inherit">
          <RestoreIcon />
        </FuseSvgIcon>
      );
    }
    case 'success': {
      return (
        <FuseSvgIcon className="mr-8 opacity-75" color="inherit">
          <RestoreIcon />
        </FuseSvgIcon>
      );
    }
    case 'warning': {
      return (
        <FuseSvgIcon className="mr-8 opacity-75" color="inherit">
          <RestoreIcon />
        </FuseSvgIcon>
      );
    }
    case 'info': {
      return (
        <FuseSvgIcon className="mr-8 opacity-75" color="inherit">
          <RestoreIcon />
        </FuseSvgIcon>
      );
    }
    default: {
      return null;
    }
  }
};

export default NotificationIcon;
