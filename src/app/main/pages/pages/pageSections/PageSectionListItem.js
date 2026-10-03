import { useDispatch, useSelector } from 'react-redux';
import ListItem from '@mui/material/ListItem';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import List from '@mui/material/List';
import { Accordion, AccordionDetails, AccordionSummary, Divider } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import DevMode from 'app/shared-components/DevMode';
import { useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import TabModal from '../modals/TabModal';
import { changeOrderSection, getPageSections } from '../store/pageSectionsSlice';
import GallerySection from './itemSections/GallerySection';
import TextSection from './itemSections/TextSection';
import FileSection from './itemSections/FileSection';
import {
  changeOrderAccordions,
  deleteAccordionInSection,
  deleteTabInSection,
} from '../store/pageSectionSlice';
import PageSectionContextMenu from '../contextMenus/PageSectionContextMenu';
import { selectLogo } from '../../../view/logo/store/logoSlice';
import MapSection from './itemSections/MapSection';

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

const PageSectionListItem = (props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const logo = useSelector(selectLogo);
  const gkey = logo?.gmap_id || 'AIzaSyAtnP-63Xgrx31Hu0R08sXUlKgEpLQ5VUc';
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const { translationLanguage } = useSelector((state) => state.i18n);

  const { item: section, checked, setChecked, canManage } = props;

  const [selectTab, setSelectTab] = useState(null);
  const { id, sectionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const AccordionSection = useMemo(
    () => (
      <DragAndDrop data={section.accordion} update={changeOrderAccordions} disableKey={!canManage}>
        <AccordionListItem canManage={canManage} />
      </DragAndDrop>
    ),
    // eslint-disable-next-line
    [section.accordion, canManage, translationLanguage]
  );

  return (
    <>
      <ListItem
        id="step7"
        className="pr-28 py-16 gap-14 justify-start"
        sx={{ bgcolor: section.id === +sectionId ? '' : 'background.paper' }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (canManage) {
            navigate(
              // eslint-disable-next-line no-nested-ternary
              section.tab_id
                ? `/pages/${section.page_id}/tab/${section.tab_id}/section/${section.id}/edit`
                : section.accordion_id
                ? `/pages/${section.page_id}/accordion/${section.accordion_id}/section/${section.id}/edit`
                : `/pages/${section.page_id}/section/${section.id}/edit`
            );
          }
        }}
      >
        <DevMode>id: {section.id}</DevMode>
        {section.type === 'text' && <TextSection section={section} />}
        {section.type === 'gallery' && (
          <GallerySection section={section} checked={checked} setChecked={setChecked} />
        )}
        {section.type === 'file' && (
          <FileSection section={section} checked={checked} setChecked={setChecked} />
        )}
        {section.type === 'map' ? <MapSection section={section} gkey={gkey} /> : ''}
        <>
          <span className="relative">
            <FuseSvgIcon size={35}>feather:list</FuseSvgIcon>
            <Typography>
              {section.translations?.find((val) => val.language_id === translationLanguage)?.title}
            </Typography>
            <PageSectionContextMenu section={section} />
          </span>

          {section.type === 'tab' && (
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
                              {canManage ? (
                                <div className="flex gap-x-10">
                                  <FuseSvgIcon onClick={() => setModalOpen(item)}>
                                    heroicons-solid:trash
                                  </FuseSvgIcon>
                                  <FuseSvgIcon onClick={() => setSelectTab(item)}>
                                    heroicons-outline:pencil-alt
                                  </FuseSvgIcon>
                                </div>
                              ) : (
                                ''
                              )}
                            </>
                          }
                          label={
                            item.translations.find((val) => val.language_id === translationLanguage)
                              ?.title
                          }
                        />
                      );
                    })}
                    {!searchParams.get('deleted') && canManage ? (
                      <Box
                        className="my-auto"
                        onClick={() => setSelectTab({ section_id: section.id, type: section.type })}
                      >
                        <FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>
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
          )}
        </>

        {section.type === 'accordion' && (
          <>
            <span className="relative">
              <FuseSvgIcon size={35}>material-twotone:menu_open</FuseSvgIcon>
              <Typography>
                {
                  section.translations?.find((val) => val.language_id === translationLanguage)
                    ?.title
                }
              </Typography>
              <PageSectionContextMenu section={section} />
            </span>
            <div className="flex w-full">
              <Box sx={{ width: '100%' }}>
                {!!canManage && (
                  <Box
                    className="w-full flex justify-center cursor-pointer"
                    onClick={() => setSelectTab({ section_id: section.id, type: section.type })}
                  >
                    <FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>
                  </Box>
                )}
                {/* {canManage ? <DragSwitcher keyName="accordion" data={section.accordion} /> : ''} */}
                {AccordionSection}
              </Box>
            </div>
          </>
        )}
        {!searchParams.get('deleted') && section.id !== +sectionId && !!canManage && (
          <ListItem
            id="step8"
            className="py-16 pr-0 pl-0 gap-14 ml-auto"
            sx={{ bgcolor: 'background.paper', width: '30px' }}
            component={NavLinkAdapter}
            to={
              // eslint-disable-next-line no-nested-ternary
              section.tab_id
                ? `/pages/${section.page_id}/tab/${section.tab_id}/section/${section.id}/edit`
                : section.accordion_id
                ? `/pages/${section.page_id}/accordion/${section.accordion_id}/section/${section.id}/edit`
                : `/pages/${section.page_id}/section/${section.id}/edit`
            }
          >
            <ListItemText
              primary={<FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>}
            />
          </ListItem>
        )}
        {section.id === +sectionId && (
          <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
        )}
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {section.log?.length !== 0 && <HistoryComponent data={section} name="SECTION" />}
        </div>
      </ListItem>

      <DeleteModal
        open={!!modalOpen}
        name={modalOpen.type?.toUpperCase()}
        onClick={() => {
          dispatch(
            modalOpen.type === 'tab'
              ? deleteTabInSection(modalOpen.id)
              : deleteAccordionInSection(modalOpen.id)
          ).then(() => {
            dispatch(getPageSections(id));
            setModalOpen(false);
          });
        }}
        close={() => setModalOpen(false)}
      />

      <Divider />

      <TabModal selectTab={selectTab} setSelectTab={setSelectTab} />
    </>
  );

  // eslint-disable-next-line no-shadow
  function AccordionListItem({ item: accordion, canManage }) {
    return (
      <Accordion sx={{ width: '100%', marginTop: '2px', bgcolor: 'background.default' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <DevMode>id: {section.id}</DevMode>
          <Typography className="leading-[3rem]">
            {accordion.translations?.find((val) => val.language_id === translationLanguage)?.title}
          </Typography>

          {canManage ? (
            <div className="ml-auto flex">
              <FuseSvgIcon onClick={() => setModalOpen(accordion)}>
                heroicons-solid:trash
              </FuseSvgIcon>
              <FuseSvgIcon onClick={() => setSelectTab(accordion)}>
                heroicons-outline:pencil-alt
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
          {!searchParams.get('deleted') && !!canManage && (
            <Box
              className="m-auto"
              component={NavLinkAdapter}
              to={`/pages/${id}/${section.type}/${section.id}/section/new/edit`}
            >
              <FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>
            </Box>
          )}
        </List>

        {/* {!!canManage && ( */}
        {/*  <DragSwitcher keyName={!canManage || 'inAccordion'} data={section.sections || []} /> */}
        {/* )} */}

        <DragAndDrop
          data={section.sections || []}
          update={changeOrderSection}
          disableKey={!canManage /* || 'inAccordion' */}
        >
          <PageSectionListItem tabId={tabId} canManage={canManage} />
        </DragAndDrop>
      </div>
    </List>
  );
};

export default PageSectionListItem;
