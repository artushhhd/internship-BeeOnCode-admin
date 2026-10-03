import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import { FILE_API_URL } from '@api/http';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { getSlides, selectSlider } from './store/sliderSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 750,
  bgcolor: 'rgb(18, 17, 17)',
  boxShadow: 24,
  p: 4,
};
const Slider = ({ setCollapseAll, collapseAll, value }) => {
  const { translationLanguageInModal } = useSelector((state) => state.i18n);
  const slider = useSelector(selectSlider);

  const dispatch = useDispatch();

  dispatch(getSlides);

  return (
    <>
      {collapseAll && (
        <Modal
          open={collapseAll}
          onClose={() => setCollapseAll(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              onSwiper={(swiper) => null}
              onSlideChange={() => null}
            >
              {slider.map((slid) => {
                return (
                  <SwiperSlide
                    key={slid.id}
                    style={{
                      maxWidth: '100%',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItem: 'center',
                    }}
                  >
                    <Box
                      style={{
                        width: '100%',
                        height: '500px',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItem: 'center',
                      }}
                    >
                      {slid.file_type === 'image' ? (
                        <div
                          style={{
                            width: '100%',
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <img
                            width="500px"
                            height="250px"
                            src={`${FILE_API_URL}/${slid.media.medium_url}`}
                            alt="Slider"
                            className="rounded"
                          />
                          {slid.translations.map((text) => {
                            return (
                              text.language_id === translationLanguageInModal && (
                                <div
                                  key={text.id}
                                  style={{
                                    background: `${slid.color}`,
                                    width: '100%',
                                    minHeight: '50px',
                                    opacity: '0.5',
                                    position: 'relative',
                                    bottom: '50px',
                                  }}
                                >
                                  <p style={{ marginLeft: '20px' }} key={text.id}>
                                    {text?.caption}
                                  </p>
                                </div>
                              )
                            );
                          })}
                          <div />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <ReactPlayer
                            url={
                              slid.file_type === 'video'
                                ? `${FILE_API_URL}/${slid.media.medium_url}`
                                : slid.media.youtube_link
                            }
                            width="700px"
                            maxHeight="400px"
                            volume={1}
                            loop
                            controls
                          />
                          {slid.translations.map((text) => {
                            return (
                              text.language_id === translationLanguageInModal && (
                                <div
                                  key={text.id}
                                  style={{
                                    background: `${slid.color}`,
                                    width: '100%',
                                    height: '50px',
                                    opacity: '0.5',
                                    position: 'relative',
                                    bottom: '50px',
                                  }}
                                >
                                  <p style={{ marginLeft: '20px' }} key={text.id}>
                                    {text?.caption}
                                  </p>
                                </div>
                              )
                            );
                          })}
                        </div>
                      )}
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default Slider;
