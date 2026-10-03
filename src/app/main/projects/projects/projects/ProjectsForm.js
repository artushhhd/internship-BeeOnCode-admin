import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { selectUser } from 'app/store/userSlice';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Modal from '@mui/material/Modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import FileManagerModal from 'app/shared-components/modals/FileManagerModal';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import createTranslationData from '@helpers/createTranslationData';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import NewImageController from 'app/shared-components/fields/NewImageController';
import clsx from 'clsx';
import ReactPlayer from 'react-player';
import { FILE_API_URL } from '@api/http';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import { selectLanguages } from 'app/store/i18nSlice';
import createArrayTranslationData from '@helpers/createArrayTranslationData';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';
import { getProjects } from '../../store/projectsSlice';
import {
  addProject,
  getProjectById,
  newProject,
  deleteProject,
  editProject,
  selectLoading,
  selectProject,
  resetProject,
  selectCrossArea,
  getCrossArea,
} from '../../store/projectSlice';

import { Root } from '../../../pages/pages/pages/sectionForms/GalleryForm';
import { selectAreas } from '../../store/areasSlice';
import { getStatuses, selectStatuses } from '../../store/statusesSlice';
import { getRegions, selectRegions } from '../../store/regionsSlice';

// SCHEMA VALIDATION....................................................................

const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a name'),
  short_description1: yup
    .string()
    .trim()
    .test((v) => {
      const regex = /(<([^>]+)>)/gi;
      const plainText = v && v.replaceAll(regex, '').replaceAll('&nbsp;', '').trim();
      return !!plainText;
    }),
  long_description1: yup.string().trim().required('You must enter a description'),
  // grantee1: yup.string().trim().required('You must enter a grantee'),
  // region_group_id: yup
  //   .array()
  //   .required()
  //   .test('array-0-required', 'The first element is required', (value) => {
  //     return value && value.length > 0 && !!value[0];
  //   }),
});

