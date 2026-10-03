import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import { Zoom } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import 'intro.js/introjs.css';
import createTranslationData from '@helpers/createTranslationData';
import NewImageController from 'app/shared-components/fields/NewImageController';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import introJs from 'intro.js';
import { Root } from '../../../pages/pages/pages/sectionForms/GalleryForm';
import { editMission, getMission } from '../store/missionSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a name'),
  // title2: yup.string().trim().required('You must enter a name'),
  // title3: yup.string().trim().required('You must enter a name'),
});

const Mission = ({ canManage, steps }) => {
  const { t } = useTranslation('navigation');
  const { translationLanguages } = useSelector((state) => state.i18n);
  const { mission } = useSelector((state) => state.logoApp.mission);
  const dispatch = useDispatch();

  const copyMission = useMemo(() => {
    return { ...mission };
  }, [mission]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState([]);

  const [editorData, setEditorData] = useState({});

  const routeParams = useParams();

  const edit = routeParams.id !== 'new';

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    // resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();
  useEffect(() => {
    dispatch(getMission());
  }, [dispatch]);

  useEffect(() => {
    if (mission) {
      if (edit) {
        mission?.section?.[0]?.translations?.forEach((item, i) => {
          copyMission[`title${item.id}`] = item?.title;
        });
        mission?.section?.[0]?.translations?.forEach((item) => {
          copyMission[`short_description${item.language_id}`] = item.short_description;
        });
        mission?.section?.[0]?.translations?.forEach((item) => {
          copyMission[`long_description${item.language_id}`] = item.long_description
            ? JSON.parse(item.long_description).htmlValue
            : '';
        });
        setSelected(mission?.section?.[0]?.media);
        setDefaultSelected(mission?.section?.[0]?.media);
      }
      // setImage(logo.logo);
      reset({ ...copyMission });
    }
  }, [edit, mission, reset, copyMission, translationLanguages]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.title = createTranslationData(data, 'title');

    data.short_description = createTranslationData(data, 'short_description');
    data.long_description = editorData;
    data.file_id = selected.id;
    dispatch(editMission(data)).then(() => dispatch(getMission()));
  }

  function startTour() {
    introJs().setOptions({ steps }).start();
  }
  return (
    <Paper className="w-[99%] overflow-y-auto  flex flex-col  justify-between px-10 mx-10 my-10">
      <Box
        className="relative w-full  "
        sx={{
          backgroundColor: 'background.default',
        }}
      />

      <div className="relative flex flex-col flex-auto items-start">
        <div className="w-full flex">
          <Root className="w-full">
            <div className="flex justify-center sm:justify-start flex-wrap ">
              <div className="flex  w-full ">
                <div className="flex  my-9" style={{ width: '80%' }}>
                  <FuseSvgIcon
                    onClick={startTour}
                    sx={{ display: 'inline-block', marginRight: '5px', cursor: 'pointer' }}
                    size={24}
                    color="action"
                  >
                    feather:info
                  </FuseSvgIcon>
                  <p>{t('OURMISSION')} </p>
                </div>
                <Box className="w-full flex justify-end mt-[20px]">
                  <LanguageSwitcher inModal />
                </Box>
              </div>
              <div className="w-full flex flex-wrap" id="step1">
                <NewImageController
                  setDefaultSelected={setDefaultSelected}
                  control={control}
                  name="logo"
                  disableEdit={!canManage}
                  required
                  selected={selected}
                  defaultSelected={defaultSelected}
                  setSelected={setSelected}
                />
              </div>
            </div>
          </Root>
        </div>

        <div style={{ width: '100%' }} id="step2">
          <InputTranslationController
            control={control}
            errors={errors}
            name="title"
            disable={!canManage}
          />
        </div>

        <div style={{ width: '100%' }} id="step3">
          <InputTranslationController
            control={control}
            errors={errors}
            name="short_description"
            label="SHORT_DESCRIPTION"
            multiline
            rows={5}
          />
        </div>
        <div style={{ width: '95%' }} id="step4">
          <EditorTranslationController
            control={control}
            name="long_description"
            setEditorData={setEditorData}
            label="LONG_DESCRIPTION"
          />
        </div>
      </div>

      <div className="flex  justify-center  w-full">
        <div className="flex  justify-end my-9" style={{ width: '80%' }}>
          {canManage ? (
            <Button
              id="step5"
              variant="contained"
              color="secondary"
              // disabled={_.isEmpty(dirtyFields) || !isValid}
              onClick={handleSubmit(onSubmit)}
            >
              <Tooltip
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 300 }}
                title={t('SAVE')}
                enterDelay={500}
                leaveDelay={200}
                followCursor
              >
                <span>{t('SAVE')}</span>
              </Tooltip>
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
    </Paper>
  );
};

export default Mission;
