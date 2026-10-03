import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import { useEffect, useMemo, useState } from 'react';
import createTranslationData from '@helpers/createTranslationData';
import FuseLoading from '@fuse/core/FuseLoading';
import { yupResolver } from '@hookform/resolvers/yup';
import FormButtons from 'app/shared-components/modals/FormButtons';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import InputController from 'app/shared-components/fields/InputController';
import SelectController from 'app/shared-components/fields/SelectController';
import { selectUser } from 'app/store/userSlice';
import Typography from '@mui/material/Typography';
import { Switch, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { selectLanguages } from 'app/store/i18nSlice';
import createArrayTranslationData from '@helpers/createArrayTranslationData';
import Chip from '@mui/material/Chip';
import { getPages, selectPages } from '../store/pagesSlice';
import { addPage, removePage, selectPage, updatePage } from '../store/pageSlice';
import {
  getInactivePageTemplates,
  getPageTemplates,
  selectPageTemplates,
} from '../../pageTemplates/store/pageTemplatesSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';
import { getAreas, selectAreas } from '../../../projects/store/areasSlice';

// Components....................................................................
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
const PagesForm = (props) => {
  const [searchParams] = useSearchParams();
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const page = useSelector(selectPage);
  const pages = useSelector(selectPages);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = routeParams;
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');
  const pageTemplates = useSelector(selectPageTemplates);
  const [havePageTemplate, setHavePageTemplate] = useState(false);
  const staticPages = pages?.filter((val) => val.type === 'static' && val.is_template === 1);
  const [hiddenSlug, setHiddenSlug] = useState('');
  const edit = routeParams.id !== 'new';
  const stat = routeParams?.type === 'category';
  const areas = useSelector(selectAreas);
  const [editorDataLong, setEditorDataLong] = useState({});
  const [ogDescription, setOgDescription] = useState();
  const [chips, setChips] = useState([]);
  const languages = useSelector(selectLanguages);
  const [value, setValue2] = useState(0);

  // SCHEMA VALIDATION....................................................................

  const schema = yup.object().shape({
    slug: yup
      .string()
      .matches(/^[a-z0-9-_]+$/, 'Only alphabets are allowed for this field ')
      .test('unique_slug_validation', 'that slug already used', (val) => {
        return pages.every((ls) => ls.slug !== val || +id === +ls.id);
      })
      .trim(),
    title1: yup.string().trim().required('You must enter a armenian title'),
  });

  const CategorySchema = yup.object().shape({
    staticPage_id: yup.number().required(),
    pageCategory_id: yup.number().required(),
  });

  const { control, trigger, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
    mode: 'all',
    resolver: yupResolver(stat ? CategorySchema : schema),
  });
  const { isValid, dirtyFields, errors, isSubmitting } = formState;
  const keyword = watch('keyword');
  const values = getValues();
  const form = watch();

  const copyPage = useMemo(() => {
    return { ...page };
  }, [page]);

  // USE EFFECTS....................................................................

  useEffect(() => {
    if (edit) {
      if (page) {
        const arr = [];
        const lastArr = [];
        copyPage.translations?.forEach((item) => {
          copyPage[`title${item.language_id}`] = item.title;
          arr.push({ language_id: item.language_id, keyword: JSON.parse(item.keyword) });
          copyPage[`ogdescription${item.language_id}`] = item.meta;
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
        copyPage.keyword = lastArr;
        setChips(lastArr);
      } else if (page && !edit) {
        copyPage.keyword = [];
        translationLanguages.forEach((val) => {
          copyPage[`title${val.id}`] = '';
          copyPage[`ogdescription${val.language_id}`] = '';
        });
      }
      reset({ ...copyPage });
    } // eslint-disable-next-line
  }, [page, edit, routeParams.id,copyPage]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Pages' }));
    if (!canManage) {
      navigate('/pages');
    }
    dispatch(searchParams.get('deleted') ? getInactivePageTemplates() : getPageTemplates());
    dispatch(getAreas('focal_area'));
    // eslint-disable-next-line
  }, [navigate,searchParams.get('deleted'),canManage, userId]);

  useEffect(() => {
    reset({ ...copyPage });
  }, [copyPage, page, reset]);

  useEffect(() => {
    if (page?.is_template === 1) {
      setValue(values.myCheckbox, true);
    }
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (stat) {
      if (values.pageCategory_id && values.staticPage_id) {
        const pageSlug = staticPages.find((Spage) => {
          return Spage.id === values.staticPage_id;
        })?.slug;

        if (areas.length) {
          const pageCategory = areas?.find((Spage) => {
            return Spage.id === values.pageCategory_id;
          })?.slug;
          const pageName = `${pageSlug}+${pageCategory}`;
          setHiddenSlug(`/${pageSlug}/list?category=${pageCategory}`);
          setValue('type', 'template');
          setValue('title1', pageName);
          setValue('slug', hiddenSlug);
        }
      }
    }
    // eslint-disable-next-line
  }, [values,areas]);

  // FUNCTIONS....................................................................

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

  function onSubmit(data) {
    data.title = createTranslationData(data, 'title');
    data.meta = createTranslationData(data, 'ogdescription');
    data.short_description = createTranslationData(data, 'short_description', true);
    if (keyword) {
      data.keyword = createArrayTranslationData(languages, keyword);
    }

    if (!edit && routeParams?.id === 'new' && !stat) {
      if (!havePageTemplate) {
        data.template_id = null;
      }
      data.type = 'dynamic';
      data.is_template = 0;
      dispatch(addPage(data)).then(() => {
        dispatch(getPages());
        navigate('/pages');
      });
    }
    if (!edit && stat) {
      data.type = 'template';
      dispatch(addPage(data)).then(() => {
        dispatch(getPages());
        navigate('/pages');
      });
    } else if (page?.type === 'static' && edit) {
      data.type = 'static';
      data.is_template = values.myCheckbox ? 1 : 0;
      data.id = routeParams.id;
      dispatch(updatePage(data)).then(() => {
        dispatch(getPages());
        navigate(`/pages`);
      });
    } else if (page?.type === 'dynamic' && edit) {
      data.type = 'dynamic';
      data.id = routeParams.id;
      dispatch(updatePage(data)).then(() => {
        dispatch(getPages());
        navigate(`/pages`);
      });
    } else if (page?.type === 'template' && edit) {
      data.type = 'template';
      data.id = routeParams.id;
      dispatch(updatePage(data)).then(() => {
        dispatch(getPages());
        navigate(`/pages`);
      });
    }
    if (stat && edit) {
      data.type = 'template';
      data.id = routeParams.id;
      dispatch(updatePage(data)).then(() => {
        dispatch(getPages());
        navigate(`/pages`);
      });
    }
  }
  function handleRemovePage() {
    dispatch(removePage(id)).then(() => {
      dispatch(getPages());
      navigate('/pages');
    });
  }
  function handleChange(event, newValue) {
    setValue2(newValue);
  }
  if (_.isEmpty(form) || !page) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-start px-24 sm:px-48">
        {edit ? (
          <Tabs
            value={value}
            onChange={handleChange}
            className="mb-3"
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            aria-label="all or pined"
          >
            <Tab label={t('DESCRIPTION')} {...a11yProps(0)} />
            <Tab label="SEO" {...a11yProps(1)} />
          </Tabs>
        ) : null}
        <CustomTabPanel value={value} index={0}>
          {stat ? (
            <>
              <SelectController
                control={control}
                name="staticPage_id"
                data={staticPages}
                errors={errors}
                label="PAGES"
                getValue={(val) => val?.id}
                getOption={(val) =>
                  val?.translations.find((trs) => trs.language_id === translationLanguageInModal)
                    ?.title
                }
              />
              <SelectController
                control={control}
                name="pageCategory_id"
                data={areas}
                errors={errors}
                label="AREAS"
                getValue={(val) => val.id}
                getOption={(val) =>
                  val.translations.find((trs) => trs.language_id === translationLanguageInModal)
                    ?.title
                }
              />
              <Controller
                name="title"
                control={control}
                defaultValue={hiddenSlug}
                render={({ field }) => (
                  <TextField
                    value={hiddenSlug}
                    onChange={hiddenSlug}
                    color="secondary"
                    focused
                    disabled
                    style={{ width: '100%', marginTop: '30px' }}
                  />
                )}
              />
            </>
          ) : (
            <>
              <InputTranslationController
                control={control}
                name="title"
                errors={errors}
                label="PAGE"
              />
              <InputController control={control} name="slug" errors={errors} />
              {!edit && (
                <Box component="label" className="flex w-full items-center pointer">
                  <Typography className="font-bold">{`${t('SELECT')} ${t(
                    'PAGETEMPLATES'
                  )}`}</Typography>
                  <Switch
                    checked={havePageTemplate}
                    onChange={() => {
                      setHavePageTemplate(!havePageTemplate);
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {page?.type === 'static' && (
            <Box component="label" className="flex w-full items-center pointer">
              <Typography className="font-bold">{`${t('MAKE')} ${t('TEMPLATE2')}`}</Typography>
              <Controller
                name="myCheckbox"
                control={control}
                defaultValue={false}
                render={({ field }) => <Switch {...field} />}
              />
            </Box>
          )}

          {havePageTemplate && (
            <SelectController
              control={control}
              name="template_id"
              data={pageTemplates}
              errors={errors}
              label="PAGETEMPLATES"
              getValue={(val) => val.id}
              getOption={(val) =>
                val.translations.find((trs) => trs.language_id === translationLanguageInModal)
                  ?.title
              }
            />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} className="w-full">
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
        </CustomTabPanel>
      </div>

      <FormButtons
        edit={edit}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemovePage}
      />
    </>
  );
};

export default PagesForm;
