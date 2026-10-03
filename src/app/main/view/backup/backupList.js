import { motion } from 'framer-motion';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import { REACT_APP_MODE } from '@api/http';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { backupRestoreById, backupRun, getBackup } from './store/backupSlice';
import BackupListItem from './BackupListItem';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
function BackupList({ backup, canManage }) {
  const dispatch = useDispatch();
  const { t } = useTranslation('navigation');
  const [open, setOpen] = useState(false);
  const [copyType, setCopyType] = useState('release');
  const [type, setType] = useState('sql');
  useEffect(() => {
    dispatch(getBackup());
    // eslint-disable-next-line
  }, []);
  const stateLoading = useSelector((state) => state.BackupApp.backupReducer.loading);

  if (!backup) {
    return null;
  }
  // if (backup.length === 0 && !stateLoading) {
  //   return <EmptyContent />;
  // }
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full   max-h-full px-10"
    >
      <Box className="w-full h-[30px] relative  ">
        <Button
          onClick={() => {
            dispatch(backupRun()).then(() => dispatch(getBackup()));
          }}
          className="absolute top-0 right-[30px] text-gray-50 bg-red hover:bg-blue-gray-A400"
          variant="contained"
        >
          {stateLoading ? <CircularProgress color="inherit" size={20} /> : t('BACKUPNOW')}
        </Button>
        {REACT_APP_MODE !== 'prod' ? (
          <Button
            className="ml-[70%]  hover:bg-blue-gray-A400"
            variant="contained"
            color="secondary"
            onClick={() => setOpen(true)}
          >
            {t('COPYFROM')}
          </Button>
        ) : null}
      </Box>
      <Box className="flex items-center w-full h-[50px] text-[20px]">
        <Box className="ml-[30px] w-[380px]  ">{t('DESCRIPTION')}</Box>
        <Box className="w-[230px]  ">{t('DATE')} </Box>
        <Box className="">{t('DISKSIZE')} </Box>
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }} className=" flex flex-col items-center justify-center">
          <h2 id="child-modal-title">{t('COPYFROMWHERE')}</h2>
          <FormControl fullWidth className="mt-[20px]">
            <InputLabel id="demo-simple-select-label">{t('FROMWHERE')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={copyType}
              label={t('FROMWHERE')}
              onChange={(e) => {
                setCopyType(e.target.value);
              }}
            >
              <MenuItem value="production">Production</MenuItem>
              <MenuItem value="release">Release</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth className="mt-[20px]">
            <InputLabel id="demo-simple-select-label">{t('COPYFROMWHAT')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label={t('COPYFROMWHAT')}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <MenuItem value="sql">SQL</MenuItem>
              <MenuItem value="storage">STORAGE</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>

          <Button
            className="my-12"
            variant="contained"
            color="secondary"
            onClick={() => {
              dispatch(backupRestoreById({ id: '', name: copyType, choice: type })).then(() => {
                setOpen(false);
              });
            }}
          >
            {t('COPY')}
          </Button>
        </Box>
      </Modal>
      <DragAndDrop data={backup} disableKey={canManage}>
        <BackupListItem canManage={canManage} />
      </DragAndDrop>
    </motion.div>
  );
}

export default BackupList;
