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
  addRegion,
  getRegionById,
  newRegion,
  removeRegion,
  resetRegion,
  selectRegion,
  selectLoading,
  updateRegion,
} from '../../store/regionSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a name'),
});

const RegionForm = (props) => {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  const region = useSelector(selectRegion);
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
    dispatch(getPermissionsByPage({ userId, pageName: 'Regions' }));
    if (!canManage) {
      navigate(`/projects/regions`);
    }
  }, [canManage, dispatch, navigate, userId]);

  useEffect(() => {
    dispatch(resetRegion());
    if (routeParams.id !== 'new') {
      dispatch(getRegionById(routeParams.id));
    } else {
      dispatch(newRegion());
    }
  }, [dispatch, routeParams, userId]);

  const copyRegion = useMemo(() => {
    return { ...region };
  }, [region]);

  useEffect(() => {
    if (region) {
      if (edit) {
        region.translations.forEach((item, i) => {
          copyRegion[`title${item.language_id}`] = item.title;
        });
      } else {
        translationLanguages.forEach((language) => {
          copyRegion[`title${language.id}`] = '';
        });
      }
      reset({ ...copyRegion });
    }
  }, [region, edit, reset, copyRegion, translationLanguages, canManage, navigate, loading]);

  if (loading) {
    return <FuseLoading />;
  }

  /**
   * Form Submit
   */

  async function onSubmit(data) {
    data.title = createTranslationData(data, 'title');

    if (routeParams.id === 'new') {
      await dispatch(addRegion(data));
    } else {
      data.id = routeParams.id;
      await dispatch(updateRegion(data));
    }

    navigate(`/projects/regions`);
  }

  return (
    <>
      <Box className="relative flex flex-col flex-auto items-center px-24">
        <InputTranslationController control={control} errors={errors} name="title" />
      </Box>

      <FormButtons
        edit={routeParams.id !== 'new'}
        onDeleteFunction={() => {
          dispatch(removeRegion(region?.id)).then(() => {
            navigate('/projects/regions');
          });
        }}
        onSubmitFunction={handleSubmit(onSubmit)}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
      />
    </>
  );
};

export default RegionForm;
