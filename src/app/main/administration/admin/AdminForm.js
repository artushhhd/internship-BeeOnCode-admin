import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useTranslation } from 'react-i18next';
import FormButtons from 'app/shared-components/modals/FormButtons';
import InputController from 'app/shared-components/fields/InputController';
import SelectController from 'app/shared-components/fields/SelectController';
import NewImageController from 'app/shared-components/fields/NewImageController';
import { selectUser } from 'app/store/userSlice';
import InputPasswordController from 'app/shared-components/fields/inputPasswordController';
import Box from '@mui/system/Box';
import { setLanguages } from 'app/store/RightBarSlice';
import { getRoles, selectRoles } from '../store/rolesSlice';
import { getAdmins } from '../store/adminsSlice';
import {
  addAdmin,
  getAdmin,
  newAdmin,
  removeAdmin,
  selectRole,
  selectAdmin,
  updateAdmin,
} from '../store/adminSlice';
import { getPermissionsByPage, selectPermission } from '../store/permissionsSlice';

// /**
//  * Form Validation Schema
//  */
const schema = yup.object().shape({
  name: yup.string().trim().required('You must enter a name'),
  email: yup.string().email().required('Email address must contain @'),
  password: yup
    .string()
    .oneOf([yup.ref('password'), null])
    .min(8, 'Error'),
  role_id: yup.string().required('please Select item'),
});

const AdminForm = (props) => {
  const admin = useSelector(selectAdmin);
  const { t } = useTranslation('navigation');
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const { translationLanguage } = useSelector((state) => state.i18n);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const roles = useSelector(selectRoles);

  const selectRole1 = useSelector(selectRole);
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  const [password, setPassword] = useState(false);

  const [selected, setSelected] = useState(
    selectRole1 ? { src: selectRole1.avatar, userId: selectRole1.file_id } : {}
  );
  const [defaultSelected, setDefaultSelected] = useState({});

  useEffect(() => {
    const def = {
      id: admin?.file_id,
      src: admin?.avatar,
    };
    setDefaultSelected(def);
    setSelected(def);
  }, [setDefaultSelected, admin, setSelected]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'admins' }));
    if (!canManage) {
      navigate('/administration/admins');
    }

    if (routeParams.id === 'new') {
      dispatch(newAdmin());
    } else {
      dispatch(getAdmin(routeParams.id));
    }
  }, [dispatch, routeParams, navigate, canManage, userId]);

  useEffect(() => {
    reset({ ...admin });
  }, [admin, reset]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.file_id = selected.id;

    if (routeParams.id === 'new') {
      // data.avatar = image;
      dispatch(addAdmin(data)).then(() => {
        dispatch(getAdmins());
        navigate('/administration/admins');
      });
    } else {
      const dataForSend = {};
      dataForSend.file_id = selected.id;
      Object.keys(data).forEach((key) => {
        // eslint-disable-next-line
        if (''+admin[key] !== ''+data[key] || key === 'id') {  // '1' !== 1
          dataForSend[key] = data[key];
        }
      });
      if (admin.avatar !== data.avatar) {
        // dataForSend.avatar = image;
      }

      dispatch(updateAdmin(dataForSend)).then(() => {
        dispatch(getAdmins());
        navigate('/administration/admins');
      });
    }
  }

  function handleRemoveUser() {
    dispatch(removeAdmin(selectRole1.id)).then(() => {
      dispatch(getAdmins());
      navigate('/administration/admins');
    });
  }

  // disable language switcher
  useEffect(() => {
    dispatch(setLanguages(false));
    return () => dispatch(setLanguages(true));
  }, [dispatch]);

  if (_.isEmpty(form) || !admin) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 ">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <Box>
              <InputController control={control} errors={errors} name="name" label="NAME" />

              <InputController
                control={control}
                errors={errors}
                name="email"
                label={t('EMAIL')}
                icon="heroicons-solid:mail"
              />
            </Box>

            <NewImageController
              setDefaultSelected={setDefaultSelected}
              control={control}
              name="avatar"
              disableEdit={!canManage}
              selected={selected}
              defaultSelected={defaultSelected}
              setSelected={setSelected}
            />
          </div>
        </div>

        <SelectController
          control={control}
          name="role_id"
          errors={errors}
          label={t('ROLE')}
          data={roles}
          getOption={(item) =>
            item?.translations?.find((trs) => trs.language_id === translationLanguage)?.name
          }
        />

        {routeParams.id === 'new' ? (
          <InputPasswordController
            control={control}
            errors={errors}
            name="password"
            label={t('PASSWORD')}
          />
        ) : (
          <div className=" w-full ">
            {!password ? (
              <Button
                className="group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
                onClick={() => setPassword(true)}
              >
                <span className="ml-8 font-medium text-secondary group-hover:underline">
                  {t('CHANGEPASSWORD')}
                </span>
              </Button>
            ) : (
              <div>
                <Button
                  className="group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
                  onClick={() => setPassword(false)}
                >
                  <span className="ml-8 font-medium text-secondary group-hover:underline">
                    {t('CANCEL')}
                  </span>
                </Button>
                <InputController
                  control={control}
                  errors={errors}
                  name="password"
                  type="password"
                  label={t('PASSWORD')}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={/* _.isEmpty(dirtyFields) || */ !isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemoveUser}
      />
    </>
  );
};
export default AdminForm;
