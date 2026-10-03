import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import createTranslationData from '@helpers/createTranslationData';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { selectUser } from 'app/store/userSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import NewImageController from 'app/shared-components/fields/NewImageController';
import InputController from 'app/shared-components/fields/InputController';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import { useTranslation } from 'react-i18next';
import SelectController from 'app/shared-components/fields/SelectController';
import { getAreas, selectAreas } from '../../store/areasSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../administration/store/permissionsSlice';
import {
  addArea,
  getAreaById,
  newArea,
  removeArea,
  resetArea,
  selectArea,
  selectLoading,
  updateArea,
} from '../../store/areaSlice';
import { getPages, selectPages } from '../../../pages/pages/store/pagesSlice';

/**
 * Form Validation Schema
 */

const AreaForm = (props) => {
  const { translationLanguages, translationLanguage } = useSelector((state) => state.i18n);

  const area = useSelector(selectArea);
  const areas = useSelector(selectAreas);
  const loading = useSelector(selectLoading);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});
  const { t } = useTranslation('navigation');
  const [pageChange, setPageChange] = useState();

  const edit = routeParams.id !== 'new';
  const [checkBox, setCheckBox] = useState(null);

  const schema = yup.object().shape({
    title1: yup.string().trim().required('You must enter a name'),
    slug: yup
      .string()
      .trim()
      .required('You must enter a slug')
      .test('unique_slug_validation', 'that slug already used', (val) => {
        let bool = true;
        if (edit && area) {
          let res = areas;
          res = res?.filter((el) => el.id !== area?.id);
          bool = !!res.every((ls) => ls.slug !== val);
        } else {
          bool = !!areas.every((ls) => ls.slug !== val);
        }
        return bool;
      }),
    radio: yup.string().required(),
    page_id: yup.number(),
  });

  const { control, watch, reset, register, handleSubmit, setValue, getValues, formState } = useForm(
    {
      mode: 'onChange',
      resolver: yupResolver(schema),
      // defaultValues: {
      //   radio: '',
      //   page_id: 0,
      //   icon_id: 0,
      // },
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Areas' }));
    if (!canManage) {
      navigate(`/projects/areas`);
    }
  }, [canManage, dispatch, navigate, userId]);

  const form = watch();

  useEffect(() => {
    dispatch(getPages());
    dispatch(resetArea());
    if (routeParams.id !== 'new') {
      dispatch(getAreaById(routeParams.id));
    } else {
      dispatch(newArea());
    }
  }, [dispatch, routeParams.id, userId]);

  useEffect(() => {
    const def = {
      id: area?.icon_id,
      src: area?.icon?.name,
    };
    setDefaultSelected(def);
    setSelected(def);
  }, [area]);

  useEffect(() => {
    if (area) {
      const copyArea = {};

      if (edit) {
        area.translations.forEach((item, i) => {
          copyArea[`title${item.language_id}`] = item.title;
        });
        copyArea.page_id = area.page_id;
        copyArea.radio = area?.type;
        copyArea.slug = area?.slug;
        setDefaultSelected(area?.media);
        setSelected(area?.media);
        setCheckBox(area?.type);
      }
      reset({ ...copyArea });
    }
  }, [area, edit, reset, translationLanguages, canManage, navigate, loading]);

  const pages = useSelector(selectPages);

  if (loading) {
    return <FuseLoading />;
  }

  /**
   * Form Submit
   */

  async function onSubmit(data) {
    data.title = createTranslationData(data, 'title');
    data.icon_id = selected?.id;
    data.type = data.radio;
    if (routeParams.id === 'new') {
      await dispatch(addArea(data));
      await dispatch(getAreas(form?.radio || 'focal_area'));
    } else {
      data.id = routeParams.id;
      await dispatch(updateArea(data));
      await dispatch(getAreas(form?.radio || 'focal_area'));
    }

    navigate(`/projects/areas`);
  }

  return (
    <>
      <Box className="relative flex flex-col flex-auto items-center px-24">
        <Box className="flex justify-between w-full">
          <NewImageController
            setDefaultSelected={setDefaultSelected}
            control={control}
            name="icon_id"
            required
            selected={selected}
            setSelected={setSelected}
            defaultSelected={defaultSelected}
            disableEdit={!canManage}
          />
          <FormControl className="mt-[30px]">
            <Controller
              name="radio"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  defaultValue={edit ? area?.type : ''}
                  defaultChecked={edit ? area?.type : ''}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setCheckBox(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="focal_area"
                    control={<Radio />}
                    label={t('FOCAL_AREA')}
                  />
                  <FormControlLabel
                    value="cross_cutting_area"
                    control={<Radio />}
                    label={t('CROSS_CUTTING_AREAS')}
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Box>

        <InputTranslationController control={control} errors={errors} name="title" />
        <InputController
          control={control}
          errors={errors}
          name="slug"
          label="Slug"
          className="mt-16 h-48"
        />
        <>
          <SelectController
            control={control}
            errors={errors}
            name="page_id"
            label="PAGES"
            getOption={(v) => {
              return v.translations.find((trs) => trs.language_id === translationLanguage)?.title;
            }}
            data={pages}
          />
        </>
      </Box>

      <FormButtons
        edit={routeParams.id !== 'new'}
        onDeleteFunction={() => {
          dispatch(removeArea(area?.id)).then(() => {
            navigate('/projects/areas');
          });
        }}
        onSubmitFunction={handleSubmit(onSubmit)}
        saveDisable={!isValid}
      />
    </>
  );
};

export default AreaForm;
