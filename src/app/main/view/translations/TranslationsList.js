import { motion } from 'framer-motion';
import EmptyContent from 'app/shared-components/EmptyContent';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { FILE_API_URL } from '@api/http';
import TextField from '@mui/material/TextField';
import DevMode from 'app/shared-components/DevMode';
import { useTranslation } from 'react-i18next';
import FuseLoading from '@fuse/core/FuseLoading';
import { selectTranslations, selectTranslationsLoading } from './store/TranslationsSlice';
import TranslationsTextField from './TranslationsTextField';

function TranslationsList() {
  const { translationLanguages } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');
  const translations = useSelector(selectTranslations);
  const loading = useSelector(selectTranslationsLoading);
  const dispatch = useDispatch();

  if (loading) {
    return <FuseLoading />;
  }

  if (translations.length === 0) {
    return <EmptyContent name={t('TRANSLATIONS')} />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      <Box className="flex">
        <Box className="flex-1" />
        {translationLanguages.map((obj) => {
          return (
            <Box key={obj.id} className="flex-1 flex justify-center">
              <img src={`${FILE_API_URL}/${obj.flag}`} alt={obj.slug} className="w-30 h-20" />
            </Box>
          );
        })}
      </Box>

      {translations.map((obj) => {
        return (
          <Box
            key={obj.id}
            className="flex p-10 my-4 gap-10"
            sx={{ backgroundColor: 'background.paper' }}
          >
            <Box className="flex-1">
              <TextField
                multiline
                fullWidth
                maxRows={4}
                className="w-100"
                value={obj.key}
                disabled
              />
            </Box>
            {translationLanguages.map((lang) => {
              const translationString = obj.translations.find((trs) => trs.language_id === lang.id);
              return (
                <Box key={lang.id} className="flex-1">
                  <DevMode>string id {obj.id}</DevMode>
                  <DevMode>string translation id {translationString?.id}</DevMode>
                  <TranslationsTextField translationString={translationString} />
                </Box>
              );
            })}
          </Box>
        );
      })}
    </motion.div>
  );
}

export default TranslationsList;
