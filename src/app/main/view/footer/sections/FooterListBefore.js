import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';

const FooterListBefore = (props) => {
  const { translationLanguage } = useSelector((state) => state.i18n);

  const { item: section } = props;

  return (
    <>
      <Card>
        <ListItem
          className="px-32 py-16"
          sx={{ bgcolor: 'background.paper' }}
          component={NavLinkAdapter}
          to={`/view/footer/sections/${section.id}/edit`}
        >
          {section.translations.find((val) => val.language_id === translationLanguage) && (
            <ListItemText
              classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
              primary={
                section.translations.find((val) => val.language_id === translationLanguage).title
              }
              secondary={
                <>
                  <Box className="inline" component="span" variant="body2" color="text.secondary">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: JSON.parse(
                          section.translations.find(
                            (val) => val.language_id === translationLanguage
                          ).content
                        ).htmlValue,
                      }}
                    />
                  </Box>
                </>
              }
            />
          )}
        </ListItem>
        <Divider />
      </Card>
    </>
  );
};

export default FooterListBefore;
