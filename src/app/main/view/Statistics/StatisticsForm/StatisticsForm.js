import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import _ from '@lodash';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import { selectUser } from 'app/store/userSlice';
import FileManagerModal from 'app/shared-components/modals/FileManagerModal';
import NewImageController from 'app/shared-components/fields/NewImageController';
import createTranslationData from '@helpers/createTranslationData';
import Chip from '@mui/material/Chip';
import { Autocomplete } from '@mui/material';
import Box from '@mui/system/Box';
import { selectPages } from '../../../pages/pages/store/pagesSlice';
import { selectPermission } from '../../../administration/store/permissionsSlice';
import {
  addStatistics,
  editStatistic,
  getStatisticId,
  getStatistics,
  removeStatistics,
} from '../store/StatisticsSlice';
import { getStatuses, selectStatuses } from '../../../projects/store/statusesSlice';

/**
 * Form Validation Schema
 */

const StatisticsForm = (props) => {
  const { t } = useTranslation('navigation');
  const [searchParams] = useSearchParams();
  const idQuery = searchParams.get('id');
  const pages = useSelector(selectPages);
  const [fileNameCopy, setFileNameCopy] = useState();
  const {
    loading,
    item: { statisticsSettings: statistics },
  } = useSelector((state) => state.StatisticsApp.statiscticsReducer);
  const { id: userId } = useSelector(selectUser);
  const dispatch = useDispatch();
  const status = useSelector(selectStatuses);

  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [checkBox, setCheckBox] = useState(null);
  const routeParams = useParams();
  const { canManage } = useSelector(selectPermission);
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  useEffect(() => {
    dispatch(getStatisticId(routeParams.id));
    dispatch(getStatuses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const [selected, setSelected] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState([]);

  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const edit = routeParams.id !== 'new';

  const defaultSchemaShape = {
    name1: yup.string().trim().required('You must enter a name'),
    radio: yup.string().required(),
    status_id: yup
      .array()
      .required()
      .test('array-0-required', 'The first element is required', (value) => {
        return value && value.length > 0 && !!value[0];
      }),
  };

  // eslint-disable-next-line no-nested-ternary

  const schema = yup.object().shape({ ...defaultSchemaShape });

  const { control, reset, handleSubmit, setValue, formState, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const image = watch('file_id');

  const copyStatistics = useMemo(() => {
    return { ...statistics };
  }, [statistics]);

  useEffect(() => {
    if (statistics) {
      if (edit) {
        statistics.translations.forEach((val, i) => {
          copyStatistics[`name${val.language_id}`] = val.title;
        });
        const statuses = statistics.status_id.split(',');

        copyStatistics.status_id = status.filter(({ id }) => statuses.includes(`${id}`));
        setSelectedStatuses(status.filter(({ id }) => statuses.includes(`${id}`)));

        if (statistics?.is_sponsor === 1) {
          copyStatistics.radio = 2;
          setCheckBox(2);
        } else if (statistics?.is_amount === 1) {
          copyStatistics.radio = 3;
          setCheckBox(3);
        } else if (statistics?.is_count === 1) {
          copyStatistics.radio = `1`;
          setCheckBox(1);
        }
        setValue('file_id', statistics?.icon_id);
      }
    }

    reset({ ...copyStatistics });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyStatistics, edit, statistics, reset]);

  useEffect(() => {
    if (selected?.id) {
      setValue('file_id', selected.id);
    }
    // eslint-disable-next-line
  }, [selected]);
  /**
   * Form Submit
   */

  function onSubmit(data) {
    data.status_id = data.status_id.map((v) => v.id);

    data.title = createTranslationData(data, 'name');
    data.icon_id = selected?.id;
    data.checkBox = +data.radio;

    if (routeParams.id === 'new') {
      dispatch(addStatistics(data)).then(({ payload }) => {
        dispatch(getStatistics());
        navigate(`/view/statistics`);
        setChecked(false);
      });
    } else {
      data.id = statistics.id;
      dispatch(editStatistic(data)).then(() => {
        dispatch(getStatistics());
        navigate(`/view/statistics`);
      });
    }
  }
  useEffect(() => {
    if (routeParams.id === 'new') {
      setDefaultSelected([]);
      setSelected([]);
    }
  }, [routeParams.id]);

  useEffect(() => {
    const def = {
      id: statistics?.icon_id,
      src: statistics?.icon?.name,
    };
    setDefaultSelected(def);
    setSelected(def);
  }, [setDefaultSelected, statistics, setSelected]);

  function handleRemoveStep() {
    dispatch(removeStatistics(routeParams.id)).then(() => {
      dispatch(getStatistics());
      navigate('/view/statistics');
    });
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center px-24">
        <InputTranslationController control={control} errors={errors} name="name" label="NAME" />
        <div className="grid w-full  " />

        <Controller
          name="status_id"
          control={control}
          render={({ field: { onChange } }) => (
            <Autocomplete
              multiple
              className="mt-20 w-full"
              id="skills-filled"
              value={selectedStatuses}
              options={status}
              getOptionLabel={(item) =>
                item?.translations?.find((trs) => trs.language_id === translationLanguageInModal)
                  ?.title || '---'
              }
              // defaultValue={copyStatistics.status_id}
              renderTags={(val, getTagProps) => {
                return val.map((option, index) => (
                  <Chip
                    key={option.id}
                    variant="outlined"
                    label={
                      option.translations.find(
                        (trs) => trs.language_id === translationLanguageInModal
                      )?.title || '---'
                    }
                    {...getTagProps({ index })}
                  />
                ));
              }}
              renderInput={(params) => <TextField {...params} label={t('STATUS')} />}
              onChange={(e, newValue) => {
                onChange(newValue);
                setSelectedStatuses(newValue);
                // setMySkills(changedValues);
              }}
            />
          )}
        />

        <Box className="w-full flex justify-between mt-8">
          <FormControl>
            <Controller
              name="radio"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={(e) => {
                    onChange(e.target.value);
                    setCheckBox(e.target.value);
                  }}
                  value={checkBox}
                >
                  <FormControlLabel value="1" control={<Radio />} label={t('COUNT')} />
                  <FormControlLabel value="2" control={<Radio />} label={t('SPONSOR_AMOUNT')} />
                  <FormControlLabel value="3" control={<Radio />} label={t('GRANT_AMOUNT')} />
                </RadioGroup>
              )}
            />
          </FormControl>

          <NewImageController
            setDefaultSelected={setDefaultSelected}
            control={control}
            name="file_id"
            required
            selected={selected}
            setSelected={setSelected}
            defaultSelected={defaultSelected}
            disableEdit={!canManage}
          />
        </Box>
      </div>

      <FileManagerModal
        type="file"
        handleClose={handleClose}
        open={open}
        selected={selected}
        defaultSelected={defaultSelected}
        setSelected={setSelected}
        multiple
        setDefaultSelected={setDefaultSelected}
      />

      <FormButtons
        edit={routeParams.id !== 'new'}
        saveDisable={(_.isEmpty(dirtyFields) || !isValid) && !image}
        onSubmitFunction={handleSubmit(onSubmit)}
        onDeleteFunction={handleRemoveStep}
      />
    </>
  );
};

export default StatisticsForm;
