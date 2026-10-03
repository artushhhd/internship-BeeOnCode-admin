import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import DevMode from 'app/shared-components/DevMode';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import ReactPlayer from 'react-player';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ListItem from '@mui/material/ListItem';
import { changeStatusYoutubeSettings } from './store/youtubeSettingsSlice';

function YoutubeSettingsListItem(props) {
  const { item: youtubeSetting } = props;
  const { translationLanguage } = useSelector((state) => state.i18n);
  const dispatch = useDispatch();

  const title = youtubeSetting.translations.find(
    (trs) => trs.language_id === translationLanguage
  )?.title;

  const [videoId, setVideoId] = useState(null);
  const handleSliderClose = () => {
    setVideoId(null);
  };

  return (
    <>
      <ListItem id="two" className="px-32 py-8" sx={{ bgcolor: 'background.paper' }}>
        <DevMode>{`id: ${youtubeSetting.id}`}</DevMode>
        <Box
          onClick={() => setVideoId(youtubeSetting.video_id)}
          className="relative cursor-pointer"
        >
          <img src={youtubeSetting.url} alt={title} className="h-64" />
          <YouTubeIcon
            className="absolute"
            sx={{ color: '#f00', fontSize: '60px', left: '27px', top: '3px' }}
          />
        </Box>
        <Box className="grid ml-[10px]">
          <ListItemText
            classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
            primary={title}
          />
        </Box>

        <Box className="ml-auto" id="three">
          <Button
            onClick={() =>
              dispatch(
                changeStatusYoutubeSettings({
                  id: youtubeSetting.id,
                  status: youtubeSetting.status ? 0 : 1,
                })
              )
            }
          >
            <FuseSvgIcon>{youtubeSetting.status ? 'feather:eye' : 'feather:eye-off'}</FuseSvgIcon>
          </Button>
        </Box>
      </ListItem>
      <Divider />

      <Modal
        open={!!videoId}
        onClose={handleSliderClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          className="flex flex-col justify-center items-center"
          style={{ width: '100%', height: '100vh' }}
          onClick={handleSliderClose}
        >
          <Box
            style={{
              maxWidth: '600px',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${videoId}`}
              volume={1}
              loop
              controls
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default YoutubeSettingsListItem;
