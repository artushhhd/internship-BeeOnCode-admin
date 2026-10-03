import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import _ from '@lodash';
import createTranslationData from '@helpers/createTranslationData';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { selectUser } from 'app/store/userSlice';
import NewImageController from 'app/shared-components/fields/NewImageController';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import InputColorController from 'app/shared-components/fields/inputColorController';
import {
  addStatus,
  getStatusById,
  newStatus,
  removeStatus,
  resetStatus,
  selectStatus,
  updateStatus,
  selectLoading,
} from '../../store/statusSlice';
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

const StatusForm = (props) => {
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');
  const status = useSelector(selectStatus);
  const routeParams = useParams();
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});

  const edit = routeParams.id !== 'new';

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Status' }));
    if (!canManage) {
      navigate(`/projects/status`);
    }
  }, [dispatch, userId, canManage, navigate]);

  useEffect(() => {
    dispatch(resetStatus());
    if (routeParams.id !== 'new') {
      dispatch(getStatusById(routeParams.id));
    } else {
      dispatch(newStatus());
    }
  }, [dispatch, routeParams.id, userId]);

  const copyStatus = useMemo(() => {
    return { ...status };
  }, [status]);

  useEffect(() => {
    const def = {
      id: status?.file_id,
      src: status?.media?.thumbnail_url,
    };
    if (edit) {
      setDefaultSelected(def);
      setSelected(def);
    }
  }, [setDefaultSelected, status, setSelected, edit]);

  useEffect(() => {
    if (status) {
      if (edit) {
        status.translations.forEach((item, i) => {
          copyStatus[`title${item.language_id}`] = item.title;
          setDefaultSelected(status?.icon);
          setSelected(status?.icon);
        });
      }

      reset({ ...copyStatus });
    }
  }, [status, edit, reset, copyStatus, translationLanguages, canManage, navigate]);

  if (loading) {
    return <FuseLoading />;
  }

  /**
   * Form Submit
   */
  async function onSubmit(data) {
    data.title = createTranslationData(data, 'title');
    data.icon_id = selected?.id;
    data.is_terminate = data.is_terminate ? 1 : 0;
    data.is_completed = data.is_completed ? 1 : 0;
    if (routeParams?.id === 'new') {
      await dispatch(addStatus(data));
    } else {
      data.id = routeParams?.id;
      await dispatch(updateStatus(data));
    }

    navigate(`/projects/status`);
  }

  if (!status && edit) {
    return <FuseLoading />;
  }

  return (
    <>
      <Box className="relative flex flex-col flex-auto items-center px-24 ">
        <InputTranslationController control={control} errors={errors} name="title" />
        <Box className="w-full ">
          <InputColorController
            errors={errors}
            control={control}
            name="color"
            label="COLORS"
            palette={2}
          />
        </Box>
        <Box className="mt-[10px] ml-[10px]">
          <Controller
            name="is_terminate"
            control={control}
            render={({ field }) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      defaultValue={edit ? copyStatus?.is_terminate : false}
                      defaultChecked={edit ? copyStatus?.is_terminate : false}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label={t('terminated')}
                />
              );
            }}
          />
          <Controller
            name="is_completed"
            control={control}
            render={({ field }) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      defaultValue={edit ? copyStatus?.is_completed : false}
                      defaultChecked={edit ? copyStatus?.is_completed : false}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label={t('complited')}
                />
              );
            }}
          />
        </Box>
        <Box className="w-full">
          <Box className="flex flex-auto items-end">
            <NewImageController
              setDefaultSelected={setDefaultSelected}
              control={control}
              name="icon_id"
              selected={selected}
              setSelected={setSelected}
              defaultSelected={defaultSelected}
              disableEdit={!canManage}
            />
          </Box>
        </Box>
      </Box>

      <FormButtons
        edit={routeParams.id !== 'new'}
        onDeleteFunction={() => {
          dispatch(removeStatus(status.id)).then(() => {
            navigate('/projects/status');
          });
        }}
        onSubmitFunction={handleSubmit(onSubmit)}
        saveDisable={_.isEmpty(form) || !isValid}
      />
    </>
  );
};

export default StatusForm;
