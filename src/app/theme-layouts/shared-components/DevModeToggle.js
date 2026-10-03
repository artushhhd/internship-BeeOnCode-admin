import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { changeDevMode } from 'app/store/devModeSlice';
import { selectUser } from 'app/store/userSlice';

const DevModeToggle = () => {
  const dispatch = useDispatch();

  const { devMode } = useSelector((state) => state.devMode);
  const user = useSelector(selectUser);
  return (
    (process.env.REACT_APP_API_DEVMODE || !!user.role.is_vendor) && (
      <IconButton className="w-40 h-40" onClick={(ev) => dispatch(changeDevMode())} size="large">
        <FuseSvgIcon className="text-48" size={24} color="action">
          {devMode ? 'heroicons-outline:code' : 'feather:code'}
        </FuseSvgIcon>
      </IconButton>
    )
  );
};

export default DevModeToggle;
