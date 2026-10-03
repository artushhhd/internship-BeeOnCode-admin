import { useSelector } from 'react-redux';
import { AccordionDetails } from '@mui/material';

const AnnouncementAcardionSection = ({ item }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);

  return (
    <AccordionDetails>
      {item?.translations?.find((val) => val.language_id === translationLanguage) && (
        <div
          dangerouslySetInnerHTML={{
            __html: JSON.parse(
              item?.translations.find((val) => val.language_id === translationLanguage).text
            ).htmlValue,
          }}
        />
      )}
    </AccordionDetails>
  );
};

export default AnnouncementAcardionSection;
