import { useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FILE_API_URL } from '@api/http';
import Box from '@mui/material/Box';
import ReactPlayer from 'react-player';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageBox from 'app/shared-components/ImageBox';

const SliderAcardion = ({ item, setOpen }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const color = item?.button_text_color;
  const bgColors = item?.button_color;

  return (
    <Accordion sx={{ width: '90%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Box className="w-full flex justify-between">
          <Box
            className="text-12 whitespace-nowrap"
            color="text.secondary"
            onClick={() => {
              setOpen(item.id);
            }}
          >
            {item.media.type === 'image' ? (
              <ImageBox
                src={`${FILE_API_URL}/${item.media?.thumbnail_url}`}
                modal={`${FILE_API_URL}/${item.media?.large_url}`}
                alt="Slider"
                height={60}
                className="rounded"
              />
            ) : (
              <Box id="three">
                <ReactPlayer
                  className="react-player"
                  url={
                    item.file_type === 'video'
                      ? `${FILE_API_URL}/${item.media?.thumbnail_url}`
                      : item.media.youtube_link
                  }
                  width="100px"
                  height="70px"
                  volume={1}
                />
              </Box>
            )}
          </Box>
          {item?.translations?.find((val) => val.language_id === translationLanguage) && (
            <Typography>
              {item.translations.find((val) => val.language_id === translationLanguage)?.title}
            </Typography>
          )}

          <Button style={{ color, backgroundColor: bgColors }}>
            {item.translations.find((val) => val.language_id === translationLanguage)?.button_text}
          </Button>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {item?.translations?.find((val) => val.language_id === translationLanguage) && (
          <div
            dangerouslySetInnerHTML={{
              __html: JSON?.parse(
                item?.translations?.find((val) => val.language_id === translationLanguage)?.caption
              )?.htmlValue,
            }}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default SliderAcardion;
