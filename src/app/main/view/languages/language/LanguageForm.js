import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FormButtons from 'app/shared-components/modals/FormButtons';
import InputController from 'app/shared-components/fields/InputController';
import { selectUser } from 'app/store/userSlice';
import NewImageController from 'app/shared-components/fields/NewImageController';
import { setLanguages } from 'app/store/RightBarSlice';
import {
  addLanguage,
  getLanguage,
  newLanguage,
  removeLanguage,
  selectLanguage,
  updateLanguage,
} from '../store/languageSlice';
import { getLanguages } from '../store/languagesSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().trim().required('You must enter a name'),
  // file: yup
  //   .object()
  //   .test((img) => !!img.id)
  //   .required('You must select a gallery'),
  display_name: yup.string().trim().required('You must enter a display_name'),
  slug: yup
    .string()
    .matches(/^[a-z0-9-_]+$/, 'Only alphabets are allowed for this field ')
    .trim(),
});

const LanguageForm = (props) => {
  const language = useSelector(selectLanguage);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);

  const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  const [selected, setSelected] = useState({});

  const [defaultSelected, setDefaultSelected] = useState({});

  useEffect(() => {
    setValue('file', selected);
    dirtyFields.file = selected.id !== defaultSelected?.id;
  }, [selected, defaultSelected, setValue, dirtyFields]);

  useEffect(() => {
    const def = {
      id: language?.file_id,
      src: language?.flag,
    };
    setDefaultSelected(def);
    setSelected(def);
  }, [setDefaultSelected, language, setSelected]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Languages' }));
    if (!canManage) {
      navigate(`/view/languages`);
    }
    if (routeParams.id === 'new') {
      dispatch(newLanguage());
    } else {
      dispatch(getLanguage(routeParams.id));
    }
  }, [dispatch, routeParams.id, navigate, canManage, userId]);

  useEffect(() => {
    reset({ ...language });
  }, [language, reset]);

  // disable language switcher
  useEffect(() => {
    dispatch(setLanguages(false));
    return () => dispatch(setLanguages(true));
  }, [dispatch]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (routeParams.id === 'new') {
      dispatch(addLanguage(data)).then(() => {
        dispatch(getLanguages());
        navigate(`/view/languages`);
      });
    } else {
      dispatch(updateLanguage(data)).then(() => {
        dispatch(getLanguage(routeParams.id));
        dispatch(getLanguages());
        navigate(`/view/languages`);
      });
    }
  }

  if (_.isEmpty(form) || !language) {
    return <FuseLoading />;
  }
  return (
    <>
      <Box className="relative flex flex-col flex-auto items-center px-24 ">
        <InputController control={control} errors={errors} name="name" label="NAME" />
        <Box className="w-full flex items-center gap-2">
          <NewImageController
            setDefaultSelected={setDefaultSelected}
            control={control}
            name="flag"
            required
            selected={selected}
            setSelected={setSelected}
            defaultSelected={defaultSelected}
            disableEdit={!canManage}
          />
          <Box>
            <InputController
              control={control}
              errors={errors}
              name="display_name"
              label="DISPLAY_NAME"
            />
            <InputController control={control} errors={errors} name="slug" label="SLUG" />
          </Box>
        </Box>
      </Box>

      <FormButtons
        edit={routeParams.id !== 'new' && language.order !== 1}
        saveDisable={_.isEmpty(dirtyFields) || !isValid || !selected.id}
        onSubmitFunction={handleSubmit(onSubmit)}
        data={language}
        onDeleteFunction={() => {
          dispatch(removeLanguage(language.id)).then(() => {
            dispatch(getLanguages());
            navigate('/view/languages');
          });
        }}
      />
    </>
  );
};

export default LanguageForm;
