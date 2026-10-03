import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import DevMode from 'app/shared-components/DevMode';
import { useNavigate, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import Button from '@mui/material/Button';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ImageBox from 'app/shared-components/ImageBox';
import { FILE_API_URL } from '@api/http';
import { statusService } from './store/serviceSlice';
import { getServices } from './store/servicesSlice';

function ServicesListItem(props) {
  const dispatch = useDispatch();
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { item: service, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();

  const translation = service.translations?.find((val) => val.language_id === translationLanguage);

  return (
    <>
      <ListItem
        id="two"
        className="px-32 py-16 "
        sx={{ bgcolor: service.id === +id ? '' : 'background.paper' }}
        onDoubleClick={() =>
          service.id !== +id && !!canManage && navigate(`/view/services/${service.id}/edit`)
        }
      >
        <DevMode>{`id: ${service.id}`}</DevMode>
        <ListItemAvatar>
          <ImageBox
            src={service?.icon?.name ? `${FILE_API_URL}/${service?.icon?.name}` : ''}
            alt="image"
          />
        </ListItemAvatar>
        {translation && (
          <div className="grid ml-[10px]">
            <ListItemText
              classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
              primary={translation.title}
              secondary={
                <span
                  className="truncate"
                  dangerouslySetInnerHTML={{
                    __html: translation.long_description
                      ? JSON.parse(translation.long_description)?.htmlValue || ''
                      : '',
                  }}
                />
              }
            />
          </div>
        )}
        {canManage ? (
          <div className="ml-auto flex items-center ">
            {service.id === +id ? (
              <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
            ) : (
              <>
                <Button
                  id="four"
                  className="px-0"
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      statusService({ id: service.id, isPublished: service?.is_published })
                    ).then(() => dispatch(getServices()));
                  }}
                >
                  <FuseSvgIcon>
                    {service.is_published === 1 ? 'feather:eye' : 'feather:eye-off'}
                  </FuseSvgIcon>
                </Button>
                <ListItem
                  id="three"
                  className="w-5 h-5"
                  component={NavLinkAdapter}
                  to={`/view/services/${service.id}/edit`}
                >
                  <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                </ListItem>
              </>
            )}
          </div>
        ) : (
          ''
        )}
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {service?.log?.length !== 0 && <HistoryComponent data={service} name="SERVICES" />}
        </div>
      </ListItem>
      <Divider />
    </>
  );
}

export default ServicesListItem;
