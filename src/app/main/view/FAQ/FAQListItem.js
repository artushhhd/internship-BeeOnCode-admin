import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import DevMode from 'app/shared-components/DevMode';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import FAQAcardionSection from './FAQAcardionSection';

function FAQListItem(props) {
  const { item, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <ListItem
        id="two"
        className="px-32 py-16 "
        sx={{ bgcolor: item.id === +id ? '' : 'background.paper' }}
        onDoubleClick={() =>
          item.id !== +id && !!canManage && navigate(`/view/faq/${item.id}/edit`)
        }
      >
        <DevMode>id: {item.id}</DevMode>
        <FAQAcardionSection item={item} />
        {!!canManage && (
          <>
            {item.id === +id ? (
              <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
            ) : (
              <ListItem
                id="three"
                style={{ width: '50px' }}
                component={NavLinkAdapter}
                to={`/view/faq/${item?.id}/edit`}
              >
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
              </ListItem>
            )}
          </>
        )}
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {!!item.log?.length && <HistoryComponent data={item} name="FAQ" />}
        </div>
      </ListItem>
      <Divider />
    </>
  );
}

export default FAQListItem;
