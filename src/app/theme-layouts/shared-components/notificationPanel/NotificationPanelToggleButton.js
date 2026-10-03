import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import RestoreIcon from '@mui/icons-material/Restore';
import reducer from './store';
import { selectNotifications } from './store/dataSlice';
import { toggleNotificationPanel } from './store/stateSlice';

function NotificationPanelToggleButton(props) {
  const notifications = useSelector(selectNotifications);

  const dispatch = useDispatch();

  return (
    <IconButton
      className="w-40 h-40"
      onClick={(ev) => dispatch(toggleNotificationPanel())}
      size="large"
    >
      <RestoreIcon color="inherit" variant="dot" invisible={`${notifications.length === 0}`}>
        {props.children}
      </RestoreIcon>
    </IconButton>
  );
}

NotificationPanelToggleButton.defaultProps = {
  children: <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon>,
};

export default withReducer('notificationPanel', reducer)(NotificationPanelToggleButton);
