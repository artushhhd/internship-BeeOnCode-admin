import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Box from '@mui/system/Box';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import InputController from 'app/shared-components/fields/InputController';
import InputColorController from 'app/shared-components/fields/inputColorController';
import { setLanguages } from 'app/store/RightBarSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import {
  editFolder,
  getFolder,
  selectEditedFolders,
  selectFolderActionLoading,
} from '../../../administration/store/folderManagerSlice';
import { getFiles } from '../../../administration/store/fileManagerSlice';

const FileManagerFolderForm = () => {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const folder = useSelector(selectEditedFolders);
  const edit = routeParams.id !== 'new';
  const location = useLocation();
  const schema = yup.object().shape({
    file_name: yup.string().trim().min(3, 'You must enter a name, min 3 symbol'),
  });

  const loading = useSelector(selectFolderActionLoading);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const copyEditFileData = useMemo(() => {
    return { ...folder };
  }, [folder]);

  useEffect(() => {
    dispatch(getFiles());
    reset({ ...copyEditFileData });
  }, [reset, copyEditFileData, dispatch]);

  // disable language switcher
  useEffect(() => {
    dispatch(setLanguages(false));
    return () => dispatch(setLanguages(true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFolder(routeParams.id));
  }, [dispatch, routeParams.id]);

  function onSubmit(data) {
    if (data && edit) {
      dispatch(
        editFolder({ name: data.file_name, folderColor: data.folder_color, id: routeParams.id })
      ).then(() => {
        navigate(`/view/fileManager?${location.search}`);
        dispatch(getFiles());
      });
    }
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <>
      <Box className=" relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <InputController
          control={control}
          name="file_name"
          icon="heroicons-outline:folder-add"
          label="title"
          errors={errors}
        />
        <InputColorController control={control} name="folder_color" errors={errors} palette={2} />
      </Box>
      <FormButtons
        onSubmitFunction={handleSubmit(onSubmit)}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
      />
    </>
  );
};
export default FileManagerFolderForm;
