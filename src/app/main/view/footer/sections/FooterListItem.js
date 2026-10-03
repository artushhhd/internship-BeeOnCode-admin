import { useDispatch, useSelector } from 'react-redux';
import ListItem from '@mui/material/ListItem';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemText from '@mui/material/ListItemText';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import { FILE_API_URL } from '@api/http';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import DevMode from 'app/shared-components/DevMode';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import { useNavigate, useParams } from 'react-router-dom';
import ImageBox from 'app/shared-components/ImageBox';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import { addType } from './store/footersSlice';

function FooterListItem(props) {
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { item: section, canManage } = props;
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');
  const dispatch = useDispatch();

  return section.type !== 'middle' ? (
    <>
      <ListItem
        className="w-full  "
        sx={{ bgcolor: 'background.paper' }}
        onDoubleClick={() =>
          section.id !== +id && !!canManage && navigate(`/view/footer/sections/${section.id}/edit`)
        }
      >
        <DevMode>id: {section.id}</DevMode>
        <ListItemAvatar>
          <ImageBox
            alt={section.name}
            src={
              section.media?.thumbnail_url ? `${FILE_API_URL}/${section.media?.thumbnail_url}` : ''
            }
          />
        </ListItemAvatar>
        <ListItem className="w-[220px]" sx={{ bgcolor: 'background.paper' }}>
          {section.translations.find((val) => val.language_id === translationLanguage) && (
            <div className="w-full grid">
              <ListItemText
                className="w-full"
                classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
                primary={
                  section.translations.find((val) => val.language_id === translationLanguage).title
                }
              />
              <Box className="inline" component="span" variant="body2" color="text.secondary">
                <div
                  style={{ color: 'black' }}
                  dangerouslySetInnerHTML={{
                    __html: JSON.parse(
                      section.translations?.find((val) => val?.language_id === translationLanguage)
                        .content
                    )?.htmlValue,
                  }}
                />
              </Box>
            </div>
          )}
        </ListItem>
        <Box className="w-full flex">
          <Box
            onClick={() => dispatch(addType('before'))}
            component={NavLinkAdapter}
            to={`/view/footer/sections/${section?.id}/edit?link=1`}
            className="cursor-pointer flex w-[25px] rounded-[30px] bg-green-400 items-center justify-between mt-8 mb-8 hover:bg-green-700"
          >
            <Box className="rounded-full bg-green-900 text-white mr-10">
              <FuseSvgIcon size={25}>heroicons-outline:plus</FuseSvgIcon>
            </Box>
          </Box>
          <Box className="flex pl-10 items-center underline">
            {section?.links?.map((obj) => {
              return (
                <Box className="flex items-center fs-22 hover:bg-blue-50 pt-2 pb-2 pl-5 border-r-1 mr-5 pr-8">
                  <Box className="mt-3 mr-5" style={{ fontSize: '15px', color: '#009FDF' }}>
                    {obj?.name}
                  </Box>
                  <Box>
                    {obj.page_id ? (
                      <>
                        <Box className="flex">
                          <Tooltip title={t('SEE_THE_PAGE')} enterDelay={300}>
                            <Box
                              className="ml-10"
                              onClick={() => {
                                navigate(`/pages/${obj?.page_id}`);
                              }}
                              style={{
                                cursor: 'pointer',
                                color: '#009FDF',
                                marginTop: '4px',
                              }}
                            >
                              <FuseSvgIcon size={23}>heroicons-outline:external-link</FuseSvgIcon>
                            </Box>
                          </Tooltip>
                          <Tooltip title={t('SEE_ON_SITE')} enterDelay={300}>
                            <Box
                              className="ml-10"
                              onClick={() => {
                                window.open(
                                  `https://dev-gtpq.beeonco.de/page${obj?.page_id}`,
                                  '_blank'
                                );
                              }}
                              style={{ cursor: 'pointer', color: '#009FDF', marginTop: '4px' }}
                            >
                              <FuseSvgIcon size={23}>heroicons-outline:external-link</FuseSvgIcon>
                            </Box>
                          </Tooltip>
                        </Box>
                      </>
                    ) : (
                      <Tooltip title={t('FOLLOW_LINK')} enterDelay={300}>
                        <Box
                          className="ml-10"
                          onClick={() => {
                            window.open(obj?.link, '_blank');
                          }}
                          style={{ cursor: 'pointer', color: '#009FDF', marginTop: '4px' }}
                        >
                          <FuseSvgIcon size={23}>heroicons-outline:external-link</FuseSvgIcon>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        {canManage ? (
          <ListItem
            className="w-5 h-5 "
            component={NavLinkAdapter}
            to={`/view/footer/sections/${section.id}/edit`}
          >
            <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
          </ListItem>
        ) : (
          ''
        )}
        <div className="w-5 h-5 " style={{ marginRight: '50px', marginBottom: '33px' }}>
          {section.log?.length !== 0 && <HistoryComponent data={section} name="FOOTER" />}
        </div>
      </ListItem>
    </>
  ) : (
    <>
      <ListItem
        className=" flex flex-col items-center  my-3"
        sx={{ bgcolor: 'background.paper' }}
        onDoubleClick={() =>
          section.id !== +id && !!canManage && navigate(`/view/footer/sections/${section.id}/edit`)
        }
      >
        <ListItem className="flex items-center  justify-around">
          <div className="flex w-full h-full items-center">
            <DevMode>id: {section.id}</DevMode>
            <ListItemAvatar>
              <ImageBox
                alt={section.name}
                src={
                  section.media?.thumbnail_url
                    ? `${FILE_API_URL}/${section.media?.thumbnail_url}`
                    : ''
                }
              />
            </ListItemAvatar>
            {canManage ? (
              <ListItem
                className="w-5 h-5 "
                component={NavLinkAdapter}
                to={`/view/footer/sections/${section.id}/edit`}
              >
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
              </ListItem>
            ) : (
              ''
            )}
            <div className="w-5 h-5 " style={{ marginRight: '50px', marginBottom: '33px' }}>
              {section.log?.length !== 0 && <HistoryComponent data={section} name="FOOTER" />}
            </div>
          </div>
        </ListItem>
        <div className="overflow-y-scroll ">
          <div>
            <ListItem className="w-full block  ">
              {section.translations.find((val) => val.language_id === translationLanguage) && (
                <div className="w-full">
                  <ListItemText
                    className="w-full"
                    classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
                    primary={
                      section.translations.find((val) => val.language_id === translationLanguage)
                        .title
                    }
                  />
                  <Box component="span" variant="body2">
                    <div
                      className="footerMidleText"
                      dangerouslySetInnerHTML={{
                        __html: JSON.parse(
                          section.translations?.find(
                            (val) => val?.language_id === translationLanguage
                          ).content
                        )?.htmlValue,
                      }}
                    />
                  </Box>
                </div>
              )}
            </ListItem>
            <Box
              onClick={() => dispatch(addType('middle'))}
              component={NavLinkAdapter}
              to={`/view/footer/sections/${section?.id}/edit?link=1`}
              className="cursor-pointer flex w-full rounded-[30px] bg-green-400 items-center justify-between mt-8 mb-8 hover:bg-green-700"
            >
              <Typography className="font-600 pl-4">
                <span className="mx-4">{t('ADD')}</span> <span>{t('LINK')}</span>
              </Typography>
              <Box className="rounded-full bg-green-900 text-white">
                <FuseSvgIcon size={25}>heroicons-outline:plus</FuseSvgIcon>
              </Box>
            </Box>
            <Box className="w-full flex flex-col pl-10 content-center underline">
              {section?.links?.map((obj) => {
                return (
                  <Box className="flex items-center fs-22 hover:bg-blue-50 pt-2 pb-2 pl-5 border-b-1">
                    <Box className="mt-3 mr-5" style={{ fontSize: '15px', color: '#009FDF' }}>
                      {obj?.name}
                    </Box>
                    <Box>
                      {obj.page_id ? (
                        <>
                          <Box className="flex">
                            <Tooltip title={t('SEE_THE_PAGE')} enterDelay={300}>
                              <Box
                                className="ml-10"
                                onClick={() => {
                                  navigate(`/pages/${obj?.page_id}`);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  color: '#009FDF',
                                  marginTop: '4px',
                                }}
                              >
                                <FuseSvgIcon size={23}>heroicons-outline:external-link</FuseSvgIcon>
                              </Box>
                            </Tooltip>
                            <Tooltip title={t('SEE_ON_SITE')} enterDelay={300}>
                              <Box
                                className="ml-10"
                                onClick={() => {
                                  window.open(
                                    `https://dev-gtpq.beeonco.de/page${obj?.page_id}`,
                                    '_blank'
                                  );
                                }}
                                style={{ cursor: 'pointer', color: '#009FDF', marginTop: '4px' }}
                              >
                                <FuseSvgIcon size={23}>heroicons-outline:external-link</FuseSvgIcon>
                              </Box>
                            </Tooltip>
                          </Box>
                        </>
                      ) : (
                        <Tooltip title={t('FOLLOW_LINK')} enterDelay={300}>
                          <Box
                            className="ml-10"
                            onClick={() => {
                              window.open(obj?.link, '_blank');
                            }}
                            style={{ cursor: 'pointer', color: '#009FDF', marginTop: '4px' }}
                          >
                            <FuseSvgIcon size={23}>heroicons-outline:external-link</FuseSvgIcon>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </div>
        </div>
      </ListItem>
    </>
  );
}

export default FooterListItem;
