import ListItem from '@mui/material/ListItem';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DevMode from 'app/shared-components/DevMode';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { FILE_API_URL } from '@api/http';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ImageBox from 'app/shared-components/ImageBox';

function AreasListItem(props) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { item: area, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ListItem
      id="two"
      className="px-32 py-16 border-b-1"
      sx={{ bgcolor: area.id === +id ? '' : 'background.paper' }}
      onDoubleClick={() =>
        area.id !== +id && !!canManage && navigate(`/projects/areas/${area.id}/edit`)
      }
    >
      <DevMode>id: {area.id} |</DevMode>
      <ListItemAvatar>
        <ImageBox
          alt={area?.icon?.name}
          src={area?.media?.thumbnail_url ? `${FILE_API_URL}/${area?.media?.thumbnail_url}` : ''}
          modal={area?.media?.large_url ? `${FILE_API_URL}/${area?.media?.large_url}` : ''}
        />
      </ListItemAvatar>
      <ListItemText
        classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
        primary={area?.translations?.find((trs) => trs.language_id === translationLanguage)?.title}
      />
      {!!canManage && (
        <Box className="ml-auto">
          {area.id === +id ? (
            <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
          ) : (
            <ListItem
              id="three"
              className="w-5 h-5 mr-24"
              component={NavLinkAdapter}
              to={`/projects/areas/${area.id}/edit`}
              onClick={(e) => e.stopPropagation()}
            >
              <Button>
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
              </Button>
            </ListItem>
          )}
        </Box>
      )}
      <Box className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
        {area.log?.length !== 0 && <HistoryComponent data={area} name="CATEGORY" />}
      </Box>
    </ListItem>
  );
}

export default AreasListItem;
