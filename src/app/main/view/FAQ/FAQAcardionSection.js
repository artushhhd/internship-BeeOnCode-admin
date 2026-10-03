import { useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQAcardionSection = ({ item }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);

  return (
    <Accordion sx={{ width: '90%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {item?.translations?.find((val) => val.language_id === translationLanguage) && (
          <Typography>
            {item.translations.find((val) => val.language_id === translationLanguage).question}
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {item?.translations?.find((val) => val.language_id === translationLanguage) && (
          <div
            dangerouslySetInnerHTML={{
              __html: JSON.parse(
                item?.translations.find((val) => val.language_id === translationLanguage).answer
              )?.htmlValue,
            }}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQAcardionSection;
