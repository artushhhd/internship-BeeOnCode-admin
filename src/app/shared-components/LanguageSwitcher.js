import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeTranslationLanguage,
  changeTranslationLanguageInModal,
  getTranslationLanguages,
} from 'app/store/i18nSlice';
import { FILE_API_URL } from '@api/http';
import { List } from '@mui/material';

const LanguageSwitcher = ({ inModal = false }) => {
  const dispatch = useDispatch();
  const { translationLanguages, translationLanguage, translationLanguageInModal } = useSelector(
    (state) => state.i18n
  );
  useEffect(() => {
    dispatch(getTranslationLanguages());
  }, [dispatch]);

  return (
    <List className="flex justify-between items-center w-[70px] h-[25px] px-[5px] bg-gray-400 rounded">
      {translationLanguages.map(({ id, slug, flag }) => {
        return (
          <li key={id} className="w-[20px] h-[15px] mx-5">
            <button
              type="button"
              onClick={() => {
                if (!inModal) {
                  dispatch(changeTranslationLanguage({ id }));
                } else {
                  dispatch(changeTranslationLanguageInModal({ id }));
                }
              }}
              className="w-full h-full opacity-40"
              style={{
                opacity:
                  ((!inModal && translationLanguage === id) ||
                    (inModal && translationLanguageInModal === id)) &&
                  1,
              }}
            >
              <img src={`${FILE_API_URL}/${flag}`} alt={slug} className="w-full h-full" />
            </button>
          </li>
        );
      })}
    </List>
  );
};

export default LanguageSwitcher;
