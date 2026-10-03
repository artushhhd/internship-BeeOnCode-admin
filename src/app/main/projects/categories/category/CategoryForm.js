import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import createTranslationData from '@helpers/createTranslationData';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';

import {
  addCategory,
  getCategoryById,
  newCategory,
  removeCategory,
  resetCategory,
  selectCategory,
  selectLoading,
  updateCategory,
} from '../../store/categorySlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';
import { getCategories } from '../../store/categoriesSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a name'),
});

const CategoryForm = (props) => {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  const category = useSelector(selectCategory);
  const loading = useSelector(selectLoading);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);

  const edit = routeParams.id !== 'new';

  const { control, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Categories' }));
    if (!canManage) {
      navigate(`/projects/categories`);
    }
  }, [canManage, dispatch, navigate, userId]);

  useEffect(() => {
    dispatch(resetCategory());
    dispatch(getCategories());
    if (routeParams.id !== 'new') {
      dispatch(getCategoryById(routeParams.id));
    } else {
      dispatch(newCategory());
    }
  }, [dispatch, routeParams, userId]);

  const copyCategory = useMemo(() => {
    return { ...category };
  }, [category]);

  useEffect(() => {
    if (category) {
      if (edit) {
        category.translations.forEach((item, i) => {
          copyCategory[`title${item.language_id}`] = item.title;
        });
      } else {
        translationLanguages.forEach((language) => {
          copyCategory[`title${language.id}`] = '';
        });
      }
      reset({ ...copyCategory });
    }
  }, [category, edit, reset, copyCategory, translationLanguages, canManage, navigate, loading]);

  if (loading) {
    return <FuseLoading />;
  }

  /**
   * Form Submit
   */

  async function onSubmit(data) {
    data.title = createTranslationData(data, 'title');

    if (routeParams.id === 'new') {
      await dispatch(addCategory(data)).finally(() => {
        dispatch(getCategories());
        navigate(`/projects/categories`);
      });
    } else {
      data.id = routeParams.id;
      await dispatch(updateCategory(data)).finally(() => {
        dispatch(getCategories());
        navigate(`/projects/categories`);
      });
    }

    // navigate(`/projects/categories`);
  }

  return (
    <>
      <Box className="relative flex flex-col flex-auto items-center px-24">
        <InputTranslationController control={control} errors={errors} name="title" />
      </Box>

      <FormButtons
        edit={routeParams.id !== 'new'}
        onDeleteFunction={() => {
          dispatch(removeCategory(category?.id)).then(() => {
            navigate('/projects/categories');
          });
        }}
        onSubmitFunction={handleSubmit(onSubmit)}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
      />
    </>
  );
};

export default CategoryForm;
