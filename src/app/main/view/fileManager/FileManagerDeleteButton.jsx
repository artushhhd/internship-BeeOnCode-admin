import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteFile, getFiles } from '../../administration/store/fileManagerSlice';

function FileManagerDeleteButton({ item }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  return (
    <Box className="absolute top-2 left-2" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="contained"
        className="m-0 p-0 min-w-28 h-28 min-h-28"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <FuseSvgIcon size={28} color="error">
          material-twotone:delete_forever
        </FuseSvgIcon>
      </Button>

      <DeleteModal
        open={open}
        close={() => setOpen(false)}
        onClick={() => {
          dispatch(deleteFile(item.id)).then(() => {
            dispatch(getFiles());
            setOpen(false);
          });
        }}
      />
    </Box>
  );
}

export default FileManagerDeleteButton;
