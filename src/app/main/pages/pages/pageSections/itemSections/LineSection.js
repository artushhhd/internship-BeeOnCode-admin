import { useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';
import PageSectionContextMenu from '../../contextMenus/PageSectionContextMenu';

const LineSection = ({ section }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');
  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <FuseSvgIcon size={35}>heroicons-solid:minus</FuseSvgIcon>
        <Typography className="text-[1rem] ">
          {t('SECTION')} {t('LINE')}
        </Typography>
        <Typography className="leading-[3rem] ml-[20px]">
          {section.translations.find((val) => val.language_id === translationLanguage)?.title}
        </Typography>
        <PageSectionContextMenu section={section} />
      </AccordionSummary>
      <AccordionDetails>
        <div
          style={{
            borderBottom: `${section.line?.height}px ${section.line?.line_type} ${section.line?.color}`,
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default LineSection;
