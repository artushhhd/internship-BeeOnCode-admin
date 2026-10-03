import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import Paper from '@mui/material/Paper';
import CountUp from 'react-countup';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { Zoom } from '@mui/material';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SosIcon from '@mui/icons-material/Sos';
import { useForm } from 'react-hook-form';
import InputDateController from 'app/shared-components/fields/InputDateController';
import SelectController from 'app/shared-components/fields/SelectController';
import { useDispatch, useSelector } from 'react-redux';
import FormButtons from 'app/shared-components/modals/FormButtons';
import { getFilterProject, getProjects } from '../main/projects/store/projectsSlice';
import { getFilterNews, getNews } from '../main/news/news/store/newsSlice';

const HeaderContent = ({
  id,
  steps,
  instruction,
  name,
  data = [],
  addButtonTo = 'new/edit',
  subtitle = '_',
  searchText = '',
  onSearch,
  disableSearch = false,
  disableLanguageSwitcher = false,
  additionalMenu = null,
  viewDeleted = [],
  eyeOpen = false,
  setCollapseAll,
  collapseAll,
  tab = null,
  disableNote = false,
  disableAddButton = false,
  addLabel = name,
  addTurnOffOn = true,
  projectFilter = false,
  newsFilter = false,
  allArea = [],
  regions = [],
  status = [],
}) => {
  const { t } = useTranslation('navigation');
  const [viewActive, setViewActive] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);

  const params = useParams();

  const [minimize, setMinimize] = useState(+localStorage.getItem('mini_header') || 1);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('mini_header', minimize ? 1 : 0);
  }, [minimize, params]);

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
  });
  const { isValid, dirtyFields, errors } = formState;

  function startTour() {
    const intro = introJs();
    intro.setOptions({
      steps,
    });

    // Add new options after the steps
    intro.setOptions({
      nextLabel: t('NEXT'),
      prevLabel: t('PREV'),
      doneLabel: t('DONE'),
    });

    intro.start();
  }

  async function onSubmit(filterData) {
    // data.keyword = keyWord;

    dispatch(getFilterProject(filterData));
    // navigate(`/projects/item?page=${searchParams.get('page') || 1}`);
  }

  async function newsOnSubmit(newsData) {
    dispatch(getFilterNews(newsData));
  }
  const AddButton = () => {
    return (
      params.id !== 'new' &&
      !disableAddButton && (
        <Tooltip
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 300 }}
          title={`${t('ADD')} ${t(addLabel).toLowerCase()}`}
          enterDelay={500}
          leaveDelay={200}
          arrow
        >
          <Button
            id={id}
            style={id === 'notToShow' ? { display: 'none' } : null}
            className="mx-8"
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to={addButtonTo}
          >
            <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>

            <span className="mx-8">
              {addLabel === 'BACKUPES'
                ? `${t('SETTINGS')}`
                : `${t('ADD')} ${t(addLabel).toLowerCase()}`}
            </span>
          </Button>
        </Tooltip>
      )
    );
  };

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        className={`${minimize ? 'py-12 px-32' : 'p-20 sm:p-32'} w-full h-${
          minimize ? 'auto' : '192'
        }`}
      >
        <div className="flex flex-col items-center sm:items-start">
          <div
            className={`flex items-center w-full ${
              additionalMenu || (!additionalMenu && minimize) ? '-mx-8' : ''
            } `}
          >
            {minimize ? (
              <Button className="min-w-0" onClick={() => setMinimize(!minimize)}>
                <FuseSvgIcon>heroicons-outline:chevron-double-down</FuseSvgIcon>
              </Button>
            ) : (
              ''
            )}
            <Typography
              variant="h1"
              component={motion.div}
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.2 } }}
              delay={300}
              className={`text-24 md:text-${
                minimize ? '24 mr-4' : '32'
              } font-extrabold tracking-tight leading-none`}
            >
              {additionalMenu}
              {t(name)}
            </Typography>
            {minimize ? (
              <>
                {disableLanguageSwitcher ? '' : <LanguageSwitcher />}
                {!disableSearch && (
                  <Paper className="flex ml-8 h-32 items-center w-full sm:max-w-320 space-x-8 px-16 rounded-full border-1 shadow-0">
                    <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

                    <Input
                      style={{ background: 'transparent' }}
                      placeholder={`${t('SEARCH')} ${t(name)}`}
                      className="flex flex-1 "
                      value={searchText}
                      onChange={onSearch}
                    />
                  </Paper>
                )}
                <Box
                  component={motion.div}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                  className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-full"
                />
                {addTurnOffOn && viewActive && addButtonTo && <AddButton />}
                {projectFilter && (
                  <Button onClick={startTour} title={instruction} className="ml-auto">
                    <SosIcon style={{ fill: 'red', fontSize: 30 }} />
                  </Button>
                )}
              </>
            ) : (
              ''
            )}
          </div>

          {!minimize ? (
            <div className="flex items-center justify-between w-full">
              <Typography
                component={motion.span}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
                delay={500}
                className="text-14 font-medium ml-2"
                color="text.secondary"
              >
                {`${t('ALL')}\`  `}
                <CountUp end={data.length} delay={0.2} duration={0.3} />
              </Typography>
              {viewDeleted.length === 2 && (
                <Tooltip
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 300 }}
                  title={viewActive ? t('ACTIVE') : t('INACTIVE')}
                  enterDelay={500}
                  leaveDelay={200}
                  followCursor
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={async () => {
                      setViewActive(!viewActive);
                      if (viewActive) {
                        await viewDeleted[0]();
                        setSearchParams({ deleted: true });
                      } else {
                        viewDeleted[1]();
                      }
                    }}
                  >
                    <FuseSvgIcon className="text-48" size={20}>
                      {viewActive ? 'feather:trash-2' : 'feather:trash'}
                    </FuseSvgIcon>
                  </Button>
                </Tooltip>
              )}
            </div>
          ) : (
            ''
          )}
          {!minimize ? (
            <Typography
              component={motion.span}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              delay={500}
              className="text-14 font-medium ml-2"
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          ) : (
            ''
          )}
        </div>
        {!minimize ? (
          <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center mt-16 -mx-8">
            <Button className="min-w-0" onClick={() => setMinimize(!minimize)}>
              <FuseSvgIcon>heroicons-outline:chevron-double-up</FuseSvgIcon>
            </Button>
            {!disableLanguageSwitcher && (
              <motion.div
                className="flex items-end"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              >
                <LanguageSwitcher />
                {eyeOpen && (
                  <button
                    className="ml-10"
                    type="button"
                    onClick={() => setCollapseAll(!collapseAll)}
                  >
                    {collapseAll ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                )}
              </motion.div>
            )}

            {!disableSearch && (
              <Paper className="flex ml-8 h-32 items-center w-full sm:max-w-320 space-x-8 px-16 rounded-full border-1 shadow-0">
                <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

                <input
                  style={{ background: 'transparent' }}
                  placeholder={`${t('SEARCH')} ${t(name)}`}
                  value={searchText}
                  onChange={onSearch}
                />
              </Paper>
            )}

            {tab && (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Box className="flex">
                  <Box
                    style={{
                      padding: '10px 20px',
                      cursor: 'pointer',
                    }}
                    label="Sortable"
                    className={tab.value === 'sortable' && 'bg-light-green-700 text-white'}
                    onClick={() => tab.setValue('sortable')}
                  >
                    Sortable
                  </Box>
                  <Box
                    style={{
                      padding: '10px 20px',
                      cursor: 'pointer',
                    }}
                    label="Nestable"
                    className={tab.value === 'nestable' && 'bg-light-blue-100'}
                    onClick={() => tab.setValue('nestable')}
                  >
                    Nestable
                  </Box>
                </Box>
              </Box>
            )}

            <Box
              component={motion.div}
              initial={{ y: -20, opacity: 1 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-full"
            />
            <Box>
              {viewActive && addButtonTo ? <AddButton /> : ''}
              {/* <Button onClick={startTour} className="ml-auto"> */}
              {/*  <SosIcon style={{ fill: 'red', fontSize: 30 }} /> */}
              {/* </Button> */}
            </Box>
          </div>
        ) : (
          ''
        )}
      </motion.div>

      {!disableNote && (
        <Box
          bgcolor="background.default"
          className={` w-full bg rounded-t-lg flex items-center overflow-hidden ${
            projectFilter || newsFilter ? 'p-0' : 'p-12'
          }`}
        >
          {projectFilter ? (
            <Box className="flex gap-10 pl-[10px] relative w-full " id="one">
              <Box className="w-[150px] mb-[10px]  ">
                <InputDateController
                  control={control}
                  errors={errors}
                  name="start_date"
                  label="START_DATE"
                />
              </Box>
              <Box className="w-[150px]">
                <InputDateController
                  control={control}
                  errors={errors}
                  name="end_date"
                  label="END_DATE"
                />
              </Box>
              <Box className="w-[160px]">
                <SelectController
                  control={control}
                  errors={errors}
                  name="areaAll"
                  label="FOCAL_AREA"
                  getOption={(v) => {
                    return v.translations.find(
                      (trs) => trs.language_id === translationLanguageInModal
                    )?.title;
                  }}
                  data={allArea}
                />
              </Box>
              <Box className="w-[150px]">
                <SelectController
                  control={control}
                  errors={errors}
                  name="region_group_id"
                  label="REGION"
                  getOption={(v) => {
                    return v.translations.find(
                      (trs) => trs.language_id === translationLanguageInModal
                    )?.title;
                  }}
                  data={regions}
                />
              </Box>
              <Box className="w-[150px]">
                <SelectController
                  control={control}
                  errors={errors}
                  name="status_id"
                  label="STATUS"
                  getOption={(v) => {
                    return v.translations.find(
                      (trs) => trs.language_id === translationLanguageInModal
                    )?.title;
                  }}
                  data={status}
                />
              </Box>
              <Box className="absolute right-[10px] flex gap-10 ">
                <Box className="w-[220px] h-[95px]  mt-[-42px] ml-[-10px]  ">
                  <FormButtons
                    filter
                    saveDisable={false}
                    onSubmitFunction={handleSubmit(onSubmit)}
                    // data={project}
                  />
                </Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    reset();
                    dispatch(
                      getProjects({
                        page: +searchParams.get('page') || 1,
                      })
                    );
                    setSearchParams([]);
                  }}
                  className=" px-[10px] h-[95px] mt-[13px] text-white bg-red-700 z-[9999] ml-[-50px] hover:text-red-A700 "
                >
                  {t('reset')}
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {newsFilter ? (
                <Box className="flex gap-10 pl-[10px] relative w-full ">
                  <Box className="w-[200px]">
                    <InputDateController
                      control={control}
                      errors={errors}
                      name="start_date"
                      label="START_DATE"
                    />
                  </Box>
                  <Box className="w-[200px]">
                    <InputDateController
                      control={control}
                      errors={errors}
                      name="end_date"
                      label="END_DATE"
                    />
                  </Box>

                  <Box className="absolute right-[10px] flex gap-10 ">
                    <Box className="w-[220px] h-[95px]  mt-[-42px] ml-[-10px]  ">
                      <FormButtons
                        filter
                        saveDisable={false}
                        onSubmitFunction={handleSubmit(newsOnSubmit)}
                        // data={project}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => {
                        reset();
                        dispatch(
                          getNews({
                            page: +searchParams.get('page') || 1,
                          })
                        );
                        setSearchParams([]);
                      }}
                      className=" px-[10px] h-[95px] mt-[13px]  bg-green z-[9999] ml-[-50px] "
                    >
                      {t('reset')}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <FuseSvgIcon
                    sx={{ display: 'inline-block', marginRight: '5px' }}
                    size={24}
                    color="action"
                  >
                    feather:info
                  </FuseSvgIcon>
                  {instruction}
                  {params.id !== 'new' && (
                    <Button onClick={startTour} className="ml-auto">
                      <SosIcon style={{ fill: 'red', fontSize: 30 }} />
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default HeaderContent;
