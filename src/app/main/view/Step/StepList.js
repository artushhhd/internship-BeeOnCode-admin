import { motion } from 'framer-motion';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import EmptyContent from 'app/shared-components/EmptyContent';
import StepListItem from './StepListItem';
import { changeStepOrder } from './store/StepSlice';

function StepList({ step, canManage }) {
  if (!step) {
    return null;
  }

  if (step.length === 0) {
    return <EmptyContent />;
  }
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      <DragAndDrop data={step} update={changeStepOrder} disableKey={!canManage}>
        <StepListItem canManage={canManage} />
      </DragAndDrop>
    </motion.div>
  );
}

export default StepList;
