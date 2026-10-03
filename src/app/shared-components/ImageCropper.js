import { useCallback, useEffect, useState } from 'react';
import '@styles/ReactCrop.css';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { CircularProgress, Zoom, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/system/Box';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Cropper from 'react-easy-crop';
import { FILE_API_URL } from '@api/http';
import { notifyError } from '@helpers/toast';
import getCroppedImg from './cropUtils';
import { cropImage, getFiles } from '../main/administration/store/fileManagerSlice';

function ImageCropper({ img, setCropImage }) {
  const image = `${FILE_API_URL}/${img.name}`;
  const { t } = useTranslation('navigation');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [aspect, setAspect] = useState(5 / 3);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const aspects = [
    [5, 3],
    [1, 1],
    [9, 16],
  ];

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  // eslint-disable-next-line no-shadow
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      // eslint-disable-next-line no-shadow
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      const croppedImageToFile = await fetch(croppedImage)
        .then((r) => r.blob())
        .then((blobFile) => new File([blobFile], img.title, { type: 'image/webp' }));
      dispatch(cropImage({ file: croppedImageToFile, fileId: img.id }));
      return null;
    } catch (e) {
      throw new Error('Cropping Error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, croppedAreaPixels, rotation]);

  return (
    <Box className=" bg-redflex flex-col justify-between w-full h-[80%] ">
      <Box className="flex items-cn-between w-full  h-full">
        <ToggleButtonGroup
          className="mr-20"
          orientation="vertical"
          value={aspect}
          exclusive
          onChange={(e, newValue) => {
            if (newValue) {
              setAspect(newValue);
            }
          }}
        >
          {aspects.map(([x, y], i) => {
            return (
              <ToggleButton key={i} value={x / y} aria-label={`${x}:${y}`}>
                {x}:{y}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'spaceBetween',
          }}
        >
          <Box
            sx={{
              background: 'white',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <Cropper
              image={image}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoomWithScroll={false}
            />
          </Box>
          <Box className="w-full h-1/5  flex flex-col items-center justify-evenly">
            <Box className="w-full h-1/2 items-center">
              <p className="text-center">Zoom ({zoom}x)</p>
              <input
                type="range"
                value={zoom}
                min={0.5}
                max={1.5}
                step={0.01}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(+e.target.value)}
                className="w-full"
              />
            </Box>
            <Box className="w-full h-1/2 items-center">
              <p className="text-center">Rotation ({rotation} deg)</p>
              <input
                type="range"
                value={rotation}
                min={-180}
                max={180}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e) => setRotation(+e.target.value)}
                className="w-full"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="flex justify-end mt-20">
        <Button
          className="ml-auto"
          onClick={() => {
            setCropImage(false);
          }}
        >
          <Tooltip
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 300 }}
            title={t('CLOSE')}
            enterDelay={500}
            leaveDelay={200}
            followCursor
          >
            <span>{t('CANCEL')}</span>
          </Tooltip>
        </Button>
        <Button
          className="ml-8 flex justify-center w-[100px]"
          variant="contained"
          color="secondary"
          onClick={() => {
            setLoading(true);
            showCroppedImage()
              .then(() => {
                setCropImage(false);
                dispatch(getFiles());
              })
              .catch((err) => {
                notifyError(err.message);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Tooltip
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 300 }}
            title={t('SAVE')}
            enterDelay={500}
            leaveDelay={200}
            followCursor
          >
            <span> {loading ? <CircularProgress size={20} /> : t('SAVE')}</span>
          </Tooltip>
        </Button>
      </Box>
    </Box>
  );
}

export default ImageCropper;
