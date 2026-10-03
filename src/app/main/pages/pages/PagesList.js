import { motion } from 'framer-motion';
import PagesListItem from './PagesListItem';

function PagesList({ translationLanguage, canManage, stat, setStat }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col flex-auto w-full max-h-full"
    >
      <div className="relative">
        <PagesListItem
          stat={stat}
          setStat={setStat}
          translationLanguage={translationLanguage}
          canManage={canManage}
        />
      </div>
    </motion.div>
  );
}

export default PagesList;
