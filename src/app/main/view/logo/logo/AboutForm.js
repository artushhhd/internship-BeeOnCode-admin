import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import { useTranslation } from 'react-i18next';
import { Zoom } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import EditorTranslationController from 'app/shared-components/fields/EditorTranslationController';
import { lighten } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import 'intro.js/introjs.css';
import { FILE_API_URL } from '@api/http';
import FileManagerModal from 'app/shared-components/modals/FileManagerModal';
import createTranslationData from '@helpers/createTranslationData';
import FuseUtils from '@fuse/utils';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import introJs from 'intro.js';
import { Root } from '../../../pages/pages/pages/sectionForms/GalleryForm';
import { editAbout, getAbout } from '../store/aboutSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  title1: yup.string().trim().required('You must enter a name'),
  title2: yup.string().trim().required('You must enter a name'),
  title3: yup.string().trim().required('You must enter a name'),
});

const AboutForm = ({ canManage, steps }) => {
  const { t } = useTranslation('navigation');
  const { translationLanguages } = useSelector((state) => state.i18n);
  const { about, loading } = useSelector((state) => state.logoApp.about);

  const copyAbout = useMemo(() => {
    return { ...about };
  }, [about]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [linksData, setLinksData] = useState([]);
  const [editorData, setEditorData] = useState({});

  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const edit = routeParams.id !== 'new';

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    // resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    dispatch(getAbout());
  }, [dispatch]);

  useEffect(() => {
    if (about) {
      if (edit) {
        about.translations.forEach((item, i) => {
          copyAbout[`title${item.id}`] = item?.title;
        });
        about.translations.forEach((item) => {
          copyAbout[`long_description${item.language_id}`] = item.description
            ? JSON.parse(item.description).htmlValue
            : '';
        });
        about.translations.forEach((item) => {
          copyAbout[`short_description${item.language_id}`] = item.short_description;
        });
        setSelected(
          copyAbout.files.map((f) => {
            if (f.video_url) {
              return {
                video_url: f.video_url,
              };
            }
            return {
              id: f.file_id,
              name: f.media?.thumbnail_url,
              src: f.media?.thumbnail_url,
              language_id: f.language_id,
            };
          })
        );
      }

      // setImage(logo.logo);
      reset({ ...copyAbout });
    }
  }, [edit, about, reset, copyAbout, translationLanguages]);

  useEffect(() => {
    const defaultUrls = {};
    setLinksData(
      copyAbout.files
        ?.filter((g) => g.video_url)
        .map((m, i) => {
          defaultUrls[`linkUrl${i}`] = m.video_url;
          return { id: FuseUtils.generateGUID(), deleted: false };
        })
    );

    reset({
      ...watch(),
      ...defaultUrls,
      selected,
    });
  }, [reset, watch, copyAbout, selected]);

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.title = createTranslationData(data, 'title');
    data.description = editorData;
    data.short_description = createTranslationData(data, 'short_description');

    data.link = [];
    linksData.forEach((link, i) => {
      if (!link.deleted) {
        data.link.push(data[`linkUrl${i}`]);
      }
    });
    dispatch(editAbout(data)).then(() => dispatch(getAbout()));
  }

  if (_.isEmpty(form) || !about || loading) {
    return <FuseLoading />;
  }

  function startTour() {
    introJs().setOptions({ steps }).start();
  }
  return (
    <Paper className="w-[99%]   flex flex-col  justify-between px-10 mx-10 my-10">
      <Box
        className="relative w-full "
        sx={{
          backgroundColor: 'background.default',
        }}
      />
      <div className="relative flex flex-col flex-auto items-start">
        <div className="w-full flex">
          <Root className="w-full">
            <div className="flex justify-center   sm:justify-start flex-wrap  ">
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
                  <p>{t('ABOUT')}</p>
                </div>
                <Box className="w-full flex justify-end mt-[20px]">
                  <LanguageSwitcher inModal />
                </Box>
              </div>
              <div className="w-full flex flex-wrap" id="step1">
                <Controller
                  name="files"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'light'
                            ? lighten(theme.palette.background.default, 0.4)
                            : lighten(theme.palette.background.default, 0.02),
                      }}
                      className="productImageUpload flex items-center justify-center relative w-96 h-96 rounded-16 mr-12 mt-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                      onClick={handleOpen}
                    >
                      <FuseSvgIcon size={32} color="action">
                        heroicons-outline:upload
                      </FuseSvgIcon>
                    </Box>
                  )}
                />

                {selected.map((media) => {
                  return (
                    media &&
                    !media.video_url && (
                      <div
                        role="button"
                        tabIndex={0}
                        className={clsx(
                          'productImageItem flex items-center justify-center relative w-96 h-96 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                        )}
                        key={media.id}
                      >
                        <FuseSvgIcon
                          onClick={() => {
                            setSelected([...selected.filter((s) => s.id !== media.id)]);
                          }}
                          className="productImageX z-9999"
                        >
                          heroicons-outline:x
                        </FuseSvgIcon>
                        <img
                          className="max-w-none w-auto h-full"
                          src={`${FILE_API_URL}/${media?.src}`}
                          alt="section_image"
                        />
                      </div>
                    )
                  );
                })}
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
            label="LONG_DESCRIPTION"
            setEditorData={setEditorData}
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

      <FileManagerModal
        handleClose={handleClose}
        open={open}
        selected={selected}
        setSelected={setSelected}
        defaultSelected={defaultSelected}
        multiple
        setDefaultSelected={setDefaultSelected}
        type="media"
      />
    </Paper>
  );
};

export default AboutForm;
