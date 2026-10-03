import { changeNestedDraggable } from 'app/store/nestedDraggableSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Chip } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const DragSwitcher = ({ keyName, data }) => {
  const { nestedDraggable } = useSelector((state) => state.nestedDraggable);
  const dispatch = useDispatch();

  return data.length > 1 ? (
    /* <div className="flex items-center mt-20 relative">
      <span style={{ opacity: nestedDraggable[keyName] && 0.3 }}>Drag Off</span>
      <Switch
        checked={!!nestedDraggable[keyName]}
        onChange={(ev) => {
          dispatch(changeNestedDraggable({ key: keyName, value: ev.target.checked }));
        }}
        aria-label="checked"
      />
      <span style={{ opacity: !nestedDraggable[keyName] && 0.3 }}>Drag On</span>
    </div> */
    <Chip
      label="move"
      icon={<FuseSvgIcon color="action">heroicons-outline:arrows-expand</FuseSvgIcon>}
      color="secondary"
      onClick={() => {
        dispatch(changeNestedDraggable({ key: keyName, value: !nestedDraggable[keyName] }));
      }}
      variant={nestedDraggable[keyName] ? 'filled' : 'outlined'}
    />
  ) : (
    ''
  );
};

export default DragSwitcher;
