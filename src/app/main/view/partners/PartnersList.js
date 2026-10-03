import { motion } from 'framer-motion';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import EmptyContent from 'app/shared-components/EmptyContent';
import Paginate from 'app/shared-components/pagination';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import PartnersListItem from './PartnersListItem';
import { changePartnerOrder } from './store/partnersSlice';

function PartnersList({ partners, canManage, pageTotal, from, to, whole }) {
  const { t } = useTranslation('navigation');
  if (!partners) {
    return null;
  }

  if (partners.length === 0) {
    return <EmptyContent />;
  }
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      {pageTotal > 1 && (
        <Box className="w-full  pb-[15px] flex items-center justify-center ">
          <Box className="flex w-[250px] absolute left-[50px] " component="div">
            {`${t('DISPLAYFROMTO', {
              count: from,
              total: to,
              whole,
            })}`}
          </Box>
          <Paginate pageTotal={pageTotal} />
        </Box>
      )}
      <DragAndDrop data={partners} update={changePartnerOrder} disableKey={!canManage}>
        <PartnersListItem canManage={canManage} />
      </DragAndDrop>
      {pageTotal > 1 && (
        <Box className="w-full  pb-[15px] mt-[50px] flex items-center justify-center ">
          <Box className="flex w-[250px] absolute left-[50px] " component="div">
            {`${t('DISPLAYFROMTO', {
              count: from,
              total: to,
              whole,
            })}`}
          </Box>
          <Paginate pageTotal={pageTotal} />
        </Box>
      )}
    </motion.div>
  );
}

export default PartnersList;