// Components....................................................................
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      className="w-full"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const ProjectsForm = () => {
  const { t } = useTranslation('navigation');
  const [searchParams, setSearchParams] = useSearchParams();
  const project = useSelector(selectProject);
  const crossArea = useSelector(selectCrossArea);
  const loading = useSelector(selectLoading);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState();
  const [secondaryDefaultSelected, setSecondaryDefaultSelected] = useState([project?.imagess]);
  const [secondaryImgSelected, setSecondaryImgSelected] = useState([]);
  const [sliderPhoto, setSliderPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [editorDataLong, setEditorDataLong] = useState({});
  const [editorDataShort, setEditorDataShort] = useState({});
  const edit = id !== 'new';
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const [tabStep, setTabStep] = useState(0);
  const areas = useSelector(selectAreas);
  const status = useSelector(selectStatuses);
  const regions = useSelector(selectRegions);
  const [ogDescription, setOgDescription] = useState();
  const [chips, setChips] = useState([]);
  const languages = useSelector(selectLanguages);

  const { control, watch, trigger, setValue, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const isTerminated = watch('status_id');
  const keyword = watch('keyword');

  // USE EFFECTS....................................................................

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Projects' }));
    if (!canManage) {
      navigate(`/projects/item`);
    }
  }, [canManage, dispatch, navigate, userId]);

  useEffect(() => {
    dispatch(getCrossArea());
    // dispatch(getAreas('focal_area'));
    if (!status.length) {
      dispatch(getStatuses());
    }
    if (!regions.length) {
      dispatch(getRegions());
    }
  }, [dispatch, status, regions]);

  const copyProject = useMemo(() => {
    return { ...project };
  }, [project]);

  useEffect(() => {
    dispatch(resetProject());
    if (!edit) {
      dispatch(newProject());
    } else {
      dispatch(getProjectById(id));
    }

    setEditorDataShort({});
    setEditorDataLong({});
  }, [dispatch, id, navigate, canManage, userId, edit]);

  useEffect(() => {
    if (project) {
      // copyProject.start_date = new Date(project.start_date).toISOString();
      // copyProject.end_date = new Date(project.end_date).toISOString();
      // copyProject.number = project.number;

      if (edit) {
        const arr = [];
        const lastArr = [];
        // copyProject.is_number_visible = !!project.is_number_visible;
        copyProject.file_id = project?.images?.[0]?.file_id;
        // setDefaultSelected([]);
        if (project?.images) {
          setSecondaryImgSelected(project?.images);
        }
        if (project?.media) {
          setDefaultSelected(project?.media);
        }
        // copyProject.region_group_id = project?.regions;
        // setSelectedRegions(project?.regions);

        project.translations.forEach((item, i) => {
          arr.push({ language_id: item.language_id, keyword: JSON.parse(item.keyword) });
          // copyProject[`ogdescription${item.language_id}`] = item.meta;
          copyProject[`title${item.language_id}`] = item?.title;
          // if (item?.cross_cutting_areas) {
          //   copyProject[`cross_cutting_areas${item.language_id}`] = item?.cross_cutting_areas;
          // }
          copyProject[`grantee${item.language_id}`] = item?.grantee;
          if (item?.short_description) {
            copyProject[`short_description${item.language_id}`] = item?.short_description;
          }
        });
        arr?.forEach((element) => {
          if (element?.keyword?.length > 0) {
            element?.keyword?.forEach((itemEl) => {
              lastArr.push({
                id: Math.random(),
                name: itemEl,
                language_id: element.language_id,
              });
            });
          }
        });
        copyProject.keyword = lastArr;
        // setChips(lastArr);
        // project.category?.translations?.forEach((item, i) => {
        //   copyProject[`focal_area${item.language_id}`] = item?.title;
        // });

        // project.area?.translations?.forEach((item, i) => {
        //   copyProject[`area${item.language_id}`] = item?.title;
        // });

        project?.translations?.forEach((trs) => {
          copyProject[`long_description${trs.language_id}`] = trs?.long_description
            ? JSON.parse(trs.long_description).htmlValue
            : '';
        });

        // setSelected(defaultMedia);
        // setDefaultSelected(defaultMedia);
      }
      // else {
      //   setSelectedRegions([]);
      // }
      reset({ ...copyProject });
    }
  }, [edit, project, reset, copyProject, translationLanguages]);

  useEffect(() => {
    reset({ ...project });
  }, [project, reset]);

  useEffect(() => {
    reset({
      ...watch(),
      selected,
    });
  }, [reset, watch, selected]);

  useEffect(() => {
    if (id === 'new') {
      setSecondaryImgSelected([]);
    }
  }, [id]);

  // Form Submit Function....................................................................
  function onSubmit(data) {
    console.log(data, 555);
    data.is_published = 1;
    data.title = createTranslationData(data, 'title', true);
    data.grantee = createTranslationData(data, 'grantee', true);
    // data.focal_area = createTranslationData(data, 'focal_area', true);
    // data.cross_cutting_areas = createTranslationData(data, 'cross_cutting_areas', true);
    data.short_description = createTranslationData(data, 'short_description', true);
    data.long_description = editorDataLong;
    // data.region_group_id = data.region_group_id.map((v) => v.id);
    // data.is_number_visible = data.is_number_visible ? 1 : 0;
    data.file_id = selected?.id || defaultSelected?.id;
    data.files_id = secondaryImgSelected.map((v) => v.file_id || v.id);
    data.meta = createTranslationData(data, 'ogdescription');

    if (keyword) {
      data.keyword = createArrayTranslationData(languages, keyword);
    }
    if (!edit) {
      dispatch(addProject(data)).then(() => {
        // dispatch(getProjects());
        navigate('/projects/item');
      });
    } else {
      dispatch(editProject(data)).then(() => {
        // dispatch(getProjectById(data.id));
        // dispatch(getProjects());
        navigate('/projects/item');
      });
    }
    // setDefaultSelected([]);
    // setSecondaryImgSelected(null);
    // navigate(`/projects/item?page=${searchParams.get('page') || 1}`);
  }

  // FUNCTIONS....................................................................

  const handleOpen = (e) => {
    if (secondaryImgSelected[0] === undefined) {
      setSecondaryImgSelected([]);
      setSecondaryDefaultSelected([]);
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddChip = (chip) => {
    const arr = [...chips, { id: Date.now(), name: chip, language_id: translationLanguageInModal }];
    setChips(arr);
    setValue('keyword', arr);
    trigger('keyword');
  };

  const handleDeleteChip = (chipId) => {
    const arr = chips.filter((chip) => +chip.id !== +chipId);
    setChips(arr);
    setValue('keyword', arr);
    trigger('keyword');
  };

  if (!project && loading) {
    return <FuseLoading />;
  }

  return (
    <>
      {/* not delete ↓↓↓ */}

      <Box className="hidden">
        <LanguageSwitcher inModal />
      </Box>

      {/* not delete ↑↑↑ */}

      <Box className="relative flex flex-col flex-auto items-center px-24">
        <Tabs
          value={tabStep}
          aria-label="step form"
          onChange={(event, newValue) => {
            setTabStep(newValue);
          }}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            width: '100%',
            borderBottom: 1,
            borderColor: 'divider',
            '& button:hover': {
              transition: 'all 0.1s',
              boxShadow: '0px 0px 5px inset',
            },
          }}
        >
          <Tab label={t('INFORMATION')} />
          {/* <Tab label={t('FINANCE')} /> */}
          <Tab label={t('IMAGES')} />
          {edit ? <Tab label="SEO" /> : null}
        </Tabs>

        <TabPanel value={tabStep} index={0}>
          {/* <Box className="flex items-center "> */}
          {/*  <InputController */}
          {/*    control={control} */}
          {/*    errors={errors} */}
          {/*    name="number" */}
          {/*    label="Number" */}
          {/*    // type="number" */}
          {/*    className="mt-16 h-48" */}
          {/*  /> */}
          {/* <Box className="mt-[10px] ml-[10px]"> */}
          {/*  <Controller */}
          {/*    name="is_number_visible" */}
          {/*    control={control} */}
          {/*    render={({ field }) => { */}
          {/*      return ( */}
          {/*        <FormControlLabel */}
          {/*          control={ */}
          {/*            <Checkbox */}
          {/*              {...field} */}
          {/*              defaultValue={edit ? copyProject?.is_number_visible : false} */}
          {/*              defaultChecked={edit ? copyProject?.is_number_visible : false} */}
          {/*              value={field.value} */}
          {/*              onChange={(e) => field.onChange(e.target.checked)} */}
          {/*            /> */}
          {/*          } */}
          {/*          label={t('SHOW')} */}
          {/*        /> */}
          {/*      ); */}
          {/*    }} */}
          {/*  /> */}
          {/* </Box> */}
          {/* </Box> */}
          <Box>
            {/* <SelectController */}
            {/*  control={control} */}
            {/*  errors={errors} */}
            {/*  name="status_id" */}
            {/*  label="STATUS" */}
            {/*  getOption={(v) => { */}
            {/*    return v.translations.find((trs) => trs.language_id === translationLanguageInModal) */}
            {/*      ?.title; */}
            {/*  }} */}
            {/*  data={status} */}
            {/* /> */}
            {/* {isTerminated === 3 && ( */}
            {/*  <InputController */}
            {/*    control={control} */}
            {/*    errors={errors} */}
            {/*    name="partial_amount" */}
            {/*    label="PARTIALAMOUNT" */}
            {/*    type="number" */}
            {/*    className="mt-16 h-48" */}
            {/*  /> */}
            {/* )} */}
            <InputTranslationController
              control={control}
              errors={errors}
              name="title"
              label="TITLE"
            />

            <Box className="flex gap-5">
              <NewImageController
                obj="contain"
                setDefaultSelected={setSecondaryDefaultSelected}
                control={control}
                name="file_id"
                required
                selected={selected}
                setSelected={setSelected}
                defaultSelected={defaultSelected}
                disableEdit={!canManage}
              />
              <InputTranslationController
                control={control}
                errors={errors}
                name="short_description"
                label="SHORT_DESCRIPTION"
                multiline
                rows={5}
              />
            </Box>
            <EditorTranslationController
              control={control}
              name="long_description"
              setEditorData={setEditorDataLong}
              label="LONG_DESCRIPTION"
            />
          </Box>
        </TabPanel>

        {/* <TabPanel value={tabStep} index={1}> */}
        {/*  <Box className="flex w-full"> */}
        {/*    <InputController */}
        {/*      control={control} */}
        {/*      errors={errors} */}
        {/*      name="grant_amount" */}
        {/*      label="GRANT_AMOUNT" */}
        {/*      type="number" */}
        {/*      className="mt-16 h-48" */}
        {/*      icon="heroicons-outline:currency-dollar" */}
        {/*    /> */}
        {/*    <InputController */}
        {/*      control={control} */}
        {/*      errors={errors} */}
        {/*      name="sponsor_amount" */}
        {/*      label="SPONSOR_AMOUNT" */}
        {/*      type="number" */}
        {/*      className="mt-16 h-48" */}
        {/*      icon="heroicons-outline:currency-dollar" */}
        {/*    /> */}
        {/*  </Box> */}

        {/*  <InputTranslationController */}
        {/*    control={control} */}
        {/*    errors={errors} */}
        {/*    name="grantee" */}
        {/*    label="GRANTEE" */}
        {/*  /> */}
        {/*  <Box className="flex w-full"> */}
        {/*    <SelectController */}
        {/*      control={control} */}
        {/*      errors={errors} */}
        {/*      name="focal_area_id" */}
        {/*      label="FOCAL_AREA" */}
        {/*      getOption={(v) => { */}
        {/*        return v.translations.find((trs) => trs.language_id === translationLanguageInModal) */}
        {/*          ?.title; */}
        {/*      }} */}
        {/*      data={areas} */}
        {/*    /> */}
        {/*    <SelectController */}
        {/*      control={control} */}
        {/*      errors={errors} */}
        {/*      name="cross_cutting_area_id" */}
        {/*      label="CROSS_CUTTING_AREAS" */}
        {/*      getOption={(v) => { */}
        {/*        return v.translations.find((trs) => trs.language_id === translationLanguageInModal) */}
        {/*          ?.title; */}
        {/*      }} */}
        {/*      data={crossArea} */}
        {/*    /> */}
        {/*  </Box> */}
        {/*  <Box className="flex w-full"> */}
        {/*    <InputDateController control={control} errors={errors} name="date" label="DATE" /> */}

        {/*    <InputDateController */}
        {/*      control={control} */}
        {/*      errors={errors} */}
        {/*      name="start_date" */}
        {/*      label="START_DATE" */}
        {/*    /> */}
        {/*    <InputDateController */}
        {/*      control={control} */}
        {/*      errors={errors} */}
        {/*      name="end_date" */}
        {/*      label="END_DATE" */}
        {/*    /> */}
        {/*  </Box> */}
        {/*  <Controller */}
        {/*    name="region_group_id" */}
        {/*    control={control} */}
        {/*    render={({ field: { onChange } }) => ( */}
        {/*      <Autocomplete */}
        {/*        multiple */}
        {/*        className="mt-20 w-full" */}
        {/*        id="skills-filled" */}
        {/*        // value={regions} */}
        {/*        options={regions} */}
        {/*        getOptionLabel={(item) => */}
        {/*          item?.translations?.find((trs) => trs.language_id === translationLanguageInModal) */}
        {/*            ?.title || '---' */}
        {/*        } */}
        {/*        defaultValue={selectedRegions} */}
        {/*        renderTags={(val, getTagProps) => { */}
        {/*          return val.map((option, index) => ( */}
        {/*            <Chip */}
        {/*              key={option.id} */}
        {/*              variant="outlined" */}
        {/*              label={ */}
        {/*                option.translations.find( */}
        {/*                  (trs) => trs.language_id === translationLanguageInModal */}
        {/*                )?.title || '---' */}
        {/*              } */}
        {/*              {...getTagProps({ index })} */}
        {/*            /> */}
        {/*          )); */}
        {/*        }} */}
        {/*        renderInput={(params) => <TextField {...params} label={t('REGION')} />} */}
        {/*        onChange={(e, newValue) => { */}
        {/*          onChange(newValue); */}
        {/*          setSelectedRegions(newValue); */}
        {/*          // setSelectedStatuses(newValue); */}
        {/*          // setMySkills(changedValues); */}
        {/*        }} */}
        {/*      /> */}
        {/*    )} */}
        {/*  /> */}
        {/* </TabPanel> */}
        <TabPanel value={tabStep} index={1}>
          <Root className="w-full">
            <Box className="flex justify-center sm:justify-start flex-wrap ">
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? lighten(theme.palette.background.default, 0.4)
                      : lighten(theme.palette.background.default, 0.02),
                }}
                className="productImageUpload flex items-center justify-center relative w-full h-32 rounded-16 mr-12 mt-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                onClick={handleOpen}
              >
                <FuseSvgIcon size={32}>heroicons-outline:upload</FuseSvgIcon>
              </Box>

              {/* eslint-disable-next-line no-shadow */}
              {secondaryImgSelected?.length &&
                secondaryImgSelected.map((media, index) => {
                  // eslint-disable-next-line no-nested-ternary
                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <Box
                      role="button"
                      tabIndex={0}
                      className={clsx(
                        'productImageItem flex items-center justify-center relative w-96 h-96 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                      )}
                      key={`media${media?.id}`}
                    >
                      <FuseSvgIcon
                        onClick={(e) => {
                          const arr = secondaryImgSelected.filter((s) => s.id !== media.id);
                          e.stopPropagation();
                          setSecondaryImgSelected(arr);
                          setSecondaryDefaultSelected(arr);
                        }}
                        className="productImageX z-9999"
                      >
                        heroicons-outline:x
                      </FuseSvgIcon>
                      {/* eslint-disable-next-line */}
                      <button className="absolute top-0 left-0 p-1 m-0 bg-white rounded-lg" onClick={() => {
                          setSliderPhoto(index);
                        }}
                      >
                        <FuseSvgIcon size={24} color="primary">
                          heroicons-outline:eye
                        </FuseSvgIcon>
                      </button>
                      {media?.type === 'video' || media?.media?.type === 'video' ? (
                        <ReactPlayer
                          url={`${FILE_API_URL}/${
                            media?.thumbnail_url || media?.media?.thumbnail_url
                          }`}
                          className="max-w-none w-auto h-full"
                          muted
                          controls
                        />
                      ) : (
                        <img
                          className="max-w-none w-auto h-full"
                          src={
                            // eslint-disable-next-line no-nested-ternary
                            media?.type === 'link'
                              ? `https://img.youtube.com/vi/${
                                  media?.youtube_id || media?.media?.youtube_id
                                }/hqdefault.jpg`
                              : media.src
                              ? `${FILE_API_URL}/${media?.src || media?.media?.src}`
                              : `${FILE_API_URL}/${
                                  media?.thumbnail_url || media?.media?.thumbnail_url
                                }`
                          }
                          // `${FILE_API_URL}/${media?.thumbnail_url}`
                          alt="section_image"
                        />
                      )}
                    </Box>
                  );
                })}

              <Modal
                open={sliderPhoto === 0 ? true : !!sliderPhoto}
                onClose={() => setSliderPhoto(null)}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
              >
                <Box
                  className="flex flex-col justify-center items-center "
                  style={{ width: '100%', height: '100vh' }}
                  onClick={() => setSliderPhoto(null)}
                >
                  <Box onClick={(ev) => ev.stopPropagation()}>
                    <Swiper
                      modules={[Navigation, Pagination, Scrollbar, A11y]}
                      spaceBetween={50}
                      slidesPerView={1}
                      initialSlide={sliderPhoto}
                      navigation
                      onSwiper={(swiper) => null}
                      onSlideChange={() => null}
                      style={{
                        maxWidth: '700px',
                      }}
                    >
                      {secondaryImgSelected?.map((slid, index) => {
                        return (
                          <SwiperSlide
                            key={Math.random()}
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              backgroundColor: 'white',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {slid?.type === 'image' ? (
                              <Box
                                style={{
                                  width: '700px',
                                  minHeight: '600px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <img
                                  style={{ maxWidth: '500px', minWidth: '200px' }}
                                  src={`${FILE_API_URL}/${slid?.src}`}
                                  alt="Slider"
                                  className="rounded"
                                />
                                <Box />
                                <Box className="my-8 w-[90%] flex items-center justify-center">
                                  {slid.created_at && (
                                    <MoreTimeIcon sx={{ color: '#009fdf', fontSize: '27px' }} />
                                  )}
                                  {slid?.created_at}
                                </Box>
                              </Box>
                            ) : (
                              <Box
                                style={{
                                  maxWidth: '100%',
                                  height: '500px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Box
                                  style={{
                                    maxWidth: '600px',
                                    height: '400px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <ReactPlayer url={slid?.youtube_link} volume={1} loop controls />
                                </Box>
                                <Box className="my-8 w-[90%] flex items-center justify-center">
                                  <MoreTimeIcon sx={{ color: '#009fdf', fontSize: '27px' }} />{' '}
                                  {slid.created_at}
                                </Box>
                              </Box>
                            )}
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </Box>
                </Box>
              </Modal>
            </Box>
          </Root>
        </TabPanel>
        <TabPanel value={tabStep} index={2}>
          <Controller
            name="chips"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="mt-[30px] flex flex-wrap gap-2">
                <TextField
                  placeholder="Press Enter to add"
                  label={t('KEYWORDS')}
                  fullWidth
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (e.target.value.trim()) {
                        handleAddChip(e.target.value);
                        e.target.value = '';
                      }
                    }
                  }}
                  variant="outlined"
                />
                {chips?.length > 0
                  ? chips.map((item) => {
                      return (
                        item.language_id === translationLanguageInModal && (
                          <Chip
                            key={item.id}
                            label={item.name}
                            onDelete={() => handleDeleteChip(item.id)}
                            variant="outlined"
                          />
                        )
                      );
                    })
                  : null}
              </div>
            )}
          />
          <InputTranslationController
            control={control}
            errors={errors}
            name="ogdescription"
            label="METADESCRIPTION"
            multiline
            rows={6}
          />
        </TabPanel>
      </Box>
      <FileManagerModal
        type="media"
        handleClose={handleClose}
        open={open}
        selected={secondaryImgSelected}
        setSelected={setSecondaryImgSelected}
        defaultSelected={secondaryDefaultSelected}
        multiple
        setDefaultSelected={setSecondaryDefaultSelected}
      />
      <FormButtons
        edit={edit}
        saveDisable={!isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        data={project}
        onDeleteFunction={() => {
          dispatch(deleteProject(project.id)).then(() => {
            dispatch(
              getProjects({
                page: searchParams.get('page') || 1,
                isPubleshed: +searchParams.get('isPubleshed') || 1,
              })
            );
            navigate('/projects/item');
          });
        }}
      />
    </>
  );
};

export default ProjectsForm;
