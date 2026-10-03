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
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { selectUser } from 'app/store/userSlice';
import AccordionForm from '../pages/sectionForms/AccordionForm';
import GalleryForm from '../pages/sectionForms/GalleryForm';
import TabForm from '../pages/sectionForms/TabForm';
import {
  addPageSection,
  getPageSection,
  newPageSection,
  removePageSection,
  selectPageSection,
  updatePageSection,
} from '../store/pageSectionSlice';
import LinkForm from '../pages/sectionForms/LinkForm';
import FileForm from '../pages/sectionForms/FileForm';
import LineForm from '../pages/sectionForms/LineForm';
import TextForm from '../pages/sectionForms/TextForm';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';
import MapForm from '../pages/sectionForms/MapForm';

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

const PageSectionsForm = () => {
  const handleChange = (event, newValue) => {
    setSelectedType(newValue);
  };
  const { id, sectionId, tabId, accordionId } = useParams();
  const bl = useParams();
  const [editorData, setEditorData] = useState({});
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const section = useSelector(selectPageSection);
  const edit = sectionId !== 'new';
  const [inputValue, setInputValue] = useState('');
  const [selectedType, setSelectedType] = useState(edit ? -1 : 0);
  const galleryObj = useSelector((state) => state.PagesApp?.section?.galleryObj);
  const [galleryImggg, setGalleryImgg] = useState([]);
  const [galleryImgValidation, setGalleryImgValidation] = useState(false);

  useEffect(() => {}, [selectedType]);
  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Pages' }));
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    if (galleryObj) {
      const miBan = Object.values(galleryObj);
      setGalleryImgg(miBan.map((subarr) => subarr.map((obj) => obj.id)));
    }
  }, [galleryObj]);
  const onSubmit = (data) => {
    data.pageId = id;
    data.tabId = tabId;
    data.accordionId = accordionId;
    data.title = createTranslationData(data, 'title');
    data.galleryArr = galleryImggg;

    if (selectedType === 0 || data.type === 'gallery') {
      data.link = [];
      data.links?.forEach((link, i) => {
        if (!link.deleted) {
          data.link.push({
            titles: data[`galleryTitle${link.id}_${link.language_id}`],
            id: link.id,
            lang_id: link.language_id,
            category_id: data[`category_id${link.id}`],
          });
        }
      });
      if (sectionId === 'new') {
        data.type = 'gallery';
      } else if (data.type === 'gallery') {
        dispatch(updatePageSection(data)).then(() => {
          navigate(`/pages/${id}`);
        });
      }
    }
    if (selectedType === 1 || data.type === 'link') {
      data.link = [];
      data.links.forEach((link, i) => {
        if (!link.deleted) {
          if (data[`page_id${link.id}`]?.id) {
            data.link.push({
              name: data[`linkTitle${link.id}_${link.language_id}`],
              url: '',
              cover: data[`cover${link.id}`],
              id: link.id,
              lang_id: link.language_id,
              page_id: data[`page_id${link.id}`]?.id,
            });
          } else {
            data.link.push({
              name: data[`linkTitle${link.id}_${link.language_id}`],
              url: data[`linkUrl${link.id}`],
              cover: data[`cover${link.id}`],
              id: link.id,
              lang_id: link.language_id,
              page_id: '',
            });
          }
        }
      });
      if (sectionId === 'new') {
        data.type = 'link';
      } else if (data.type === 'link') {
        dispatch(updatePageSection(data)).then(() => {
          navigate(`/pages/${id}`);
        });
      }
    }
    if (selectedType === 2 || data.type === 'file') {
      data.files = [];
      data.selected.forEach((f, i) => {
        data.files.push({
          name: data[`file_${f.id}_name_${f.language_id}`] || f.name,
          cover: data[`cover_${f.id}_id_${f.language_id}`],
          id: f.id,
          language_id: f.language_id,
        });
      });
      if (sectionId === 'new') {
        data.type = 'file';
      } else if (data.type === 'file') {
        dispatch(updatePageSection(data)).then(() => {
          navigate(`/pages/${id}`);
        });
      }
    }
    if (selectedType === 3 || data.type === 'text') {
      data.content = editorData;
      if (sectionId === 'new') {
        data.type = 'text';
      } else {
        dispatch(updatePageSection(data)).then(() => {
          navigate(`/pages/${id}`);
        });
      }
    }
    if (selectedType === 4 || data.type === 'line') {
      if (sectionId === 'new') {
        data.type = 'line';
      } else {
        dispatch(updatePageSection(data)).then(() => {
          navigate(`/pages/${id}`);
        });
      }
    }
    if (selectedType === 5 || data.type === 'accordion') {
      if (sectionId === 'new') {
        data.type = 'accordion';
      } else {
        dispatch(updatePageSection(data)).then(() => {
          navigate(`/pages/${id}`);
        });
      }
    }
    if (selectedType === 6 || data.type === 'tab') {
      if (sectionId === 'new') {
        data.type = 'tab';
      } else {
        dispatch(updatePageSection(data)).then(() => {
          navigate(`/pages/${id}`);
        });
      }
    }
    if (selectedType === 7 || data.type === 'map') {
      if (sectionId === 'new') {
        data.type = 'map';
      } else {
        dispatch(updatePageSection(data)).then(() => {
          navigate(`/pages/${id}`);
        });
      }
    }
    if (sectionId === 'new') {
      dispatch(addPageSection(data)).then(() => {
        navigate(`/pages/${id}`);
      });
    }
  };

  useEffect(
    () => {
      if (!canManage) {
        navigate(`/pages/${id}`);
      }

      if (sectionId === 'new') {
        dispatch(newPageSection());
        setEditorData({});
      } else {
        dispatch(getPageSection({ id, sectionId, tabId, accordionId }));
        setEditorData({});
      }
    }, // eslint-disable-next-line
    [sectionId]);

  Controller.propTypes = {
    name: PropTypes.string,
    control: PropTypes.any,
    render: PropTypes.func,
  };
  const gallerySchemaShape = {
    galleryArr: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required('Image ID is required'),
          title: yup.string().required('Title is required'),
        })
      )
      .min(1, 'At least one image is required'),
  };

  const textSchemaShape = {
    content1: yup
      .string()
      .test(
        'required',
        'You must enter an armenian text',
        (v) => v && JSON.stringify(v) !== JSON.stringify('<p></p>\n')
      ),
  };

  const lineSchemaShape = {
    height: yup.number().positive().integer().required(),
  };

  const fileSchemaShape = {
    selected: yup.array().min(1, 'please upload a file'),
  };
  const mapSchemaShape = {
    latitude: yup
      .number()
      .typeError('Latitude must be a number')
      .min(-90, 'Latitude must be greater than or equal to -90')
      .max(90, 'Latitude must be less than or equal to 90')
      .required('Latitude is required'),
    longitude: yup
      .number()
      .typeError('Longitude must be a number')
      .min(-180, 'Longitude must be greater than or equal to -180')
      .max(180, 'Longitude must be less than or equal to 180')
      .required('Longitude is required'),
  };
  const schema = yup
    .object()
    .shape(
      // eslint-disable-next-line no-nested-ternary
      selectedType === 2 || section?.type === 'file'
        ? fileSchemaShape
        : // eslint-disable-next-line no-nested-ternary
        selectedType === 3 || section?.type === 'text'
        ? textSchemaShape
        : // eslint-disable-next-line no-nested-ternary
        selectedType === 4 || section?.type === 'line'
        ? lineSchemaShape
        : // eslint-disable-next-line no-nested-ternary
        selectedType === 7 || section?.type === 'map'
        ? mapSchemaShape
        : {}
    )
    .test((obj) => {
      console.log(obj, 44412);
      let answer = true;
      if (selectedType === 1 || section?.type === 'link') {
        obj.links?.forEach((l, i) => {
          const pageOrLink = !!obj[`linkUrl${l.id}`] || !!obj[`page_id${l.id}`];
          const title = !!obj[`linkTitle${l.id}_${l.language_id}`] || false;
          answer = pageOrLink && title;
        });
        if (obj.links?.every((l) => l.deleted)) {
          answer = false;
        }
        if (obj.links.length === 0) {
          answer = false;
        }
      }

      if (selectedType === 0 || section?.type === 'gallery') {
        if (obj.title1 === undefined || obj.title1 === '') {
          answer = false;
        }
        galleryImggg.forEach((i) => {
          if (i.length < 1) {
            answer = false;
          }
        });
      }
      return answer;
    });
  const { control, watch, trigger, reset, handleSubmit, setValue, formState, getValues } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  return (
    <>
      {!edit ? (
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
              <Tab icon={<FuseSvgIcon>feather:map-pin</FuseSvgIcon>} label="Map" />
            </Tabs>
          </Box>
          <TabPanel value={selectedType} index={0}>
            <GalleryForm
              watch={watch}
              reset={reset}
              section={section}
              errors={errors}
              control={control}
              edit={edit}
            />
          </TabPanel>
          <TabPanel value={selectedType} index={1}>
            <LinkForm
              trigger={trigger}
              watch={watch}
              reset={reset}
              section={section}
              errors={errors}
              control={control}
              edit={edit}
              getValue={getValues}
              setValue={setValue}
            />
          </TabPanel>
          <TabPanel value={selectedType} index={2}>
            <FileForm
              trigger={trigger}
              watch={watch}
              reset={reset}
              section={section}
              errors={errors}
              control={control}
              edit={edit}
              getValue={getValues}
              setValue={setValue}
            />
          </TabPanel>
          <TabPanel value={selectedType} index={3}>
            <TextForm
              reset={reset}
              handleSubmit={handleSubmit}
              section={section}
              control={control}
              setEditorData={setEditorData}
              edit={edit}
              errors={errors}
            />
          </TabPanel>

          <TabPanel value={selectedType} index={4}>
            <LineForm
              control={control}
              section={section}
              edit={edit}
              reset={reset}
              handleSubmit={handleSubmit}
              errors={errors}
            />
          </TabPanel>
          <TabPanel value={selectedType} index={5}>
            <AccordionForm
              control={control}
              section={section}
              edit={edit}
              reset={reset}
              handleSubmit={handleSubmit}
              errors={errors}
            />
          </TabPanel>
          <TabPanel value={selectedType} index={6}>
            <TabForm
              control={control}
              section={section}
              edit={edit}
              reset={reset}
              handleSubmit={handleSubmit}
              errors={errors}
            />
          </TabPanel>
          <TabPanel value={selectedType} index={7}>
            <MapForm
              watch={watch}
              control={control}
              section={section}
              setValue={setValue}
              edit={edit}
              reset={reset}
              handleSubmit={handleSubmit}
              errors={errors}
            />
          </TabPanel>
        </Box>
      ) : (
        ''
      )}
      <Box sx={{ width: '100%', flex: '1 1 auto' }}>
        {edit && section?.type === 'text' && (
          <TextForm
            reset={reset}
            handleSubmit={handleSubmit}
            section={section}
            control={control}
            setEditorData={setEditorData}
            edit={edit}
            errors={errors}
          />
        )}
        {edit && section?.type === 'tab' && (
          <TabForm
            control={control}
            section={section}
            edit={edit}
            reset={reset}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        )}
        {edit && section?.type === 'gallery' && (
          <GalleryForm
            watch={watch}
            reset={reset}
            section={section}
            errors={errors}
            control={control}
            edit={edit}
          />
        )}
        {edit && section?.type === 'link' && (
          <LinkForm
            trigger={trigger}
            watch={watch}
            reset={reset}
            section={section}
            errors={errors}
            control={control}
            getValue={getValues}
            setValue={setValue}
            edit={edit}
          />
        )}
        {edit && section?.type === 'file' && (
          <FileForm
            trigger={trigger}
            watch={watch}
            reset={reset}
            section={section}
            errors={errors}
            control={control}
            edit={edit}
            getValue={getValues}
            setValue={setValue}
          />
        )}
        {edit && section?.type === 'line' && (
          <LineForm
            control={control}
            section={section}
            edit={edit}
            reset={reset}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        )}
        {edit && section?.type === 'accordion' && (
          <AccordionForm
            control={control}
            section={section}
            edit={edit}
            reset={reset}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        )}
        {edit && section?.type === 'map' && (
          <MapForm
            control={control}
            section={section}
            edit={edit}
            setValue={setValue}
            watch={watch}
            reset={reset}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        )}
      </Box>
      <FormButtons
        edit={edit}
        saveDisable={!isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={() =>
          dispatch(removePageSection({ id: sectionId })).then(() => {
            navigate(`/pages/${id}`);
          })
        }
      />
    </>
  );
};

export default PageSectionsForm;
