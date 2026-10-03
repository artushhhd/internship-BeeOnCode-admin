import ContextMenu from 'app/shared-components/ContextMenu';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { useTranslation } from 'react-i18next';
import { modalStyle } from 'app/shared-components/modals/DeleteModal';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Box from '@mui/system/Box';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import DevMode from 'app/shared-components/DevMode';
import ReactPlayer from 'react-player';
import { FILE_API_URL } from '@api/http';
import Button from '@mui/material/Button';
import { getPageSections, moveFileFromSection, selectedSections } from '../store/pageSectionsSlice';
import PageSectionContextMenu from './PageSectionContextMenu';

function GalleryItemContextMenu({ selectedGallery }) {
  const { t } = useTranslation('navigation');
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const dispatch = useDispatch();
  const pageSections = useSelector(selectedSections);
  const [disableButton, setDisableButton] = useState(false);

  const menuItems = [
    {
      label: t('MOVE'),
      icon: <ShortcutIcon fontSize="small" />,
      action: () => {
        setOpenMoveModal(true);
      },
    },
  ];
  const { translationLanguage } = useSelector((state) => state.i18n);

  return (
    <>
      <ContextMenu items={menuItems} />
      {openMoveModal && (
        <Modal
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={openMoveModal}
          onClose={() => setOpenMoveModal(false)}
        >
          <Box className="text-center" sx={{ ...modalStyle, width: 600 }}>
            <div className="grid mt-16">
              {pageSections.map((section) => {
                return (
                  section.type === 'gallery' && (
                    <Accordion
                      sx={{ width: '100%' }}
                      disabled={section.id === selectedGallery.section_id}
                      key={section.id}
                    >
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
                          {
                            section?.translations?.find(
                              (val) => val.language_id === translationLanguage
                            )?.title
                          }
                        </Typography>
                        <PageSectionContextMenu section={section} />
                      </AccordionSummary>
                      <AccordionDetails>
                        {/* {canManage ? <DragSwitcher keyName="gallery" data={section.gallery} /> : ''} */}
                        <Box className="flex flex-wrap">
                          {section.gallery.map((gal) => {
                            return (
                              <Box key={gal.id} className="relative">
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
                                    src={
                                      gal.video_url ||
                                      `${FILE_API_URL}/${gal?.media?.thumbnail_url}`
                                    }
                                  />
                                )}
                              </Box>
                            );
                          })}
                          <Button
                            color="secondary"
                            variant="contained"
                            disabled={disableButton}
                            onClick={() => {
                              setDisableButton(true);
                              dispatch(
                                moveFileFromSection({
                                  id: selectedGallery.id,
                                  sectionId: section.id,
                                  type: 'gallery',
                                })
                              ).then(() => {
                                dispatch(getPageSections(section.page_id)).then(() => {
                                  setOpenMoveModal(false);
                                  setDisableButton(false);
                                });
                              });
                            }}
                          >
                            {t('MOVE_HERE')}
                          </Button>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )
                );
              })}
            </div>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default GalleryItemContextMenu;
