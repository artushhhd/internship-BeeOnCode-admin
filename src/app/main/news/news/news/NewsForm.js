import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import _ from '@lodash';

import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';

import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import ReactPlayer from 'react-player';
import { FILE_API_URL } from '@api/http';
import Modal from '@mui/material/Modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import FileManagerModal from 'app/shared-components/modals/FileManagerModal';
import NewImageController from 'app/shared-components/fields/NewImageController';
import createTranslationData from '@helpers/createTranslationData';
import InputDateController from 'app/shared-components/fields/InputDateController';
import { useTranslation } from 'react-i18next';
import { selectLanguages } from 'app/store/i18nSlice';
import createArrayTranslationData from '@helpers/createArrayTranslationData';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { Root } from '../../../pages/pages/pages/sectionForms/GalleryForm';
import {
  addNewsItem,
  deleteNewsItem,
  editNewsItem,
  getNewsItemById,
  newNewsItem,
  resetNewsItem,
  selectLoading,
  selectNewsItem,
} from '../store/newsItemSlice';
import { selectPermission } from '../../../administration/store/permissionsSlice';
import { getNews } from '../store/newsSlice';

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
});

const NewsForm = (props) => {
  const { t } = useTranslation('navigation');
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const [searchParams, setSearchParams] = useSearchParams();
  const newsItem = useSelector(selectNewsItem);
  const loading = useSelector(selectLoading);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const [selected, setSelected] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState([]);
  const [secondaryImgDef, setSecondaryImgDef] = useState([]);
  const [secondaryImgSelected, setSecondaryImgSelected] = useState([]);
  const [editorDataLong, setEditorDataLong] = useState({});
  const [tabStep, setTabStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [sliderPhoto, setSliderPhoto] = useState(null);
  const edit = routeParams.id !== 'new';
  const [ogDescription, setOgDescription] = useState();
  const [chips, setChips] = useState([]);
  const languages = useSelector(selectLanguages);

  const { control, trigger, reset, handleSubmit, setValue, watch, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const keyword = watch('keyword');

  // USE EFFECTS....................................................................
  const copyNewsItem = useMemo(() => {
    return { ...newsItem };
  }, [newsItem]);

  useEffect(() => {
    setDefaultSelected([]);
    if (newsItem?.images?.length) {
      setSecondaryImgSelected(newsItem?.images);
    }
    if (newsItem?.media) {
      setDefaultSelected(newsItem?.media);
    }
  }, [newsItem]);

  useEffect(() => {
    if (selected?.id) {
      setValue('file_id', selected.id);
    }
    // eslint-disable-next-line
  }, [selected]);

  useEffect(() => {
    dispatch(resetNewsItem());
    if (routeParams.id !== 'new') {
      setSecondaryImgSelected(null);
      dispatch(getNewsItemById(routeParams.id));
    } else {
      dispatch(newNewsItem());
    }
    setEditorDataLong({});
  }, [dispatch, routeParams, userId]);

  useEffect(() => {
    if (newsItem) {
      if (edit) {
        const arr = [];
        const lastArr = [];
        newsItem?.translations?.forEach((item, i) => {
          arr.push({ language_id: item.language_id, keyword: JSON.parse(item.keyword) });
          copyNewsItem[`ogdescription${item.language_id}`] = item.meta;
          copyNewsItem[`title${item.language_id}`] = item.title;
          if (item?.long_description) {
            copyNewsItem[`long_description${item.language_id}`] = JSON.parse(
              item?.long_description
            ).htmlValue;
          }

          copyNewsItem[`short_description${item.language_id}`] = item?.short_description;
        });
        arr?.forEach((element) => {
          if (element?.keyword?.length > 0) {
            element?.keyword.forEach((itemEl) => {
              lastArr.push({
                id: Math.random(),
                name: itemEl,
                language_id: element.language_id,
              });
            });
          }
        });
        copyNewsItem.keyword = lastArr;
        setChips(lastArr);
        if (newsItem?.data) {
          copyNewsItem.data = newsItem?.data;
        }
      }
      reset({ ...copyNewsItem });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit, reset, translationLanguages, canManage, navigate, loading, dispatch, routeParams.id]);

  useEffect(() => {
    if (routeParams.id === 'new') {
      setSecondaryImgSelected([]);
      setSecondaryImgDef([]);
    }
  }, [routeParams.id]);

  if (loading) {
    return <FuseLoading />;
  }

  // Form Submit Function....................................................................
  async function onSubmit(data) {
    data.title = createTranslationData(data, 'title');
    data.meta = createTranslationData(data, 'ogdescription');
    data.short_description = createTranslationData(data, 'short_description', true);
    data.long_description = editorDataLong;
    data.files_id = secondaryImgSelected?.map((v) => v.file_id || v.id);
    data.file_id = selected?.id || defaultSelected?.id;
    if (keyword) {
      data.keyword = createArrayTranslationData(languages, keyword);
    }

    if (routeParams.id === 'new') {
      await dispatch(addNewsItem(data));
    } else {
      data.id = routeParams.id;
      await dispatch(editNewsItem(data));
    }
    setDefaultSelected([]);
    setSecondaryImgSelected([]);
    setSecondaryImgDef([]);
    navigate(`/news/item?page=${searchParams.get('page') || 1}`);
  }

  // FUNCTIONS....................................................................
  const handleOpen = (e) => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
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

  return (
    <>
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
          <Tab label={t('IMAGES')} />
          {edit ? <Tab label="SEO" /> : null}
        </Tabs>
        <TabPanel value={tabStep} index={0}>
          <InputTranslationController
            control={control}
            errors={errors}
            name="title"
            label="TITLE"
          />
          <InputDateController control={control} errors={errors} name="date" label="DATE" />
          <Box className="flex gap-5">
            <NewImageController
              obj="contain"
              setDefaultSelected={setSecondaryImgDef}
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
        </TabPanel>
      </Box>
      <TabPanel value={tabStep} index={1}>
        <Root className="w-full min-h-[500px] ">
          <Box className="flex  w-full min-h-[100px] justify-center sm:justify-start flex-wrap ">
            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="productImageUpload flex items-center justify-center relative w-full h-[30px] rounded-16 mr-12 mt-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
              onClick={handleOpen}
            >
              <FuseSvgIcon size={32}>heroicons-outline:upload</FuseSvgIcon>
            </Box>

            {secondaryImgSelected?.map(({ media, id: imgId, src }, index) => {
              // eslint-disable-next-line no-nested-ternary
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <Box
                  role="button"
                  tabIndex={0}
                  className={clsx(
                    'productImageItem  ml-[10px] flex items-center justify-center relative w-96 h-96 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                  )}
                  key={media?.imgId}
                >
                  <FuseSvgIcon
                    onClick={(e) => {
                      const arr = secondaryImgSelected.filter((s) => s.id !== imgId);
                      e.stopPropagation();
                      setSecondaryImgSelected(arr);
                    }}
                    className="productImageX z-9999"
                  >
                    heroicons-outline:x
                  </FuseSvgIcon>
                  {/* eslint-disable-next-line */}
                  <button className="absolute top-0 left-0 p-1 m-0 bg-white rounded-lg"      onClick={() => {
                      setSliderPhoto(index);
                    }}
                  >
                    <FuseSvgIcon size={24} color="primary">
                      heroicons-outline:eye
                    </FuseSvgIcon>
                  </button>
                  {media?.type === 'video' ? (
                    <ReactPlayer
                      url={`${FILE_API_URL}/${media?.src}`}
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
                          ? `https://img.youtube.com/vi/${media?.youtube_id}/hqdefault.jpg`
                          : src
                          ? `${FILE_API_URL}/${src}`
                          : `${FILE_API_URL}/${media?.thumbnail_url}`
                      }
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
                          {slid.type === 'image' ? (
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
                                <ReactPlayer url={slid.youtube_link} volume={1} loop controls />
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
      <TabPanel value={tabStep} index={2} className=" absolute top-[150px] w-full px-[30px]">
        <Root className="w-full min-h-[500px] ">
          <Controller
            name="chips"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2 mt-[-20px]">
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
        </Root>
      </TabPanel>
      <FileManagerModal
        type="image"
        handleClose={handleClose}
        open={open}
        selected={secondaryImgSelected}
        setSelected={setSecondaryImgSelected}
        defaultSelected={secondaryImgDef}
        multiple
        setDefaultSelected={setSecondaryImgDef}
      />

      <FormButtons
        edit={routeParams.id !== 'new'}
        onDeleteFunction={() => {
          dispatch(deleteNewsItem(newsItem?.id)).then(() => {
            dispatch(
              getNews({
                page: +searchParams.get('page') || 1,
                isPubleshed: searchParams.get('isPubleshed'),
              })
            );
            navigate('/news/item');
          });
        }}
        onSubmitFunction={handleSubmit(onSubmit)}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
      />
    </>
  );
};

export default NewsForm;
