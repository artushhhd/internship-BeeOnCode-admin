import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import FormButtons from 'app/shared-components/modals/FormButtons';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { selectUser } from 'app/store/userSlice';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import {
  addAnnouncement,
  getAnnouncement,
  newAnnouncement,
  removeAnnouncement,
  selectAnnouncement,
  updateAnnouncement,
} from '../store/announcementSlice';
import { getAnnouncements } from '../store/announcementsSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

/**
 * Form Validation Schema
 */

const AnnouncementForm = (props) => {
  const { translationLanguages } = useSelector((state) => state.i18n);
  const announcement = useSelector(selectAnnouncement);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const { t } = useTranslation('navigation');
  const edit = routeParams.id !== 'new';

  const schema = yup
    .object()
    .shape({
      text1: yup.string().test('required', 'You must enter an armenian text', (v) => {
        const regex = /(<([^>]+)>)/gi;
        const plainText = v.replaceAll(regex, '').replaceAll('&nbsp;', '').trim();
        return !!plainText;
      }),
      is_permanent: yup.boolean().oneOf([true, false], 'Checkbox is required'),
    })
    .test((v) => {
      return true;
    });

  const { control, watch, reset, handleSubmit, setValue, formState, getValues } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [editorData, setEditorData] = useState({});

  const form = watch();
  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Announcement' }));
    if (!canManage) {
      navigate(`/view/announcement`);
    }

    if (routeParams.id === 'new') {
      dispatch(newAnnouncement());
    } else {
      dispatch(getAnnouncement(routeParams.id));
    }

    setEditorData({});
  }, [dispatch, routeParams, navigate, canManage, userId]);

  const copyAnnouncement = useMemo(() => {
    return { ...announcement };
  }, [announcement]);

  function onSubmit(data) {
    if (routeParams.id === 'new') {
      data.text = editorData;
      data.is_permanent = data.is_permanent ? 1 : 0;
      dispatch(addAnnouncement(data)).then(() => {
        dispatch(getAnnouncements());
        navigate(`/view/announcement`);
      });
    } else {
      data.text = editorData;
      data.is_permanent = data.is_permanent ? 1 : 0;

      dispatch(updateAnnouncement(data)).then(() => {
        dispatch(getAnnouncement(routeParams.id));
        dispatch(getAnnouncements());
        navigate(`/view/announcement`);
      });
    }
  }

  useEffect(() => {
    if (announcement) {
      if (edit) {
        copyAnnouncement.is_permanent = !!announcement.is_permanent;
        announcement?.translations.forEach((item, i) => {
          copyAnnouncement[`text${item.language_id}`] = item.text
            ? JSON.parse(item.text).htmlValue
            : '';
        });
      } else {
        translationLanguages.forEach((language) => {
          copyAnnouncement[`text${language.id}`] = '';
        });
      }
    }
    reset({ ...copyAnnouncement });
  }, [announcement, edit, reset, copyAnnouncement, translationLanguages]);

  useEffect(() => {
    reset({ ...copyAnnouncement });
  }, [copyAnnouncement, announcement, reset]);

  /**
   * Form Submit
   */

  function handleRemoveContact() {
    dispatch(removeAnnouncement(announcement.id)).then(() => {
      dispatch(getAnnouncements());
      navigate('/view/announcement');
    });
  }

  if (_.isEmpty(form) || !announcement) {
    return <FuseLoading />;
  }
  return (
    <>
      <div className="relative flex flex-col flex-auto items-start content-start px-24 sm:px-48">
        <EditorTranslationController
          control={control}
          setEditorData={setEditorData}
          name="text"
          label="ANNOUNCEMENT"
        />
        <Controller
          name="is_permanent"
          control={control}
          render={({ field }) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    defaultValue={edit ? copyAnnouncement.is_permanent : false}
                    defaultChecked={edit ? copyAnnouncement.is_permanent : false}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label={t('PERMANENT')}
              />
            );
          }}
        />
      </div>
      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={_.isEmpty(dirtyFields) || !isValid}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemoveContact}
      />
    </>
  );
};

export default AnnouncementForm;
