import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import FormButtons from 'app/shared-components/modals/FormButtons';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import createTranslationData from '@helpers/createTranslationData';
import { selectUser } from 'app/store/userSlice';
import { addRole, getRole, newRole, removeRole, selectRole, updateRole } from '../store/roleSlice';
import { getRoles } from '../store/rolesSlice';
import { getPermissionsByPage, selectPermission } from '../store/permissionsSlice';

// /**
//  * Form Validation Schema
//  */
const schema = yup.object().shape({
  name1: yup.string().trim().min(3, 'min 3 letter'),
});

const RoleForm = (props) => {
  const [image, setImage] = useState(null);
  const role = useSelector(selectRole);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const edit = routeParams.id !== 'new';
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { translationLanguages } = useSelector((state) => state.i18n);

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Roles' }));
    if (!canManage) {
      navigate('/administration/roles');
    }

    if (routeParams.id === 'new') {
      dispatch(newRole());
      setImage(undefined);
    } else {
      dispatch(getRole(routeParams.id));
    }
  }, [dispatch, routeParams, canManage, navigate, userId]);

  const copyRole = useMemo(() => {
    return { ...role };
  }, [role]);

  if (role && edit) {
    copyRole.translations?.forEach((item) => {
      copyRole[`name${item.language_id}`] = item.name;
    });
  } else if (role && !edit) {
    translationLanguages.forEach((val) => {
      copyRole[`name${val.id}`] = '';
    });
  }

  useEffect(() => {
    if (role) {
      if (edit) {
        setImage(role.avatar);
      } else {
        setImage(undefined);
      }
      reset({ ...copyRole });
    }
  }, [role, edit, reset, copyRole]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.name = createTranslationData(data, 'name');

    if (routeParams.id === 'new') {
      data.avatar = image;
      dispatch(addRole(data)).then(() => {
        dispatch(getRoles());
        navigate('/administration/roles');
      });
    } else {
      data.avatar = image;

      dispatch(updateRole(data)).then(() => {
        dispatch(getRoles());
        navigate('/administration/roles');
      });
    }
  }

  function handleRemoveRole() {
    dispatch(removeRole(role.id)).then(() => {
      dispatch(getRoles());
      navigate('/administration/roles');
    });
  }

  if (_.isEmpty(form) || !role) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 ">
        <InputTranslationController control={control} errors={errors} name="name" label="NAME" />
      </div>

      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemoveRole}
      />
    </>
  );
};
export default RoleForm;
