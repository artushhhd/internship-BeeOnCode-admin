import { useEffect, useState } from 'react';
import Box from '@mui/system/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import FormButtons from 'app/shared-components/modals/FormButtons';
import createTranslationData from '@helpers/createTranslationData';

import { selectUser } from 'app/store/userSlice';
import { addPageTemplateSection, newPageSection } from '../store/pageTemplateSectionSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

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

const PageTemplateSectionsForm = () => {
  const handleChange = (event, newValue) => {
    setSelectedType(newValue);
  };
  const { id, tabId, accordionId } = useParams();
  const dispatch = useDispatch();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(0);

  const onSubmit = (data) => {
    data.templateId = id;
    data.tabId = tabId;
    data.accordionId = accordionId;
    data.title = createTranslationData(data, 'title');

    if (selectedType === 0 || data.type === 'gallery') {
      data.type = 'gallery';
    }
    if (selectedType === 1 || data.type === 'link') {
      data.type = 'link';
    }
    if (selectedType === 2 || data.type === 'file') {
      data.type = 'file';
    }
    if (selectedType === 3 || data.type === 'text') {
      data.type = 'text';
    }
    if (selectedType === 4 || data.type === 'line') {
      data.type = 'line';
    }
    if (selectedType === 5 || data.type === 'accordion') {
      data.type = 'accordion';
    }
    if (selectedType === 6 || data.type === 'tab') {
      data.type = 'tab';
    }

    dispatch(addPageTemplateSection(data)).then(() => {
      navigate(`/pageTemplate/${id}`);
    });
  };

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'PageTemplates' }));
    if (!canManage) {
      navigate(`/pageTemplate/${id}`);
    }
    dispatch(newPageSection());
  }, [dispatch, navigate, canManage, id, userId]);

  Controller.propTypes = {
    name: PropTypes.string,
    control: PropTypes.any,
    render: PropTypes.func,
  };

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'all',
    // resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  return (
    <>
      <Box
        className="relative w-full h-120 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default',
        }}
      />
      <Box sx={{ width: '100%', flex: '1 1 auto' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedType}
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
            <Tab icon={<FuseSvgIcon>feather:image</FuseSvgIcon>} label="Gallery" />
            <Tab icon={<FuseSvgIcon>feather:link</FuseSvgIcon>} label="Links" />
            <Tab icon={<FuseSvgIcon>feather:file-plus</FuseSvgIcon>} label="Files" />
            <Tab icon={<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>} label="Text" />
            <Tab icon={<FuseSvgIcon>heroicons-solid:minus</FuseSvgIcon>} label="Line" />
            {!tabId && !accordionId && (
              <Tab
                className="prima"
                icon={<FuseSvgIcon>material-twotone:menu_open</FuseSvgIcon>}
                label="Accordion"
              />
            )}
            {!tabId && !accordionId && (
              <Tab icon={<FuseSvgIcon>feather:list</FuseSvgIcon>} label="Tab" />
            )}
          </Tabs>
        </Box>
      </Box>
      <FormButtons edit={false} saveDisable={!isValid} onSubmitFunction={handleSubmit(onSubmit)} />
    </>
  );
};

export default PageTemplateSectionsForm;
