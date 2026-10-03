import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import EmptyContent from 'app/shared-components/EmptyContent';
import FuseLoading from '@fuse/core/FuseLoading';
import CategoriesListItem from './CategoriesListItem';
import { changeCategoryOrder, selectCategoriesLoading } from '../store/categoriesSlice';

function CategoriesList({ canManage, filteredData }) {
  const loading = useSelector(selectCategoriesLoading);

  if (loading) {
    return <FuseLoading />;
  }

  if (filteredData.length === 0) {
    return <EmptyContent name="CATEGORIES" />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      <DragAndDrop data={filteredData} update={changeCategoryOrder} disableKey={!canManage}>
        <CategoriesListItem canManage={canManage} />
      </DragAndDrop>
    </motion.div>
  );
}

export default CategoriesList;
