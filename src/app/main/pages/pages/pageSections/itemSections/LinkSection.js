import { useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { FILE_API_URL } from '@api/http';
import clsx from 'clsx';
import DevMode from 'app/shared-components/DevMode';
import { useTranslation } from 'react-i18next';
import HorizontalDND from 'app/shared-components/HorizontalDND';
import { selectPermission } from '../../../../administration/store/permissionsSlice';
import { changeOrderLink } from '../../store/pageSectionSlice';
import PageSectionContextMenu from '../../contextMenus/PageSectionContextMenu';

const LinkSection = ({ section }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');
  const { canManage } = useSelector(selectPermission);

  const openPDFInNewWindow = (link) => {
    window.open(link, '_blank');
  };

  return (
    <Accordion sx={{ width: '90%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <FuseSvgIcon size={35}>feather:link</FuseSvgIcon>
        <Typography className="text-[1rem]">
          {t('SECTION')} {t('LINK')}, {t('COUNT')}`{' '}
          {section.link.filter((f) => f.language_id === translationLanguage)?.length}
        </Typography>
        <Typography className="leading-[3rem] ml-[20px]">
          {section?.translations?.find((val) => val.language_id === translationLanguage)?.title}
        </Typography>
        <PageSectionContextMenu section={section} />
      </AccordionSummary>
      <AccordionDetails>
        <HorizontalDND
          data={section.link?.filter((f) => f.language_id === translationLanguage)}
          update={changeOrderLink}
          direction="vertical"
          disableKey={!canManage}
        >
          <LinkSectionListItem />
        </HorizontalDND>
      </AccordionDetails>
    </Accordion>
  );
};
const LinkSectionListItem = (props) => {
  const { item: l } = props;
  const { translationLanguage } = useSelector((state) => state.i18n);

  const openPDFInNewWindow = () => {
    window.open(`${FILE_API_URL}/${l.media?.name}`, '_blank');
  };
  return (
    <Box className="flex flex-col content-center items-between" key={l?.id}>
      <Typography>{l.name}</Typography>
      <div
        className={clsx(
          'productImageItem flex flex-col justify-center items-center relative w-72 h-72 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
        )}
        key={l?.id}
      >
        <Box className="absolute top-0 text-center">
          <DevMode>media: {l?.id}</DevMode>
        </Box>
        {l?.cover_media?.thumbnail_url.includes('webp' || 'jpg' || 'svg' || 'png') ? (
          <Button onClick={openPDFInNewWindow}>
            <img
              src={`${FILE_API_URL}/${l?.cover_media?.thumbnail_url}`}
              alt={l.cover_media.alt}
              width="50px"
            />
          </Button>
        ) : (
          <Button onClick={() => openPDFInNewWindow(l.link)}>
            <FuseSvgIcon color="secondary" sx={{ fontSize: '30px' }}>
              heroicons-outline:link
            </FuseSvgIcon>
          </Button>
        )}
      </div>
    </Box>
  );
};

export default LinkSection;
