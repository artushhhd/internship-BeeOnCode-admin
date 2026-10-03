import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import EmptyContent from 'app/shared-components/EmptyContent';
import { changeOrderSocials, selectFilteredSocials } from './store/socialsSlice';
import SocialsListItem from './SocialsListItem';

function SocialsList({ canManage }) {
  const filteredData = useSelector(selectFilteredSocials);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    <EmptyContent name="socials" />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full"
    >
      <DragAndDrop data={filteredData} update={changeOrderSocials} disableKey={!canManage}>
        <SocialsListItem canManage={canManage} />
      </DragAndDrop>
    </motion.div>
  );
}

export default SocialsList;
