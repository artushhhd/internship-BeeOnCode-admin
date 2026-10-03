import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { FILE_API_URL } from '@api/http';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DevMode from 'app/shared-components/DevMode';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import ImageBox from 'app/shared-components/ImageBox';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { useState } from 'react';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import { useTranslation } from 'react-i18next';
import { isnotifiedNews, statusNews } from './store/newsItemSlice';
import { getNews } from './store/newsSlice';

function NewsItemListItem(props) {
  const { item: section, index, canManage } = props;
  const { t } = useTranslation('navigation');
  const dispatch = useDispatch();
  const { translationLanguage } = useSelector((state) => state.i18n);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openPublishModal, setOpenPublishModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const newsTranslation = section.translations.find(
    (trs) => trs.language_id === translationLanguage
  );

  return (
    <>
      <ListItem
        className="px-32 pt-15 pb-[30px] flex "
        sx={{ bgcolor: section.id === +id ? '' : 'background.paper' }}
        onDoubleClick={() =>
          section.id !== +id && !!canManage && navigate(`/news/item/${section.id}/edit`)
        }
      >
        <DevMode>id: {section.id}</DevMode>
        <ImageBox
          height={60}
          alt={section.name}
          src={
            section?.media?.thumbnail_url ? `${FILE_API_URL}/${section?.media?.thumbnail_url}` : ''
          }
          modal={section?.media?.large_url ? `${FILE_API_URL}/${section?.media?.large_url}` : ''}
        />
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={newsTranslation?.title}
          secondary={
            <Typography className="inline" component="span" variant="body2" color="text.secondary">
              {section?.date}
            </Typography>
          }
        />

        {/* eslint-disable-next-line no-nested-ternary */}
        {canManage ? (
          section.id === +id ? (
            <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
          ) : (
            <>
              <Button
                id="three"
                className="px-0"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    isnotifiedNews({ id: section.id, isNotified: section?.is_notified })
                  ).then(() =>
                    dispatch(
                      getNews({
                        page: +searchParams.get('page') || 1,
                        isPubleshed: 1,
                      })
                    )
                  );
                }}
              >
                {section.is_notified === 1 ? <NotificationsIcon /> : <NotificationsOffIcon />}
              </Button>
              <Button
                className="px-0"
                color="secondary"
                onClick={() => {
                  setOpenPublishModal(true);
                }}
              >
                <FuseSvgIcon>
                  {section?.is_published === 1 ? 'feather:eye' : 'feather:eye-off'}
                </FuseSvgIcon>
              </Button>
              <ListItem
                className="w-5 h-5"
                component={NavLinkAdapter}
                to={`/news/item/${section.id}/edit?page=${
                  +searchParams.get('page') || 1
                }&isPubleshed=${searchParams.get('isPubleshed') || 1}`}
              >
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
              </ListItem>
            </>
          )
        ) : (
          ''
        )}
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {section?.log?.length !== 0 && <HistoryComponent data={section} name="NEWS" />}
        </div>
      </ListItem>
      <DeleteModal
        close={() => {
          setOpenPublishModal(false);
        }}
        text={t('CHANGEPUBLISH')}
        open={openPublishModal}
        onClick={() =>
          dispatch(statusNews({ id: section.id, isPublished: section?.is_published }))
            .then(() =>
              dispatch(
                getNews({
                  page: 1,
                  isPubleshed: section.is_published === 0 ? 1 : 0,
                })
              )
            )
            .then(() => {
              setSearchParams({
                page: 1,
                isPublished: section.is_published === 0 ? 1 : 0,
              });
            })
            .then(() => setOpenPublishModal(false))
        }
      />

      <Divider />
    </>
  );
}

export default NewsItemListItem;
