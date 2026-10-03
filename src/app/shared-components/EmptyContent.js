import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const EmptyContent = ({ name = 'item' }) => {
  const { t } = useTranslation('navigation');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.1 } }}
      className="flex flex-1 items-center justify-center h-full w-full"
    >
      <Typography color="text.secondary" variant="h5">
        {`${t('EMPTYCONTENT', { name: t(name.toUpperCase()).toLowerCase() })}!`}
      </Typography>
    </motion.div>
  );
};

export default EmptyContent;
