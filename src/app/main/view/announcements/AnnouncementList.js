import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import EmptyContent from 'app/shared-components/EmptyContent';
import DragAndDrop from 'app/shared-components/DragAndDrop';
// eslint-disable-next-line import/no-cycle
import {
  selectFilteredAnnouncements,
  selectGroupedFilteredAnnouncements,
} from './store/announcementsSlice';
import AnnouncementListItem from './AnnouncementListItem';
import { changeOrderAnnouncement } from './store/announcementSlice';

function AnnouncementList({ canManage }) {
  const filteredData = useSelector(selectFilteredAnnouncements);

  const { loading } = useSelector((state) => state.AnnouncementApp);
  const announcement = useSelector(selectGroupedFilteredAnnouncements);
  if (!filteredData) {
    return null;
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (filteredData.length === 0) {
    return <EmptyContent name="announcement" />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="w-full"
    >
      <List className="w-full m-0 p-0 relative ">
        <DragAndDrop data={announcement} update={changeOrderAnnouncement} disableKey={!canManage}>
          <AnnouncementListItem canManage={canManage} />
        </DragAndDrop>
      </List>
    </motion.div>
  );
}

export default AnnouncementList;
