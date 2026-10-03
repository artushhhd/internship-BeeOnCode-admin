import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import Box from '@mui/system/Box';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { FILE_API_URL } from '@api/http';
import { showMessage } from 'app/store/fuse/messageSlice';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import createTranslationData from '@helpers/createTranslationData';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import ImageCropper from 'app/shared-components/ImageCropper';
import FuseLoading from '@fuse/core/FuseLoading';
import FileItemIcon from '../FileItemIcon';
import {
  downloadFile,
  editFile,
  getFile,
  getFiles,
  getFileToEdit,
  selectFileLoadingItem,
} from '../../../administration/store/fileManagerSlice';

const FileManagerFileForm = () => {
  const { t } = useTranslation('navigation');
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editFileData = useSelector(getFileToEdit);
  const [cropImage, setCropImage] = useState(false);
  const edit = routeParams.id !== 'new';
  const location = useLocation();
  const schema = yup.object().shape({
    titles1: yup.string().trim().min(3, 'You must enter a name, min 3 symbol'),
    alt1: yup.string().trim().min(3, 'You must enter a name, min 3 symbol'),
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return date.toLocaleDateString('en-US', options);
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const copyEditFileData = useMemo(() => {
    return { ...editFileData };
  }, [editFileData]);

  const isImage = editFileData.type === 'image';

  useEffect(() => {
    if (editFileData) {
      if (routeParams.id) {
        editFileData.title_alt?.forEach((item) => {
          copyEditFileData[`titles${item.language_id}`] = item.title;
          if (isImage) {
            copyEditFileData[`alts${item.language_id}`] = item.alt;
          }
        });
      }
      reset({ ...copyEditFileData });
    }
  }, [editFileData, reset, copyEditFileData, routeParams.id, isImage]);

  useEffect(() => {
    dispatch(getFile(routeParams.id));
  }, [dispatch, routeParams.id]);

  function onSubmit(data) {
    if (data && edit) {
      data.id = Number(routeParams.id);
      data.titles = createTranslationData(data, 'titles');
      if (isImage) {
        data.alt = createTranslationData(data, 'alts');
      }
      dispatch(editFile(data)).then(() => {
        navigate(`/view/fileManager?${location.search}`);
        dispatch(getFiles());
      });
    }
  }

  const loading = useSelector(selectFileLoadingItem);

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <>
      {cropImage ? (
        <Modal
          open={cropImage}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: '70%',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <ImageCropper img={editFileData} setCropImage={setCropImage} />
          </Box>
        </Modal>
      ) : (
        <>
          <Box className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
            <table className="m-0 mt-16">
              <tbody>
                <tr />
                <tr>
                  <td>File name:</td>
                  <td>{`${editFileData?.file_name}`}</td>
                </tr>
                <tr>
                  <td>Created at:</td>
                  <td>{formatDate(`${editFileData?.created_at}`)}</td>
                </tr>
              </tbody>
            </table>
            <Box className="w-full">
              <Box className="flex flex-auto items-end">
                <Tooltip title={formatDate(editFileData?.created_at)} placement="top" arrow>
                  <Box
                    sx={{
                      borderWidth: 4,
                      borderStyle: 'solid',
                      borderColor: 'background.paper',
                      backgroundImage: `url("${FILE_API_URL}/${editFileData?.name}")`,
                      backgroundSize: 'cover',
                      backgroundColor: 'background.paper',
                    }}
                    className="flex flex-col relative  sm:w-160 h-128 w-128 m-8 p-16 justify-center shadow rounded-16 cursor-pointer overflow-hidden"
                  >
                    <Box
                      className={`flex flex-auto w-full items-center justify-center ${
                        editFileData.extension === 'webp' ? 'hidden' : ''
                      }`}
                    >
                      <FileItemIcon extension={editFileData.extension} />
                    </Box>
                  </Box>
                </Tooltip>
                {isImage && (
                  <Box className="w-[250px] h-[80px] flex items-center justify-end">
                    <Button
                      className="ml-8 flex justify-center w-[100px]"
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setCropImage(true);
                      }}
                    >
                      <Tooltip
                        TransitionProps={{ timeout: 300 }}
                        enterDelay={500}
                        leaveDelay={200}
                        followCursor
                        title="Crop"
                      >
                        <span> Crop</span>
                      </Tooltip>
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            <InputTranslationController control={control} name="titles" errors={errors} />
            {isImage && (
              <InputTranslationController
                control={control}
                name="alts"
                label={t('AlternativeText')}
                errors={errors}
              />
            )}
            <TextField
              sx={{ fontWeight: 'bold' }}
              className="mt-32 font-bold"
              label={t('Url')}
              value={`${FILE_API_URL}/${editFileData?.name}`}
              fullWidth
              InputProps={{
                style: { fontWeight: '700' },
                endAdornment: (
                  <InputAdornment position="end" className="cursor-pointer flex">
                    <Button
                      size="small min-w-min"
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          `${FILE_API_URL}/${editFileData?.name}`
                        );
                        dispatch(showMessage({ message: t('Copied') }));
                      }}
                    >
                      <ContentCopyIcon />
                    </Button>
                    <Button
                      size="small min-w-min"
                      onClick={() => dispatch(downloadFile(editFileData.id))}
                    >
                      <DownloadIcon />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <FormButtons onSubmitFunction={handleSubmit(onSubmit)} />
        </>
      )}
    </>
  );
};
export default FileManagerFileForm;
