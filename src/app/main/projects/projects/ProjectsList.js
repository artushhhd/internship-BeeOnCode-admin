import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import Paginate from 'app/shared-components/pagination';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ButtonGroup from '@mui/material/ButtonGroup';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import HorizontalDND from 'app/shared-components/HorizontalDND';
import ProjectListItem from './ProjectListItem';
import { changeOrderProjects, getProjects } from '../store/projectsSlice';
import UploadFile from './UploadFile';
import ProjectGridListItem from './ProjectGridListItem';

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function ProjectsList({ canManage, filteredData, pageTotal, from, to, whole }) {
  const dispatch = useDispatch();
  const { t } = useTranslation('navigation');
  const { excelDownload } = useSelector((state) => state.ProjectsApp.projects);
  console.log(excelDownload, 1111);

  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('list'); // Default view is list

  const handleViewChange = (newView) => {
    setView(newView);
  };
  const [sort, setSort] = useState('date');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    if (searchParams.get('isPubleshed')) {
      setValue(+searchParams.get('isPubleshed') === 1 ? 0 : 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('isPubleshed')]);

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (searchParams.get('isPublished')) {
      setValue(searchParams.get('isPublished') === '1' ? 0 : 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('isPublished')]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full relative "
    >
      <Box
        className={`w-full pb-[15px] flex flex-col h-[115px] '
        } `}
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
          <Box className="w-[700px] mt-[-10px]  ">
            {pageTotal > 1 && <Paginate pageTotal={pageTotal} />}
          </Box>
        </Box>
        <Box className="flex  items-end gap-12 mt-[10px] ml-[10px]">
          <Box className="w-[400px] mt-[20px]  ">
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
                  onClick={() => {
                    dispatch(
                      getProjects({
                        page: 1,
                        isPubleshed: 1,
                        sorting_order: searchParams.get('sorting') || null,
                        sort_by: searchParams.get('sort') || null,
                        statusId: searchParams.get('status') || null,
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
                      getProjects({
                        page: 1,
                        isPubleshed: '0',
                        sorting_order: searchParams.get('sorting') || null,
                        sort_by: searchParams.get('sort') || null,
                        statusId: searchParams.get('status') || null,
                      })
                    );
                    // setSearchParams({ isPublished: 0 });
                  }}
                  label={t('UNPUBLISHED')}
                  {...a11yProps(1)}
                />
              </Tabs>
            </AppBar>
          </Box>

          <Box className="flex gap-10">
            <Box className="w-[200px] pt-[15px]">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{t('SORT')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sort}
                  label={t('SORT')}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setSearchParams({
                      page: searchParams.get('page'),
                      sort: e.target.value,
                      sorting: searchParams.get('sorting') || 'asc',
                    });
                  }}
                >
                  {/* <MenuItem value="date">{t('DATE')}</MenuItem> */}
                  {/* <MenuItem value="number">{t('Number')}</MenuItem> */}
                  <MenuItem value="title">{t('TITLE')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* <Box className="w-[150px] pt-[15px] "> */}
            {/*  <FormControl fullWidth> */}
            {/*    <InputLabel id="demo-simple-select-label">{t('order')}</InputLabel> */}
            {/*    <Select */}
            {/*      labelId="demo-simple-select-label" */}
            {/*      id="demo-simple-select" */}
            {/*      value={order} */}
            {/*      label={t('order')} */}
            {/*      onChange={(e) => { */}
            {/*        setOrder(e.target.value); */}
            {/*        setSearchParams({ */}
            {/*          page: searchParams.get('page'), */}
            {/*          sort: searchParams.get('sort') || 'date', */}
            {/*          sorting: e.target.value || 'asc', */}
            {/*        }); */}
            {/*      }} */}
            {/*    > */}
            {/*      <MenuItem value="asc">{t('ASC')}</MenuItem> */}
            {/*      <MenuItem value="desc">{t('DESC')}</MenuItem> */}
            {/*    </Select> */}
            {/*  </FormControl> */}
            {/* </Box> */}
          </Box>
          <ButtonGroup
            sx={{
              position: 'absolute',
              right: '10px',
            }}
            variant="outlined"
            aria-label="view toggle"
          >
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
        {/* <Box onClick={handleOpen} className="absolute right-[50px]  w-[100px] h-[50px]"> */}
        {/*  <Button variant="contained"> {t('CHECK')}</Button> */}
        {/* </Box> */}
        {/* <a */}
        {/*  target="_blank" */}
        {/*  href={`${FILE_API_URL}/${excelDownload?.file_path}`} */}
        {/*  className="absolute right-[170px] flex justify-center items-center  px-[10px] py-[10px] rounded-[20px]" */}
        {/*  rel="noreferrer" */}
        {/* > */}
        {/*  {t('DOWNLOAD')} */}
        {/* </a> */}
        <UploadFile open={open} setOpen={setOpen} handleClose={handleClose} />
      </Box>
      <Box className="">
        {filteredData?.length > 0 &&
          (view === 'list' ? (
            <DragAndDrop data={filteredData} update={changeOrderProjects} disableKey={canManage}>
              <ProjectListItem filteredData={filteredData} canManage={canManage} />
            </DragAndDrop>
          ) : (
            <HorizontalDND
              maxItems={5}
              data={filteredData}
              update={changeOrderProjects}
              disableKey={canManage}
            >
              <ProjectGridListItem filteredData={filteredData} canManage={canManage} />
            </HorizontalDND>
          ))}
      </Box>
      <Box className="w-full  pb-[15px] flex items-center justify-center mt-[30px]">
        <Box className="flex w-[250px] absolute left-[50px]  " component="div">
          {pageTotal > 1
            ? `${t('DISPLAYFROMTO', {
                count: from,
                total: to,
                whole,
              })}`
            : null}
        </Box>

        {pageTotal > 1 && <Paginate pageTotal={pageTotal} />}
      </Box>
    </motion.div>
  );
}

export default ProjectsList;
