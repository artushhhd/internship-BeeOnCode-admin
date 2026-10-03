import Tab from '@mui/material/Tab';
import { useDispatch } from 'react-redux';
import ListItem from '@mui/material/ListItem';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import List from '@mui/material/List';
import { Accordion, AccordionDetails, AccordionSummary, Divider } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import DevMode from 'app/shared-components/DevMode';
import { useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import { useParams, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import {
  addAccordionInSection,
  addTabInSection,
  deleteAccordionInSection,
  deleteTabInSection,
  removePageTemplateSection,
} from '../store/pageTemplateSectionSlice';
import { changeOrderSection, getPageTemplateSections } from '../store/pageTemplateSectionsSlice';
import { changeOrderAccordions } from '../../pages/store/pageSectionSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const PageTemplateSectionListItem = (props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const { item: section, canManage } = props;
  const { id } = useParams();
  const dispatch = useDispatch();

  const AccordionSection = useMemo(
    () => (
      <DragAndDrop data={section.accordion} update={changeOrderAccordions} disableKey={!canManage}>
        <AccordionListItem />
      </DragAndDrop>
    ),
    // eslint-disable-next-line
    [section.accordion, canManage]
  );
  return (
    <>
      <Box
        className="px-28 py-16 gap-14 justify-between items-center flex"
        sx={{ bgcolor: 'background.paper' }}
      >
        <DevMode>id: {section.id}</DevMode>

        {!searchParams.get('deleted') ? (
          <ListItem
            className="py-16 pr-0 pl-0 gap-14"
            sx={{ bgcolor: 'background.paper', width: '30px' }}
          >
            <ListItemText
              primary={
                <FuseSvgIcon size={35}>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {section.type === 'gallery'
                    ? 'feather:image'
                    : // eslint-disable-next-line no-nested-ternary
                    section.type === 'text'
                    ? 'heroicons-outline:pencil'
                    : // eslint-disable-next-line no-nested-ternary
                    section.type === 'file'
                    ? 'feather:file-plus'
                    : // eslint-disable-next-line no-nested-ternary
                    section.type === 'link'
                    ? 'feather:link'
                    : // eslint-disable-next-line no-nested-ternary
                    section.type === 'line'
                    ? 'heroicons-solid:minus'
                    : ''}
                </FuseSvgIcon>
              }
            />
          </ListItem>
        ) : (
          ''
        )}
        {section.type === 'tab' && (
          <>
            <FuseSvgIcon size={35}>feather:list</FuseSvgIcon>
            <div className="flex w-full">
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={selectedTab}
                    onChange={handleChange}
                    aria-label="icon label tabs example"
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="secondary"
                    indicatorColor="secondary"
                    sx={{
                      '& button:hover': {
                        transition: 'all 0.1s',
                        boxShadow: '0px 0px 5px inset',
                      },
                    }}
                  >
                    {section.tabs.map((item, index) => {
                      return (
                        <Tab
                          key={index}
                          icon={
                            <>
                              <DevMode>id: {item.id}</DevMode>
                              {index + 1}
                              {canManage ? (
                                <div className="flex gap-x-10">
                                  <FuseSvgIcon onClick={() => setModalOpen(item)}>
                                    heroicons-solid:trash
                                  </FuseSvgIcon>
                                </div>
                              ) : (
                                ''
                              )}
                            </>
                          }
                        />
                      );
                    })}
                    {!searchParams.get('deleted') && canManage ? (
                      <Box
                        className="my-auto"
                        onClick={() =>
                          dispatch(
                            addTabInSection({
                              section_id: section.id,
                            })
                          ).then(() => dispatch(getPageTemplateSections(id)))
                        }
                      >
                        <FuseSvgIcon style={{ cursor: 'pointer' }}>
                          heroicons-outline:plus-circle
                        </FuseSvgIcon>
                      </Box>
                    ) : (
                      ''
                    )}
                  </Tabs>
                </Box>

                {section.tabs[selectedTab] && (
                  <SectionTabItem item={section.tabs[selectedTab]} canManage={canManage} />
                )}
              </Box>
            </div>
          </>
        )}
        {section.type === 'accordion' && (
          <>
            <FuseSvgIcon size={35}>material-twotone:menu_open</FuseSvgIcon>
            <div className="flex w-full">
              <Box sx={{ width: '100%' }}>
                {canManage ? (
                  <Box
                    className="w-full flex justify-center cursor-pointer"
                    onClick={() =>
                      dispatch(
                        addAccordionInSection({
                          section_id: section.id,
                        })
                      ).then(() => dispatch(getPageTemplateSections(id)))
                    }
                  >
                    <FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>
                  </Box>
                ) : (
                  ''
                )}
                {AccordionSection}
              </Box>
            </div>
          </>
        )}
        {!searchParams.get('deleted') && canManage ? (
          <Button className="" onClick={() => setModalOpen(section.id)}>
            <FuseSvgIcon>feather:trash-2</FuseSvgIcon>
          </Button>
        ) : (
          ''
        )}
      </Box>

      <DeleteModal
        open={!!modalOpen}
        name={modalOpen.type?.toUpperCase()}
        onClick={() => {
          dispatch(
            // eslint-disable-next-line no-nested-ternary
            modalOpen.type === 'tab'
              ? deleteTabInSection(modalOpen.id)
              : modalOpen.type === 'accordion'
              ? deleteAccordionInSection(modalOpen.id)
              : removePageTemplateSection(modalOpen)
          ).then(() => {
            dispatch(getPageTemplateSections(id));
            setModalOpen(false);
          });
        }}
        close={() => setModalOpen(false)}
      />

      <Divider />
    </>
  );

  function AccordionListItem({ item: accordion }) {
    return (
      <>
        <Accordion sx={{ width: '100%', marginTop: '2px', bgcolor: 'background.default' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <DevMode>id: {accordion.id}</DevMode>

            {canManage ? (
              <div className="ml-auto flex">
                <FuseSvgIcon onClick={() => setModalOpen(accordion)}>
                  heroicons-solid:trash
                </FuseSvgIcon>
              </div>
            ) : (
              ''
            )}
          </AccordionSummary>
          <AccordionDetails>
            <SectionTabItem item={accordion} canManage={canManage} />
          </AccordionDetails>
        </Accordion>
        <Divider />
      </>
    );
  }
};

const SectionTabItem = ({ item: section, canManage }) => {
  const [searchParams] = useSearchParams();

  const { id, tabId } = useParams();

  return (
    <List className="w-full m-0 pl-24">
      <div className="grid">
        <List className="w-full bg-white grid">
          {!searchParams.get('deleted') && canManage ? (
            <Box
              className="m-auto"
              component={NavLinkAdapter}
              to={`/pageTemplate/${id}/${section.type}/${section.id}/section/new/edit`}
            >
              <FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>
            </Box>
          ) : (
            ''
          )}
        </List>

        <DragAndDrop
          data={section.sections || []}
          update={changeOrderSection}
          disableKey={!canManage}
        >
          <PageTemplateSectionListItem tabId={tabId} />
        </DragAndDrop>
      </div>
    </List>
  );
};

export default PageTemplateSectionListItem;
