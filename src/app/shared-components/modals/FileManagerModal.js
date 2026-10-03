import Box from '@mui/system/Box';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import FileManagerList from '../../main/view/fileManager/FileManagerList';

function FileManagerModal({
  type = 'file',
  open,
  handleClose,
  selected,
  setSelected,
  defaultSelected,
  multiple = false,
  languageDifferent,
  youTube,
  setDefaultSelected,
}) {
  if (!['image', 'media', 'file'].includes(type)) {
    throw new Error(`Invalid prop value for 'type': ${type}`);
  }

  FileManagerModal.propTypes = {
    type: PropTypes.oneOf(['image', 'media', 'file']).isRequired,
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '90%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <FileManagerList
          type={type}
          open={open}
          languageDifferent={languageDifferent}
          multiple={multiple}
          selected={selected}
          setSelected={setSelected}
          youTube={youTube}
          setDefaultSelected={setDefaultSelected}
          handleClose={handleClose}
          defaultSelected={defaultSelected}
          inModal
        />
      </Box>
    </Modal>
  );
}
export default FileManagerModal;
