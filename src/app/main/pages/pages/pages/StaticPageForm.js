import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import InputController from 'app/shared-components/fields/InputController';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import createTranslationData from '@helpers/createTranslationData';
import DevMode from 'app/shared-components/DevMode';
import { getPages, selectPages } from '../store/pagesSlice';
import { addPage, selectPage } from '../store/pageSlice';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};
export default function StaticPageForm(props) {
  const { role, id } = useParams();
  const edit = role === 'edit';
  const pages = useSelector(selectPages);
  const page = useSelector(selectPage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /**
   * Form Validation Schema
   */
  const schema = yup.object().shape({
    slug: yup
      .string()
      .matches(/^[a-z0-9-_]+$/, 'Only alphabets are allowed for this field ')
      .test('unique_slug_validation', 'that slug already used', (val) => {
        return pages.every((ls) => ls.slug !== val || +id === +ls.id);
      })
      .trim()
      .required(),
    title1: yup.string().trim().required('You must enter a armenian title'),
  });
  const { control, watch, reset, handleSubmit, formState, getValues, setValue } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
  });
  const values = getValues();
  const { isValid, dirtyFields, errors } = formState;

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.title = createTranslationData(data, 'title');
    data.type = 'static';
    if (!edit) {
      dispatch(addPage(data)).then(() => {
        dispatch(getPages());
        navigate('/pages');
      });
    }
  }
  function handleRemovePage() {}

  return (
    <>
      <Box
        className="relative w-full h-120 px-32 sm:px-48"
        sx={{
          backgroundColor: 'background.default',
        }}
      />
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <InputTranslationController control={control} name="title" errors={errors} label="page" />

        <InputController control={control} name="slug" errors={errors} />
      </div>
      <DevMode>
        <FormButtons
          edit={edit}
          saveDisable={_.isEmpty(dirtyFields) || !isValid}
          onSubmitFunction={handleSubmit(onSubmit)}
          onDeleteFunction={handleRemovePage}
        />
      </DevMode>
    </>
  );
}
