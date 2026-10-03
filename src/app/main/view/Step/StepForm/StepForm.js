import createTranslationData from '@helpers/createTranslationData';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { useTranslation } from 'react-i18next';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import { selectUser } from 'app/store/userSlice';
import FormButtons from 'app/shared-components/modals/FormButtons';
import NewImageController from 'app/shared-components/fields/NewImageController';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { FILE_API_URL } from '@api/http';
import Tooltip from '@mui/material/Tooltip';
import { selectPermission } from '../../../administration/store/permissionsSlice';
import { addStep, editStep, getStep, getStepById, removeStep } from '../store/StepSlice';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
/**
 * Form Validation Schema
 */

const StepForm = (props) => {
  const { t } = useTranslation('navigation');
  const [searchParams] = useSearchParams();
  const idQuery = searchParams.get('id');
  const [fileNameCopy, setFileNameCopy] = useState();
  const {
    item: { step },
  } = useSelector((state) => state.StepApp.secondaryMenuReducer);
  const { id: userId } = useSelector(selectUser);
  const dispatch = useDispatch();
  const routeParams = useParams();
  const { canManage } = useSelector(selectPermission);
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  useEffect(() => {
    dispatch(getStepById(routeParams.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});
  const [selectedFile2, setSelectedFile2] = useState({});
  const [defaultSelectedFile2, setDefaultSelectedFile2] = useState({});
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const [armLanguage, setArmLanguage] = useState({});
  const [enLanguage, setEnLanguage] = useState({});
  const [armLanguageFile2, setArmLanguageFile2] = useState({});
  const [enLanguageFile2, setEnLanguageFile2] = useState({});

  const edit = routeParams.id !== 'new';

  const defaultSchemaShape = {
    name1: yup.string().required('You must enter a name'),
    fileName1: yup.string(),
    description1: yup.string().required('You must enter a description'),
  };

  const schema = yup.object().shape({ ...defaultSchemaShape });

  const { control, reset, handleSubmit, formState, setValue, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const copyStep = useMemo(() => {
    return { ...step };
  }, [step]);

  useEffect(() => {
    setSelectedFile2(null);
  }, []);

  useEffect(() => {
    if (selected?.language_id === 1) {
      setArmLanguage(selected);
    } else if (selected?.language_id === 2) {
      setEnLanguage(selected);
    }
    if (selectedFile2?.language_id === 1) {
      setArmLanguageFile2(selectedFile2);
    } else if (selectedFile2?.language_id === 2) {
      setEnLanguageFile2(selectedFile2);
    }
  }, [selected, selectedFile2]);

  useEffect(() => {
    if (translationLanguageInModal === 1) {
      setSelected(armLanguage);
    } else if (translationLanguageInModal === 2) {
      setSelected(enLanguage);
    }
    if (translationLanguageInModal === 1) {
      setSelectedFile2(armLanguageFile2);
    } else if (translationLanguageInModal === 2) {
      setSelectedFile2(enLanguageFile2);
    }
  }, [
    translationLanguageInModal,
    dispatch,
    armLanguage,
    enLanguage,
    armLanguageFile2,
    enLanguageFile2,
  ]);

  useEffect(() => {
    if (step) {
      if (edit) {
        // let copyMedia = [];
        step.translations.forEach((item, i) => {
          copyStep[`name${item.language_id}`] = item.title;
          copyStep[`file2Name${item.language_id}`] = item.file_name2;
          copyStep[`description${item.language_id}`] = item.description;
          copyStep[`fileName${item.language_id}`] = item.file_name;
          copyStep[`file${item.language_id}`] = item?.media?.id;
          if (item?.language_id === 1) {
            setArmLanguage({ ...item?.media, language_id: item?.language_id });
          } else if (item?.language_id === 2) {
            setEnLanguage({ ...item?.media, language_id: item?.language_id });
          }
          if (item?.language_id === 1) {
            setArmLanguageFile2({ ...item?.media1, language_id: item?.language_id });
          } else if (item?.language_id === 2) {
            setEnLanguageFile2({ ...item?.media1, language_id: item?.language_id });
          }
          // copyMedia = [...copyMedia, { ...item?.media, language_id: item?.language_id }];
          // console.log(copyMedia);
        });
        // setSelected(copyMedia);
      }
      // setDefaultSelected([step.media]);
      // setSelected([step.media]);
      setFileNameCopy(`fileName${translationLanguageInModal}`);
    }
    reset({ ...copyStep });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyStep, edit, step, reset]);

  /**
   * Form Submit
   */

  function onSubmit(data) {
    const copyData = {};

    copyData.cover1 = armLanguage?.id;
    copyData.cover2 = enLanguage?.id;
    copyData.coverFile1 = armLanguageFile2?.id;
    copyData.coverFile2 = enLanguageFile2?.id;
    copyData.file_name = createTranslationData(data, 'fileName');
    copyData.name = createTranslationData(data, 'name');
    copyData.description = createTranslationData(data, 'description');
    copyData.file_id = createTranslationData(copyData, 'cover');
    copyData.file_id2 = createTranslationData(copyData, 'coverFile');
    copyData.file_name2 = createTranslationData(data, 'file2Name');

    if (routeParams.id === 'new') {
      if (idQuery) {
        data.parent_id = idQuery;
      }

      dispatch(addStep(copyData)).then(({ payload }) => {
        dispatch(getStep());
        navigate(`/view/Step`);
        setChecked(false);
      });
    } else {
      copyData.id = routeParams.id;
      dispatch(editStep(copyData)).then(() => {
        dispatch(getStep());
        navigate(`/view/step`);
      });
    }
  }

  useEffect(() => {
    if (routeParams.id === 'new') {
      // setSelected({});
    }
  }, [routeParams.id]);

  // if (!Step && edit) {
  //   return <FuseLoading />;
  // }

  function handleRemoveStep() {
    dispatch(removeStep(routeParams.id)).then(() => {
      dispatch(getStep());
      navigate('/view/step');
    });
  }
  const openPDFInNewWindow = (link) => {
    window.open(`${FILE_API_URL}/${link}`, '_blank');
  };

  return translationLanguages.map((l) => {
    return (
      l.id === translationLanguageInModal && (
        <>
          <div className="relative flex flex-col  flex-auto items-center px-24 sm:px-48">
            <div className="flex w-full ">
              <div className="w-[40%] ">
                <h3>{t('template')} 1</h3>
                <div className="flex flex-auto items-end relative -mt-30">
                  {selected && translationLanguageInModal === selected.language_id && (
                    <Tooltip className="absolute left-[75px] z-9999 " title={selected?.name}>
                      <Button
                        onClick={() => {
                          openPDFInNewWindow(selected.name);
                        }}
                      >
                        <FuseSvgIcon className="text-48" size={24} color="action">
                          feather:download
                        </FuseSvgIcon>
                      </Button>
                    </Tooltip>
                  )}
                  <div className="absolute z-9999 top-[10px] right-[100px]">
                    <input className="w-[25px] h-[25px] " checked={selected.id} type="checkbox" />
                    {/* <Checkbox sx={{ color: 'white' }} {...label} checked={selected.id} /> */}
                  </div>

                  <NewImageController
                    type="file"
                    setDefaultSelected={setDefaultSelected}
                    control={control}
                    name="file_id"
                    required
                    selected={selected}
                    setSelected={setSelected}
                    defaultSelected={defaultSelected}
                    disableEdit={!canManage}
                  />
                  {/* {selected && translationLanguageInModal === selected.language_id && ( */}
                  {/*  <div className="ml-[20px] truncate">{selected?.name}</div> */}
                  {/* )} */}
                </div>
              </div>
              <div className="w-[40%] ">
                <h3>{t('template')} 2</h3>
                <div className="flex flex-auto items-end relative  -mt-30">
                  {selectedFile2.id && translationLanguageInModal === selectedFile2.language_id && (
                    <Tooltip className="absolute left-[75px] z-9999 " title={selectedFile2?.name}>
                      <Button
                        onClick={() => {
                          openPDFInNewWindow(selectedFile2.name);
                        }}
                      >
                        <FuseSvgIcon className="text-48" size={24} color="action">
                          feather:download
                        </FuseSvgIcon>
                      </Button>
                    </Tooltip>
                  )}

                  <div className="absolute z-9999 top-[10px] right-[100px]">
                    <input
                      className="w-[25px] h-[25px] "
                      checked={selectedFile2.id}
                      type="checkbox"
                    />
                    {/* <Checkbox sx={{ color: 'white' }} {...label} checked={selected.id} /> */}
                  </div>
                  <NewImageController
                    type="file"
                    setDefaultSelected={setDefaultSelectedFile2}
                    control={control}
                    name="file_id"
                    required
                    selected={selectedFile2}
                    setSelected={setSelectedFile2}
                    defaultSelected={defaultSelectedFile2}
                    disableEdit={!canManage}
                  />

                  {/* {selectedFile2 && translationLanguageInModal === selectedFile2.language_id && ( */}
                  {/*  <div className="ml-[20px] truncate">{selectedFile2?.name}</div> */}
                  {/* )} */}
                </div>
              </div>
            </div>
            <InputTranslationController
              control={control}
              errors={errors}
              name="name"
              label="NAME"
            />
            <InputTranslationController
              control={control}
              errors={errors}
              name="description"
              label="DESCRIPTION"
            />
            <InputTranslationController
              control={control}
              errors={errors}
              name="fileName"
              label="templateFileName1"
            />
            <InputTranslationController
              control={control}
              errors={errors}
              name="file2Name"
              label="templateFileName2"
            />
          </div>
          <div className="mt-[100px]">
            <FormButtons
              edit={routeParams.id !== 'new'}
              saveDisable={!isValid}
              onSubmitFunction={handleSubmit(onSubmit)}
              onDeleteFunction={handleRemoveStep}
            />
          </div>
        </>
      )
    );
  });
};

export default StepForm;
