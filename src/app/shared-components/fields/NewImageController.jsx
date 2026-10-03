import { Controller } from 'react-hook-form';
import Box from '@mui/system/Box';
import { FILE_API_URL } from '@api/http';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import { useParams } from 'react-router-dom';
import FileManagerModal from 'app/shared-components/modals/FileManagerModal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import DevMode from 'app/shared-components/DevMode';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { getFiles } from '../../main/administration/store/fileManagerSlice';

const NewImageController = ({
  type = 'image',
  control,
  name,
  disableEdit = false,
  required = false,
  selected,
  setSelected,
  defaultSelected,
  languageDifferent = false,
  setDefaultSelected,
  obj = 'cover',
}) => {
  const { translationLanguageInModal } = useSelector((state) => state.i18n);
  const image = languageDifferent ? selected[translationLanguageInModal]?.src : selected?.src;

  const routeParams = useParams();
  const edit = routeParams.id !== 'new';
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openPhoto, setOpenPhoto] = useState(false);
  const handleOpenPhoto = (e) => {
    e.stopPropagation();
    setOpenPhoto(true);
  };
  const handleClosePhoto = (e) => {
    e.stopPropagation();
    setOpenPhoto(false);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFiles());
  }, [dispatch]);

  return (
    <Controller
      control={control}
      name={languageDifferent ? `${name}${translationLanguageInModal}` : name}
      render={({ field: { onChange, value } }) => (
        <Box
          sx={{
            borderWidth: 4,
            borderStyle: 'solid',
            borderColor: 'background.paper',
          }}
          className="relative flex items-center justify-center min-w-128 h-128  overflow-hidden"
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
          {!disableEdit && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div>
                {edit && typeof image === 'string' && (
                  <>
                    <img
                      className="absolute top-0 left-0 z-[-1] flex items-center justify-center min-w-128 h-128  overflow-hidden"
                      src={`${FILE_API_URL}/${image || defaultSelected?.thumbnail_url}`}
                      alt="i"
                    />
                  </>
                )}
                <Box
                  onClick={handleOpen}
                  component="span"
                  htmlFor="button-avatar"
                  className="flex p-8 cursor-pointer"
                >
                  <FuseSvgIcon className="text-white">heroicons-outline:camera</FuseSvgIcon>
                </Box>

                {selected?.id || defaultSelected?.id ? (
                  // eslint-disable-next-line
                      <button
                    className="absolute top-0 left-0 p-1 m-0 bg-white rounded-lg cursor-pointer"
                    onClick={handleOpenPhoto}
                  >
                    <FuseSvgIcon size={24} color="primary">
                      heroicons-outline:eye
                    </FuseSvgIcon>
                  </button>
                ) : (
                  ''
                )}
              </div>
              {image && !required && (
                <div>
                  <IconButton
                    onClick={() => {
                      onChange('');
                      setSelected(
                        languageDifferent
                          ? { ...selected, [translationLanguageInModal]: { id: 0 } }
                          : { id: 0 }
                      );
                    }}
                  >
                    <FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
                  </IconButton>
                </div>
              )}
              <div className="absolute top-24 text-center">
                <DevMode>file_id: {selected?.id}</DevMode>
              </div>
            </div>
          )}
          <Avatar
            sx={{
              backgroundColor: 'background.default',
              color: 'text.secondary',
            }}
            className="bg-contain rounded-none w-full h-full text-64 font-bold"
            src={`${FILE_API_URL}/${image || defaultSelected?.thumbnail_url}`}
            alt={name}
          >
            {edit && name.charAt(0)}
          </Avatar>

          <Modal
            open={openPhoto}
            onClose={handleClosePhoto}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 1,
              }}
            >
              <Button style={{ position: 'absolute', top: 0, right: 0 }} onClick={handleClosePhoto}>
                <FuseSvgIcon className="text-48" size={24} color="error">
                  heroicons-outline:x
                </FuseSvgIcon>
              </Button>
              <img src={`${FILE_API_URL}/${image || defaultSelected?.medium_url}`} alt="alt" />
            </Box>
          </Modal>
          <FileManagerModal
            type={type}
            handleClose={handleClose}
            open={open}
            selected={selected}
            setSelected={setSelected}
            onChange={onChange}
            defaultSelected={defaultSelected}
            languageDifferent={languageDifferent}
            setDefaultSelected={setDefaultSelected}
          />
        </Box>
      )}
    />
  );
};

export default NewImageController;
