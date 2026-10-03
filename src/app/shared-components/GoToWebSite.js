import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { FRONT_URL } from '@api/http';

export default function GoToWebSite(props) {
  const token = localStorage.getItem('jwt_access_token');
  const openSiteInNewWindow = () => {
    window.open(`${FRONT_URL}?token=${token}`, '_blank');
  };

  return (
    <Tooltip title="Go to website" placement="bottom">
      <IconButton
        onClick={openSiteInNewWindow}
        className={clsx('w-40 h-40', props.className)}
        size="large"
      >
        <FuseSvgIcon>material-solid:web</FuseSvgIcon>
      </IconButton>
    </Tooltip>
  );
}
