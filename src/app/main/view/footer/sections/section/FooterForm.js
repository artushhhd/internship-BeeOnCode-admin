import _ from '@lodash';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { Controller, useForm } from 'react-hook-form';
import { lighten } from '@mui/material/styles';
import { selectUser } from 'app/store/userSlice';
import { useTranslation } from 'react-i18next';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import FormHelperText from '@mui/material/FormHelperText';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import FormButtons from 'app/shared-components/modals/FormButtons';
import createTranslationData from '@helpers/createTranslationData';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import PageCheckboxController from 'app/shared-components/fields/PageCheckboxController';
import NewImageController from 'app/shared-components/fields/NewImageController';
import { getSections, selectGroupedFilteredSections } from '../store/footersSlice';
import { getPages, selectPages } from '../../../../pages/pages/store/pagesSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../../administration/store/permissionsSlice';
import {
  addSection,
  getSection,
  removeSection,
  selectSection,
  updateSection,
} from '../store/footerSlice';

const FooterForm = () => {
  // ================================= FROM VALIDATION SCHEMA ====================================

  const schema = yup.object().shape({
    title1: yup.string(),
    content1: yup
      .string()
      .test(
        'required',
        'You must enter an armenian text',
        (v) => v && JSON.stringify(v) !== JSON.stringify('<p></p>\n')
      ),
  });

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  // ======================================= STATES =============================================

  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');
  const newType = useSelector((state) => state.sectionsApp.sections.newType);
  const { id: userId } = useSelector(selectUser);
  const section = useSelector(selectSection);
  const { canManage } = useSelector(selectPermission);
  const pages = useSelector(selectPages);
  const sections = useSelector(selectGroupedFilteredSections);
  const routeParams = useParams();
  const [copy, setCopy] = useState(true);
  const [selected, setSelected] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [linksData, setLinksData] = useState([]);
  const [deletedMedia, setDeletedMedia] = useState([]);
  const [uniqId, setUniqId] = useState(1);
  const [defaultSelected, setDefaultSelected] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const edit = routeParams.id !== 'new';
  const [valueId, setValueId] = useState(1);

  // ======================================= USEEFFECTS =============================================

  useEffect(() => {
    setUniqId(Math.floor(Math.random() * 99999999999999 + 1));
  }, [linksData]);

  useEffect(() => {
    dispatch(getPages());
  }, [dispatch]);

  useEffect(() => {
    const def = {
      id: section?.file_id,
      src: section?.media?.thumbnail_url,
    };
    setDefaultSelected(def);
    setSelected(def);
  }, [setDefaultSelected, section]);

  const { isValid, errors } = formState;
  const [editorData, setEditorData] = useState({});

  const [defaultValue, setDefaultValue] = useState(t('PAGES'));
  const [chakeLink, setChakeLink] = useState('addtitle');

  const form = watch();

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Footer' }));
    if (!canManage) {
      navigate(`/view/footer/sections`);
    }
    // if (routeParams.id === 'new') {
    //   dispatch(newSection());
    // } else {
    //   dispatch(getSection(routeParams.id));
    // }
    setEditorData({});
    // eslint-disable-next-line
  }, [routeParams.id, canManage, navigate, userId]);
  useEffect(() => {
    if (searchParams.get('link')) {
      setChakeLink('link');
    }
    // eslint-disable-next-line
  }, []);

  const copySection = useMemo(() => {
    return { ...section };
  }, [section]);

  const typeState = [
    { id: Math.random(), name: t('BEFORE'), value: 'before' },
    { id: Math.random(), name: t('MIDDLE'), value: 'middle' },
    { id: Math.random(), name: t('AFTER'), value: 'after' },
    { id: Math.random(), name: t('COPYRIGTH'), value: 'copyright' },
  ];
  const typeState1 = [
    { id: Math.random(), name: t('BEFORE'), value: 'before' },
    { id: Math.random(), name: t('MIDDLE'), value: 'middle' },
    { id: Math.random(), name: t('AFTER'), value: 'after' },
  ];

  const borderState = [
    { id: Math.random(), name: t('BORDERNONE'), value: 'none' },
    { id: Math.random(), name: t('BORDERTOP'), value: 'borderTop' },
    { id: Math.random(), name: t('BORDERBOTTOM'), value: 'borderBottom' },
  ];

  // =================================== FORM SUBMIT ===========================================

  function onSubmit(data) {
    data.file_id = selected.id;
    data.title = createTranslationData(data, 'title');
    data.content = editorData;

    data.link = [];
    data.links.forEach((link, i) => {
      console.log(link, 555);
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

    if (routeParams.id === 'new') {
      dispatch(addSection(data, translationLanguages)).then(() => {
        dispatch(getSections());
        navigate(`/view/footer/sections`);
      });
    } else {
      dispatch(updateSection(data, translationLanguages)).then(() => {
        dispatch(getSection(routeParams.id));
        dispatch(getSections());
        navigate(`/view/footer/sections`);
      });
    }
  }

  useEffect(() => {
    if (section) {
      if (edit) {
        section.translations.forEach((item) => {
          copySection[`title${item.language_id}`] = item.title;
          copySection[`content${item.language_id}`] = item.content
            ? JSON.parse(item.content).htmlValue
            : '';
        });
        copySection.border = section?.border;
        copySection.type = section.type;
        copySection.image = section.image;
        copySection.links = section.links;
        copySection.links?.forEach((l, i) => {
          console.log(l, 8222);
          copySection[`linkUrl${l.id}`] = l.link;
          copySection[`page_id${l.id}`] = l?.page;
          copySection.page_id = l?.page_id;
          copySection[`linkTitle${l.id}_${l.language_id}`] = l.name;
          copySection[`linkUrl${l.id}`] = l.link;
          copySection[`page_id${l.id}`] = l?.page;
          copySection[`linkTitle${l.id}_${l.language_id}`] = l.name;
        });
      } else {
        translationLanguages.forEach((language) => {
          copySection[`title${language.id}`] = '';
          copySection[`content${language.id}`] = '';
        });
        copySection.type = newType;
        copySection.border = 'none';
        translationLanguages.forEach((language) => {
          copySection[`title${language.id}`] = '';
        });
      }
      setLinksData(copySection.links || []);
      reset({ ...copySection });
    }
    // eslint-disable-next-line
  }, [section, edit, reset, copySection]);

  useEffect(() => {
    reset({ ...copySection });
  }, [copySection, section, reset]);
  const formWatch = watch();
  useEffect(() => {
    sections.map((val) => {
      return copy && val.type === 'copyright' && setCopy(false);
    });
  }, [sections, copy]);

  // =================================== FORM REMOVE SUBMIT ===========================================
  function handleRemoveContact() {
    dispatch(removeSection(section.id)).then(() => {
      dispatch(getSections());
      navigate('/view/footer/sections');
    });
  }
  if (_.isEmpty(form) || !section) {
    return <FuseLoading />;
  }
  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <div className="w-full flex items-center justify-between my-14">
          <Box
            onClick={() => {
              setChakeLink('addtitle');
              setDefaultValue(t('PAGES'));
              setValueId(1);
            }}
            style={
              chakeLink === 'addtitle'
                ? {
                    cursor: 'pointer',
                    width: '240px',
                    height: '50px',
                    backgroundColor: '#3e3f96',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
                : {
                    cursor: 'pointer',
                    width: '240px',
                    height: '50px',
                    border: '1px solid #3e3f96',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
            }
          >
            <span style={{ fontWeight: '600' }}>{t('TITLE')}</span>
          </Box>
          <Box
            onClick={() => {
              setChakeLink('link');
              setDefaultValue(t('AREAS'));
              setValueId(2);
            }}
            style={
              chakeLink === 'link'
                ? {
                    cursor: 'pointer',
                    width: '240px',
                    height: '50px',
                    backgroundColor: '#3e3f96',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
                : {
                    cursor: 'pointer',
                    width: '240px',
                    height: '50px',
                    border: '1px solid #3e3f96',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
            }
          >
            <span style={{ fontWeight: '600' }}> {t('LINK')}</span>
          </Box>
        </div>
        {chakeLink === 'addtitle' && pages?.length > 0 && (
          <>
            <Box className="w-full flex flex-col items-center">
              <InputTranslationController control={control} name="title" errors={errors} />
              <EditorTranslationController
                control={control}
                name="content"
                setEditorData={setEditorData}
                label="CONTENT"
              />
              <Box className="w-full flex justify-center mt-12">
                <NewImageController
                  setDefaultSelected={setDefaultSelected}
                  control={control}
                  name="avatar"
                  disableEdit={!canManage}
                  selected={selected}
                  defaultSelected={defaultSelected}
                  setSelected={setSelected}
                />
                <Box className="w-full mt-2">
                  <Controller
                    render={({ field = '' }) => (
                      <FormControl
                        className="flex w-full mt-6"
                        error={!!errors.Select}
                        required
                        fullWidth
                      >
                        <InputLabel id="category-select-label1">{t('TYPE')}</InputLabel>
                        <Select {...field} variant="outlined" fullWidth label="Type">
                          {copy || section.type === 'copyright'
                            ? typeState.map((type) => (
                                <MenuItem value={type.value} key={type.id}>
                                  {type.name}
                                </MenuItem>
                              ))
                            : typeState1.map((type) => (
                                <MenuItem value={type.value} key={type.id}>
                                  {type.name}
                                </MenuItem>
                              ))}
                        </Select>
                        <FormHelperText>{errors?.Select?.message}</FormHelperText>
                      </FormControl>
                    )}
                    name="type"
                    control={control}
                    placeholder="Type"
                  />
                  <Controller
                    render={({ field = '' }) => (
                      <FormControl
                        className="flex w-full mt-6"
                        error={!!errors.Select}
                        required
                        fullWidth
                      >
                        <InputLabel id="category-select-label1">{t('BORDER')}</InputLabel>
                        <Select {...field} variant="outlined" fullWidth label="Border">
                          {borderState.map((border) => (
                            <MenuItem value={border.value} key={border.id}>
                              {border.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors?.Select?.message}</FormHelperText>
                      </FormControl>
                    )}
                    name="border"
                    control={control}
                    placeholder="Border"
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
        {chakeLink === 'link' && (
          <>
            <Box className="w-full flex justify-center">
              <Box className="w-full flex flex-col">
                {linksData?.map((link, i) => {
                  return (
                    link.language_id === translationLanguageInModal &&
                    !link.deleted && (
                      <Box key={`linkTitle${link.id}`}>
                        <Box className="flex justify-between items-end gap-[15px] relative">
                          <div className="w-full">
                            <InputTranslationController
                              name={`linkTitle${link.id}_`}
                              control={control}
                              errors={errors}
                            />
                          </div>
                          <FuseSvgIcon
                            onClick={() => {
                              console.log(linksData, 111);
                              linksData.find((value) => value.id === link.id).deleted = true;
                              setLinksData([...linksData]);
                              if (watch().links.find((value) => value.id === link.id)) {
                                watch().links.find((value) => value.id === link.id).deleted = true;
                              }
                              // reset({ ...copySection, links: linksData });
                              if (link.created_at) {
                                setDeletedMedia([...deletedMedia, link.id]);
                                reset({ ...watch(), deletedMedia: [...deletedMedia, link.id] });
                              }
                            }}
                            className="absolute right-[-12px] rounded-full top-[3px] cursor-pointer hover:bg-red"
                          >
                            heroicons-outline:x
                          </FuseSvgIcon>
                        </Box>
                        <div className="w-full">
                          <PageCheckboxController
                            watch={watch}
                            control={control}
                            name={`page_id${link.id}`}
                            reset={reset}
                            data={pages}
                            link={`linkUrl${link.id}`}
                            edit={edit}
                          />
                        </div>
                        <Divider className="mt-16 mb-24 shadow-red" />
                      </Box>
                    )
                  );
                })}
                <div className="flex w-full">
                  <Controller
                    name="links"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      if (!value) {
                        onChange(linksData);
                      }
                      return (
                        <Box
                          sx={{
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'light'
                                ? lighten(theme.palette.background.default, 0.4)
                                : lighten(theme.palette.background.default, 0.02),
                          }}
                          component="button"
                          className="productImageUpload flex items-center justify-center relative w-full h-32 rounded-16 mt-[18px] mb-[15px] overflow-hidden cursor-pointer shadow hover:shadow-lg"
                          onClick={() => {
                            const data = [
                              ...linksData,
                              {
                                id: uniqId,
                                deleted: false,
                                language_id: translationLanguageInModal,
                              },
                            ];
                            onChange(data);
                            setLinksData(data);
                            reset({ ...copySection, ...watch() });
                          }}
                        >
                          <FuseSvgIcon size={32} color="action">
                            heroicons-outline:plus
                          </FuseSvgIcon>
                        </Box>
                      );
                    }}
                  />
                </div>
              </Box>
            </Box>
          </>
        )}
      </div>
      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={!isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemoveContact}
      />
    </>
  );
};

export default FooterForm;
