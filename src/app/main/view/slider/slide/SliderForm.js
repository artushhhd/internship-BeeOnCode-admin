import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseLoading from '@fuse/core/FuseLoading';
import createTranslationData from '@helpers/createTranslationData';

import FormButtons from 'app/shared-components/modals/FormButtons';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import InputColorController from 'app/shared-components/fields/inputColorController';
import { selectUser } from 'app/store/userSlice';
import NewImageController from 'app/shared-components/fields/NewImageController';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  addSlide,
  getSlide,
  newSlide,
  removeSlide,
  selectSlide,
  updateSlide,
} from '../store/slideSlice';
import { getSlides, selectSlider } from '../store/sliderSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';
import { getPages, selectPages } from '../../../pages/pages/store/pagesSlice';
import { getAreas, selectAreas } from '../../../projects/store/areasSlice';
import { getNews } from '../../../news/news/store/newsSlice';

/**
 * Form Validation Schema
 */

const SliderForm = (props) => {
  const { t } = useTranslation('navigation');
  const slider = useSelector(selectSlider);
  const slide = useSelector(selectSlide);
  const pages = useSelector(selectPages);
  const areas = useSelector(selectAreas);
  const news = useSelector((state) => state.NewsApp?.news?.news?.data);
  const routeParams = useParams();
  const edit = routeParams.id !== 'new';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const [type, setType] = useState('file');
  const [files, setFiles] = useState(null);
  const [chakeLink, setChakeLink] = useState('page');
  const [defaultValue, setDefaultValue] = useState(t('PAGES'));
  const { translationLanguage } = useSelector((state) => state.i18n);
  const [newPageChecked, setNewPageChecked] = useState(false);
  const [editorData, setEditorData] = useState({});

  const { control, watch, reset, dirtyFields, handleSubmit, formState, setValue } = useForm({
    mode: 'all',
  });

  const { isValid, errors } = formState;

  const form = watch();

  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});
  const [addPage, setAddPage] = useState(false);
  const [addButtonStyle, setAddButtonStyle] = useState(false);
  /**
   * Update Task
   */

  useEffect(() => {
    dispatch(getPages());
    dispatch(getAreas('focal_area'));
    dispatch(getNews());
  }, [dispatch]);

  useEffect(() => {
    if (files) {
      setValue('video_url', '');
    }
  }, [files, setValue]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Slider' }));
    if (!canManage) {
      navigate(`/view/slider`);
    }

    if (routeParams.id === 'new') {
      dispatch(newSlide());
    } else {
      dispatch(getSlide(routeParams.id));
    }
  }, [dispatch, routeParams.id, canManage, navigate, userId]);

  useEffect(() => {
    const def = {
      id: slide?.file_id,
      src: slide?.media?.medium_url,
    };
    if (edit) {
      setDefaultSelected(def);
      setSelected(def);
    }
  }, [setDefaultSelected, slide, setSelected, edit]);

  const copySlider = useMemo(() => {
    return { ...slide };
  }, [slide]);

  useEffect(() => {
    reset({ ...copySlider });
  }, [copySlider, slide, reset]);

  useEffect(() => {
    if (slide) {
      copySlider.news_id = slide.news_id;
      copySlider.area_id = slide.area_id;
      copySlider.page_id = slide.page_id;
      copySlider.is_cover = !!slide.is_cover;
      slide.translations.forEach((item) => {
        if (edit) {
          copySlider[`title${item.language_id}`] = item.title;
          copySlider[`buttonText${item.language_id}`] = item.button_text;
          copySlider[`caption${item.language_id}`] = item.caption
            ? JSON.parse(item.caption).htmlValue
            : '';
        } else {
          copySlider[`title${item.language_id}`] = '';
          copySlider[`caption${item.language_id}`] = '';
          copySlider[`buttonText${item.language_id}`] = '';
        }
        if (edit) {
          if (pages?.length) {
            const page = pages.find((p) => p.id === slide?.page_id);
            if (page) {
              setDefaultValue(
                `${page.translations.find((tr) => tr.language_id === translationLanguage).title}`
              );
            }
          }
          if (areas?.length) {
            const area = areas.find((p) => p.id === slide.area_id);

            if (area) {
              setDefaultValue(
                `${area.translations.find((tr) => tr.language_id === translationLanguage).title}`
              );
            }
          }
          if (news?.length) {
            const newsitem = news.find((p) => p.id === slide.news_id);

            if (newsitem) {
              setDefaultValue(
                `${
                  newsitem.translations.find((tr) => tr.language_id === translationLanguage).title
                }`
              );
            }
          }
          copySlider.buttonColor = slide?.button_color;
          copySlider.textColor = slide.button_text_color;

          if (slide.news_id) {
            setChakeLink('news');
            copySlider.chake = 'news';
          } else if (slide.area_id) {
            copySlider.chake = 'area';
            setChakeLink('area');
          } else if (slide.page_id) {
            copySlider.chake = 'page';
            setChakeLink('page');
          }
        }
      });

      if (slide.video_url) {
        if (edit) {
          setType('video_url');
          setFiles(null);
          copySlider.video_url = slide.video_url;
        } else {
          copySlider.video_url = '';
        }
      }

      if (slide.file) {
        if (slide.file_type === 'image') {
          if (edit) {
            setType('file');
            setFiles(slide.file);
            copySlider.file = slide.file;
          } else {
            copySlider.file = '';
          }
        } else if (slide.file_type === 'video/mp4') {
          if (edit) {
            setType('video_url');
            copySlider.file = slide.file;
          } else {
            copySlider.file = '';
          }
        }
      }
      reset({ ...copySlider });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, reset, edit, copySlider]);

  function handleRemoveSlide() {
    dispatch(removeSlide(slide.id)).then(() => {
      dispatch(getSlides());
      navigate('/view/slider');
    });
  }

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.caption = editorData;
    data.chake = chakeLink;
    data.title = createTranslationData(data, 'title');
    data.buttonText = createTranslationData(data, 'buttonText');
    if (type === 'file') {
      data.file_id = selected?.id;
      data.video_url = null;
    } else {
      data.file_id = 0;
    }
    data.is_cover = data.is_cover ? 1 : 0;

    if (routeParams.id === 'new') {
      data.file = files;

      if (data.file_id || data.video_url) {
        dispatch(addSlide(data)).then(() => {
          dispatch(getSlides());
          navigate(`/view/slider`);
        });
      }
    } else {
      dispatch(updateSlide(data)).then(() => {
        dispatch(getSlide(routeParams.id));
        dispatch(getSlides());
        navigate(`/view/slider`);
      });
    }
  }

  if (_.isEmpty(form) || !slider) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <div className="flex">
          <div className="w-full flex">
            <NewImageController
              setDefaultSelected={setDefaultSelected}
              control={control}
              name="file_id"
              required
              selected={selected}
              setSelected={setSelected}
              defaultSelected={defaultSelected}
              disableEdit={!canManage}
            />
            {!!selected?.id && (
              <Controller
                name="is_cover"
                control={control}
                render={({ field }) => {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          defaultValue={edit ? copySlider?.is_cover : false}
                          defaultChecked={edit ? copySlider?.is_cover : false}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={t('COVER')}
                    />
                  );
                }}
              />
            )}
          </div>
          <Box
            onClick={() => {
              setAddPage(!addPage);
            }}
            style={{
              marginTop: '20px',
              cursor: 'pointer',
              width: '300px',
              height: '50px',
              backgroundColor: '#3e3f96',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span className="mx-4">{t('ADD')}</span> <span>{t('PAGE')}</span>
          </Box>
        </div>

        {addPage ? (
          <>
            <div className="w-full flex items-center justify-between my-8">
              <Box
                onClick={() => {
                  setChakeLink('page');
                  setDefaultValue(t('PAGES'));
                }}
                style={
                  chakeLink === 'page'
                    ? {
                        width: '300px',
                        height: '50px',
                        backgroundColor: '#3e3f96',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }
                    : {
                        width: '300px',
                        height: '50px',
                        border: '1px solid #3e3f96',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }
                }
              >
                <span className="mx-4">{t('ADD')}</span> <span>{t('PAGE')}</span>
              </Box>
              <Box
                onClick={() => {
                  setChakeLink('news');
                  setDefaultValue(t('NEWS'));
                }}
                style={
                  chakeLink === 'news'
                    ? {
                        width: '300px',
                        height: '50px',
                        backgroundColor: '#3e3f96',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }
                    : {
                        width: '300px',
                        height: '50px',
                        border: '1px solid #3e3f96',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }
                }
              >
                <span className="mx-4">{t('ADD')}</span> <span>{t('NEWS')}</span>
              </Box>
              <Box
                onClick={() => {
                  setChakeLink('area');
                  setDefaultValue(t('AREAS'));
                }}
                style={
                  chakeLink === 'area'
                    ? {
                        width: '300px',
                        height: '50px',
                        backgroundColor: '#3e3f96',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }
                    : {
                        width: '300px',
                        height: '50px',
                        border: '1px solid #3e3f96',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }
                }
              >
                <span className="mx-4"> {t('ADD')} </span> <span> {t('AREA')}</span>
              </Box>
            </div>
            {chakeLink === 'page' && pages?.length > 0 && (
              <>
                <Controller
                  name="page_id"
                  control={control}
                  render={({ field: { onChange } }) => {
                    return (
                      <Autocomplete
                        className="mt-20 w-full"
                        options={pages}
                        disabled={newPageChecked}
                        getOptionLabel={(option) =>
                          `${
                            option.translations.find((tr) => tr.language_id === translationLanguage)
                              ?.title
                          } /${option.slug}`
                        }
                        renderInput={(params) => {
                          return <TextField {...params} label={defaultValue} />;
                        }}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                      />
                    );
                  }}
                />
              </>
            )}
            {chakeLink === 'news' && news?.length > 0 && (
              <>
                <Controller
                  name="news_id"
                  control={control}
                  render={({ field: { onChange } }) => {
                    return (
                      <Autocomplete
                        className="mt-20 w-full"
                        options={news}
                        disabled={newPageChecked}
                        getOptionLabel={(option) =>
                          `${
                            option.translations.find((tr) => tr.language_id === translationLanguage)
                              ?.title
                          } /${option.id}`
                        }
                        renderInput={(params) => {
                          return <TextField {...params} label={defaultValue} />;
                        }}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                      />
                    );
                  }}
                />
              </>
            )}
            {chakeLink === 'area' && areas?.length > 0 && (
              <>
                <Controller
                  name="area_id"
                  control={control}
                  render={({ field: { onChange } }) => {
                    return (
                      <Autocomplete
                        className="mt-20 w-full"
                        options={areas}
                        disabled={newPageChecked}
                        getOptionLabel={(option) =>
                          `${
                            option.translations.find((tr) => tr.language_id === translationLanguage)
                              ?.title
                          } /${option.slug}`
                        }
                        renderInput={(params) => {
                          return <TextField {...params} label={defaultValue} />;
                        }}
                        onChange={(event, newValue) => {
                          onChange(newValue);
                        }}
                      />
                    );
                  }}
                />
              </>
            )}
          </>
        ) : null}
        <Box
          onClick={() => {
            setAddButtonStyle(!addButtonStyle);
          }}
          style={{
            marginTop: '30px',
            cursor: 'pointer',
            width: '300px',
            height: '50px',
            backgroundColor: '#3e3f96',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span className="mx-4">{t('BUTTONSTYLE')}</span>
        </Box>

        {addButtonStyle ? (
          <>
            <Box className="flex w-full">
              <div className="w-full flex items-center my-8">
                <InputColorController
                  errors={errors}
                  control={control}
                  name="textColor"
                  label="TEXTCOLOR"
                />
              </div>

              <div className="w-full flex items-center my-8">
                <InputColorController
                  errors={errors}
                  control={control}
                  name="buttonColor"
                  label="BUTTONCOLOR"
                />
              </div>
              <div className="w-full flex items-center my-8">
                <InputColorController
                  errors={errors}
                  control={control}
                  name="color"
                  label="BACKGROUNDCOLOR"
                />
              </div>
            </Box>
            <InputTranslationController
              name="buttonText"
              control={control}
              errors={errors}
              label="BUTTONTEXT"
            />

            <InputTranslationController control={control} errors={errors} name="title" />

            <EditorTranslationController
              control={control}
              name="caption"
              setEditorData={setEditorData}
              label="DESCRIPTION"
            />
          </>
        ) : null}
      </div>

      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={!isValid || (type === 'file' && !selected?.id)}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemoveSlide}
      />
    </>
  );
};

export default SliderForm;
