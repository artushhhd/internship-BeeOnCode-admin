import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import FuseLoading from '@fuse/core/FuseLoading';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AreasListItem from './AreasListItem';
import { changeAreaOrder, getAreas, selectAreasLoading } from '../store/areasSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
function AreasList({ canManage, filteredData }) {
  const loading = useSelector(selectAreasLoading);
  const { t } = useTranslation('navigation');

  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  if (loading) {
    return <FuseLoading />;
  }

  // if (filteredData.length === 0) {
  //   return <EmptyContent name="AREAS" />;
  // }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full px-10"
    >
      <Box className="w-[450px]">
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab
              onClick={() => dispatch(getAreas('focal_area'))}
              label={t('FOCAL_AREA')}
              {...a11yProps(0)}
            />
            <Tab
              onClick={() => dispatch(getAreas('cross_cutting_area'))}
              label={t('CROSS_CUTTING_AREAS')}
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
      </Box>
      <DragAndDrop data={filteredData} update={changeAreaOrder} disableKey={!canManage}>
        <AreasListItem canManage={canManage} />
      </DragAndDrop>
    </motion.div>
  );
}

export default AreasList;
