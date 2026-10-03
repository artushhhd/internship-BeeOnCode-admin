import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';
import { FILE_API_URL } from '@api/http';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FileManagerModal from 'app/shared-components/modals/FileManagerModal';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import SelectController from 'app/shared-components/fields/SelectController';
import Divider from '@mui/material/Divider';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import Modal from '@mui/material/Modal';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { getCategories, selectCategories } from '../../../../projects/store/categoriesSlice';
import { setGalleryObj } from '../../store/pageSectionSlice';
import { getPageSections } from '../../store/pageSectionsSlice';

export const Root = styled('div')(({ theme }) => ({
  '& .productImageX': {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'red',
    opacity: 0,
  },

  '& .productImageUpload': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },

  '& .productImageItem': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    '&:hover': {
      '& .productImageX': {
        opacity: 1,
      },
    },
  },
}));

const GalleryForm = ({ reset, section, errors, control, edit, watch }) => {
  const { t } = useTranslation('navigation');
  const categories = useSelector(selectCategories);
  const [linksData, setLinksData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [deletedMedia, setDeletedMedia] = useState([]);
  const [uniqId, setUniqId] = useState(1);
  const dispatch = useDispatch();
  const [modulOpen, setModulOpen] = useState(false);
  const [pastarPhoto, setPastarPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const { id } = useParams();
  const { translationLanguages, translationLanguageInModal, translationLanguage } = useSelector(
    (state) => state.i18n
  );
  const [defaultSelected, setDefaultSelected] = useState([]);
  const [selectedStates, setSelectedStates] = useState({});
  const [imgId, setImgId] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSliderOpen = () => setModulOpen(true);
  const handleSliderClose = () => setModulOpen(false);

  useEffect(() => {
    setUniqId(Math.floor(Math.random() * 99999999999999 + 1));
  }, [galleryData]);

  const copySection = useMemo(() => {
    return { ...selectedStates };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const object = {};
    const arr = [];
    defaultSelected?.forEach((o) => {
      if (object[`selected${o.category_id}`]) {
        object[`selected${o.category_id}`].push(o.media);
      } else {
        object[`selected${o.category_id}`] = [o.media];
        arr.push({ id: o.category_id, language_id: o.language_id, delete: false });
      }
    });
    setSelectedStates(object);
    setGalleryData(arr);
  }, [defaultSelected]);

  useEffect(
    () => {
      dispatch(getCategories());
      if (section?.type === 'gallery') {
        if (edit) {
          section.translations.forEach((item, i) => {
            copySection[`title${item.language_id}`] = item.title;
          });
          copySection.type = section?.type;
          copySection.id = section?.id;
          copySection.gallery = section.gallery;

          copySection.gallery?.forEach((f, i) => {
            copySection[`category_id${f.category_id}`] = f.category_id;
            copySection[`galleryTitle${f.category_id}_${f.language_id}`] = f.title;
          });

          setDefaultSelected(copySection.gallery);
        } else {
          translationLanguages.forEach((language) => {
            copySection[`title${language.id}`] = '';
          });
        }
        reset({ ...copySection });
      }
    },
    // eslint-disable-next-line
    [section, edit, copySection, reset]);

  useEffect(() => {
    dispatch(getPageSections(id));
    reset({ ...copySection });
    // eslint-disable-next-line
  }, [copySection, id]);

  useEffect(() => {
    if (!edit) {
      const updatedSelectedStates = { ...selectedStates };
      galleryData?.forEach((gallery) => {
        if (!updatedSelectedStates[`selected${gallery?.id}`]) {
          updatedSelectedStates[`selected${gallery?.id}`] = [];
        }
      });

      setSelectedStates(updatedSelectedStates);
    }
    // eslint-disable-next-line
  }, [galleryData]);
  useEffect(() => {
    dispatch(setGalleryObj(selectedStates));
    // eslint-disable-next-line
  }, [selectedStates]);

  return translationLanguages.map((l) => {
    return (
      l.id === translationLanguageInModal && (
        <div className={edit ? 'p-24 ' : ''} key={`gallery${l.id}`}>
          <InputTranslationController control={control} errors={errors} name="title" />
          <div className="grid">
            <Controller
              name="links"
              control={control}
              render={({ field: { onChange, value } }) => {
                if (!value) {
                  onChange(galleryData);
                }
                return (
                  <Box
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                          ? lighten(theme.palette.background.default, 0.4)
                          : lighten(theme.palette.background.default, 0.02),
                    }}
                    component="button"
                    className="productImageUpload flex items-center justify-center relative w-full h-32 rounded-16 mr-12 mt-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                    onClick={() => {
                      const data = [
                        ...galleryData,
                        { id: uniqId, deleted: false, language_id: translationLanguageInModal },
                      ];
                      onChange(data);
                      setGalleryData(data);
                      reset({ ...copySection, ...watch() });
                    }}
                  >
                    <FuseSvgIcon size={32} color="action">
                      heroicons-outline:plus
                    </FuseSvgIcon>
                  </Box>
                );
              }}
            />
          </div>

          {galleryData?.map((gallery, i) => {
            return (
              gallery.language_id === translationLanguageInModal &&
              !gallery.deleted && (
                <Box key={`galleryTitle${gallery.id}`}>
                  <Box className="flex w-full justify-between items-end gap-[15px] relative">
                    <Root className="w-full pt-[17px]">
                      <div className="w-full">
                        <InputTranslationController
                          name={`galleryTitle${gallery.id}_`}
                          control={control}
                          errors={errors}
                        />
                      </div>
                      <div className="flex w-full justify-center sm:justify-start flex-wrap ">
                        <SelectController
                          control={control}
                          errors={errors}
                          name={`category_id${gallery.id}`}
                          label="CATEGORIES"
                          getOption={(v) => {
                            return v?.translations.find(
                              (trs) => trs.language_id === translationLanguage
                            )?.title;
                          }}
                          data={categories}
                        />
                        <Controller
                          name="gallery"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Box
                              sx={{
                                backgroundColor: (theme) =>
                                  theme.palette.mode === 'light'
                                    ? lighten(theme.palette.background.default, 0.4)
                                    : lighten(theme.palette.background.default, 0.02),
                              }}
                              onClick={() => {
                                handleOpen();
                                setImgId(`selected${gallery.id}`);
                              }}
                              className="productImageUpload flex items-center justify-center relative w-full h-32 rounded-16 mr-12 mt-12 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                            >
                              <FuseSvgIcon size={32}>heroicons-outline:upload</FuseSvgIcon>
                            </Box>
                          )}
                        />
                      </div>
                      <div className="w-full flex flex-wrap">
                        {selectedStates[`selected${gallery.id}`]?.map((media, index) => {
                          // eslint-disable-next-line no-nested-ternary
                          return media.type === 'image' || media?.media?.type === 'image' ? (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                            <div
                              role="button"
                              tabIndex={0}
                              className={clsx(
                                'productImageItem flex items-center justify-center relative w-96 h-96 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                              )}
                              key={`gallery-${gallery.id}-${media.id}`}
                            >
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStates((prevSelectedStates) => {
                                    const updatedSelected = prevSelectedStates[
                                      `selected${gallery.id}`
                                    ].filter((s) => s.id !== media.id);

                                    return {
                                      ...prevSelectedStates,
                                      [`selected${gallery.id}`]: updatedSelected,
                                    };
                                  });
                                  handleSliderClose();
                                }}
                                className="productImageX z-9999"
                              >
                                <FuseSvgIcon className="productImageX z-9999">
                                  heroicons-outline:x
                                </FuseSvgIcon>
                              </Button>
                              {/* eslint-disable-next-line */}
                              <button className="absolute top-0 left-0 p-1 m-0 bg-white rounded-lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModulOpen(true);
                                  setPastarPhoto(index);
                                }}
                              >
                                <FuseSvgIcon size={24} color="primary">
                                  heroicons-outline:eye
                                </FuseSvgIcon>
                              </button>
                              <img
                                className="max-w-none w-auto h-full"
                                src={
                                  `${FILE_API_URL}/${
                                    media?.src ||
                                    media?.media?.thumbnail_url ||
                                    media?.thumbnail_url
                                  }` ||
                                  `${FILE_API_URL}/${
                                    media?.thumbnail_url || media?.media?.thumbnail_url
                                  }`
                                }
                                alt="section_image"
                              />
                            </div>
                          ) : // eslint-disable-next-line no-nested-ternary
                          media.type === 'gallery' ? (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                            <div
                              role="button"
                              tabIndex={0}
                              className={clsx(
                                'productImageItem flex items-center justify-center relative w-96 h-96 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                              )}
                              key={`img_${gallery.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setModulOpen(true);
                                setPastarPhoto(index);
                              }}
                            >
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStates((prevSelectedStates) => {
                                    const updatedSelected = prevSelectedStates[
                                      `selected${gallery.id}`
                                    ].filter((s) => s.id !== media.id);

                                    return {
                                      ...prevSelectedStates,
                                      [`selected${gallery.id}`]: updatedSelected,
                                    };
                                  });
                                  handleSliderClose();
                                }}
                                className="productImageX z-9999"
                              >
                                <FuseSvgIcon className="productImageX z-9999">
                                  heroicons-outline:x
                                </FuseSvgIcon>
                              </Button>
                              <img
                                className="max-w-none w-auto h-full"
                                src={`https://img.youtube.com/vi/${media.youtube_id}/maxresdefault.jpg`}
                                alt="section_image"
                              />
                            </div>
                          ) : media.type === 'video' ? (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                            <div
                              role="button"
                              tabIndex={0}
                              className={clsx(
                                'productImageItem flex items-center justify-center relative w-96 h-96 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
                              )}
                              key={media.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setModulOpen(true);
                                setPastarPhoto(index);
                              }}
                            >
                              <ReactPlayer
                                url={media.name}
                                className="max-w-none w-auto h-full"
                                volume={1}
                                loop
                                controls
                              />
                            </div>
                          ) : (
                            <></>
                          );
                        })}
                      </div>
                    </Root>

                    <FuseSvgIcon
                      onClick={() => {
                        galleryData.find((value) => value.id === gallery.id).deleted = true;
                        setGalleryData([...galleryData]);
                        if (watch().links.find((value) => value.id === gallery.id)) {
                          watch().links.find((value) => value.id === gallery.id).deleted = true;
                        }

                        // reset({ ...copySection, links: gallery });

                        if (gallery.created_at) {
                          setDeletedMedia([...deletedMedia, gallery.id]);
                          reset({ ...watch(), deletedMedia: [...deletedMedia, gallery.id] });
                        }
                      }}
                      className="absolute right-0 top-[7px] cursor-pointer"
                    >
                      heroicons-outline:x
                    </FuseSvgIcon>
                  </Box>
                  <Modal
                    open={modulOpen}
                    onClose={handleSliderClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                  >
                    <Box
                      className="flex flex-col justify-center items-center "
                      style={{ width: '100%', height: '100vh' }}
                      onClick={handleSliderClose}
                    >
                      <Box onClick={(ev) => ev.stopPropagation()}>
                        <Swiper
                          modules={[Navigation, Pagination, Scrollbar, A11y]}
                          spaceBetween={50}
                          slidesPerView={1}
                          initialSlide={pastarPhoto}
                          navigation
                          onSwiper={(swiper) => null}
                          onSlideChange={() => null}
                          style={{
                            maxWidth: '700px',
                          }}
                        >
                          {selectedStates[`selected${gallery.id}`]?.map((slid, index) => {
                            return (
                              <SwiperSlide
                                key={Math.random()}
                                style={{
                                  maxWidth: '100%',
                                  height: 'auto',
                                  backgroundColor: 'white',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                {slid.type === 'image' ? (
                                  <div
                                    style={{
                                      width: '700px',
                                      minHeight: '600px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <img
                                      style={{ maxWidth: '500px', minWidth: '200px' }}
                                      src={
                                        `${FILE_API_URL}/${
                                          slid?.src ||
                                          slid?.media?.thumbnail_url ||
                                          slid?.thumbnail_url
                                        }` ||
                                        `${FILE_API_URL}/${
                                          slid?.thumbnail_url || slid?.media?.thumbnail_url
                                        }`
                                      }
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
                  <div className="w-full" />
                  <Divider className="mt-16" />
                </Box>
              )
            );
          })}
          <FileManagerModal
            type="media"
            handleClose={handleClose}
            open={open}
            selected={selectedStates[imgId]}
            setSelected={(newSelectedValue) => {
              setSelectedStates((prevSelectedStates) => {
                // Create a copy of the previous selectedStates
                const updatedSelectedStates = { ...prevSelectedStates };

                // Update the selected state for the current gallery
                updatedSelectedStates[imgId] = newSelectedValue;

                // Return the updated selectedStates
                return updatedSelectedStates;
              });
            }}
            defaultSelected={selectedStates[imgId] || []}
            multiple
            setDefaultSelected={(newSelectedValue) => {
              // eslint-disable-next-line
              setSelected(newSelectedValue => {
                return {
                  ...selected,
                  [imgId]: newSelectedValue,
                };
              });
            }}
          />
        </div>
      )
    );
  });
};

export default GalleryForm;
