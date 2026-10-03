import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FILE_API_URL } from '@api/http';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ReactPlayer from 'react-player';
import { useEffect } from 'react';
import { selectUser } from 'app/store/userSlice';
import Box from '@mui/system/Box';
import DevMode from 'app/shared-components/DevMode';
import { useTranslation } from 'react-i18next';
import HorizontalDND from 'app/shared-components/HorizontalDND';
import { changeOrderGallery } from '../../store/pageSectionSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../../administration/store/permissionsSlice';
import PageSectionContextMenu from '../../contextMenus/PageSectionContextMenu';
import GalleryItemContextMenu from '../../contextMenus/GalleryItemContextMenu';

const GallerySection = ({ section }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const dispatch = useDispatch();
  const { t } = useTranslation('navigation');
  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Pages' }));
    // eslint-disable-next-line
  }, [userId]);

  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <FuseSvgIcon size={35}>feather:image</FuseSvgIcon>
        <Typography className="text-[1rem]">
          {t('SECTION')} {t('PHOTO')}, {t('COUNT')}` {section?.gallery?.length}
        </Typography>
        <Typography className="leading-[3rem] ml-[20px]">
          {section?.translations?.find((val) => val.language_id === translationLanguage)?.title}
        </Typography>
        <PageSectionContextMenu section={section} />
      </AccordionSummary>
      <AccordionDetails>
        {/* {canManage ? <DragSwitcher keyName="gallery" data={section.gallery} /> : ''} */}
        <HorizontalDND
          data={section.gallery}
          update={changeOrderGallery}
          direction="horizontal"
          disableKey={!canManage /* || 'gallery' */}
        >
          <GallerySectionListItem />
        </HorizontalDND>
      </AccordionDetails>
    </Accordion>
  );
};

const GallerySectionListItem = (props) => {
  const { item: gal } = props;
  return (
    <Box className="relative">
      <Box className="absolute z-99 text-center">
        <DevMode>media: {gal.id}</DevMode>
      </Box>
      {gal?.video_url ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <ReactPlayer
          className={clsx(
            'productImageItem inline-block relative w-96 h-96 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
          )}
          width={200}
          height={96}
          url={`${gal.video_url}`}
        />
      ) : (
        <img
          className={clsx(
            'productImageItem object-cover inline-block relative w-96 h-96 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
          )}
          key={gal.id}
          alt={gal?.media?.thumbnail_url}
          src={gal.video_url || `${FILE_API_URL}/${gal?.media?.thumbnail_url}`}
        />
      )}
      <GalleryItemContextMenu selectedGallery={gal} />
    </Box>
  );
};

export default GallerySection;
