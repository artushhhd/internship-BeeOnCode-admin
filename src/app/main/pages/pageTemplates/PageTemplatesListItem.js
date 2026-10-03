import { useSearchParams } from 'react-router-dom';
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
import { ListItem } from '@mui/material';
import Box from '@mui/material/Box';
import DevMode from 'app/shared-components/DevMode';
import Button from '@mui/material/Button';
import DeleteModal from 'app/shared-components/modals/DeleteModal';
import { useTranslation } from 'react-i18next';
import { deletePageTemplate, restorePageTemplate } from './store/pageTemplateSlice';
import {
  getInactivePageTemplates,
  getPageTemplates,
  selectPageTemplates,
  selectPageTemplatesSearchText,
  setPageTemplatesSearchText,
} from './store/pageTemplatesSlice';

function PageTemplatesListItem({ translationLanguage, canManage }) {
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(searchParams.get('deleted') ? getInactivePageTemplates() : getPageTemplates()).then(
      () => setLoading(false)
    );
  }, [dispatch, searchParams]);

  const pageTemplates = useSelector(selectPageTemplates);

  const searchText = useSelector(selectPageTemplatesSearchText);
  const { t } = useTranslation('navigation');

  const [data, setData] = useState(pageTemplates);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(pageTemplates, (item) =>
          item.translations
            ?.find((val) => val.language_id === translationLanguage)
            ?.title.toLowerCase()
            .includes(searchText.toLowerCase())
        )
      );
    } else {
      setData(pageTemplates);
    }
  }, [pageTemplates, searchText, translationLanguage]);

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
          ? 'rgba(0, 0, 0, .05)!important'
          : 'rgba(255, 255, 255, .1)!important',
      '& .list-item-icon': {
        color: theme.palette.secondary.main,
      },
      '& h6': {
        whiteSpace: 'pre-wrap',
      },
    },
    '& .list-item-icon': {
      marginRight: 16,
    },
  }));

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
            placeholder="Search pageTemplates"
            className="flex"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={(ev) => dispatch(setPageTemplatesSearchText(ev))}
          />
        </Paper>
      </div>
      <Divider />
      <Box className="px-16 py-24">
        {!searchParams.get('deleted') && canManage ? (
          <Button
            id="step1"
            className="my-8 w-full shadow-1"
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to="/pageTemplate/new/edit"
          >
            <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>

            <span className="mx-8">{`${t('ADD')} ${t('PAGETEMPLATES')}`}</span>
          </Button>
        ) : (
          ''
        )}
        {data.length ? (
          data.map((pageTemplate) => {
            return (
              <div key={`pageTemplate${pageTemplate.id}`} className="relative">
                <StyledListItem
                  id="step2"
                  button
                  component={NavLinkAdapter}
                  to={
                    searchParams.get('deleted')
                      ? `/pageTemplate/${pageTemplate.id}?deleted=true`
                      : `/pageTemplate/${pageTemplate.id}`
                  }
                  end
                  activeClassName="active"
                  className="shadow-1 justify-between"
                >
                  <Typography
                    className="whitespace-nowrap w-[75%] overflow-hidden overflow-ellipsis"
                    variant="subtitle2"
                  >
                    <DevMode>
                      <span>{`id: ${pageTemplate.id} `}</span>
                    </DevMode>
                    <span className={searchParams.get('deleted') ? 'line-through' : ''}>
                      {
                        pageTemplate.translations?.find(
                          (val) => val.language_id === translationLanguage
                        )?.title
                      }
                    </span>
                  </Typography>
                </StyledListItem>

                {canManage ? (
                  <>
                    {searchParams.get('deleted') ? (
                      <Button
                        className="absolute min-w-[40px] right-0 top-0"
                        onClick={() => setOpen(pageTemplate.id)}
                      >
                        <FuseSvgIcon>feather:trash-2</FuseSvgIcon>
                      </Button>
                    ) : null}
                    {searchParams.get('deleted') ? (
                      <Button
                        className="absolute min-w-[40px] right-28 top-0"
                        onClick={() =>
                          dispatch(restorePageTemplate(pageTemplate.id)).then(() => {
                            dispatch(getInactivePageTemplates());
                          })
                        }
                      >
                        <FuseSvgIcon>heroicons-outline:reply</FuseSvgIcon>
                      </Button>
                    ) : (
                      <Button
                        id="step3"
                        className="absolute min-w-[40px] right-0 top-0"
                        component={NavLinkAdapter}
                        to={`/pageTemplate/${pageTemplate.id}/edit`}
                      >
                        <FuseSvgIcon>heroicons-outline:pencil-alt</FuseSvgIcon>
                      </Button>
                    )}
                  </>
                ) : (
                  ''
                )}
              </div>
            );
          })
        ) : (
          <Box id="step2">
            <EmptyContent name="PAGETEMPLATES" />
          </Box>
        )}
      </Box>

      <DeleteModal
        name={t('PAGETEMPLATES')}
        onClick={() =>
          dispatch(deletePageTemplate(open)).then(() => {
            dispatch(getInactivePageTemplates());
            setOpen(false);
          })
        }
        open={!!open}
        close={() => setOpen(false)}
      />
    </>
  );
}

export default PageTemplatesListItem;
