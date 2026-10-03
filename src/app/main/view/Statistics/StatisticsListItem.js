import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import DevMode from 'app/shared-components/DevMode';
import { useNavigate, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import { useEffect } from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { FILE_API_URL } from '@api/http';
import Button from '@mui/material/Button';
import ImageBox from 'app/shared-components/ImageBox';
import { getStatistics, statusStatistic } from './store/StatisticsSlice';

function StatisticsListItem(props) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  // const {step} = useSelector((state) => state.StepApp.secondaryMenuReducer);
  const dispatch = useDispatch();

  const { item: statistics, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getStatistics());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ListItem
        id="two"
        className="px-32 py-16 "
        sx={{ bgcolor: statistics.id === +id ? '' : 'background.paper' }}
        onDoubleClick={() =>
          statistics.id !== +id && !!canManage && navigate(`/view/statistics/${statistics.id}/edit`)
        }
      >
        <DevMode>{`id: ${statistics.id}`}</DevMode>
        <ListItemAvatar>
          <ImageBox
            src={statistics?.icon?.name ? `${FILE_API_URL}/${statistics?.icon?.name}` : ''}
            alt="image"
          />
        </ListItemAvatar>
        {statistics.translations.find((val) => val.language_id === translationLanguage) && (
          <div className="grid ml-[10px]">
            <ListItemText
              classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
              primary={
                statistics.translations.find((val) => val.language_id === translationLanguage).title
              }
            />
          </div>
        )}
        {canManage ? (
          <div className="ml-auto flex items-center ">
            {statistics.id === +id ? (
              <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
            ) : (
              <>
                <Button
                  id="four"
                  className="px-0"
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      statusStatistic({ id: statistics.id, isPublished: statistics?.is_published })
                    ).then(() => dispatch(getStatistics()));
                  }}
                >
                  <FuseSvgIcon>
                    {statistics.is_published === 1 ? 'feather:eye' : 'feather:eye-off'}
                  </FuseSvgIcon>
                </Button>
                <ListItem
                  id="three"
                  className="w-5 h-5"
                  component={NavLinkAdapter}
                  to={`/view/statistics/${statistics.id}/edit`}
                >
                  <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                </ListItem>
              </>
            )}
          </div>
        ) : (
          ''
        )}
        <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
          {statistics?.log.length !== 0 && (
            <HistoryComponent data={statistics} name="SECONDARYMENU" />
          )}
        </div>
      </ListItem>
      <Divider />
    </>
  );
}

export default StatisticsListItem;
