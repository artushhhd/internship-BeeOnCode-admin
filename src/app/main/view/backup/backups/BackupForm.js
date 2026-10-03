import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { useForm } from 'react-hook-form';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { useTranslation } from 'react-i18next';
import { selectUser } from 'app/store/userSlice';
import InputDateController from 'app/shared-components/fields/InputDateController';
import InputPasswordController from 'app/shared-components/fields/inputPasswordController';
import InputController from 'app/shared-components/fields/InputController';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';
import { backupSave, getBackupSettings } from '../store/backupSlice';

/**
 * Form Validation Schema
 */

const BackupForm = (props) => {
  const { t } = useTranslation('navigation');
  const [searchParams] = useSearchParams();
  const idQuery = searchParams.get('id');

  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const { translationLanguages, translationLanguage } = useSelector((state) => state.i18n);
  const { backupSettings } = useSelector((state) => state.BackupApp.backupReducer);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const edit = routeParams.id !== 'new';

  // eslint-disable-next-line no-nested-ternary

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    // resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    dispatch(getBackupSettings());
    dispatch(getPermissionsByPage({ userId, pageName: 'BACKUPES' }));
    if (!canManage) {
      navigate(`/view/backup`);
    }
  }, [dispatch, routeParams, navigate, canManage, userId]);

  const copyBackup = useMemo(() => {
    return { ...backupSettings };
  }, [backupSettings]);

  useEffect(() => {
    reset({ ...copyBackup });
  }, [backupSettings, copyBackup, reset]);

  useEffect(() => {
    reset({ ...backupSettings });
  }, [backupSettings, reset]);

  /**
   * Form Submit
   */

  function onSubmit(data) {
    dispatch(backupSave(data));
    navigate(`/view/backup`);
  }

  if (!backupSettings && edit) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 ">
        <InputController control={control} errors={errors} name="ip" label="IP" />
        <InputController control={control} errors={errors} name="ftp_username" label="USER" />
        <InputPasswordController
          control={control}
          errors={errors}
          name="ftp_password"
          label={t('PASSWORD')}
        />
        <InputController
          type="number"
          control={control}
          errors={errors}
          name="ftp_port"
          label="PORT"
        />
        <InputDateController control={control} errors={errors} name="time1" label="DATE" />
        <InputDateController control={control} errors={errors} name="time2" label="DATE2" />
      </div>

      <FormButtons
        edit={routeParams.id !== 'new'}
        // saveDisable={
        //   !edit &&
        //   (loading ||
        //     (_.isEmpty(dirtyFields) &&
        //       JSON.stringify(selected) === JSON.stringify(defaultSelected)) ||
        //     !isValid)
        // }
        onSubmitFunction={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default BackupForm;
