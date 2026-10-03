import ContextMenu from 'app/shared-components/ContextMenu';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { FILE_API_URL } from '@api/http';
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
import Button from '@mui/material/Button';
import { getPageSections, moveFileFromSection, selectedSections } from '../store/pageSectionsSlice';
import FileItemIcon from '../../../view/fileManager/FileItemIcon';

function FileItemContextMenu({ file }) {
  const { t } = useTranslation('navigation');
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const dispatch = useDispatch();
  const pageSections = useSelector(selectedSections);
  const [disableButton, setDisableButton] = useState(false);

  const menuItems = [
    {
      label: t('SHOW'),
      icon: <RemoveRedEyeIcon fontSize="small" />,
      action: () => {
        window.open(`${FILE_API_URL}/${file.media?.name}`, '_blank');
      },
    },
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
                  section.type === 'file' && (
                    <Accordion
                      key={section.id}
                      sx={{ width: '100%' }}
                      disabled={section.id === file.section_id}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <FuseSvgIcon size={35}>feather:file-plus</FuseSvgIcon>
                        <Typography className="text-[1rem] ">
                          {t('SECTION')} {t('FILE')}, {t('COUNT')}`{' '}
                          {
                            section.file?.filter((f) => f.language_id === translationLanguage)
                              ?.length
                          }
                        </Typography>
                        <Typography className="leading-[3rem] ml-[20px]">
                          {
                            section.translations.find(
                              (val) => val.language_id === translationLanguage
                            )?.title
                          }
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className="flex flex-wrap">
                        {section.file
                          ?.filter((f) => f.language_id === translationLanguage)
                          .map((item, i) => {
                            return (
                              <Box key={i} className="flex flex-col content-center items-between">
                                <Typography>{item.name}</Typography>

                                <div
                                  className={clsx(
                                    'productImageItem flex flex-col justify-center items-center relative w-72 h-72 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                                  )}
                                >
                                  <Box className="absolute top-0 text-center">
                                    <DevMode>media: {item?.id}</DevMode>
                                  </Box>
                                  <FileItemIcon extension={item.media.extension} />
                                </div>
                              </Box>
                            );
                          })}
                        <Box className="flex flex-col content-center items-between ml-auto">
                          <Button
                            color="secondary"
                            variant="contained"
                            disabled={disableButton}
                            onClick={() => {
                              setDisableButton(true);
                              dispatch(
                                moveFileFromSection({
                                  id: file.id,
                                  sectionId: section.id,
                                  type: 'file',
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

export default FileItemContextMenu;
