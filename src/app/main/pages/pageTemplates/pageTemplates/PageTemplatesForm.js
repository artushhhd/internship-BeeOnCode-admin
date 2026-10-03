import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import { useEffect, useMemo } from 'react';
import createTranslationData from '@helpers/createTranslationData';
import FuseLoading from '@fuse/core/FuseLoading';
import { yupResolver } from '@hookform/resolvers/yup';
import FormButtons from 'app/shared-components/modals/FormButtons';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import { selectUser } from 'app/store/userSlice';
import { getPageTemplates } from '../store/pageTemplatesSlice';
import {
  addPageTemplate,
  removePageTemplate,
  selectPageTemplate,
  updatePageTemplate,
} from '../store/pageTemplateSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

const PageTemplatesForm = (props) => {
  const { translationLanguages } = useSelector((state) => state.i18n);
  const pageTemplate = useSelector(selectPageTemplate);
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);

  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Form Validation Schema
   */

  const schema = yup.object().shape({
    title1: yup.string().trim().required('You must enter a armenian title'),
  });

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const edit = routeParams.id !== 'new';

  const copyPageTemplate = useMemo(() => {
    return { ...pageTemplate };
  }, [pageTemplate]);

  if (pageTemplate && edit) {
    copyPageTemplate.translations?.forEach((item) => {
      copyPageTemplate[`title${item.language_id}`] = item.title;
    });
  } else if (pageTemplate && !edit) {
    translationLanguages.forEach((val) => {
      copyPageTemplate[`title${val.id}`] = '';
    });
  }

  useEffect(
    () => {
      dispatch(getPermissionsByPage({ userId, pageName: 'PageTemplates' }));
      if (!canManage) {
        navigate(`/pageTemplate/${routeParams.id}`);
      }
    },
    // eslint-disable-next-line
    []);

  useEffect(() => {
    reset({ ...copyPageTemplate });
  }, [copyPageTemplate, pageTemplate, reset]);

  const { isValid, dirtyFields, errors } = formState;

  /**
   * Form Submit
   */

  function onSubmit(data) {
    data.title = createTranslationData(data, 'title');

    if (routeParams.id === 'new') {
      dispatch(addPageTemplate(data)).then(() => {
        dispatch(getPageTemplates());
        navigate('/pageTemplate');
      });
    } else {
      data.id = routeParams.id;
      dispatch(updatePageTemplate(data)).then(() => {
        dispatch(getPageTemplates());
        navigate(`/pageTemplate/${routeParams.id}`);
      });
    }
  }

  function handleRemovePageTemplate() {
    const { id } = routeParams;
    dispatch(removePageTemplate(id)).then(() => {
      dispatch(getPageTemplates());
      navigate('/pageTemplate');
    });
  }

  // if (_.isEmpty(form)) {
  //   return <FuseLoading />;
  // }

  if (!pageTemplate) {
    return <FuseLoading />;
  }

  return (
    <>
      <Box
        className="relative w-full h-120 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default',
        }}
      />

      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <InputTranslationController control={control} name="title" errors={errors} />
      </div>

      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemovePageTemplate}
      />
    </>
  );
};

export default PageTemplatesForm;
