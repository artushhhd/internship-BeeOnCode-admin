import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/system/Box';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { ImageListItemBar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import DevMode from 'app/shared-components/DevMode';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import formatDate from '@helpers/formatDate';
import FileItemIcon from '../FileItemIcon';
import FileManagerSelectForMoveCheckBox from '../checkbox/FileManagerSelectForMoveCheckBox';
import FileManagerSelectLinkCheckBox from '../checkbox/FileManagerSelectLinkCheckBox';
import {
  selectIsEnable,
  selectItemForMove,
  selectSelectedFolders,
} from '../../../administration/store/folderManagerSlice';
import FileManagerDeleteButton from '../FileManagerDeleteButton';
import { selectFiles } from '../../../administration/store/fileManagerSlice';

const FileManagerListItemLink = ({
  item,
  languageDifferent,
  selected,
  setSelected,
  multiple,
  setPhoto,
  isChecked,
  inModal,
}) => {
  const isEnableMove = !!useSelector(selectIsEnable);
  const dispatch = useDispatch();
  const selectedItems = useSelector(selectSelectedFolders);
  const checkedMove = selectedItems.includes(item.id);
  const filesData = useSelector(selectFiles);
  const files = filesData?.data || [];

  return (
    <Tooltip title={item.file_name || ''} placement="top" arrow key={item.id}>
      <Box
        className="flex flex-col items-center relative w-144 h-128 m-8 p-16 justify-center shadow  cursor-pointer overflow-hidden group rounded-16"
        sx={{
          border:
            formatDate(item.created_at) === formatDate(new Date()) ? '5px solid gold' : 'none',
        }}
      >
        <Box>
          <Box
            style={{
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            sx={{
              backgroundColor: 'background.paper',
              backgroundImage: `url("https://img.youtube.com/vi/${item.youtube_id}/maxresdefault.jpg")`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
            component="label"
            htmlFor={`file_${item.id}`}
            onClick={() => {
              if (isEnableMove) dispatch(selectItemForMove(item.id));
            }}
          >
            <PlayCircleIcon sx={{ position: 'absolute', color: 'red', fontSize: '35px' }} />
          </Box>
          <Box
            className={`flex flex-auto w-full items-center justify-center ${
              item.extension === 'webp' ? 'hidden' : ''
            }`}
            style={{ position: 'absolute' }}
          >
            <FileItemIcon extension={item.extension} />
          </Box>

          {/* eslint-disable-next-line no-nested-ternary */}
          {isEnableMove ? (
            <FileManagerSelectForMoveCheckBox checkedMove={checkedMove} />
          ) : inModal ? (
            <FileManagerSelectLinkCheckBox
              isChecked={isChecked}
              selected={selected}
              setSelected={setSelected}
              multiple={multiple}
              item={item}
              languageDifferent={languageDifferent}
            />
          ) : null}

          <Box className="absolute top-2 left-2">
            <Button
              variant="contained"
              className="m-0 p-0 min-w-40"
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
          <DevMode>
            <FileManagerDeleteButton item={item} />
          </DevMode>
          <ImageListItemBar
            sx={{
              borderTop: 'none',
              background: 'rgba(0,0,0,0.5)',
              '& div': {
                color: 'rgba(255, 255, 255, 0.8)',
                fontsize: '1.3rem',
                fontWeight: 'bolder',
              },
            }}
            title={item.file_name}
            actionIcon={
              <IconButton aria-label={`info about ${item.title}`}>
                {item.extension === 'webp' && (
                  <EditIcon
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  />
                )}
              </IconButton>
            }
          />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default FileManagerListItemLink;
