import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function HistoryModal({ setModal, modal }) {
  return (
    modal && (
      <div>
        <Modal
          keepMounted
          onClick={() => setModal(false)}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style} className="flex">
            <div
              style={{
                border: '1px solid',
                width: '500px',
                height: '500px',
                backgroundColor: 'green',
              }}
            />
            <div
              style={{
                border: '1px solid',
                width: '500px',
                height: '500px',
                backgroundColor: 'red',
              }}
            />
          </Box>
        </Modal>
      </div>
    )
  );
}
