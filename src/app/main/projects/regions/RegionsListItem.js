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

function RegionsListItem(props) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { item: region, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ListItem
      id="two"
      className="px-32 py-16 border-b-1"
      sx={{ bgcolor: region.id === +id ? '' : 'background.paper' }}
      onDoubleClick={() =>
        region.id !== +id && !!canManage && navigate(`/projects/regions/${region.id}/edit`)
      }
    >
      <DevMode>id: {region.id} |</DevMode>
      <ListItemText
        classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
        primary={
          region?.translations?.find((trs) => trs.language_id === translationLanguage)?.title
        }
      />
      {!!canManage && (
        <Box className="ml-auto">
          {region.id === +id ? (
            <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
          ) : (
            <ListItem
              className="w-5 h-5 mr-24"
              component={NavLinkAdapter}
              to={`/projects/regions/${region.id}/edit`}
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
        {region.log?.length !== 0 && <HistoryComponent data={region} name="CATEGORY" />}
      </Box>
    </ListItem>
  );
}

export default RegionsListItem;
