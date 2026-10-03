import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import DevMode from 'app/shared-components/DevMode';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import formatDate from '@helpers/formatDate';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import { backupRestoreById, getBackup } from './store/backupSlice';

export default function BackupListItem(props) {
  const { t } = useTranslation('navigation');
  const { item, canManage } = props;
  const dispatch = useDispatch();
  const stateLoading = useSelector((state) => state.BackupApp.backupReducer.loading);
  const { id } = useParams();
  return (
    <>
      <ListItem
        id="two"
        className="px-32 py-16 relative "
        sx={{ bgcolor: item.id === +id ? '' : 'background.paper' }}
      >
        <DevMode>{`id: ${item.id}`}</DevMode>
        <Box className="w-[380px] ">{item?.name}</Box>
        <Box className="w-[230px]">{formatDate(item?.date)}</Box>
        <Box className="">{item?.size}</Box>

        <Button
          onClick={() => {
            dispatch(backupRestoreById({ id: item.id, name: '', choice: '' }));
            dispatch(getBackup());
          }}
          className="absolute right-[30px] bg-blue hover:bg-blue-gray-A400"
          variant="contained"
        >
          {stateLoading ? <CircularProgress color="inherit" size={20} /> : t('RESTORE')}
        </Button>
      </ListItem>

      <Divider />
    </>
  );
}
