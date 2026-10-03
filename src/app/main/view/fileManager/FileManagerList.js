import { useEffect, useState } from 'react';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Backdrop, LinearProgress, Zoom } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { useDropzone } from 'react-dropzone';
import Box from '@mui/system/Box';
import { useParams, useSearchParams } from 'react-router-dom';
import PaginatedItems from 'app/shared-components/reactPaginate';
import clsx from 'clsx';
import CountSelect from './toolbar/CountSelect';
import FileManagerFilterBar from './toolbar/FileManagerFilterBar';
import {
  addFiles,
  cancelUpload,
  getFiles,
  getMediaCount,
  moveFiles,
  selectBreadcrumbs,
  selectCount,
  selectFiles,
  selectFilesLoadingAll,
  selectFileUploadPercent,
} from '../../administration/store/fileManagerSlice';
import FilesSkeleton from './FilesSkeleton';
import FileManagerLinkModal from './modals/FileManagerLinkModal';
import FileManagerSwiper from './FileManagerSwiper';
import FileManagerSearchInput from './toolbar/FileManagerSearchInput';
import FolderButtons from './folder/FolderButtons';
import FileManagerListItemFolder from './listItem/FileManagerListItemFolder';
import FileManagerListItemLink from './listItem/FileManagerListItemLink';
import FileManagerListItemFile from './listItem/FileManagerListItemFile';
import FileManagerMoveButton from './toolbar/FileManagerMoveButton';
import {
  changeMoveStatus,
  resetSelectedItems,
  selectIsEnable,
  selectItemForMove,
  selectSelectedFolders,
} from '../../administration/store/folderManagerSlice';
import FileManagerBreadcrumbs from './toolbar/FileManagerBreadcrumbs';

