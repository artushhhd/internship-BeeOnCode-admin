import { Modal } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DeleteModal = ({ open, close, onClick, text = false }) => {
  const [disable, setDisable] = useState(false);
  const { t } = useTranslation('navigation');

  useEffect(() => {
    return () => {
      setDisable(false);
    };
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="text-center" sx={modalStyle}>
        {!text ? <h4>{t('ARE_YOU_SURE_DELETE')} ?</h4> : <h4>{text}?</h4>}
        <div className="flex justify-evenly mt-16">
          <Button variant="contained" color="secondary" onClick={close}>
            {t('NO')}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setDisable(true);
              onClick();
            }}
            disabled={disable}
          >
            {t('YES')}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
