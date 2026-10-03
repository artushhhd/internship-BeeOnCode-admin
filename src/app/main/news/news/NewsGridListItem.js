import { CardActionArea, CardActions, CardContent, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { FILE_API_URL } from '@api/http';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import Box from '@mui/system/Box';
import { useTranslation } from 'react-i18next';
import DevMode from 'app/shared-components/DevMode';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { getNews } from './store/newsSlice';
import { isnotifiedNews, statusNews } from './store/newsItemSlice';

export default function NewsGridListItem({ item: news, onDropDown = false, canManage }) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { search } = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const { t } = useTranslation('navigation');
  const [openPublishModal, setOpenPublishModal] = useState(false);

  const handleAccordionToggle = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const title = news.translations.find((val) => val.language_id === translationLanguage)?.title;
  const data = news.date;
  const subTitle = news.translations.find(
    (val) => val.language_id === translationLanguage
  )?.short_description;
  const image = news.media?.medium_url ? `${FILE_API_URL}/${news.media?.medium_url}` : '';
  return (
    <>
      <Card
        className="transition-transform"
        sx={{
          width: isAccordionOpen ? 400 : 'auto',
          minHeight: 550,
          height: 'auto',
          margin: 1,
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="100"
            sx={{
              height: '200px',
            }}
            image={image}
            alt="green iguana"
          />
          <DevMode>id: {news.id}</DevMode>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="font-medium text-lg text-clip"
            >
              {title.length <= 50 ? title : `${title.substr(0, 50)}...`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subTitle.length <= 70 ? subTitle : `${subTitle.substr(0, 70)}...`}
            </Typography>
            <div className="flex mt-2 flex-wrap">
              {news?.images?.map((val, index) => {
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                  <div
                    style={{
                      width: '35px',
                      height: '35px',
                      display: 'flex',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      borderRadius: '10px',
                      marginLeft: '10px',
                    }}
                    key={val.id}
                  >
                    <img
                      key={Math.random()}
                      className="max-w-none  w-[35px] h-[35px]  "
                      src={`${FILE_API_URL}/${val.media?.thumbnail_url}`}
                      alt="section_image"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions className="grid grid-cols-4 w-full ">
          <Button
            size="small"
            color="primary"
            id="step5"
            className="w-[15px] h-[15px]"
            component={NavLinkAdapter}
            to={`/news/item/${news.id}/edit${search}`}
            onClick={(e) => e.stopPropagation()}
          >
            <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
          </Button>
          <Button
            id="three"
            size="small"
            className="w-[15px] h-[15px]"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(isnotifiedNews({ id: news.id, isNotified: news?.is_notified })).then(() =>
                dispatch(
                  getNews({
                    page: +searchParams.get('page') || 1,
                    isPubleshed: 1,
                  })
                )
              );
            }}
          >
            {news.is_notified === 1 ? (
              <NotificationsIcon size={20} />
            ) : (
              <NotificationsOffIcon size={20} />
            )}
          </Button>
          <Button
            id="three"
            size="small"
            className="w-[15px] h-[15px]"
            color="primary"
            onClick={() => {
              setOpenPublishModal(true);
            }}
          >
            <FuseSvgIcon size={20}>
              {news?.is_published === 1 ? 'feather:eye' : 'feather:eye-off'}
            </FuseSvgIcon>
          </Button>
          <Button
            onClick={handleAccordionToggle}
            size="small"
            color="primary"
            className="w-[10px] h-[10px]"
          >
            <FuseSvgIcon className="w-[10px] h-[10px]" size={20} color="action">
              {isAccordionOpen
                ? 'material-twotone:keyboard_arrow_up'
                : 'material-twotone:keyboard_arrow_down'}
            </FuseSvgIcon>
          </Button>
        </CardActions>

        {isAccordionOpen ? (
          <Box className="w-full flex items-center">
            <Box sx={{ padding: '10px' }}>
              <Box
                sx={{
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {news.translations.find((val) => val.language_id === translationLanguage) && (
                  <div className="w-full grid">
                    <Box
                      className="inline p-[10px] w-[350px]"
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      <b style={{ color: 'black' }}> {t('LONG_DESCRIPTION')}</b>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(
                            news.translations?.find(
                              (val) => val?.language_id === translationLanguage
                            )?.long_description
                          )?.htmlValue,
                        }}
                      />
                    </Box>
                  </div>
                )}
              </Box>
            </Box>
          </Box>
        ) : null}

        <DeleteModal
          close={() => {
            setOpenPublishModal(false);
          }}
          text={t('CHANGEPUBLISH')}
          open={openPublishModal}
          onClick={() =>
            dispatch(statusNews({ id: news.id, isPublished: news?.is_published }))
              .then(() =>
                dispatch(
                  getNews({
                    page: 1,
                    isPubleshed: news.is_published === 0 ? 1 : 0,
                  })
                )
              )
              .then(() => {
                setSearchParams({
                  page: 1,
                  isPublished: news.is_published === 0 ? 1 : 0,
                });
              })
              .then(() => setOpenPublishModal(false))
          }
        />
      </Card>
    </>
  );
}
