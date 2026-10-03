import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import Box from '@mui/system/Box';
import { useTranslation } from 'react-i18next';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import { useState } from 'react';
import { CircularProgress, Zoom } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';

const FormButtons = ({ edit, saveDisable, onSubmitFunction, onDeleteFunction, filter = false }) => {
  const { t } = useTranslation('navigation');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { maximize } = useSelector((state) => state.rightBarSlice);

  return (
    <Box
      className={`sticky bottom-0 z-40 flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t transition-all ${
        maximize ? 'border-transparent opacity-50 hover:border-current hover:opacity-100' : ''
      }`}
      sx={{ backgroundColor: 'background.default' }}
    >
      {edit && (
        <Button color="error" onClick={() => setOpen(true)}>
          <Tooltip
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 300 }}
            title={t('DELETE')}
            enterDelay={500}
            leaveDelay={200}
            followCursor
          >
            <span>{t('DELETE')}</span>
          </Tooltip>
        </Button>
      )}
      {/* {router.id !== 'new' && <History data={data} />} */}
      <Button
        className="ml-auto"
        style={{ visibility: 'hidden' }}
        component={NavLinkAdapter}
        to={-1}
      >
        <Tooltip
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 300 }}
          title={t('PREVIOUS')}
          enterDelay={500}
          leaveDelay={200}
          followCursor
        >
          <span>{t('PREVIOUS')}</span>
        </Tooltip>
      </Button>

      <Button
        className="ml-8 flex justify-center w-[100px]"
        variant="contained"
        color="secondary"
        disabled={saveDisable || loading}
        onClick={() => {
          onSubmitFunction();
          setLoading(false);
        }}
      >
        <Tooltip
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 300 }}
          title={t('SAVE')}
          enterDelay={500}
          leaveDelay={200}
          followCursor
        >
          {filter ? (
            <span>{t('FILTER')}</span>
          ) : (
            <span> {loading ? <CircularProgress size={20} /> : t('SAVE')}</span>
          )}
        </Tooltip>
      </Button>

      <DeleteModal
        open={open}
        close={() => setOpen(false)}
        name="section"
        onClick={onDeleteFunction}
      />
    </Box>
  );
};

export default FormButtons;
