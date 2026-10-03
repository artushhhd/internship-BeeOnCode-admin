import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import FormButtons from 'app/shared-components/modals/FormButtons';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import { selectUser } from 'app/store/userSlice';
import NewImageController from 'app/shared-components/fields/NewImageController';
import FormHelperText from '@mui/material/FormHelperText';
import {
  addService,
  editService,
  getService,
  newService,
  removeService,
  selectService,
} from '../store/serviceSlice';
import { getServices } from '../store/servicesSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

const MAIN_LANGUAGE_ID = 1;

const stripHtml = (value) => {
  if (!value) {
    return '';
  }
  return value
    .replaceAll(/(<([^>]+)>)/gi, '')
    .replaceAll('&nbsp;', ' ')
    .trim();
};

const schema = yup.object().shape({
  [`title${MAIN_LANGUAGE_ID}`]: yup.string().trim().required('You must enter a name'),
  [`long_description${MAIN_LANGUAGE_ID}`]: yup
    .string()
    .test('required', 'You must enter a description', (value) => !!stripHtml(value)),
});

const createTitleData = (data, languages) =>
  languages.reduce((acc, { id }) => {
    const title = data[`title${id}`];
    return title === undefined ? acc : { ...acc, [id]: title };
  }, {});

const createDescriptionData = (data, languages) =>
  languages.reduce((acc, { id }) => {
    const html = data[`long_description${id}`];
    return html === undefined ? acc : { ...acc, [id]: { htmlValue: html } };
  }, {});

const ServiceForm = () => {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const service = useSelector(selectService);
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

  const { errors, dirtyFields } = formState;
  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});
  const loadedId = useRef(null);

  const form = watch();

  const mainLanguage = translationLanguages.find((language) => language.id === MAIN_LANGUAGE_ID);
  const isImageSelected = !!selected?.id;
  const isMainLanguageFilled =
    !!stripHtml(form[`title${MAIN_LANGUAGE_ID}`]) &&
    !!stripHtml(form[`long_description${MAIN_LANGUAGE_ID}`]);
  const isMainLanguageShown = translationLanguageInModal === MAIN_LANGUAGE_ID;
  const isDirty = !_.isEmpty(dirtyFields) || selected?.id !== defaultSelected?.id;

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Services' }));

    if (!canManage) {
      navigate(`/view/services`);
    }

    if (edit) {
      dispatch(getService(routeParams.id));
    } else {
      dispatch(newService());
    }
  }, [dispatch, routeParams, canManage, navigate, userId, edit]);

  useEffect(() => {
    const serviceId = edit ? service?.id : 'new';

    if (!service || loadedId.current === serviceId) {
      return;
    }

    loadedId.current = serviceId;

    const formValues = { ...service };

    if (edit) {
      service.translations.forEach((item) => {
        formValues[`title${item.language_id}`] = item.title;
        formValues[`long_description${item.language_id}`] = item.long_description
          ? JSON.parse(item.long_description).htmlValue || ''
          : '';
      });
      setSelected({ id: service.icon_id, src: service.icon?.name });
      setDefaultSelected({ id: service.icon_id, src: service.icon?.name });
    } else {
      setSelected({});
      setDefaultSelected({});
    }

    reset(formValues);
  }, [service, edit, reset]);

  function onSubmit(data) {
    data.title = createTitleData(data, translationLanguages);
    data.long_description = createDescriptionData(data, translationLanguages);
    data.icon_id = selected?.id;

    if (edit) {
      data.id = service.id;
      dispatch(editService(data)).then(() => {
        dispatch(getService(routeParams.id));
        dispatch(getServices());
        navigate(`/view/services`);
      });
    } else {
      dispatch(addService(data)).then(() => {
        dispatch(getServices());
        navigate(`/view/services`);
      });
    }
  }

  function handleRemoveService() {
    dispatch(removeService(service.id)).then(() => {
      dispatch(getServices());
      navigate('/view/services');
    });
  }

  if (_.isEmpty(form) || !service) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
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

        {!isImageSelected && (
          <FormHelperText error className="mb-16">
            You must select an image
          </FormHelperText>
        )}

        {!isMainLanguageFilled && !isMainLanguageShown && (
          <FormHelperText error className="mb-16">
            {`You must enter a name and a description for "${mainLanguage?.slug}"`}
          </FormHelperText>
        )}

        <InputTranslationController control={control} errors={errors} name="title" label="NAME" />

        <EditorTranslationController
          control={control}
          name="long_description"
          label="DESCRIPTION"
        />
      </div>
      <FormButtons
        edit={edit}
        saveDisable={!isImageSelected || !isMainLanguageFilled || !isDirty}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemoveService}
      />
    </>
  );
};

export default ServiceForm;
