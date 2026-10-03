import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { FILE_API_URL } from '@api/http';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DevMode from 'app/shared-components/DevMode';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryComponent from 'app/shared-components/HistoryComponent';

function LanguageListItem(props) {
  const { item: language, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ListItem
      id="two"
      className="px-32 py-16 flex border-b-1"
      sx={{ bgcolor: language.id === +id ? '' : 'background.paper' }}
      onDoubleClick={() =>
        language.id !== +id && !!canManage && navigate(`/view/languages/${language.id}/edit`)
      }
    >
      <DevMode>id: {language.id}</DevMode>
      <ListItemAvatar>
        <Avatar alt={language.name} src={`${FILE_API_URL}/${language.flag}`} />
      </ListItemAvatar>
      <ListItemText
        classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
        primary={language.name}
        secondary={
          <>
            <Typography className="inline" component="span" variant="body2" color="text.secondary">
              {language.slug}
            </Typography>
          </>
        }
      />
      {/* {!index && (
        <IconButton
          component={motion.div}
          className="w-40 h-40 p-0"
          aria-haspopup="true"
          size="large"
        >
          <FuseSvgIcon sx={{ color: amber[600] }}>heroicons-solid:star</FuseSvgIcon>
        </IconButton>
      )} */}

      <DevMode>
        {!!canManage &&
          (language.id === +id ? (
            <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
          ) : (
            <ListItem
              className="w-5 h-5"
              component={NavLinkAdapter}
              to={`/view/languages/${language.id}/edit`}
            >
              <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
            </ListItem>
          ))}
      </DevMode>
      <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
        {!!language.log.length && <HistoryComponent data={language} name="OFLANGUAGES" />}
      </div>
    </ListItem>
  );
}

export default LanguageListItem;
