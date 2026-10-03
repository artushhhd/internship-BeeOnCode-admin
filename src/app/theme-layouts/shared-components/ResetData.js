import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';

import { $api } from '@api/http';
import { dataResetUrl } from '@api/url';
import { useSelector } from 'react-redux';
import { notifyError, notifySuccess } from '@helpers/toast';
import { useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/system/Box';
import { useTranslation } from 'react-i18next';

const ResetData = () => {
  const { devMode } = useSelector((state) => state.devMode);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  function waitms(delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
  const { t } = useTranslation('navigation');

  return (
    devMode &&
    process.env.REACT_APP_API_DEVMODE && (
      <>
        <IconButton className={`w-40 h-40 ${loading ? 'animate-spin' : ''}`} onClick={handleOpen}>
          <FuseSvgIcon className="text-48" size={24} color="error">
            feather:refresh-cw
          </FuseSvgIcon>
        </IconButton>
        <div>
          <Backdrop
            sx={{ color: 'error', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="error" />
          </Backdrop>
        </div>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <h4 className="text-center">{t('ARE_YOU_SURE_FRESH')}?</h4>
              <div className="flex justify-evenly mt-16">
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={loading}
                  onClick={handleClose}
                >
                  {t('NO')}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setLoading(true);
                    $api
                      .get(dataResetUrl)
                      .then((e) => notifySuccess(e.data.message))
                      .then(() => waitms(1500))
                      .then(() => window.location.reload())
                      .then(() => handleClose())
                      .catch((err) => {
                        setLoading(false);
                        notifyError(err.response.data.message);
                      });
                  }}
                  disabled={loading}
                >
                  {t('YES')}
                </Button>
              </div>
            </Box>
          </Modal>
        </div>
      </>
    )
  );
};

export default ResetData;
