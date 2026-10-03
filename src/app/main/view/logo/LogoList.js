import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { Tab, AppBar, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/system/Box';
import { useSearchParams } from 'react-router-dom';
import { selectFilteredLogos } from './store/logosSlice';
import LogoForm from './logo/LogoForm';
import AboutForm from './logo/AboutForm';

function LogoList({ canManage }) {
  const [tabType, setTabType] = useState(1);
  const filteredData = useSelector(selectFilteredLogos);
  const { t } = useTranslation('navigation');
  const [sParam, setSParam] = useSearchParams();
  const checked = +sParam.get('id') || 1;

  const Logosteps = [
    {
      element: '#step1',
      // logo
      intro: t('CHANGESTEP', { name: t('LOGO'), which: t('PAGE') }),
    },
    {
      element: '#step2',
      // title
      intro: t('CHANGESTEP', { name: t('TITLE'), which: t('PAGE') }),
    },
    {
      element: '#step4',
      // favicon
      intro: t('CHANGESTEP', { name: 'Favicon', which: t('PAGE') }),
    },
    {
      element: '#step3',
      // save
      intro: t('SAVESTEP'),
    },
  ];

  const Partnersteps = [
    {
      element: '#step1',
      // logo
      intro: t('CHANGESTEP', { name: t('LOGO'), which: t('PARTNER') }),
    },
    {
      element: '#step2',
      // title
      intro: t('CHANGESTEP', { name: t('TITLE'), which: t('PARTNER') }),
    },
    {
      element: '#step3',
      // title
      intro: t('CHANGESTEP', { name: t('LINK'), which: t('PARTNER') }),
    },
    {
      element: '#step4',
      // save
      intro: t('SAVESTEP'),
    },
  ];

  const AboutSteps = [
    {
      element: '#step1',
      // add file
      intro: t('ADDSTEP', { name: t('FILE') }),
    },
    {
      element: '#step2',
      // title
      intro: t('CHANGESTEP', { name: t('TITLE'), which: t('ABOUT') }),
    },
    {
      element: '#step3',
      // title
      intro: t('CHANGESTEP', { name: t('SHORT_DESCRIPTION'), which: t('ABOUT') }),
    },
    {
      element: '#step4',
      // title
      intro: t('CHANGESTEP', { name: t('CONTENT'), which: t('ABOUT') }),
    },
    {
      element: '#step5',
      // save
      intro: t('SAVESTEP'),
    },
  ];

  const Missionsteps = [
    {
      element: '#step1',
      // logo
      intro: t('CHANGESTEP', { name: t('LOGO'), which: t('OURMISSION') }),
    },
    {
      element: '#step2',
      // title
      intro: t('CHANGESTEP', { name: t('TITLE'), which: t('OURMISSION') }),
    },
    {
      element: '#step3',
      // title
      intro: t('CHANGESTEP', { name: t('SHORT_DESCRIPTION'), which: t('OURMISSION') }),
    },
    {
      element: '#step4',
      // title
      intro: t('CHANGESTEP', { name: t('CONTENT'), which: t('OURMISSION') }),
    },
    {
      element: '#step5',
      // save
      intro: t('SAVESTEP'),
    },
  ];

  const AnalyiticSteps = [
    {
      element: '#step4',
      // title
      intro: t('CHANGESTEP', { name: t('ANALYTICS'), which: t('PAGE') }),
    },
  ];

  const MapSteps = [
    {
      element: '#step4',
      // title
      intro: t('CHANGESTEP', { name: t('MAP'), which: t('PAGE') }),
    },
  ];
  useEffect(() => {
    setTabType(checked);
  }, [checked]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="text.secondary" variant="h5">
          There are no logos!
        </Typography>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col  flex-auto w-full max-h-full"
    >
      <AppBar position="static" className="w-[700px] ml-[10px]">
        <Tabs
          value={tabType}
          onChange={(e, value) =>
            setSParam({
              id: value,
            })
          }
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={t('LOGOSETTINGS')} value={1} />
          {/* <Tab label={t('PARTNERS')} value={2} /> */}
          <Tab label={t('ABOUT')} value={3} />
          {/* <Tab label={t('OURMISSION')} value={4} /> */}
          {/* <Tab label={t('ANALYTICS')} value={5} /> */}
          {/* <Tab label={t('MAP')} value={6} /> */}
        </Tabs>
      </AppBar>
      <Box className="w-full overflow-auto	">
        {tabType === 1 && <LogoForm steps={Logosteps} canManage={canManage} />}
        {/* {tabType === 2 && <PartnersForm steps={Partnersteps} canManage={canManage} />} */}
        {tabType === 3 && <AboutForm steps={AboutSteps} canManage={canManage} />}
        {/* {tabType === 4 && <Mission steps={Missionsteps} canManage={canManage} />} */}
        {/* {tabType === 5 && <AnalyticsForm steps={AnalyiticSteps} canManage={canManage} />} */}
        {/* {tabType === 6 && <MapKeyForm steps={MapSteps} canManage={canManage} />} */}
      </Box>
    </motion.div>
  );
}

export default LogoList;
