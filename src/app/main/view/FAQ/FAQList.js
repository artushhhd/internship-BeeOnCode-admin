import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import EmptyContent from 'app/shared-components/EmptyContent';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import { changeOrderFAQ } from './store/FAQSlice';
// eslint-disable-next-line import/no-cycle
import { selectFilteredFaqs, selectGroupedFilteredFaqs } from './store/FAQsSlice';
import FAQListItem from './FAQListItem';

function FAQList({ canManage }) {
  const filteredData = useSelector(selectFilteredFaqs);

  const { loading } = useSelector((state) => state.FAQApp);
  const faq = useSelector(selectGroupedFilteredFaqs);
  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return <EmptyContent name="faq" />;
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="w-full"
    >
      <List className="w-full m-0 p-0 relative ">
        <DragAndDrop data={faq} update={changeOrderFAQ} disableKey={!canManage}>
          <FAQListItem canManage={canManage} />
        </DragAndDrop>
      </List>
      <div className="w-full flex flex-col min-h-200" />
    </motion.div>
  );
}

export default FAQList;
