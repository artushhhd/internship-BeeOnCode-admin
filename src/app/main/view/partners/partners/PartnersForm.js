import createTranslationData from '@helpers/createTranslationData';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import _ from '@lodash';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { useTranslation } from 'react-i18next';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import { selectUser } from 'app/store/userSlice';
import NewImageController from 'app/shared-components/fields/NewImageController';
import InputController from 'app/shared-components/fields/InputController';
import { selectPages } from '../../../pages/pages/store/pagesSlice';
import {
  addPartner,
  getPartners,
  getPartnerById,
  removePartner,
  updatePartner,
} from '../store/partnersSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a title'),
  link: yup.string().trim().required('You must enter a url'),
});

const PartnersForm = () => {
  const { t } = useTranslation('navigation');
  const pages = useSelector(selectPages);
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const { translationLanguages, translationLanguage } = useSelector((state) => state.i18n);
  const { item: partner } = useSelector((state) => state.PartnersApp.partnersReducer);
  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const edit = routeParams.id !== 'new';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Partners' }));
    if (!canManage) {
      navigate(`/view/partners`);
    }

    if (routeParams.id === 'new') {
      setChecked(false);
    } else {
      dispatch(getPartnerById(routeParams.id));
    }
  }, [dispatch, routeParams, navigate, canManage, userId]);

  const copyPartner = useMemo(() => {
    return { ...partner };
  }, [partner]);

  useEffect(() => {
    const def = {
      id: partner?.file_id,
      src: partner.media?.thumbnail_url,
    };
    setDefaultSelected(def);
    setSelected(def);
  }, [partner?.file_id, partner.media?.thumbnail_url]);

  useEffect(() => {
    if (partner) {
      if (edit) {
        setChecked(!!partner.status);

        partner.translations.forEach((item) => {
          copyPartner[`title${item.language_id}`] = item.title;
        });
      } else {
        translationLanguages.forEach((language) => {
          copyPartner[`title${language.id}`] = '';
        });
        copyPartner.link = '';
        setChecked(false);
      }
      reset({ ...copyPartner });
    }
  }, [partner, edit, reset, copyPartner, translationLanguages, translationLanguage, pages, t]);

  // useEffect(() => {
  //   if (edit) {
  //     const def = {
  //       id: partner?.file_id,
  //       src: partner.media?.name,
  //     };
  //     setDefaultSelected(def);
  //     setSelected(def);
  //   }
  // }, [setDefaultSelected, partner, setSelected]);

  function onSubmit(data) {
    data.icon_id = selected.id;
    data.title = createTranslationData(data, 'title');
    data.is_main = 1;
    data.is_visible = 1;
    if (routeParams.id === 'new') {
      dispatch(addPartner(data)).then(() => {
        dispatch(getPartners(searchParams.get('page') || 1));
        navigate(`/view/partners?page=${searchParams.get('page') || 1}`);
        // setChecked(false);
      });
    } else {
      data.id = routeParams.id;
      // data.icon = image;
      dispatch(updatePartner(data)).then(() => {
        // dispatch(getPartnerById(routeParams.id));
        dispatch(getPartners(searchParams.get('page') || 1));
        navigate(`/view/partners?page=${searchParams.get('page') || 1}`);
      });
    }
  }
  useEffect(() => {
    if (!edit) {
      setDefaultSelected({ id: undefined, src: undefined });
      setSelected({ id: undefined, src: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!partner && edit) {
    return <FuseLoading />;
  }

  function handleRemovePartner() {
    dispatch(removePartner(partner.id)).then(() => {
      dispatch(getPartners(searchParams.get('page') || 1));
      navigate(`/view/partners?page=${searchParams.get('page') || 1}`);
    });
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 ">
        <Box className="w-full">
          <Box className="flex flex-auto items-end">
            <NewImageController
              setDefaultSelected={setDefaultSelected}
              control={control}
              name="icon"
              required
              selected={selected}
              setSelected={setSelected}
              defaultSelected={defaultSelected}
              disableEdit={!canManage}
            />
          </Box>
        </Box>
        <InputTranslationController
          control={control}
          errors={errors}
          name="title"
          label="PARTNERS"
        />

        <InputController control={control} errors={errors} name="link" label="URL" />
      </div>

      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={_.isEmpty(form) || !isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemovePartner}
      />
    </>
  );
};

export default PartnersForm;
