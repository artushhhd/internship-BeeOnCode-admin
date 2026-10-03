import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import EmptyContent from 'app/shared-components/EmptyContent';
import { useEffect } from 'react';
import {
  changeOrderLanguages,
  getLanguages,
  selectFilteredLanguages,
} from './store/languagesSlice';
import LanguageListItem from './LanguageListItem';

function LanguagesList({ canManage }) {
  const dispatch = useDispatch();
  const filteredData = useSelector(selectFilteredLanguages);

  useEffect(() => {
    dispatch(getLanguages());
    // eslint-disable-next-line
  }, []);
  const stateLoading = useSelector((state) => state.languagesApp.languages.loading);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0 && !stateLoading) {
    return <EmptyContent name="languages" />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full"
    >
      {filteredData.length && (
        <DragAndDrop data={filteredData} update={changeOrderLanguages} disableKey={!canManage}>
          <LanguageListItem filteredData={filteredData} canManage={canManage} />
        </DragAndDrop>
      )}
    </motion.div>
  );
}

export default LanguagesList;
