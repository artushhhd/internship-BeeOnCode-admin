import Box from '@mui/system/Box';
import { FILE_API_URL } from '@api/http';
import DevMode from 'app/shared-components/DevMode';
import { ImageListItemBar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import formatDate from '@helpers/formatDate';
import { useState } from 'react';
import FileManagerSelectCheckBox from '../checkbox/FileManagerSelectCheckBox';
import FileManagerSelectForMoveCheckBox from '../checkbox/FileManagerSelectForMoveCheckBox';
import FileItemIcon from '../FileItemIcon';
import {
  selectIsEnable,
  selectItemForMove,
  selectSelectedFolders,
} from '../../../administration/store/folderManagerSlice';
import FileManagerDeleteButton from '../FileManagerDeleteButton';
import { selectFiles } from '../../../administration/store/fileManagerSlice';
import FileManagerInsideZipModal from '../modals/FileManagerInsideZipModal';

const FileManagerListItemFile = ({
  item,
  fileType,
  languageDifferent,
  selected,
  setSelected,
  multiple,
  setPhoto,
  isChecked,
  inModal,
}) => {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const navigate = useNavigate();
  const location = useLocation();
  const isEnableMove = !!useSelector(selectIsEnable);
  const selectedItems = useSelector(selectSelectedFolders);
  const checkedMove = selectedItems.includes(item.id);
  const dispatch = useDispatch();
  const filesData = useSelector(selectFiles);
  const files = filesData?.data || [];
  const [showInsideZip, setShowInsideZip] = useState(false);

  return (
    <Tooltip title={item.file_name} key={item.id} arrow placement="top">
      <Box
        key={item.id}
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: `url("${FILE_API_URL}/${item.thumbnail_url}")`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border:
            formatDate(item.created_at) === formatDate(new Date()) ? '5px solid gold' : 'none',
        }}
        className="flex flex-col relative w-144 h-128 m-8 p-16 justify-center shadow rounded-16 cursor-pointer overflow-hidden group"
        component="label"
        htmlFor={`file_${item.id}`}
        onClick={() => {
          if (isEnableMove) dispatch(selectItemForMove(item.id));
        }}
      >
        <DevMode>media_id: {item?.id}</DevMode>
        <Box
          className={`flex flex-auto w-full items-center justify-center ${
            item.extension === 'webp' ? 'hidden' : ''
          }`}
        >
          <FileItemIcon extension={item.extension} />
        </Box>

        {isEnableMove && <FileManagerSelectForMoveCheckBox checkedMove={checkedMove} />}

        {(item.type === 'image' || fileType === 'video' || fileType === 'link') && (
          <Box className="absolute top-2 left-2">
            <Button
              variant="contained"
              className="m-0 p-0 min-w-28 h-28 min-h-28"
              onClick={(e) => {
                e.stopPropagation();
                setPhoto(
                  files
                    .filter((f) => ['image', 'video', 'link'].includes(f.type))
                    .findIndex((f) => f.id === item.id)
                );
              }}
            >
              <FuseSvgIcon size={24} color="primary">
                heroicons-outline:eye
              </FuseSvgIcon>
            </Button>
          </Box>
        )}
        {item.type === 'zip' && (
          <Box className="absolute top-2 left-2">
            <Button
              variant="contained"
              className="m-0 p-0 min-w-28 h-28 min-h-28"
              onClick={(e) => {
                e.stopPropagation();
                setShowInsideZip(true);
              }}
            >
              <FuseSvgIcon size={24} color="primary">
                heroicons-outline:eye
              </FuseSvgIcon>
            </Button>

            {showInsideZip && (
              <FileManagerInsideZipModal
                item={item}
                showInsideZip={showInsideZip}
                setShowInsideZip={setShowInsideZip}
              />
            )}
          </Box>
        )}
        {inModal && !isEnableMove && (
          <FileManagerSelectCheckBox
            item={item}
            languageDifferent={languageDifferent}
            isChecked={isChecked}
            selected={selected}
            setSelected={setSelected}
            multiple={multiple}
          />
        )}

        <DevMode>
          <FileManagerDeleteButton item={item} />
        </DevMode>

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
          title={
            item.extension === 'webp'
              ? item?.title_alt?.find((val) => val.language_id === translationLanguage)?.title
              : item?.file_name
          }
          actionIcon={
            <IconButton
              aria-label={`info about ${item.title}`}
              onClick={() => {
                navigate(`/view/fileManager/${item?.id}/edit${location.search}`);
              }}
            >
              <EditIcon
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              />
            </IconButton>
          }
        />
      </Box>
    </Tooltip>
  );
};

export default FileManagerListItemFile;
