import { motion } from 'framer-motion';
import PageTemplatesListItem from './PageTemplatesListItem';

function PageTemplatesList({ translationLanguage, canManage }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col flex-auto w-full max-h-full"
    >
      <div className="relative">
        <PageTemplatesListItem translationLanguage={translationLanguage} canManage={canManage} />
      </div>
    </motion.div>
  );
}

export default PageTemplatesList;
