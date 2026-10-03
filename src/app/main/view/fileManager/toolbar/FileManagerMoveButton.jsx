import { motion } from 'framer-motion';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Badge from '@mui/material/Badge';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import {
  resetSelectedItems,
  selectIsEnable,
  selectSelectedFolders,
} from '../../../administration/store/folderManagerSlice';
import { getFiles, moveFiles, selectFiles } from '../../../administration/store/fileManagerSlice';

function FileManagerMoveButton() {
  const dispatch = useDispatch();
  const selectedItems = useSelector(selectSelectedFolders);
  const isEnable = useSelector(selectIsEnable);
  const { t } = useTranslation('navigation');
  const urlParams = new URLSearchParams(window.location.search);
  const folderId = urlParams.get('file_manager_folder_id') || null;
  const files = useSelector(selectFiles)?.data || [];

  return (
    isEnable &&
    !!selectedItems.length &&
    selectedItems.some((item) => !files.find((f) => f.id === item)) && (
      <Paper
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        className="flex items-center justify-center my-10 ml-auto space-x-8 px-16 rounded-full shadow-0"
      >
        <Badge badgeContent={selectedItems.length} color="primary">
          <Tooltip arrow title={t('MOVE_HERE')}>
            <Button
              disabled={!selectedItems.length}
              variant="w-24 p-0 min-w-min"
              onClick={() => {
                dispatch(moveFiles({ folderId, ids: selectedItems })).then(() => {
                  dispatch(resetSelectedItems());
                  dispatch(getFiles());
                });
              }}
            >
              <FuseSvgIcon size={48} color="success">
                material-twotone:arrow_circle_down
              </FuseSvgIcon>
            </Button>
          </Tooltip>
        </Badge>
      </Paper>
    )
  );
}

export default FileManagerMoveButton;
