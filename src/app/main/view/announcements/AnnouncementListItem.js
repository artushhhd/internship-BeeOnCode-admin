import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { useDispatch } from 'react-redux';
import DevMode from 'app/shared-components/DevMode';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import AnnouncementAcardionSection from './AnnouncementAcardionSection';
import { editAnnouncemenStatus } from './store/announcementSlice';
import { getAnnouncements } from './store/announcementsSlice';

function AnnouncementListItem(props) {
  const { item, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  return (
    <>
      <ListItem
        id="two"
        className="px-32 py-16 flex "
        sx={{ bgcolor: item.id === +id ? '' : 'background.paper' }}
        onDoubleClick={() =>
          item.id !== +id && !!canManage && navigate(`/view/announcement/${item.id}/edit`)
        }
      >
        <DevMode>id: {item.id}</DevMode>

        <AnnouncementAcardionSection item={item} />
        {canManage ? (
          <div className="flex ml-auto items-center">
            <Button
              id="four"
              color="secondary"
              className="px-0"
              onClick={() =>
                dispatch(editAnnouncemenStatus(item)).then(() => dispatch(getAnnouncements()))
              }
            >
              <FuseSvgIcon>{item.status ? 'feather:eye' : 'feather:eye-off'}</FuseSvgIcon>
            </Button>
            {item.id === +id ? (
              <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
            ) : (
              <ListItem
                id="three"
                className="px-0"
                component={NavLinkAdapter}
                to={`/view/announcement/${item?.id}/edit`}
              >
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
              </ListItem>
            )}
          </div>
        ) : (
          ''
        )}
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {item.log?.length !== 0 && <HistoryComponent data={item} name="ANNOUNCEMENT" />}
        </div>
      </ListItem>
      <Divider />
    </>
  );
}

export default AnnouncementListItem;
