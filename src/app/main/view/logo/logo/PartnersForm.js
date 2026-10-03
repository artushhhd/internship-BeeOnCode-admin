import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import createTranslationData from '@helpers/createTranslationData';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { Zoom } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import NewImageController from 'app/shared-components/fields/NewImageController';
import 'intro.js/introjs.css';
import InputController from 'app/shared-components/fields/InputController';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import introJs from 'intro.js';
import { getLogo, newLogo, selectLogo, updateLogo } from '../store/logoSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a name'),
});

const PartnersForm = ({ canManage, steps }) => {
  const { t } = useTranslation('navigation');
  const logo = useSelector(selectLogo);
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const [partners1Selected, setPartners1Selected] = useState({});
  const [partners2Selected, setPartners2Selected] = useState({});
  const [defaultPartners1Selected, setDefaultPartners1Selected] = useState({});
  const [defaultPartners2Selected, setDefaultPartners2Selected] = useState({});

  useEffect(() => {
    const def2 = {
      partner_logo1_id: logo?.partner_logo1_id,
      partner_website1: logo?.partner_website1,
      partner_titles1: logo?.partner_titles1,
    };
    const def3 = {
      partner_logo2_id: logo?.partner_logo2_id,
      partner_website2: logo?.partner_website2,
      partner_titles1: logo?.partner_titles1,
    };

    setPartners1Selected(def2);
    setDefaultPartners1Selected(def2);
    setPartners2Selected(def3);
    setDefaultPartners2Selected(def3);
  }, [setPartners1Selected, logo, setDefaultPartners1Selected]);

  const edit = routeParams.id !== 'new';

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  useEffect(() => {
    if (routeParams.id === 'new') {
      dispatch(newLogo());
    } else {
      dispatch(getLogo(routeParams.id));
    }
  }, [dispatch, routeParams.id]);

  useEffect(() => {
    if (logo) {
      const copyLogo = { ...logo };
      logo.translations.forEach((item, i) => {
        if (edit) {
          copyLogo[`title${i + 1}`] = item?.title;
          copyLogo[`partners1${i + 1}`] = item?.partner_titles1;
          copyLogo[`partners2${i + 1}`] = item?.partner_titles2;
          copyLogo.link2 = logo?.partner_website1;
          copyLogo.link3 = logo?.partner_website2;

          reset({ ...copyLogo });
        } else {
          copyLogo[`title${item.id}`] = '';
        }
        setDefaultPartners1Selected(logo?.partner_logo1);
        setPartners1Selected(logo?.partner_logo1);
        setDefaultPartners2Selected(logo?.partner_logo2);
        setPartners2Selected(logo?.partner_logo2);
      });
    }
  }, [edit, logo, reset]);

  /**
   * Form Submit
   */

  function onSubmitPartners1(data) {
    data.title = createTranslationData(data, 'title');
    data.id = logo.id;
    data.partner_titles1 = createTranslationData(data, 'partners1');
    data.partner_logo1_id = partners1Selected?.id;
    data.partner_website1 = data?.link2;
    dispatch(updateLogo(data)).then(() => dispatch(getLogo(routeParams.id)));
  }
  function onSubmitPartners2(data) {
    data.title = createTranslationData(data, 'title');
    data.id = logo.id;
    data.partner_logo1_id = partners1Selected?.id;
    data.partner_titles1 = createTranslationData(data, 'partners1');
    data.partner_website2 = data?.link3;
    dispatch(updateLogo(data)).then(() => dispatch(getLogo(routeParams.id)));
  }

  function startTour() {
    introJs().setOptions({ steps }).start();
  }
  return (
    <>
      <Box
        className="relative w-full "
        sx={{
          backgroundColor: 'background.default',
        }}
      />
      <Box className="flex w-full gap-1 justify-between items-start">
        <Paper className="w-full  px-10 mx-10 my-10">
          <div className="flex    w-full">
            <div className="flex  my-9" style={{ width: '80%' }}>
              <FuseSvgIcon
                onClick={startTour}
                sx={{ display: 'inline-block', marginRight: '5px', cursor: 'pointer' }}
                size={24}
                color="action"
              >
                feather:info
              </FuseSvgIcon>
              <p>{t('PARTNERS')} 1</p>
            </div>
            <Box className="w-full flex justify-end  mt-[20px]">
              <LanguageSwitcher inModal />
            </Box>
          </div>
          <div className="w-full flex" id="step1">
            <NewImageController
              setDefaultSelected={setDefaultPartners1Selected}
              control={control}
              name="logo"
              disableEdit={!canManage}
              required
              selected={partners1Selected}
              defaultSelected={defaultPartners1Selected}
              setSelected={setPartners1Selected}
            />
          </div>

          <div id="step2">
            <InputTranslationController
              control={control}
              errors={errors}
              name="partners1"
              label="PARTNERS"
            />
          </div>

          <div id="step3">
            <InputController control={control} errors={errors} name="link2" label="URL" />
          </div>
          <div className="flex  justify-center  w-full">
            <div className="flex  justify-end my-9" style={{ width: '80%' }}>
              <Button
                id="step4"
                variant="contained"
                color="secondary"
                // disabled={/* _.isEmpty(dirtyFields) || */ !isValid}
                onClick={handleSubmit(onSubmitPartners1)}
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
            </div>
          </div>
        </Paper>
        <Paper className="w-full  px-10 mx-10 my-10">
          <div className="flex    w-full">
            <div className="flex  my-9" style={{ width: '80%' }}>
              <FuseSvgIcon
                onClick={startTour}
                sx={{ display: 'inline-block', marginRight: '5px', cursor: 'pointer' }}
                size={24}
                color="action"
              >
                feather:info
              </FuseSvgIcon>
              <p>{t('PARTNERS')} 2</p>
            </div>
            <Box className="w-full flex justify-end  mt-[20px]">
              <LanguageSwitcher inModal />
            </Box>
          </div>
          <div className="w-full flex">
            <NewImageController
              setDefaultSelected={setDefaultPartners2Selected}
              control={control}
              name="logo"
              disableEdit={!canManage}
              required
              selected={partners2Selected}
              defaultSelected={defaultPartners2Selected}
              setSelected={setPartners2Selected}
            />
          </div>
          <InputTranslationController
            control={control}
            errors={errors}
            name="partners2"
            label="PARTNERS"
          />
          <InputController control={control} errors={errors} name="link3" label="URL" />
          <div className="flex  justify-center  w-full">
            <div className="flex  justify-end my-9" style={{ width: '80%' }}>
              <Button
                id="step3"
                variant="contained"
                color="secondary"
                // disabled={/* _.isEmpty(dirtyFields) || */ !isValid}
                onClick={handleSubmit(onSubmitPartners2)}
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
            </div>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default PartnersForm;
