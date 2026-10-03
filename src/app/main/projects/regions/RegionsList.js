import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import EmptyContent from 'app/shared-components/EmptyContent';
import FuseLoading from '@fuse/core/FuseLoading';
import RegionsListItem from './RegionsListItem';
import { changeRegionOrder, selectRegionsLoading } from '../store/regionsSlice';

function RegionsList({ canManage, filteredData }) {
  const loading = useSelector(selectRegionsLoading);

  if (loading) {
    return <FuseLoading />;
  }

  if (filteredData.length === 0) {
    return <EmptyContent name="REGIONS" />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      <DragAndDrop data={filteredData} update={changeRegionOrder} disableKey={!canManage}>
        <RegionsListItem canManage={canManage} />
      </DragAndDrop>
    </motion.div>
  );
}

export default RegionsList;
