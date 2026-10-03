import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DevMode from 'app/shared-components/DevMode';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import { editSocialStatus } from './store/socialSlice';
import { getSocials } from './store/socialsSlice';

function SocialsListItem(props) {
  const { item: section, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  return (
    <>
      <ListItem
        id="one"
        className="px-32 py-16"
        sx={{ bgcolor: section.id === +id ? '' : 'background.paper' }}
        onDoubleClick={() =>
          section.id !== +id && !!canManage && navigate(`/view/socials/${section.id}/edit`)
        }
      >
        <DevMode>{`id: ${section.id}`}</DevMode>
        <ListItemAvatar>
          <FuseSvgIcon className="text-48" size={24} color="action">
            {`feather:${section.icon}`}
          </FuseSvgIcon>
        </ListItemAvatar>
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={section.url}
        />
        {canManage ? (
          <Button
            id="two"
            className="px-0"
            color="secondary"
            onClick={() => dispatch(editSocialStatus(section)).then(() => dispatch(getSocials()))}
          >
            <FuseSvgIcon>{section.status ? 'feather:eye' : 'feather:eye-off'}</FuseSvgIcon>
          </Button>
        ) : (
          ''
        )}
        {/* eslint-disable-next-line no-nested-ternary */}
        {canManage ? (
          section.id === +id ? (
            <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
          ) : (
            <ListItem
              id="three"
              className="w-5 h-5"
              component={NavLinkAdapter}
              to={`/view/socials/${section.id}/edit`}
            >
              <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
            </ListItem>
          )
        ) : (
          ''
        )}
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {section?.log.length !== 0 && <HistoryComponent data={section} name="SOCIALNETWORKS" />}
        </div>
      </ListItem>

      <Divider />
    </>
  );
}

export default SocialsListItem;
