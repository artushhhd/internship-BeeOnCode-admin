import Box from '@mui/system/Box';
import DevMode from 'app/shared-components/DevMode';
import { ImageListItemBar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Badge from '@mui/material/Badge';
import formatDate from '@helpers/formatDate';
import FileManagerSelectForMoveCheckBox from '../checkbox/FileManagerSelectForMoveCheckBox';
import {
  selectIsEnable,
  selectItemForMove,
  selectSelectedFolders,
} from '../../../administration/store/folderManagerSlice';
import FileManagerDeleteButton from '../FileManagerDeleteButton';

const FileManagerListItemFolder = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEnableMove = !!useSelector(selectIsEnable);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const selectedItems = useSelector(selectSelectedFolders);
  const checkedMove = selectedItems.includes(item.id);
  const searchQuery = searchParams.get('file_manager_search');

  return (
    <Tooltip title={item.file_name} placement="top" arrow key={item.id}>
      <Badge
        id="three"
        sx={{
          '& .MuiBadge-badge': {
            right: 10,
            top: 10,
            border: `2px solid`,
            borderColor: 'background.paper',
          },
        }}
        max={9999}
        badgeContent={item.children_count || (!searchQuery ? '0' : null)}
        color="primary"
      >
        <Badge
          sx={{
            '& .MuiBadge-badge': {
              right: 10,
              top: 30,
              border: `2px solid`,
              borderColor: 'background.paper',
              background: 'gold',
            },
          }}
          max={9999}
          badgeContent={item.children_folder_count}
          color="primary"
        >
          <Box
            onClick={() => {
              if (isEnableMove) dispatch(selectItemForMove(item.id));
            }}
            key={item.id}
            sx={{
              backgroundColor: 'background.paper',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              border:
                formatDate(item.created_at) === formatDate(new Date()) ? '5px solid gold' : 'none',
            }}
            className="flex flex-col relative w-full sm:w-144 h-128 m-8 p-16 justify-center shadow rounded-16 cursor-pointer overflow-hidden group"
            onDoubleClick={(e) => {
              const newSearchParams = new URLSearchParams(searchParams);

              newSearchParams.set('file_manager_page', `1`);
              newSearchParams.set('file_manager_folder_id', item.id);

              if (searchQuery) {
                newSearchParams.delete('file_manager_search');
              }

              if (isEnableMove && checkedMove) dispatch(selectItemForMove(item.id));

              setSearchParams(newSearchParams);
            }}
          >
            <DevMode>media_id: {item?.id}</DevMode>
            <Box
              className="flex flex-auto w-full items-center justify-center"
              style={{
                color: item.folder_color,
              }}
            >
              <FuseSvgIcon className="text-48" size={72}>
                heroicons-outline:folder
              </FuseSvgIcon>
            </Box>

            {isEnableMove && <FileManagerSelectForMoveCheckBox checkedMove={checkedMove} />}
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
              title={item.file_name}
              actionIcon={
                <IconButton
                  id="five"
                  aria-label={`info about ${item.file_name}`}
                  onClick={() => {
                    navigate(`/view/fileManager/folder/${item?.id}/edit${location.search}`);
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
        </Badge>
      </Badge>
    </Tooltip>
  );
};

export default FileManagerListItemFolder;
