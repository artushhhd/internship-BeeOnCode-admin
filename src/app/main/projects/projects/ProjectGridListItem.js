import { CardActionArea, CardActions, CardContent, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FILE_API_URL } from '@api/http';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import Box from '@mui/system/Box';
import { useTranslation } from 'react-i18next';
import DevMode from 'app/shared-components/DevMode';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getProjects } from '../store/projectsSlice';
import { isnotifiedProject, statusProject } from '../store/projectSlice';

export default function ProjectGridListItem({ item: project, onDropDown = false, canManage }) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { search } = useLocation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const { t } = useTranslation('navigation');
  const [openPublishModal, setOpenPublishModal] = useState(false);
  const nav = useNavigate();
  const handleAccordionToggle = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const title = project?.number;
  const image = project.media?.medium_url ? `${FILE_API_URL}/${project.media?.medium_url}` : '';
  const regionsTranslation = project?.regions?.reduce((aggr, obj) => {
    return `${
      aggr + (obj.translations?.find((trs) => trs.language_id === translationLanguage)?.title || '')
    }, `;
  }, '');
  const projectTranslation = project.translations.find(
    (trs) => trs.language_id === translationLanguage
  );
  const focalAreaTranslation = project?.focal_area?.translations?.find(
    (trs) => trs.language_id === translationLanguage
  );
  const crossAreaTranslation = project?.cross_cutting_area?.translations?.find(
    (trs) => trs.language_id === translationLanguage
  );
  const projectStatus = project?.status?.translations?.find((trs) => {
    return trs.language_id === translationLanguage;
  });

  return (
    <>
      <Card
        className="transition-transform"
        sx={{
          width: isAccordionOpen ? 430 : 'auto',
          minHeight: 400,
          maxWidth: isAccordionOpen ? 430 : 260,
          height: 'auto',
          margin: 1,
        }}
      >
        <CardActionArea
          onDoubleClick={() => !!canManage && nav(`/projects/item/${project.id}/edit${search}`)}
        >
          <CardMedia
            component="img"
            height="100"
            sx={{
              height: '200px',
            }}
            image={image}
            alt="green iguana"
          />
          <DevMode>id: {project.id}</DevMode>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className="font-medium text-base	 text-clip"
              onClick={async () => {
                await navigator.clipboard.writeText(project?.number);
                dispatch(showMessage({ message: t('Copied') }));
              }}
            >
              {title}
            </Typography>
            <Typography className="inline" component="span" variant="body2" color="text.secondary">
              {project.start_date} - {project.end_date} <br />
              {focalAreaTranslation?.title} -- {crossAreaTranslation?.title} <br />
              {regionsTranslation} <br />
              {projectStatus?.title}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className="grid grid-cols-4 w-full ">
          <Button
            size="small"
            color="primary"
            id="step5"
            className="w-[15px] h-[15px]"
            component={NavLinkAdapter}
            to={`/projects/item/${project.id}/edit${search}`}
            onClick={(e) => e.stopPropagation()}
          >
            <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
          </Button>
          <Button
            id="three"
            size="small"
            className="w-[15px] h-[15px]"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                isnotifiedProject({ id: project.id, isNotified: project?.is_notified })
              ).then(() => dispatch(getProjects(+searchParams.get('page') || 1)));
            }}
          >
            {project.is_notified === 1 ? (
              <NotificationsIcon size={20} />
            ) : (
              <NotificationsOffIcon size={20} />
            )}
          </Button>
          <Button
            id="three"
            size="small"
            className="w-[15px] h-[15px]"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              setOpenPublishModal(true);
            }}
          >
            <FuseSvgIcon size={20}>
              {project?.is_published === 1 ? 'feather:eye' : 'feather:eye-off'}
            </FuseSvgIcon>
          </Button>
          <Button
            onClick={handleAccordionToggle}
            size="small"
            color="primary"
            className="w-[10px] h-[10px]"
          >
            <FuseSvgIcon className="w-[10px] h-[10px]" size={20} color="action">
              {isAccordionOpen
                ? 'material-twotone:keyboard_arrow_up'
                : 'material-twotone:keyboard_arrow_down'}
            </FuseSvgIcon>
          </Button>
        </CardActions>

        {isAccordionOpen ? (
          <Box className="w-full flex items-center  p-5">
            <Table sx={{ '& td': { padding: '4px', border: '1px solid' } }}>
              <TableBody>
                <TableRow>
                  <TableCell>{t('Number')}</TableCell>
                  <TableCell>{project?.number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('REGION')}</TableCell>
                  <TableCell>{regionsTranslation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('GRANTEE')}</TableCell>
                  <TableCell>{projectTranslation?.grantee}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('FOCAL_AREA')}</TableCell>
                  <TableCell>{focalAreaTranslation?.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('CROSS_CUTTING_AREAS')}</TableCell>
                  <TableCell>{crossAreaTranslation?.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('GRANT_AMOUNT')}</TableCell>
                  <TableCell>{project?.grant_amount}</TableCell>
                </TableRow>{' '}
                <TableRow>
                  <TableCell>{t('SPONSOR_AMOUNT')}</TableCell>
                  <TableCell>{project?.sponsor_amount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('PARTIALAMOUNT')}</TableCell>
                  <TableCell>{project?.partial_amount}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        ) : null}

        <DeleteModal
          close={() => {
            setOpenPublishModal(false);
          }}
          text={t('CHANGEPUBLISH')}
          open={openPublishModal}
          onClick={() => {
            dispatch(statusProject({ id: project.id, isPublished: project?.is_published }))
              .then(() =>
                dispatch(
                  getProjects({
                    page: 1,
                    isPubleshed: project.is_published === 0 ? 1 : '0',
                  })
                )
              )
              .then(() => {
                setSearchParams({
                  page: 1,
                  isPublished: project.is_published === 0 ? 1 : 0,
                });
              })
              .then(() => setOpenPublishModal(false));
          }}
        />
      </Card>
    </>
  );
}
