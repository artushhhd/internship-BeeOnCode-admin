import ListItem from '@mui/material/ListItem';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useSelector } from 'react-redux';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import DevMode from 'app/shared-components/DevMode';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import { useState } from 'react';
import SliderAcardion from './SliderAcardion';
import SliderModal from './sliderModal';

function SliderListItem(props) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { item: slider, canManage } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListItem
        id="two"
        className="px-40 py-12 group shadow   "
        onDoubleClick={() =>
          slider.id !== +id && !!canManage && navigate(`/view/slider/${slider.id}/edit`)
        }
      >
        <DevMode>
          <span className="mx-8 my-8 ">{`id: ${slider.id} `}</span>
        </DevMode>

        <Box className="flex  items-center  w-full ">
          <SliderAcardion item={slider} setOpen={setOpen} />
          {open && <SliderModal open={open} setOpen={setOpen} />}

          {canManage ? (
            <>
              {slider.id === +id ? (
                <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
              ) : (
                <ListItem
                  id="six"
                  className="w-5 h-5"
                  component={NavLinkAdapter}
                  to={`/view/slider/${slider.id}/edit`}
                >
                  <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                </ListItem>
              )}
            </>
          ) : (
            ''
          )}
          <div className="w-5 h-5 " style={{ marginRight: '25px', marginBottom: '33px' }}>
            {slider?.log.length !== 0 && <HistoryComponent data={slider} name="SLIDER" />}
          </div>
        </Box>
      </ListItem>
      <Divider />
    </>
  );
}

export default SliderListItem;
