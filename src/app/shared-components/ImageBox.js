import { FILE_API_URL } from '@api/http';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import Modal from '@mui/material/Modal';

export default function ImageBox({
  alt = '',
  src = '',
  title = '',
  width = '100%',
  height = '40px',
  className = '',
  modal = '',
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 1,
  };

  return (
    <Box sx={{ ml: '10px', mr: '10px' }}>
      {src ? (
        <Box className="hover:scale-[180%] z-9999 ease-in-out duration-500">
          {modal && (
            <Button
              variant="contained"
              className="relative top-20 m-0 p-0 min-w-20 h-20 min-h-20 "
              onClick={handleOpen}
            >
              <FuseSvgIcon size={20} color="primary">
                heroicons-outline:eye
              </FuseSvgIcon>
            </Button>
          )}
          <img className={className} alt={alt} src={src} title={title} style={{ width, height }} />

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Button style={{ position: 'absolute', top: 0, right: 0 }} onClick={handleClose}>
                <FuseSvgIcon className="text-48" size={24} color="error">
                  heroicons-outline:x
                </FuseSvgIcon>
              </Button>
              <img src={modal} alt={alt} />
            </Box>
          </Modal>
        </Box>
      ) : (
        <img
          alt={alt}
          src={`${FILE_API_URL}/images/default/users/noPhoto.svg`}
          title={title}
          style={{ width, height }}
        />
      )}{' '}
    </Box>
  );
}
