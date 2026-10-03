import Box from '@mui/system/Box';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ImageIcon from '@mui/icons-material/Image';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import CompressIcon from '@mui/icons-material/Compress';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import Badge from '@mui/material/Badge';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFilesLoadingCount } from '../../../administration/store/fileManagerSlice';

const FileManagerFilterBar = ({ type = 'all', fileType, count }) => {
  const { t } = useTranslation('navigation');

  // type` all, file, media, image

  const filters = [
    {
      icon: <DensitySmallIcon color="secondary" sx={{ fontSize: '27px' }} />,
      title: t('ALL'),
      type: 'all',
      count: count?.all,
      allowedType: ['all'],
    },
    {
      icon: <FilePresentIcon color="secondary" sx={{ fontSize: '30px' }} />,
      title: t('FILES'),
      type: 'file',
      count: count?.file,
      allowedType: ['all', 'file'],
    },
    {
      icon: <VolumeUpIcon color="secondary" sx={{ fontSize: '30px' }} />,
      title: t('AUDIO'),
      type: 'audio',
      count: count?.audio,
      allowedType: ['all', 'file'],
    },
    {
      icon: <ImageIcon color="secondary" sx={{ fontSize: '30px' }} />,
      title: t('IMAGES'),
      type: 'image',
      count: count?.image,
      allowedType: ['all', 'image', 'media'],
    },
    {
      icon: <PictureInPictureIcon color="secondary" sx={{ fontSize: '30px' }} />,
      title: t('CROPPED'),
      type: 'cropped',
      count: count?.cropped,
      allowedType: ['all', 'image', 'media'],
    },
    {
      icon: <VideoCameraBackIcon color="secondary" sx={{ fontSize: '30px' }} />,
      title: t('VIDEOS'),
      type: 'video',
      count: count?.video,
      allowedType: ['all', 'media'],
    },
    {
      icon: <CompressIcon color="secondary" sx={{ fontSize: '30px' }} />,
      title: t('ARCHIVE'),
      type: 'zip',
      count: count?.archive,
      allowedType: ['all', 'file'],
    },
    {
      icon: <YouTubeIcon color="secondary" sx={{ fontSize: '30px' }} />,
      title: 'Youtube',
      type: 'link',
      count: count?.link,
      allowedType: ['all', 'media'],
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  const loading = useSelector(selectFilesLoadingCount);

  return (
    <Box className="flex justify-between" id="two">
      <Box className="w-min-w h-[70px] flex items-center gap-12 pr-16">
        {filters.map((obj, i) => {
          return (
            obj.allowedType.includes(type) && (
              <Box
                key={i}
                sx={fileType === obj.type ? { borderBottom: '2px solid black' } : {}}
                className="w-min-w min-w-48 h-[57px] flex flex-col items-center justify-center hover:cursor-pointer"
                onClick={() => {
                  const newSearchParams = new URLSearchParams(searchParams);

                  newSearchParams.set('file_manager_page', `1`);
                  newSearchParams.set('file_manager_type', obj.type);

                  setSearchParams(newSearchParams);
                }}
              >
                <Badge badgeContent={loading ? null : obj.count || '0'} color="primary" max={9999}>
                  {obj.icon}
                </Badge>
                <Box component="div">
                  <Box component="p" sx={{ fontSize: '12px' }}>
                    {obj.title}
                  </Box>
                </Box>
              </Box>
            )
          );
        })}
      </Box>
    </Box>
  );
};

export default FileManagerFilterBar;
