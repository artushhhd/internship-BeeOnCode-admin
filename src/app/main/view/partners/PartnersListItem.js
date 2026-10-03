import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DevMode from 'app/shared-components/DevMode';
import { useParams, useSearchParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import Button from '@mui/material/Button';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ImageBox from 'app/shared-components/ImageBox';
import { FILE_API_URL } from '@api/http';
import { getPartners, statusPartner, visiblePartner } from './store/partnersSlice';

function PartnersListItem(props) {
  const dispatch = useDispatch();
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { item: partner, canManage } = props;
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <ListItem
        id="two"
        className="px-32 py-16 "
        sx={{ bgcolor: partner.id === +id ? '' : 'background.paper' }}
      >
        <DevMode>{`id: ${partner.id}`}</DevMode>
        <ListItemAvatar>
          <ImageBox
            src={
              partner?.media?.thumbnail_url ? `${FILE_API_URL}/${partner.media.thumbnail_url}` : ''
            }
            modal={partner?.media?.large_url ? `${FILE_API_URL}/${partner.media.large_url}` : ''}
            alt="image"
          />
        </ListItemAvatar>
        {partner.translations.find((val) => val.language_id === translationLanguage) && (
          <div className="grid">
            <ListItemText
              classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
              primary={
                partner.translations.find((val) => val.language_id === translationLanguage).title
              }
              secondary={
                <>
                  <Typography
                    className="inline"
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {partner.link ||
                      `${
                        partner.page
                          ? partner.page?.translations.find(
                              (val) => val.language_id === translationLanguage
                            ).title
                          : ''
                      }  (${partner.slug})`}
                  </Typography>
                </>
              }
            />
          </div>
        )}
        <div className="ml-auto flex justify-end items-center">
          {canManage ? (
            <Button
              id="three"
              className="px-0"
              color="secondary"
              onClick={() =>
                dispatch(statusPartner(partner.id)).then(() =>
                  dispatch(getPartners(searchParams.get('page') || 1))
                )
              }
            >
              <FuseSvgIcon>{partner.status ? 'feather:eye' : 'feather:eye-off'}</FuseSvgIcon>
            </Button>
          ) : (
            ''
          )}
          {canManage ? (
            <Button
              id="four"
              className="px-0"
              color="secondary"
              onClick={() =>
                dispatch(
                  visiblePartner({ id: partner.id, is_visible: Boolean(partner.is_visible) })
                ).then(() => dispatch(getPartners(searchParams.get('page') || 1)))
              }
            >
              <FuseSvgIcon>
                {partner?.is_visible === 0
                  ? 'material-twotone:home'
                  : 'material-twotone:disabled_visible'}
              </FuseSvgIcon>
            </Button>
          ) : (
            ''
          )}
          {canManage ? (
            <div className="ml-auto">
              {partner.id === +id ? (
                <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
              ) : (
                <ListItem
                  id="five"
                  className="w-5 h-5"
                  component={NavLinkAdapter}
                  to={`/view/partners/${partner.id}/edit?page=${searchParams.get('page') || 1}`}
                >
                  <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                </ListItem>
              )}
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {partner?.log.length !== 0 && <HistoryComponent data={partner} name="DEPARTMENT" />}
        </div>
      </ListItem>
      <Divider />
    </>
  );
}

export default PartnersListItem;
