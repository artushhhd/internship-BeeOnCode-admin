import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import EmptyContent from 'app/shared-components/EmptyContent';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Link, ListItem } from '@mui/material';
import Box from '@mui/material/Box';
import DevMode from 'app/shared-components/DevMode';
import Button from '@mui/material/Button';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import HistoryComponent from 'app/shared-components/HistoryComponent';
import { useTranslation } from 'react-i18next';
import Menu from '@mui/material/Menu';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {
  getInactivePages,
  getPages,
  selectPages,
  selectPagesSearchText,
  setPagesSearchText,
} from './store/pagesSlice';
import { deletePage, editPageStatus, restorePage } from './store/pageSlice';

function PagesListItem({ translationLanguage, canManage, stat, setStat }) {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [additionalMenu, setAdditionalMenu] = useState(-1);
  const nav = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    dispatch(searchParams.get('deleted') ? getInactivePages() : getPages()).then(() =>
      setLoading(false)
    );
  }, [dispatch, searchParams]);

  const pages = useSelector(selectPages);

  const searchText = useSelector(selectPagesSearchText);

  const [data, setData] = useState(pages);

  const { t } = useTranslation('navigation');

  const [pageType, setPageType] = useState('dynamic');

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(pages, (item) =>
          item.translations
            ?.find((val) => val.language_id === translationLanguage)
            ?.title.toLowerCase()
            .includes(searchText.toLowerCase())
        )
      );
    } else {
      setData(pages);
    }
  }, [pages, searchText, translationLanguage]);

  const StyledListItem = styled(ListItem)(({ theme }) => ({
    color: 'inherit!important',
    textDecoration: 'none!important',
    minHeight: 40,
    width: '100%',
    padding: '0 0 0 10px',
    borderRadius: 20,
    marginBottom: 8,
    fontWeight: 500,
    '&.active': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? 'rgba(0, 0, 0, .15)!important'
          : 'rgba(255, 255, 255, .15)!important',
      '& .list-item-icon': {
        color: theme.palette.secondary.main,
      },
    },
    '&': {
      '& h6': {
        whiteSpace: 'pre-wrap',
      },
    },
    '& .list-item-icon': {
      marginRight: 16,
    },
  }));

  const StyledActiveListItem = styled(ListItem)(({ theme }) => {
    return {
      color: 'inherit!important',
      textDecoration: 'none!important',
      minHeight: 40,
      width: '100%',
      padding: '0 0 0 10px',
      borderRadius: 20,
      marginBottom: 8,
      fontWeight: 500,
      '& h6': {
        whiteSpace: 'pre-wrap',
      },
      backgroundColor:
        theme.palette.mode === 'light'
          ? 'rgba(0, 0, 0, .15)!important'
          : 'rgba(255, 255, 255, .15)!important',
      '& .list-item-icon': {
        color: theme.palette.secondary.main,
      },
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center px-16 gap-14">
        <Paper
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex items-center justify-center my-10 mx-auto	w-full space-x-8 px-16 rounded-full border-1 shadow-0"
        >
          <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

          <Input
            placeholder="Search pages"
            className="flex"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={(ev) => dispatch(setPagesSearchText(ev))}
          />
        </Paper>
      </div>
      <Divider />
      <Tabs
        id="step1"
        value={pageType}
        aria-label="types pages"
        onChange={(event, newValue) => {
          setPageType(newValue);
        }}
      >
        <Tab
          label={t('DYNAMIC')}
          value="dynamic"
          onClick={() => {
            setStat('dynamic');
            nav('/pages');
          }}
        />
        <Tab
          label={t('STATIC')}
          value="static"
          onClick={() => {
            nav('/pages');
            setStat('static');
          }}
        />
        <Tab
          label={t('AREAS')}
          value="template"
          onClick={() => {
            nav('/pages');
            setStat('template');
          }}
        />
        {/* <Tab label={t('HOMEPAGE')} value="home" onClick={() => setStat('home')} /> */}
      </Tabs>
      <Box className="px-16 py-24">
        {(!searchParams.get('deleted') && !!canManage && stat === 'static') ||
          (stat !== 'static' && (
            <Button
              id="step2"
              className="my-8 w-full shadow-1"
              variant="contained"
              color="secondary"
              component={NavLinkAdapter}
              to={stat === 'dynamic' ? '/pages/new/edit' : '/pages/new/edit/category'}
            >
              <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>

              <span className="mx-8">{`${t('ADD')} ${t('PAGE')}`}</span>
            </Button>
          ))}
        <DevMode>
          {stat === 'static' && (
            <Button
              id="step2"
              className="my-8 w-full shadow-1"
              variant="contained"
              color="error"
              component={NavLinkAdapter}
              to="/pages/new/edit/static/add"
            >
              <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>

              <span className="mx-8">{`${t('ADD')} ${t('STATIC')} ${t('PAGE')}`}</span>
            </Button>
          )}
        </DevMode>
        {data.length > 0 ? (
          data
            .filter((page) => page.type === pageType)
            .map((page, i) => {
              return (
                <div key={`page${page.id}`} className="relative">
                  <Box className="flex">
                    {page.id === +id ? (
                      <StyledListItem
                        button
                        className={`shadow-1 bg-grey-500 hover:bg-grey-700  justify-between ${
                          page.status ? '' : '!bg-red !hover:bg-red-700 !outline-0'
                        } ${page.has_menu ? '' : 'bg-orange-500 hover:bg-orange-500'}`}
                      >
                        <Typography
                          className="whitespace-nowrap w-[75%] overflow-hidden overflow-ellipsis"
                          variant="subtitle2"
                        >
                          <DevMode>
                            <span>{`id: ${page.id} `}</span>
                          </DevMode>
                          <span className={searchParams.get('deleted') ? 'line-through' : ''}>
                            {
                              page.translations?.find(
                                (val) => val.language_id === translationLanguage
                              )?.title
                            }
                          </span>
                        </Typography>
                        {!!canManage && page.type !== 'static' && (
                          <Button
                            size="small"
                            className="mr-[15px]"
                            onClick={() =>
                              dispatch(editPageStatus(page)).then(() => dispatch(getPages()))
                            }
                          >
                            <FuseSvgIcon>
                              {page.status ? 'feather:eye' : 'feather:eye-off'}
                            </FuseSvgIcon>
                          </Button>
                        )}
                      </StyledListItem>
                    ) : (
                      <StyledListItem
                        button
                        component={stat === 'dynamic' ? NavLinkAdapter : ''}
                        to={
                          // eslint-disable-next-line no-nested-ternary
                          searchParams.get('deleted')
                            ? `/pages/${page.id}?deleted=true`
                            : `/pages/${page.id}`
                        }
                        end
                        activeClassName="active"
                        className={`shadow-1 justify-between ${
                          page.status ? '' : '!bg-red !hover:bg-red-700 !outline-0'
                        } ${
                          page.has_menu
                            ? ''
                            : 'hover:bg-orange-500 outline outline-2 outline-solid outline-orange-500'
                        }`}
                      >
                        <Typography
                          id="step4"
                          className="whitespace-nowrap w-[75%] overflow-hidden overflow-ellipsis"
                          variant="subtitle2"
                        >
                          <DevMode>
                            <span>{`id: ${page.id} `}</span>
                          </DevMode>
                          <span className={searchParams.get('deleted') ? 'line-through' : ''}>
                            {
                              page.translations?.find(
                                (val) => val.language_id === translationLanguage
                              )?.title
                            }
                          </span>
                        </Typography>
                        {!!canManage && page.type !== 'static' && (
                          <Button
                            size="small"
                            className="mr-[15px]"
                            onClick={() =>
                              dispatch(editPageStatus(page)).then(() => dispatch(getPages()))
                            }
                          >
                            <FuseSvgIcon>
                              {page.status ? 'feather:eye' : 'feather:eye-off'}
                            </FuseSvgIcon>
                          </Button>
                        )}
                      </StyledListItem>
                    )}
                    {!!canManage && (
                      <Button
                        id="step5"
                        className="absolute min-w-[40px] right-0 top-0"
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setAdditionalMenu(i);
                        }}
                      >
                        <FuseSvgIcon size={24}>feather:more-vertical</FuseSvgIcon>
                      </Button>
                    )}

                    {!!canManage && (
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={i === additionalMenu}
                        onClose={() => {
                          setAnchorEl(null);
                          setAdditionalMenu(-1);
                        }}
                      >
                        {searchParams.get('deleted') && (
                          <Button size="small" onClick={() => setOpen(page.id)}>
                            <FuseSvgIcon>feather:trash-2</FuseSvgIcon>
                          </Button>
                        )}
                        {page.type !== 'static' && searchParams.get('deleted') ? (
                          <Button
                            size="small"
                            onClick={() =>
                              dispatch(restorePage(page.id)).then(() => {
                                dispatch(getInactivePages());
                              })
                            }
                          >
                            <FuseSvgIcon>heroicons-outline:reply</FuseSvgIcon>
                          </Button>
                        ) : (
                          // page.type !== 'static' && (
                          <Button
                            size="small"
                            component={NavLinkAdapter}
                            to={
                              stat === 'template'
                                ? `/pages/${page.id}/edit/category`
                                : `/pages/${page.id}/edit`
                            }
                            onClick={() => {
                              setAnchorEl(null);
                              setAdditionalMenu(-1);
                            }}
                          >
                            <FuseSvgIcon>heroicons-outline:pencil-alt</FuseSvgIcon>
                          </Button>
                          // )
                        )}
                        {!searchParams.get('deleted') && (
                          <Button size="small">
                            <Link
                              href={`${process.env.REACT_APP_FRONT_URL}${
                                page.type !== 'static' ? '/pages/' : ''
                              }${page.slug}`}
                              target="_blank"
                              style={{ background: 'transparent', border: 'none' }}
                            >
                              <FuseSvgIcon>feather:external-link</FuseSvgIcon>
                            </Link>
                          </Button>
                        )}
                        {(page.log.length || page.translations.some((trs) => trs.log.length)) &&
                          page.type !== 'static' && <HistoryComponent data={page} name="PAGES" />}
                      </Menu>
                    )}
                  </Box>
                </div>
              );
            })
        ) : (
          <EmptyContent name="pages" />
        )}
      </Box>

      <DeleteModal
        name={t('PAGE')}
        onClick={() =>
          dispatch(deletePage(open)).then(() => {
            dispatch(getInactivePages());
            setOpen(false);
          })
        }
        open={!!open}
        close={() => setOpen(false)}
      />
    </>
  );
}

export default PagesListItem;
