import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import createTranslationData from '@helpers/createTranslationData';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { useTranslation } from 'react-i18next';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import { selectUser } from 'app/store/userSlice';
import { addFAQ, getFAQ, newFAQ, removeFAQ, selectFAQ, updateFAQ } from '../store/FAQSlice';
import { getFAQs } from '../store/FAQsSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  question1: yup.string().trim().required('You must enter a name'),

  answer1: yup
    .string()
    .trim()
    .test(
      'required',
      'You must enter an armenian text',
      (v) => v && JSON.stringify(v) !== JSON.stringify('<p></p>\n')
    ),
});

const FAQForm = () => {
  const { translationLanguages } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');
  const faq = useSelector(selectFAQ);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const edit = routeParams.id !== 'new';

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [editorData, setEditorData] = useState({});

  const form = watch();

  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'FAQ' }));

    if (!canManage) {
      navigate(`/view/faq`);
    }

    if (routeParams.id === 'new') {
      dispatch(newFAQ());
    } else {
      dispatch(getFAQ(routeParams.id));
    }

    setEditorData({});
  }, [dispatch, routeParams, canManage, navigate, userId]);

  const copyFaq = useMemo(() => {
    return { ...faq };
  }, [faq]);

  function onSubmit(data) {
    data.answer = createTranslationData(data, 'answer');
    data.question = createTranslationData(data, 'question');
    data.answer = editorData;
    if (routeParams.id === 'new') {
      dispatch(addFAQ(data)).then(() => {
        dispatch(getFAQs());
        navigate(`/view/faq`);
      });
    } else {
      dispatch(updateFAQ(data)).then(() => {
        dispatch(getFAQ(routeParams.id));
        dispatch(getFAQs());
        navigate(`/view/faq`);
      });
    }
  }

  useEffect(() => {
    if (faq) {
      if (edit) {
        faq?.translations.forEach((item, i) => {
          copyFaq[`question${item.language_id}`] = item.question;

          copyFaq[`answer${item.language_id}`] = item.answer
            ? JSON.parse(item.answer).htmlValue
            : '';
        });
      } else {
        translationLanguages.forEach((language) => {
          copyFaq[`question${language.id}`] = '';
          copyFaq[`answer${language.id}`] = '';
        });
      }
      reset({ ...copyFaq });
    }
  }, [faq, edit, reset, copyFaq, translationLanguages]);

  useEffect(() => {
    reset({ ...copyFaq });
  }, [copyFaq, faq, reset]);

  /**
   * Form Submit
   */

  function handleRemoveContact() {
    dispatch(removeFAQ(faq.id)).then(() => {
      dispatch(getFAQs());
      navigate('/view/faq');
    });
  }

  if (_.isEmpty(form) || !faq) {
    return <FuseLoading />;
  }
  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <InputTranslationController
          control={control}
          errors={errors}
          name="question"
          label={t('QUESTION')}
        />

        <EditorTranslationController
          control={control}
          setEditorData={setEditorData}
          name="answer"
          label="ANSWER"
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

export default FAQForm;
