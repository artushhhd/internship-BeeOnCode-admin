import { motion } from 'framer-motion';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import { useDispatch, useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import YoutubeSettingsListItem from './YoutubeSettingsListItem';
import {
  changeYoutubeSettingsOrder,
  getYoutubeSettings,
  selectYoutubeSettings,
  selectYoutubeSettingsSyncLoading,
  syncYoutubeSettings,
} from './store/youtubeSettingsSlice';

function YoutubeSettingsList({ canManage }) {
  const youtubeSettings = useSelector(selectYoutubeSettings);
  const loading = useSelector(selectYoutubeSettingsSyncLoading);
  const dispatch = useDispatch();
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      <IconButton
        className={`w-40 h-40 ml-auto ${loading ? 'animate-spin' : ''}`}
        onClick={() => dispatch(syncYoutubeSettings()).then(() => dispatch(getYoutubeSettings()))}
        size="large"
      >
        <FuseSvgIcon className="text-48" size={24} color="action">
          feather:refresh-cw
        </FuseSvgIcon>
      </IconButton>
      <DragAndDrop data={youtubeSettings} update={changeYoutubeSettingsOrder}>
        <YoutubeSettingsListItem />
      </DragAndDrop>
    </motion.div>
  );
}

export default YoutubeSettingsList;
