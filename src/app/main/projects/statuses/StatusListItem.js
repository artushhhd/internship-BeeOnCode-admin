import ListItem from '@mui/material/ListItem';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useSelector } from 'react-redux';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DevMode from 'app/shared-components/DevMode';
import Box from '@mui/material/Box';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import Button from '@mui/material/Button';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { FILE_API_URL } from '@api/http';
import ImageBox from 'app/shared-components/ImageBox';

function StatusesListItem(props) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { item: status, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ListItem
      id="two"
      className="px-32 py-16 border-b-1"
      sx={{ bgcolor: status.id === +id ? '' : 'background.paper' }}
      onDoubleClick={() =>
        status.id !== +id && !!canManage && navigate(`/projects/status/${status.id}/edit`)
      }
    >
      <DevMode>id: {status.id} |</DevMode>
      <ListItemAvatar>
        <ImageBox
          alt={status.icon?.name}
          src={status.icon?.name ? `${FILE_API_URL}/${status.icon?.name}` : ''}
        />
      </ListItemAvatar>
      <ListItemText
        classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
        primary={
          status?.translations?.find((trs) => trs.language_id === translationLanguage)?.title
        }
      />
      {!!canManage && (
        <Box className="ml-auto">
          {status.id === +id ? (
            <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
          ) : (
            <ListItem
              className="w-5 h-5 mr-24"
              component={NavLinkAdapter}
              to={`/projects/status/${status.id}/edit`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button id="three">
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
              </Button>
            </ListItem>
          )}
        </Box>
      )}
      <Box className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
        {status.log?.length !== 0 && <HistoryComponent data={status} name="STATUS" />}
      </Box>
    </ListItem>
  );
}

export default StatusesListItem;
