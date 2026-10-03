import { motion } from 'framer-motion';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import EmptyContent from 'app/shared-components/EmptyContent';
import StatisticsListItem from './StatisticsListItem';
import { changeStatisticOrder } from './store/StatisticsSlice';

function StatisticsList({ statistics, canManage }) {
  if (!statistics) {
    return null;
  }

  if (statistics.length === 0) {
    return <EmptyContent />;
  }
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      <DragAndDrop data={statistics} update={changeStatisticOrder} disableKey={!canManage}>
        <StatisticsListItem canManage={canManage} />
      </DragAndDrop>
    </motion.div>
  );
}

export default StatisticsList;