const FileManagerList = ({
  type,
  multiple = false,
  selected = false,
  languageDifferent = false,
  setSelected,
  youTube,
  defaultSelected,
  handleClose,
  setDefaultSelected,
  inModal = false,
}) => {
  const dispatch = useDispatch();
  const filesData = useSelector(selectFiles);
  const breadcrumbs = useSelector(selectBreadcrumbs);
  const count = useSelector(selectCount);
  const files = filesData?.data || [];

  const [searchParams, setSearchParams] = useSearchParams();

  const { t } = useTranslation('navigation');
  // eslint-disable-next-line no-nested-ternary
  const fileType = !inModal
    ? searchParams.get('file_manager_type') || 'all'
    : // eslint-disable-next-line no-nested-ternary
    searchParams.get('file_manager_type')
    ? searchParams.get('file_manager_type')
    : type === 'file'
    ? 'file'
    : 'image'; // types [file, image, media (for support link)]
  const { translationLanguageInModal } = useSelector((state) => state.i18n);
  const [photo, setPhoto] = useState(-1);
  const params = useParams();
  const edit = params.id !== 'new';
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const [uploadImageCount, setUploadImageCount] = useState(null);
  const pageNumber = searchParams.get('file_manager_page') || 1;
  const searchQuery = searchParams.get('file_manager_search') || '';
  const pageSize = searchParams.get('file_manager_page_size') || 20;
  const folderId = searchParams.get('file_manager_folder_id');
  const loading = useSelector(selectFilesLoadingAll);
  const selectedItems = useSelector(selectSelectedFolders);
  const [isDrag, setIsDrag] = useState(false);
  const isEnableMove = !!useSelector(selectIsEnable);
  const uploadPercent = +useSelector(selectFileUploadPercent);

  const accept =
    // eslint-disable-next-line no-nested-ternary
    fileType === 'audio'
      ? 'audio/*'
      : // eslint-disable-next-line no-nested-ternary
      fileType === 'image'
      ? 'image/*'
      : // eslint-disable-next-line no-nested-ternary
      fileType === 'video'
      ? 'video/*'
      : fileType === 'zip'
      ? 'application/*'
      : 'file';

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('file_manager_type', fileType);
    setSearchParams(newSearchParams);
  }, [fileType, searchParams, setSearchParams, inModal]);

  useEffect(() => {
    dispatch(changeMoveStatus(!inModal));
    dispatch(resetSelectedItems());
  }, [dispatch, inModal]);

  useEffect(() => {
    return () => {
      if (inModal) {
        const newSearchParams = new URLSearchParams(searchParams);

        newSearchParams.delete('file_manager_page');
        newSearchParams.delete('file_manager_search');
        newSearchParams.delete('file_manager_page_size');
        newSearchParams.delete('file_manager_folder_id');
        newSearchParams.delete('file_manager_type');

        setSearchParams(newSearchParams);
      }
    };
  }, [dispatch, searchParams, setSearchParams, inModal]);

  useEffect(() => {
    dispatch(getFiles());
  }, [dispatch, fileType, pageNumber, pageSize, edit, searchQuery, folderId]);

  useEffect(() => {
    dispatch(getMediaCount());
  }, [dispatch, searchQuery, folderId]);

  async function uploadFiles(e) {
    return new Promise(() => {
      const uploadedFiles = e;
      if (!uploadedFiles) {
        return;
      }
      setUploadedFilesCount(uploadedFiles.length);

      dispatch(addFiles(uploadedFiles))
        .then(() => {
          setUploadedFilesCount(0);
          dispatch(getFiles());
          setUploadImageCount(e.length);
          dispatch(getMediaCount());
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: uploadFiles,
    noClick: true,
    noKeyboard: true,
  });
  useEffect(() => {
    const imageCheckBox = [];
    if (uploadImageCount > 0 && selected !== false && typeof selected !== 'object') {
      Array.from({ length: uploadImageCount }).forEach((_, i) => {
        imageCheckBox.push({
          id: files[i].id,
          name: files[i].file_name,
          language_id: translationLanguageInModal,
          youtube_id: files[i].youtube_id,
          youtube_link: files[i].youtube_link,
          src: files[i].name,
          type: files[i].type,
          created_at: files[i].created_at,
        });
      });
      setSelected([...selected, ...imageCheckBox]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesData?.total]);

  return (
    <Box
      className="w-full h-[100%] rounded-16 mb-24 flex flex-col"
      onPaste={(e) => {
        const pastedFiles = Array.from(e.clipboardData.files);
        const copiedText = e.clipboardData.getData('text');
        if (pastedFiles.length) {
          uploadFiles(pastedFiles).then();
        } else if (copiedText) {
          fetch(copiedText)
            .then((response) => response.blob())
            .then((blob) => {
              const file = new File([blob], blob.type, { type: blob.type });
              uploadFiles([file]).then();
            })
            .catch((error) => {
              console.error('Error fetching or creating the file:', error);
            });
        }
      }}
    >
      <Box className="flex justify-between ">
        <CountSelect pageSize={pageSize} />
        <FileManagerMoveButton />
        <FileManagerSearchInput />
        <FileManagerFilterBar type={type} fileType={fileType} youTube={youTube} count={count} />

        {inModal && (
          <>
            <Button
              className="ml-auto"
              onClick={() => {
                if (languageDifferent && multiple) {
                  setSelected(defaultSelected);
                } else if (languageDifferent) {
                  setSelected({
                    ...selected,
                    [translationLanguageInModal]: defaultSelected[translationLanguageInModal],
                  });
                } else {
                  setSelected(defaultSelected);
                }
                handleClose();
              }}
            >
              <Tooltip
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 300 }}
                title={t('CANCEL')}
                enterDelay={500}
                leaveDelay={200}
                followCursor
              >
                <span>{t('CANCEL')}</span>
              </Tooltip>
            </Button>

            <Button
              className="ml-8 flex justify-center"
              variant="contained"
              color="secondary"
              onClick={() => {
                setDefaultSelected(selected);
                handleClose();
              }}
            >
              <Tooltip
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 300 }}
                title={t('SAVE')}
                enterDelay={500}
                leaveDelay={200}
                followCursor
              >
                <span>{t('SAVE')}</span>
              </Tooltip>
            </Button>
          </>
        )}
      </Box>

      <Box
        {...getRootProps()}
        className={`p-16 w-full h-[100vh] rounded-16 mb-24 border flex flex-col ${
          loading ? 'overflow-hidden' : ''
        }`}
        sx={{
          backgroundColor: (theme) => lighten(theme.palette.background.default, 0.4),
          overflowY: 'scroll',
          position: 'relative',
        }}
      >
        {!!isDragActive && (
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              left: 0,
              background: 'rgba(217,225,225,0.89)',
              borderRadius: '16px',
            }}
            className=" flex justify-center items-center text-[100px] z-40 h-full"
          >
            <span>Drop Here...</span>
          </Box>
        )}

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!!uploadedFilesCount}
        >
          <Box className="flex w-full justify-center content-center" color="text.secondary">
            <Box
              className="w-1/2 px-40 py-20"
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 6,
              }}
            >
              <Typography textAlign="center" variant="h4">
                uploading {uploadedFilesCount} files
              </Typography>

              <Box className="flex w-full justify-center items-center gap-10">
                <Box className="w-full my-18">
                  <LinearProgress variant="determinate" value={uploadPercent} />
                </Box>
                <Box>
                  <Typography variant="body2">{`${uploadPercent}%`}</Typography>
                </Box>
              </Box>
              <Typography textAlign="center" variant="h3">
                <Button
                  className="ml-auto"
                  variant="contained"
                  color="error"
                  onClick={() => dispatch(cancelUpload())}
                >
                  Cancel <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                </Button>
              </Typography>
            </Box>
          </Box>
        </Backdrop>

        {breadcrumbs && (
          <Box className="border-b h-32">
            <FileManagerBreadcrumbs folder={breadcrumbs} />
          </Box>
        )}

        <div className="flex flex-wrap -m-8 mt-8">
          {loading && <FilesSkeleton />}

          <Box className="flex flex-col">
            <Box
              sx={{ backgroundColor: 'background.paper' }}
              className="flex relative w-144 h-56 m-8 p-16 shadow rounded-16 cursor-pointer"
              component="label"
            >
              {fileType !== 'link' && (
                <input
                  type="file"
                  className="hidden"
                  multiple
                  id="button-file"
                  {...getInputProps()}
                  accept={accept}
                />
              )}
              <div className="flex flex-auto w-full items-center justify-center">
                {fileType !== 'link' ? (
                  <Box id="one">
                    <FuseSvgIcon size={32} color="action">
                      heroicons-outline:upload
                    </FuseSvgIcon>
                  </Box>
                ) : (
                  <FileManagerLinkModal pageSize={pageSize} />
                )}
              </div>
            </Box>
            <FolderButtons
              inModal={inModal}
              fileType={fileType}
              pageNumber={pageNumber}
              pageSize={pageSize}
              searchQuery={searchQuery}
              folderId={folderId}
            />
          </Box>

          {!!files?.length &&
            !loading &&
            files?.map((item, index) => {
              let isChecked;

              if (multiple && languageDifferent) {
                isChecked = selected?.some(
                  (value) =>
                    value?.id === item?.id && translationLanguageInModal === value?.language_id
                );
              } else if (multiple) {
                isChecked = selected?.some((value) => value?.id === item?.id);
              } else if (languageDifferent) {
                isChecked = item?.id === selected[translationLanguageInModal]?.id;
              } else {
                isChecked = item?.id === selected?.id;
              }
              const createAt = item.created_at;
              const checkedMove = selectedItems.includes(item.id);

              // eslint-disable-next-line no-nested-ternary

              return (
                <Box
                  key={item.id}
                  draggable={isEnableMove}
                  onDragStart={(e) => {
                    setIsDrag(true);
                    if (!checkedMove) {
                      if (!e.ctrlKey) {
                        dispatch(resetSelectedItems());
                      }
                      dispatch(selectItemForMove(item.id));
                    }
                  }}
                  onDragEnd={(e) => {
                    e.preventDefault();
                    setIsDrag(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!selectedItems.includes(item.id)) {
                      if (item.type === 'folder') {
                        dispatch(moveFiles({ ids: selectedItems, folderId: item.id })).then(() => {
                          dispatch(getFiles());
                          dispatch(resetSelectedItems());
                        });
                      }
                    }
                  }}
                  className={clsx(
                    isDrag && checkedMove ? 'opacity-10' : 'opacity-100',
                    'relative group'
                  )}
                >
                  {searchQuery && (
                    <Tooltip title={t('SHOW_IN_FOLDER')} placement="right-end">
                      <Button
                        variant="contained"
                        onClick={() => {
                          const newSearchParams = new URLSearchParams(searchParams);

                          newSearchParams.set('file_manager_page', `1`);

                          if (item.folder_id) {
                            newSearchParams.set('file_manager_folder_id', item.folder_id);
                          } else {
                            newSearchParams.delete('file_manager_folder_id');
                          }

                          if (searchQuery) {
                            newSearchParams.delete('file_manager_search');
                          }

                          setSearchParams(newSearchParams);
                        }}
                        className="hidden group-hover:block min-w-0 absolute top-10 left-1/2 -translate-x-1/2 z-10 bg-primary border"
                      >
                        <FuseSvgIcon color="primary" className="text-48">
                          heroicons-outline:folder
                        </FuseSvgIcon>
                      </Button>
                    </Tooltip>
                  )}
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {item.type === 'folder' ? (
                    <FileManagerListItemFolder item={item} />
                  ) : item.type === 'link' ? (
                    <FileManagerListItemLink
                      createAt={createAt}
                      fileType={fileType}
                      selected={selected}
                      setSelected={setSelected}
                      multiple={multiple}
                      item={item}
                      languageDifferent={languageDifferent}
                      isChecked={isChecked}
                      index={index}
                      setPhoto={setPhoto}
                      inModal={inModal}
                    />
                  ) : (
                    <FileManagerListItemFile
                      createAt={createAt}
                      fileType={fileType}
                      selected={selected}
                      setSelected={setSelected}
                      multiple={multiple}
                      item={item}
                      languageDifferent={languageDifferent}
                      isChecked={isChecked}
                      index={index}
                      setPhoto={setPhoto}
                      inModal={inModal}
                    />
                  )}
                </Box>
              );
            })}
          <FileManagerSwiper
            photo={photo}
            setPhoto={setPhoto}
            files={files.filter((f) => ['image', 'video', 'link'].includes(f.type))}
          />
        </div>
      </Box>
      <Box className="flex w-full justify-between" component="div">
        <Box className="flex w-1/3 items-center" component="div">
          {filesData?.total > filesData?.per_page &&
            `${t('DISPLAYFROM', {
              count: pageSize,
              total: filesData?.total,
            })}`}
          {filesData?.total > 0 &&
            filesData?.total <= filesData?.per_page &&
            `${t('DISPLAYFROM', {
              count: filesData?.total,
              total: filesData?.total,
            })}`}
        </Box>
        {!(filesData?.total <= filesData?.per_page) && (
          <Box className="w-2/3">
            <PaginatedItems pageTotal={filesData?.last_page} keyQuery="file_manager_page" />
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default FileManagerList;
