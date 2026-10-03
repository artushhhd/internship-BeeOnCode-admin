import ContextMenu from 'app/shared-components/ContextMenu';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { useTranslation } from 'react-i18next';
import { modalStyle } from 'app/shared-components/modals/DeleteModal';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Box from '@mui/system/Box';
import { useDispatch, useSelector } from 'react-redux';
import DevMode from 'app/shared-components/DevMode';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { getPageSections, moveSectionFromPage, selectedSections } from '../store/pageSectionsSlice';
import { selectPages } from '../store/pagesSlice';

function PageSectionContextMenu({ section }) {
  const { t } = useTranslation('navigation');
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const dispatch = useDispatch();
  const pageSections = useSelector(selectedSections);
  const pages = useSelector(selectPages);
  const [disableButton, setDisableButton] = useState(false);

  const menuItems = [
    {
      label: t('MOVE'),
      icon: <ShortcutIcon fontSize="small" />,
      action: () => setOpenMoveModal(true),
    },
  ];
  const { translationLanguage } = useSelector((state) => state.i18n);

  const moveSection = ({ id, tabId, accordionId, pageId }) => {
    setDisableButton(true);
    dispatch(moveSectionFromPage({ id, tabId, accordionId, pageId })).then(() => {
      dispatch(getPageSections(section.page_id)).then(() => {
        setOpenMoveModal(false);
        setDisableButton(false);
      });
    });
  };

  return (
    <>
      <ContextMenu items={menuItems} />
      {openMoveModal && (
        <Modal
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={openMoveModal}
          onClose={() => setOpenMoveModal(false)}
          onClick={(e) => e.stopPropagation()}
        >
          <Box
            className="text-center"
            sx={{ ...modalStyle, width: 600 }}
            onClick={(e) => e.stopPropagation()}
          >
            {pageSections.some((obj) => obj.type === 'tab') &&
              section.type !== 'accordion' &&
              section.type !== 'tab' && (
                <>
                  <Typography fontWeight="bold" align="center">
                    Tabs
                  </Typography>
                  <div className="flex overflow-x-auto">
                    {pageSections.map((obj) => {
                      return (
                        obj.type === 'tab' && (
                          <Box key={obj.id} className="grid justify-items-center border min-h-112">
                            <span className="flex">
                              <FuseSvgIcon size={35}>feather:list</FuseSvgIcon>
                              <Typography>
                                {
                                  obj.translations.find(
                                    (val) => val.language_id === translationLanguage
                                  )?.title
                                }
                              </Typography>
                            </span>

                            <span className="flex">
                              {obj.tabs.map((item, index) => {
                                return (
                                  <Tooltip title={t('MOVE_HERE')} arrow key={index}>
                                    <Button
                                      disabled={disableButton}
                                      onClick={() =>
                                        moveSection({
                                          id: section.id,
                                          tabId: item.id,
                                        })
                                      }
                                      icon={<DevMode>id: {item.id}</DevMode>}
                                    >
                                      {
                                        item.translations.find(
                                          (val) => val.language_id === translationLanguage
                                        )?.title
                                      }
                                    </Button>
                                  </Tooltip>
                                );
                              })}
                            </span>
                          </Box>
                        )
                      );
                    })}
                  </div>
                </>
              )}
            {pageSections.some((obj) => obj.type === 'tab') &&
              section.type !== 'accordion' &&
              section.type !== 'tab' && (
                <>
                  <Typography fontWeight="bold" align="center" className="mt-16">
                    Accordions
                  </Typography>
                  <div className="flex overflow-x-auto">
                    {pageSections.map((obj) => {
                      return (
                        obj.type === 'accordion' && (
                          <Box key={obj.id} className="grid justify-items-center border min-h-112">
                            <span className="flex">
                              <FuseSvgIcon size={35}>feather:list</FuseSvgIcon>
                              <Typography>
                                {
                                  obj.translations.find(
                                    (val) => val.language_id === translationLanguage
                                  )?.title
                                }
                              </Typography>
                            </span>

                            <span className="flex">
                              {obj.accordion.map((item, index) => {
                                return (
                                  <Tooltip title={t('MOVE_HERE')} key={index} arrow>
                                    <Button
                                      icon={<DevMode>id: {item.id}</DevMode>}
                                      disabled={disableButton}
                                      onClick={() =>
                                        moveSection({
                                          id: section.id,
                                          accordionId: item.id,
                                        })
                                      }
                                    >
                                      {
                                        item.translations.find(
                                          (val) => val.language_id === translationLanguage
                                        )?.title
                                      }
                                    </Button>
                                  </Tooltip>
                                );
                              })}
                            </span>
                          </Box>
                        )
                      );
                    })}
                  </div>
                </>
              )}
            <Typography fontWeight="bold" className="mt-16" align="center">
              Pages
            </Typography>
            <div className="grid h-[400px] overflow-y-auto">
              {pages.map((obj) => {
                return (
                  obj.type === 'dynamic' && (
                    <Box
                      className="flex"
                      key={obj.id}
                      sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                      <Tooltip title={t('MOVE_HERE')} placement="right" arrow>
                        <Button
                          className="flex"
                          disabled={disableButton}
                          onClick={() =>
                            moveSection({
                              id: section.id,
                              pageId: obj.id,
                            })
                          }
                        >
                          <Typography>
                            {
                              obj.translations.find(
                                (val) => val.language_id === translationLanguage
                              )?.title
                            }
                          </Typography>
                        </Button>
                      </Tooltip>
                    </Box>
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

export default PageSectionContextMenu;
