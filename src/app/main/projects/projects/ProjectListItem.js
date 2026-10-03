import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useState } from 'react';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import DevMode from 'app/shared-components/DevMode';
import Box from '@mui/system/Box';
import { showMessage } from 'app/store/fuse/messageSlice';
import ImageBox from 'app/shared-components/ImageBox';
import { FILE_API_URL } from '@api/http';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItem from '@mui/material/ListItem';
import { isnotifiedProject, statusProject } from '../store/projectSlice';
import { getProjects } from '../store/projectsSlice';

function ProjectListItem(props) {
  const dispatch = useDispatch();
  const { item: project, canManage } = props;
  console.log(project);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openPublishModal, setOpenPublishModal] = useState(false);

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
    <Accordion
      id="two"
      style={{
        borderColor: project?.status?.color,
      }}
      className="px-32 py-20 w-full border-[4px] relative mb-5"
      sx={{ bgcolor: project.id === +id ? 'background.default' : 'background.paper' }}
      onDoubleClick={() =>
        project.id !== +id && !!canManage && navigate(`/projects/item/${project.id}/edit`)
      }
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <DevMode>id: {project.id}</DevMode>
        <Box
          className="absolute top-[-15px] left-[-20px] px-[10px] py-[2px] rounded-[10px] border-1 border-black "
          onClick={async (e) => {
            await navigator.clipboard.writeText(project?.number);
            dispatch(showMessage({ message: t('Copied') }));
          }}
        >
          {project?.number}
        </Box>
        <Box className="mt-[10px] ml-[-20px]">
          {project?.media?.thumbnail_url && (
            <ImageBox
              height={60}
              modal={`${FILE_API_URL}/${project?.media?.large_url}`}
              src={`${FILE_API_URL}/${project?.media?.thumbnail_url}`}
              alt="alt"
            />
          )}
        </Box>
        <ListItemText
          className="w-[10px] mt-[20px] "
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={projectTranslation?.title}
          secondary={
            <Typography className="inline" component="span" variant="body2" color="text.secondary">
              {project.start_date} - {project.end_date} <br />
              {focalAreaTranslation?.title} -- {crossAreaTranslation?.title} <br />
              {regionsTranslation} <br />
              {projectStatus?.title}
            </Typography>
          }
        />

        {!!canManage &&
          (project.id === +id ? (
            <FuseSvgIcon size={24}>heroicons-outline:arrow-right</FuseSvgIcon>
          ) : (
            <>
              <Button
                id="three"
                className="px-0 mt-[35px]"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    isnotifiedProject({ id: project.id, isNotified: project?.is_notified })
                  ).then(() => dispatch(getProjects(+searchParams.get('page') || 1)));
                }}
              >
                {project.is_notified === 1 ? <NotificationsIcon /> : <NotificationsOffIcon />}
              </Button>
              <Button
                id="three"
                className="px-0 mt-[35px]"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPublishModal(true);
                }}
              >
                <FuseSvgIcon>
                  {project.is_published === 1 ? 'feather:eye' : 'feather:eye-off'}
                </FuseSvgIcon>
              </Button>

              <ListItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="ml-auto  w-96 mt-[-5px]"
                component={NavLinkAdapter}
                to={`/projects/item/${project.id}/edit?page=${
                  +searchParams.get('page') || 1
                }&isPubleshed=${searchParams.get('isPubleshed') || 1}`}
              >
                {/* <Button }> */}
                <Button id="four">
                  <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                </Button>
              </ListItem>
              {/* {project?.log.length > 0 && ( */}
              {/*  <div className="w-96 mt-[35px] h-5 ml-auto "> */}
              {/*    <HistoryComponent data={project} name="PROJECT" /> */}
              {/*  </div> */}
              {/* )} */}
            </>
          ))}
      </AccordionSummary>
      <AccordionDetails>
        <Table sx={{ '& td': { padding: '8px', border: '1px solid' } }}>
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
      </AccordionDetails>
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
    </Accordion>
  );
}

export default ProjectListItem;
