import Modal from '@mui/material/Modal';
import Box from '@mui/system/Box';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Tooltip from '@mui/material/Tooltip';
import { FILE_API_URL } from '@api/http';
import { ImageListItemBar } from '@mui/material';
import isImagePath from '@helpers/isImagePath';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import {
  extractFiles,
  selectFilesInsideZip,
  selectLoadingInsideZip,
} from '../../../administration/store/fileManagerSlice';
import FileItemIcon from '../FileItemIcon';

function FileManagerInsideZipModal({ item, showInsideZip, setShowInsideZip }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    overflowY: 'scroll',
    p: 4,
  };

  const dispatch = useDispatch();

  const loading = useSelector(selectLoadingInsideZip);
  const files = useSelector(selectFilesInsideZip);

  useEffect(() => {
    dispatch(extractFiles({ path: item.name }));
  }, [dispatch, item]);

  return (
    <Modal
      open={showInsideZip}
      onClose={() => setShowInsideZip(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h2>{item.file_name}</h2>
        <IconButton onClick={() => setShowInsideZip(false)} className="absolute top-8 right-0">
          <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
        </IconButton>
        {loading ? (
          <FuseLoading />
        ) : (
          <Box className="flex flex-wrap">
            {files.map((obj, i) => {
              return (
                <Tooltip title={obj.name} key={i} arrow placement="top">
                  <Box
                    sx={{
                      backgroundColor: 'background.paper',
                      backgroundImage: `url("${FILE_API_URL}/${obj.path}")`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                    className="flex flex-col relative w-144 h-128 m-8 p-16 justify-center shadow rounded-16 cursor-pointer overflow-hidden group"
                  >
                    <Box
                      className={`flex flex-auto w-full items-center justify-center ${
                        isImagePath(obj.path) ? 'hidden' : ''
                      }`}
                    >
                      {obj.type === 'folder' ? (
                        <FuseSvgIcon className="text-48" size={72}>
                          heroicons-outline:folder
                        </FuseSvgIcon>
                      ) : (
                        <FileItemIcon extension={obj.extension} />
                      )}
                    </Box>

                    {/* <Box className="absolute top-2 left-2"> */}
                    {/*  <a href={`${FILE_API_URL}/${obj.path}`} target="_blank" rel="noreferrer"> */}
                    {/*    <Button variant="contained" className="m-0 p-0 min-w-28 h-28 min-h-28"> */}
                    {/*      <FuseSvgIcon size={24} color="primary"> */}
                    {/*        heroicons-outline:eye */}
                    {/*      </FuseSvgIcon> */}
                    {/*    </Button> */}
                    {/*  </a> */}
                    {/* </Box> */}

                    <ImageListItemBar
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        height: 32,
                        borderTop: 'none',
                        '& div': {
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontsize: '1.3rem',
                          fontWeight: 'bolder',
                        },
                      }}
                      title={obj.name}
                    />
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default FileManagerInsideZipModal;
