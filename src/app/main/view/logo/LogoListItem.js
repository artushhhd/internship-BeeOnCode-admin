import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';
import { selectCurrentLanguage } from 'app/store/i18nSlice';
import { FILE_API_URL } from '@api/http';

function LogoListItem(props) {
  const { index } = useSelector(selectCurrentLanguage);

  const { logo } = props;

  return (
    <>
      <ListItem className="px-32 py-16" sx={{ bgcolor: 'background.paper' }} button>
        <ListItemAvatar>
          <Avatar alt={logo.name} src={`${FILE_API_URL}/${logo.logo}`} />
        </ListItemAvatar>
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={logo.name}
          secondary={
            <>
              <Typography
                className="inline"
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {logo.translations[index].title}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

export default LogoListItem;
