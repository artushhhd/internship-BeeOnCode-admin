import Modal from '@mui/material/Modal';
import Box from '@mui/system/Box';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar, Keyboard } from 'swiper';
import { FILE_API_URL } from '@api/http';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ReactPlayer from 'react-player';

function FileManagerSwiper({ photo, setPhoto, files }) {
  const sliderOpen = photo !== -1;
  const handleSliderClose = () => setPhoto(-1);

  return (
    <Modal
      open={sliderOpen}
      onClose={handleSliderClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box
        className="flex flex-col justify-center items-center"
        style={{ width: '100%', height: '100vh' }}
        onClick={handleSliderClose}
      >
        <Box onClick={(ev) => ev.stopPropagation()}>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Keyboard]}
            spaceBetween={50}
            slidesPerView={1}
            initialSlide={photo}
            navigation
            onSwiper={() => null}
            onSlideChange={() => null}
            style={{
              maxWidth: '1100px',
              minHeight: '80vh',
              maxHeight: '95vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {files?.map((slid) => {
              return (
                <SwiperSlide
                  key={slid.id}
                  style={{
                    maxWidth: '100%',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {slid.type === 'image' ? (
                    <div
                      style={{
                        width: '1100px',
                        minHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        style={{
                          maxWidth: '1000px',
                          minWidth: '600px',
                          maxHeight: '70vh',
                          minHeight: '70vh',
                          objectFit: 'contain',
                        }}
                        src={`${FILE_API_URL}/${slid.name}`}
                        alt="Slider"
                        className="rounded"
                      />
                      <div />
                      <Box className="my-8 w-[90%] flex items-center justify-center">
                        {slid.created_at && (
                          <MoreTimeIcon sx={{ color: '#0B847F', fontSize: '27px' }} />
                        )}
                        {slid.created_at}
                      </Box>
                    </div>
                  ) : (
                    <div
                      style={{
                        maxWidth: '100%',
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '600px',
                          height: '400px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ReactPlayer
                          url={slid.youtube_link}
                          // minWidth="300px"
                          // maxHeight="400px"
                          volume={1}
                          loop
                          controls
                        />
                      </div>
                      <Box className="my-8 w-[90%] flex items-center justify-center">
                        <MoreTimeIcon sx={{ color: '#0B847F', fontSize: '27px' }} />{' '}
                        {slid.created_at}
                      </Box>
                    </div>
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Box>
      </Box>
    </Modal>
  );
}

export default FileManagerSwiper;
