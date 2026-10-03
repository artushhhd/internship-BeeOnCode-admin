import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import FuseLoading from '@fuse/core/FuseLoading';
import Paginate from 'app/shared-components/pagination';
import Box from '@mui/material/Box';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import HorizontalDND from 'app/shared-components/HorizontalDND';
import { changeOrderNews, getNews, selectNewsLoading } from './store/newsSlice';
import NewsItemListItem from './NewsItemListItem';
import NewsGridListItem from './NewsGridListItem';

function NewsList({ canManage, filteredData, pageTotal, perPage, from, to, whole }) {
  const loading = useSelector(selectNewsLoading);
  const { t } = useTranslation('navigation');
  const dispatch = useDispatch();
  const [openFilter, setOpenFilter] = useState(false);
  const [view, setView] = useState('list'); // Default view is list

  const handleViewChange = (newView) => {
    setView(newView);
  };
  const [searchParams] = useSearchParams();
  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
  });

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  const [value, setValue] = useState(0);
  // useEffect(() => {
  //   if (searchParams.get('isPubleshed')) {
  //     setValue(+searchParams.get('isPubleshed') === 1 ? 0 : 1);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchParams.get('isPubleshed')]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (searchParams.get('isPublished')) {
      setValue(searchParams.get('isPublished') === '1' ? 0 : 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('isPublished')]);

  if (loading) {
    return (
      <>
        <FuseLoading />;
      </>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className={`flex flex-col items-center flex-auto w-full h-[10px]
      ${openFilter ? 'pt-[70px]' : 'pt-0'}`}
    >
      <Box className="flex w-full pt-[10px] pl-[10px] ">
        <span>
          {pageTotal > 1
            ? `${t('DISPLAYFROMTO', {
                count: from,
                total: to,
                whole,
              })}`
            : `${t('DISPLAYFROMTO', {
                count: from,
                total: to,
                whole,
              })}`}
        </span>
        <Box className="w-[700px] mt-[-10px] ">
          {pageTotal > 1 && <Paginate pageTotal={pageTotal} />}
        </Box>
      </Box>

      <Box className={` w-full ${pageTotal <= 1 ? 'mt-[70px]' : 'mt-[65px]'} `}>
        {filteredData &&
          (view === 'list' ? (
            <DragAndDrop data={filteredData} update={changeOrderNews} disableKey={canManage}>
              <NewsItemListItem filteredData={filteredData} canManage={canManage} />
            </DragAndDrop>
          ) : (
            <HorizontalDND
              maxItems={5}
              data={filteredData}
              update={changeOrderNews}
              disableKey={canManage}
            >
              <NewsGridListItem filteredData={filteredData} canManage={canManage} />
            </HorizontalDND>
          ))}
      </Box>
      {pageTotal && (
        <Box className="w-[600px]  py-[30px] flex items-center justify-center ">
          <Box className="flex w-[250px]  absolute left-[50px] " component="div">
            {`${t('DISPLAYFROMTO', {
              count: from,
              total: to,
              whole,
            })}`}
          </Box>
          {pageTotal > 1 && <Paginate pageTotal={pageTotal} />}
        </Box>
      )}
      <Box
        className={`w-full flex justify-between  absolute left-0 t ${
          openFilter ? 'top-[155px]' : 'top-[45px]'
        }`}
      >
        <AppBar position="static" className="w-[400px]">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab
              onClick={() => {
                dispatch(
                  getNews({
                    page: 1,
                    isPubleshed: 1,
                  })
                );
                // setSearchParams({ isPublished: 1 });
              }}
              label={t('PUBLISHED')}
              {...a11yProps(0)}
            />
            <Tab
              onClick={() => {
                dispatch(
                  getNews({
                    page: 1,
                    isPubleshed: '0',
                  })
                );
                // setSearchParams({ isPublished: 0 });
              }}
              label={t('UNPUBLISHED')}
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>

        <ButtonGroup variant="outlined" aria-label="view toggle">
          <Button
            onClick={() => handleViewChange('list')}
            variant={view === 'list' ? 'contained' : 'outlined'}
            startIcon={<ViewListIcon />}
          />
          <Button
            onClick={() => handleViewChange('grid')}
            variant={view === 'grid' ? 'contained' : 'outlined'}
            startIcon={<ViewModuleIcon />}
          />
        </ButtonGroup>
      </Box>
    </motion.div>
  );
}

export default NewsList;
