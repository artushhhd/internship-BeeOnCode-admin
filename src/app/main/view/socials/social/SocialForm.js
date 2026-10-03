import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import FormButtons from 'app/shared-components/modals/FormButtons';
import InputController from 'app/shared-components/fields/InputController';
import { selectUser } from 'app/store/userSlice';
import { setLanguages } from 'app/store/RightBarSlice';
import { getSocial, selectSocial, updateSocial } from '../store/socialSlice';
import { getSocials } from '../store/socialsSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  url: yup.string().trim().required('You must enter the url'),
});

const SocialForm = (props) => {
  const social = useSelector(selectSocial);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Socials' }));
    if (!canManage) {
      navigate(`/view/socials`);
    }

    if (routeParams.id !== 'new') {
      dispatch(getSocial(routeParams.id));
    }
  }, [dispatch, routeParams, canManage, navigate, userId]);

  useEffect(() => {
    reset({ ...social });
  }, [social, reset]);

  // disable language switcher
  useEffect(() => {
    dispatch(setLanguages(false));
    return () => dispatch(setLanguages(true));
  }, [dispatch]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (routeParams.id !== 'new') {
      dispatch(updateSocial(data)).then(() => {
        dispatch(getSocial(routeParams.id));
        dispatch(getSocials());
      });
      navigate(`/view/socials`);
    }
  }

  if (_.isEmpty(form) || !social) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 ">
        <InputController
          control={control}
          errors={errors}
          name="url"
          label="URL"
          icon={`feather:${social.icon}`}
        />
      </div>

      <FormButtons
        edit={false}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default SocialForm;
