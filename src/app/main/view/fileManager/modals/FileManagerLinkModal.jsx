import Modal from '@mui/material/Modal';
import Box from '@mui/system/Box';
import InputController from 'app/shared-components/fields/InputController';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { addFiles, getFiles, getMediaCount } from '../../../administration/store/fileManagerSlice';

function FileManagerLinkModal() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  const schema = yup.object().shape({
    LINK: yup.string().url().trim().required('The link entered is incorrect'),
  });

  const { control, formState, handleSubmit } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const { t } = useTranslation('navigation');

  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenInside = () => setModalOpen(true);
  const handleCloseInside = () => setModalOpen(false);
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  function onSubmit(data) {
    const link = [data.LINK];
    dispatch(addFiles({ type: 'link', link })).then(() => {
      setModalOpen(false);
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set('file_manager_type', `link`);

      setSearchParams(newSearchParams);

      dispatch(getFiles());
      dispatch(getMediaCount());
    });
  }

  return (
    <div>
      <Button
        onClick={handleOpenInside}
        className="w-[100%] h-[100%] flex justify-center items-center"
      >
        <Box>
          <FuseSvgIcon size={32} color="action">
            heroicons-outline:plus
          </FuseSvgIcon>
        </Box>
      </Button>
      <Modal
        open={modalOpen}
        onClose={handleCloseInside}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box className="flex flex-col justify-center items-center mx-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-center items-center mx-4"
            >
              <InputController
                control={control}
                name="LINK"
                errors={errors}
                icon="material-solid:smart_display"
                className="w-[500px] mt-32 font-bold"
              />
              <Button className="my-12" variant="contained" color="secondary" type="submit">
                <span className="mx-8">{t('SAVE')}</span>
              </Button>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default FileManagerLinkModal;
