import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import InputController from 'app/shared-components/fields/InputController';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import InputColorController from 'app/shared-components/fields/inputColorController';
import { getFiles } from '../../../administration/store/fileManagerSlice';
import {
  addFolder,
  changeMoveStatus,
  selectFolderActionLoading,
  selectIsEnable,
} from '../../../administration/store/folderManagerSlice';

function FolderButtons({ fileType, pageNumber, pageSize, searchQuery, folderId, inModal }) {
  const [open, setOpen] = useState(false);
  const loading = !!useSelector(selectFolderActionLoading);
  const isEnableMove = !!useSelector(selectIsEnable);

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

  const { t } = useTranslation('navigation');

  const schema = yup.object().shape({
    name: yup.string().trim().required('The name required'),
    folder_color: yup.string().trim().required('The color required'),
  });

  const dispatch = useDispatch();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [reset, open]);

  function onSubmit(data) {
    dispatch(addFolder({ ...data, folderId })).then(() => {
      setOpen(false);
      dispatch(getFiles({ type: fileType, pageNumber, pageSize, q: searchQuery, folderId }));
    });
  }

  return (
    <Box className="flex w-full">
      <Box
        id="four"
        sx={{ backgroundColor: 'background.paper' }}
        className={`flex justify-center items-center ${
          inModal ? 'w-1/2' : 'w-full'
        } w-1/2 h-56 m-8 p-16 shadow rounded-16 cursor-pointer`}
        onClick={() => setOpen(true)}
      >
        <FuseSvgIcon size={32} color="action">
          heroicons-outline:folder-add
        </FuseSvgIcon>
      </Box>
      {inModal && (
        <Box
          sx={{ backgroundColor: isEnableMove ? 'background.secondary' : 'background.paper' }}
          className="flex justify-center items-center w-1/2 h-56 m-8 p-16 shadow rounded-16 cursor-pointer"
          onClick={() => {
            dispatch(changeMoveStatus(!isEnableMove));
          }}
        >
          <FuseSvgIcon size={32} color="action">
            feather:move
          </FuseSvgIcon>
        </Box>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
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
                name="name"
                label={t('NAME')}
                errors={errors}
                icon="heroicons-outline:folder-add"
                className="w-[500px] mt-32 font-bold"
              />
              <InputColorController
                control={control}
                name="folder_color"
                errors={errors}
                palette={2}
              />
              <Button
                disabled={loading}
                className="my-12"
                variant="contained"
                color="secondary"
                type="submit"
              >
                <span className="mx-8">{t('ADD')}</span>
              </Button>
            </form>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
export default FolderButtons;
