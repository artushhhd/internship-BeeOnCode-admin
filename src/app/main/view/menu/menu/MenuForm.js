import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import createTranslationData from '@helpers/createTranslationData';
import { Autocomplete, Switch, Typography } from '@mui/material';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useTranslation } from 'react-i18next';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import InputController from 'app/shared-components/fields/InputController';
import SwitchController from 'app/shared-components/fields/SwitchController';
import DevMode from 'app/shared-components/DevMode';
import { selectUser } from 'app/store/userSlice';
import NewImageController from 'app/shared-components/fields/NewImageController';
import { getPages, selectPages } from '../../../pages/pages/store/pagesSlice';
import { addMenu, getMenu, getMenuById, removeMenu, updateMenu } from '../store/menuSlice';
import BreadCrumbsComponent from '../BreadCrumbsComponent';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

/**
 * Form Validation Schema
 */

const MenuForm = (props) => {
  const { t } = useTranslation('navigation');
  const [searchParams] = useSearchParams();
  const idQuery = searchParams.get('id');
  const pages = useSelector(selectPages);
  const [newPageChecked, setNewPageChecked] = useState(false);
  const [checked, setChecked] = useState(false);

  const schema = yup.object().shape(
    // eslint-disable-next-line no-nested-ternary
    checked
      ? {
          link: yup.string().trim().required(),
        }
      : newPageChecked
      ? {
          name1: yup.string().trim().min(3, 'You must enter a name, min 3 symvol'),
          page_title1: yup.string().trim().required(),
          page_slug: yup.string().trim().required(),
        }
      : {
          name1: yup.string().trim().min(3, 'You must enter a name, min 3 symvol'),
          page: yup.object().shape({
            id: yup.number().required(),
          }),
        }
  );

  const { translationLanguages, translationLanguage } = useSelector((state) => state.i18n);

  const { item: menu, loading } = useSelector((state) => state.menuApp.menuReducer);

  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);

  const edit = routeParams.id !== 'new';

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const form = watch();

  const [defaultValue, setDefaultValue] = useState(t('PAGES'));

  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    const def = {
      id: menu?.file_id,
      src: menu?.media?.thumbnail_url,
    };
    setDefaultSelected(def);
    setSelected(def);
  }, [setDefaultSelected, menu, setSelected]);

  useEffect(() => {
    dispatch(getPages());
  }, [dispatch]);

  useEffect(() => {
    if (idQuery) {
      dispatch(getMenuById(idQuery));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idQuery]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Menu' }));
    if (!canManage) {
      navigate(`/view/menu`);
    }

    if (routeParams.id === 'new') {
      // setIcon(null);
      setChecked(false);
    } else {
      dispatch(getMenuById(routeParams.id));
    }
  }, [dispatch, routeParams, searchParams, canManage, navigate, userId]);

  const copyMenu = useMemo(() => {
    return { ...menu };
  }, [menu]);

  useEffect(() => {
    if (menu) {
      if (edit) {
        setChecked(!!menu.link);
        if (pages?.length) {
          const page = pages.find((p) => p.id === menu.page_id) || null;
          copyMenu.page = page;
          if (page) {
            setDefaultValue(
              `${page.translations.find((tr) => tr.language_id === translationLanguage).title} (${
                page.slug
              })`
            );
          }
        }

        // if (menu.icon) {
        //   setIcon(`${FILE_API_URL}/${menu.icon}`);
        // }

        menu.translations.forEach((item, i) => {
          copyMenu[`name${item.language_id}`] = item.name;
        });
      } else {
        translationLanguages.forEach((language) => {
          copyMenu[`name${language.id}`] = '';
        });
        setSelected(0);
        copyMenu.pageId = 0;
        copyMenu.link = '';
        setDefaultValue(t('PAGES'));
        // setIcon(null);
        setChecked(false);
      }
      reset({ ...copyMenu });
    }
  }, [menu, edit, reset, copyMenu, translationLanguages, pages, translationLanguage, t]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.file_id = selected.id;
    data.name = createTranslationData(data, 'name');
    data.checked = checked;
    data.pageId = data.page?.id || data.page_id;
    data.newPageChecked = newPageChecked;
    if (newPageChecked) {
      data.page_title = createTranslationData(data, 'page_title');
    }
    // data.icon = icon;

    if (routeParams.id === 'new') {
      if (idQuery) {
        data.parent_id = idQuery;
      }

      dispatch(addMenu(data)).then(() => {
        navigate(`/view/menu?action=added`);
        dispatch(getMenu());
        // setIcon(null);
        setChecked(false);
      });
    } else {
      data.id = routeParams.id;
      dispatch(updateMenu(data)).then(() => {
        dispatch(getMenuById(routeParams.id));
        dispatch(getMenu());
        navigate(`/view/menu?action=edited`);
      });
    }
  }

  const arr = [];
  const getParents = (obj) => {
    if (obj.parent) {
      arr.unshift(obj.parent);
      getParents(obj.parent);
    }
    return arr;
  };

  const [bc, setBC] = useState([]);
  useEffect(() => {
    if (menu.id) {
      setBC(getParents(menu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  if (!menu && edit) {
    return <FuseLoading />;
  }

  function handleRemoveContact() {
    dispatch(removeMenu(menu.id)).then(() => {
      dispatch(getMenu());
      navigate('/view/menu');
    });
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 ">
        <Box className="w-full flex justify-between">
          <NewImageController
            setDefaultSelected={setDefaultSelected}
            control={control}
            name="avatar"
            disableEdit={!canManage}
            selected={selected}
            defaultSelected={defaultSelected}
            setSelected={setSelected}
          />
          {idQuery && (
            <Box className="text-left mt-20">
              <BreadCrumbsComponent data={bc} object={menu} />
              <DevMode>
                <div>{`Parent ID: ${menu.parent_id} `}</div>
              </DevMode>
            </Box>
          )}
          {edit && (
            <Box className="text-left mt-20">
              <BreadCrumbsComponent data={bc} object={menu} />
              <DevMode>
                <div>{`Parent ID: ${menu.parent_id} `}</div>
              </DevMode>
            </Box>
          )}
        </Box>

        <InputTranslationController control={control} name="name" errors={errors} />

        <div className="w-full flex flex-col">
          <SwitchController
            checked={checked}
            setChecked={setChecked}
            labels={{ first: 'INTERNAL_PAGES', second: 'EXTERNAL_PAGES' }}
          >
            {!checked && pages?.length > 0 && (
              <>
                <Controller
                  name="page"
                  control={control}
                  render={({ field: { onChange } }) => {
                    return (
                      <Autocomplete
                        className="mt-20 w-full"
                        options={pages}
                        disabled={newPageChecked}
                        getOptionLabel={(option) => {
                          return `${
                            option.translations?.find(
                              (tr) => tr.language_id === translationLanguage
                            )?.title
                          } (${option.slug})`;
                        }}
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

                {!checked && (
                  <Box className="flex mt-8">
                    <Typography>
                      {t('ADD')} {t('NEW')} {t('PAGE')}
                    </Typography>
                    <Switch
                      checked={newPageChecked}
                      onChange={() => setNewPageChecked(!newPageChecked)}
                    />
                  </Box>
                )}

                {newPageChecked && !checked && (
                  <InputTranslationController
                    control={control}
                    errors={errors}
                    name="page_title"
                    label="NAME"
                  />
                )}
                {newPageChecked && !checked && (
                  <InputController
                    control={control}
                    errors={errors}
                    name="page_slug"
                    label="SLUG"
                  />
                )}
              </>
            )}

            {checked && (
              <InputController control={control} errors={errors} name="link" label="LINK" />
            )}
          </SwitchController>
        </div>
      </div>

      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={
          !edit &&
          (loading ||
            (_.isEmpty(dirtyFields) &&
              JSON.stringify(selected) === JSON.stringify(defaultSelected)) ||
            !isValid)
        }
        onDeleteFunction={handleRemoveContact}
        onSubmitFunction={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default MenuForm;
