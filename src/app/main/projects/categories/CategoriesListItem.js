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

function CategoriesListItem(props) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { item: category, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ListItem
      id="two"
      className="px-32 py-16 border-b-1"
      sx={{ bgcolor: category.id === +id ? '' : 'background.paper' }}
      onDoubleClick={() =>
        category.id !== +id && !!canManage && navigate(`/projects/categories/${category.id}/edit`)
      }
    >
      <DevMode>id: {category.id} |</DevMode>
      <ListItemText
        classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
        primary={
          category?.translations?.find((trs) => trs.language_id === translationLanguage)?.title
        }
      />
      {!!canManage && (
        <Box className="ml-auto">
          {category.id === +id ? (
            <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
          ) : (
            <ListItem
              className="w-5 h-5 mr-24"
              component={NavLinkAdapter}
              to={`/projects/categories/${category.id}/edit`}
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
        {category.log?.length !== 0 && <HistoryComponent data={category} name="CATEGORY" />}
      </Box>
    </ListItem>
  );
}

export default CategoriesListItem;
