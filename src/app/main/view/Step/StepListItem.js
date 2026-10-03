import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import ListItemText from '@mui/material/ListItemText';
import DevMode from 'app/shared-components/DevMode';
import { useNavigate, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import { useEffect } from 'react';
import { getStep } from './store/StepSlice';

function StepListItem(props) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  // const {step} = useSelector((state) => state.StepApp.secondaryMenuReducer);
  const dispatch = useDispatch();

  const { item: step, canManage, index } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getStep());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ListItem
        id="two"
        className="px-32 py-16 "
        sx={{ bgcolor: step.id === +id ? '' : 'background.paper' }}
        onDoubleClick={() =>
          step.id !== +id && !!canManage && navigate(`/view/step/${step.id}/edit`)
        }
      >
        <DevMode>{`id: ${step.id}`}</DevMode>
        {/* <ListItemAvatar>
          <Avatar
            src={secondaryMenus.icon ? `${FILE_API_URL}/${secondaryMenus.icon}` : ''}
            alt="image"
          />
        </ListItemAvatar> */}
        <div className="font-Raleway text-green-500 text-[30px]">{index + 1}</div>
        {step.translations.find((val) => val.language_id === translationLanguage) && (
          <div className="grid ml-[10px]">
            <ListItemText
              classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
              primary={
                step.translations.find((val) => val.language_id === translationLanguage).title
              }
            />
          </div>
        )}
        {canManage ? (
          <div className="ml-auto">
            {step.id === +id ? (
              <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
            ) : (
              <ListItem
                id="three"
                className="w-5 h-5"
                component={NavLinkAdapter}
                to={`/view/step/${step.id}/edit`}
              >
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
              </ListItem>
            )}
          </div>
        ) : (
          ''
        )}
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {step?.log.length !== 0 && <HistoryComponent data={step} name="SECONDARYMENU" />}
        </div>
      </ListItem>
      <Divider />
    </>
  );
}

export default StepListItem;
