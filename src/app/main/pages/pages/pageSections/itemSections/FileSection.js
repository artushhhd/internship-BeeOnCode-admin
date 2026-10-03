import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect } from 'react';
import { selectUser } from 'app/store/userSlice';
import DevMode from 'app/shared-components/DevMode';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import HorizontalDND from 'app/shared-components/HorizontalDND';
import { changeOrderFile } from '../../store/pageSectionSlice';
import {
  getPermissionsByPage,
  selectPermission,
} from '../../../../administration/store/permissionsSlice';
import FileItemIcon from '../../../../view/fileManager/FileItemIcon';
import FileItemContextMenu from '../../contextMenus/FileItemContextMenu';
import PageSectionContextMenu from '../../contextMenus/PageSectionContextMenu';

const FileSection = ({ section }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { id: userId } = useSelector(selectUser);
  const { canManage } = useSelector(selectPermission);
  const dispatch = useDispatch();
  const { t } = useTranslation('navigation');

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Pages' }));
    // eslint-disable-next-line
  }, [userId]);

  return (
    <Accordion sx={{ width: '100%' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <FuseSvgIcon size={35}>feather:file-plus</FuseSvgIcon>
        <Typography className="text-[1rem] ">
          {t('SECTION')} {t('FILE')}, {t('COUNT')}`{' '}
          {section?.file?.filter((f) => f.language_id === translationLanguage)?.length}
        </Typography>
        <Typography className="leading-[3rem] ml-[20px]">
          {section?.translations?.find((val) => val.language_id === translationLanguage)?.title}
        </Typography>
        <PageSectionContextMenu section={section} />
      </AccordionSummary>
      <AccordionDetails>
        {/* canManage ? <DragSwitcher keyName="file" data={section.file} /> : '' */}
        <HorizontalDND
          data={section?.file?.filter((f) => f.language_id === translationLanguage)}
          update={changeOrderFile}
          direction="vertical"
          disableKey={!canManage /* || 'file' */}
        >
          <FileSectionListItem />
        </HorizontalDND>
      </AccordionDetails>
    </Accordion>
  );
};

const FileSectionListItem = (props) => {
  const { item: file } = props;

  return (
    <Box className="flex flex-col content-center items-between">
      <Typography>{file?.name}</Typography>

      <div
        className={clsx(
          'productImageItem flex flex-col justify-center items-center relative w-72 h-72 rounded-16 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
        )}
        key={file?.id}
      >
        <Box className="absolute top-0 text-center">
          <DevMode>media: {file?.id}</DevMode>
        </Box>
        <FileItemIcon extension={file?.media?.extension} />

        <FileItemContextMenu file={file} />
      </div>
    </Box>
  );
};

export default FileSection;
