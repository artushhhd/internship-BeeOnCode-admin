import { useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';
import PageSectionContextMenu from '../../contextMenus/PageSectionContextMenu';

const TextSection = ({ section }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');

  const text = section.text?.translations.find(
    (val) => val.language_id === translationLanguage
  )?.text;

  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <FuseSvgIcon size={35}>heroicons-outline:pencil</FuseSvgIcon>
        <Typography className="text-[1rem]">
          {t('SECTION')} {t('TEXT')}
        </Typography>
        <Typography className="leading-[3rem] ml-[20px]">
          {section.translations.find((val) => val.language_id === translationLanguage)?.title}
        </Typography>
        <PageSectionContextMenu section={section} />
      </AccordionSummary>
      <AccordionDetails>
        {text ? <div dangerouslySetInnerHTML={{ __html: JSON.parse(text).htmlValue }} /> : ''}
      </AccordionDetails>
    </Accordion>
  );
};

export default TextSection;
