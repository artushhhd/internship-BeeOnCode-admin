import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import EmptyContent from 'app/shared-components/EmptyContent';
import { useTranslation } from 'react-i18next';
import Tree from './Tree';

function MenuList({ collapseAll, search, canManage }) {
  const { t } = useTranslation('navigation');
  const { menu } = useSelector((state) => state.menuApp.menuReducer);

  if (!menu) {
    return null;
  }

  if (menu.length === 0) {
    return <EmptyContent name={t('MENU')} />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      <Tree data={menu} close={collapseAll} search={search} canManage={canManage} />
    </motion.div>
  );
}

export default MenuList;
