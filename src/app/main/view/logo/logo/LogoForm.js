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
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import Paper from '@mui/material/Paper';
import { getLogo, newLogo, selectLogo, updateLogo } from '../store/logoSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a name'),
});

const LogoForm = ({ canManage, steps }) => {
  const { t } = useTranslation('navigation');
  const logo = useSelector(selectLogo);
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  const routeParams = useParams();
  const dispatch = useDispatch();
  const [armLanguage, setArmLanguage] = useState({});
  const [enLanguage, setEnLanguage] = useState({});
  const [selected, setSelected] = useState({});
  const [defaultSelected, setDefaultSelected] = useState({});
  const [faviconSelected, setFaviconSelected] = useState({});
  const [defaultFaviconSelected, setDefaultFaviconSelected] = useState({});

  const [ogLogoSelected, setOgLogoSelected] = useState({});
  const [defaultOgLogoSelected, setDefaultOgLogoSelected] = useState({});
  const [armOgLogo, setArmOgLogo] = useState({});
  const [enOgLogo, setEnOgLogo] = useState({});
  useEffect(() => {
    if (selected?.language_id === 1) {
      setArmLanguage(selected);
    } else if (selected?.language_id === 2) {
      setEnLanguage(selected);
    }
  }, [selected]);

  useEffect(() => {
    if (translationLanguageInModal === 1) {
      setSelected(armLanguage);
      setDefaultSelected(armLanguage);
    } else if (translationLanguageInModal === 2) {
      setSelected(enLanguage);
      setDefaultSelected(enLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationLanguageInModal, dispatch, armLanguage, enLanguage]);

  useEffect(() => {
    if (ogLogoSelected?.language_id === 1) {
      setArmOgLogo(ogLogoSelected);
    } else if (ogLogoSelected?.language_id === 2) {
      setEnOgLogo(ogLogoSelected);
    }
  }, [ogLogoSelected]);

  useEffect(() => {
    if (translationLanguageInModal === 1) {
      setOgLogoSelected(armOgLogo);
      setDefaultOgLogoSelected(armOgLogo);
    } else if (translationLanguageInModal === 2) {
      setOgLogoSelected(enOgLogo);
      setDefaultOgLogoSelected(enOgLogo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationLanguageInModal, dispatch, armOgLogo, enOgLogo]);

  useEffect(() => {
    const def = {
      id: logo?.logo_id,
      src: logo?.logo,
    };
    setDefaultSelected(def);
    setSelected(def);
  }, [setDefaultSelected, logo, setSelected]);
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
          copyLogo.link2 = logo?.partner_website1;
          copyLogo.link3 = logo?.partner_website2;

          if (item?.language_id === 1) {
            setArmLanguage({ ...item?.logo, language_id: item?.language_id });
          } else if (item?.language_id === 2) {
            setEnLanguage({ ...item?.logo, language_id: item?.language_id });
          }
          if (item?.language_id === 1) {
            setArmOgLogo({ ...item?.og_image, language_id: item?.language_id });
          } else if (item?.language_id === 2) {
            setEnOgLogo({ ...item?.og_image, language_id: item?.language_id });
          }

          reset({ ...copyLogo });
        } else {
          copyLogo[`title${item.id}`] = '';
        }

        setSelected(logo?.logo);
        setDefaultSelected(logo?.logo);
        setFaviconSelected(logo?.favicon);
        setDefaultFaviconSelected(logo?.favicon);
      });
    }
  }, [edit, logo, reset]);

  /**
   * Form Submit
   */

  function onSubmitLogo(data) {
    data.cover1 = armLanguage?.id;
    data.cover2 = enLanguage?.id;
    data.id = logo.id;
    data.logo_id = createTranslationData(data, 'cover');
    data.title = createTranslationData(data, 'title');
    dispatch(updateLogo(data)).then(() => dispatch(getLogo(routeParams.id)));
  }
  function onSubmitFavicon(data) {
    data.title = createTranslationData(data, 'title');
    data.id = logo.id;
    data.favicon_id = faviconSelected?.id;
    dispatch(updateLogo(data)).then(() => dispatch(getLogo(routeParams.id)));
  }
  function onSubmitOgLogo(data) {
    console.log(data);
    data.title = createTranslationData(data, 'title');
    data.ogLogo1 = armOgLogo?.id;
    data.ogLogo2 = enOgLogo?.id;
    data.id = logo.id;
    data.og_image_id = createTranslationData(data, 'ogLogo');
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
        <Paper className="w-full h-[320px]   px-10 mx-10 my-10">
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
              <p>{t('LOGOSETTINGS')}</p>
            </div>
            <Box className="w-full flex justify-end mt-[20px]">
              <LanguageSwitcher inModal />
            </Box>
          </div>
          <div className="w-full flex" id="step1">
            {translationLanguages.map((l) => {
              return (
                l.id === translationLanguageInModal && (
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
                )
              );
            })}
          </div>
          <div style={{ width: '100%' }} id="step2">
            <InputTranslationController
              control={control}
              errors={errors}
              name="title"
              disable={!canManage}
            />
          </div>
          <div className="flex   justify-center  w-full">
            <div className="flex  justify-end my-9" style={{ width: '80%' }}>
              <Button
                id="step3"
                variant="contained"
                color="secondary"
                // disabled={/* _.isEmpty(dirtyFields) || */ !isValid}
                onClick={handleSubmit(onSubmitLogo)}
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
        <Paper className="w-full h-[320px]   px-10 mx-10 my-10">
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
              <p>Favicon</p>
            </div>
            <Box className="w-full flex justify-end  mt-[20px]">
              <LanguageSwitcher inModal />
            </Box>
          </div>

          <div className="w-full flex " id="step4">
            <NewImageController
              setDefaultSelected={setDefaultFaviconSelected}
              control={control}
              name="favicon"
              disableEdit={!canManage}
              required
              selected={faviconSelected}
              defaultSelected={defaultFaviconSelected}
              setSelected={setFaviconSelected}
            />
          </div>
          <div style={{ visibility: 'hidden', height: '65px' }} />
          <div className="flex  justify-center  w-full">
            <div className="flex  justify-end " style={{ width: '80%' }}>
              <Button
                id="step3"
                variant="contained"
                color="secondary"
                // disabled={/* _.isEmpty(dirtyFields) || */ !isValid}
                onClick={handleSubmit(onSubmitFavicon)}
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
        <Paper className="w-full h-[320px]   px-10 mx-10 my-10">
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
              <p>OG:Logo</p>
            </div>
            <Box className="w-full flex justify-end  mt-[20px]">
              <LanguageSwitcher inModal />
            </Box>
          </div>

          <div className="w-full flex " id="step4">
            <NewImageController
              setDefaultSelected={setDefaultOgLogoSelected}
              control={control}
              name="OgLogo"
              disableEdit={!canManage}
              required
              selected={ogLogoSelected}
              defaultSelected={defaultOgLogoSelected}
              setSelected={setOgLogoSelected}
            />
          </div>
          <div style={{ visibility: 'hidden', height: '65px' }} />
          <div className="flex  justify-center  w-full">
            <div className="flex  justify-end " style={{ width: '80%' }}>
              <Button
                id="step3"
                variant="contained"
                color="secondary"
                // disabled={/* _.isEmpty(dirtyFields) || */ !isValid}
                onClick={handleSubmit(onSubmitOgLogo)}
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

export default LogoForm;
