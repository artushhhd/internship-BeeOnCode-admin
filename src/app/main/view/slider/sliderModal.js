import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, Box } from '@mui/system';
import { Modal } from '@mui/material';
import { FILE_API_URL } from '@api/http';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { selectSlider } from './store/sliderSlice';

const SliderModal = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);
  const slider = useSelector(selectSlider);
  const item = slider.find((val) => val.id === open);
  return (
    <div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <Box sx={style}>
          <Box
            className="text-12 whitespace-nowrap"
            color="text.secondary"
            onClick={() => {
              setOpen(item.id);
            }}
          >
            {item?.media.type === 'image' ? (
              <div
                id="three"
                style={{
                  width: '500px',
                  height: '350px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  style={{ maxWidth: '500px', height: '300px' }}
                  src={`${FILE_API_URL}/${item.media?.medium_url}`}
                  alt="Slider"
                  className="rounded"
                />
              </div>
            ) : (
              <Box id="three">
                <ReactPlayer
                  className="react-player"
                  url={
                    item.file_type === 'video'
                      ? `${FILE_API_URL}/${item.media?.name}`
                      : item.media.youtube_link
                  }
                  width="500px"
                  height="350px"
                  volume={1}
                />
              </Box>
            )}
          </Box>
        </Box>
      </StyledModal>
    </div>
  );
};

const Backdrop = React.forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return <div className={clsx({ 'MuiBackdrop-open': open }, className)} ref={ref} {...other} />;
});

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const blue = {
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme) => ({
  width: 'auto',
  borderRadius: '12px',
  padding: '16px 32px 24px 32px',
  backgroundColor: theme.palette.mode === 'dark' ? '#0A1929' : 'white',
  boxShadow: `0px 2px 24px ${theme.palette.mode === 'dark' ? '#000' : '#383838'}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const TriggerButton = styled('button')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  border-radius: 12px;
  padding: 6px 12px;
  line-height: 1.5;
  background: transparent;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[100] : grey[900]};

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
  }

  &:focus-visible {
    border-color: ${blue[400]};
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
  }
  `
);
export default SliderModal;
