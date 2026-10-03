import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import EmptyContent from 'app/shared-components/EmptyContent';
import { ListItem } from '@mui/material';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import FooterDragAndDrop from './FooterDragAndDrop';
import FooterListItem from './FooterListItem';
import { changeOrderSection } from './store/footerSlice';
import {
  addType,
  selectFilteredSections,
  selectGroupedFilteredSections,
} from './store/footersSlice';

function FooterList({ canManage }) {
  const filteredData = useSelector(selectFilteredSections);
  const { loading } = useSelector((state) => state.sectionsApp.sections);
  const sections = useSelector(selectGroupedFilteredSections);

  const dispatch = useDispatch();

  const { t } = useTranslation('navigation');
  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return <EmptyContent name="sections" />;
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="w-full"
    >
      <div className="w-ful flex items-center content-center">
        <Button className="mx-8" variant="contained">
          <span className="mx-8 items-center content-center">
            {t('FRONTCL')} {t('FRAGMENT')}
          </span>
        </Button>
      </div>
      <ListItem className="w-full flex m-0 p-0">
        <div
          className="w-full"
          style={{
            minHeight: '200px',
          }}
        >
          {canManage ? (
            <ListItem
              onClick={() => dispatch(addType('before'))}
              component={NavLinkAdapter}
              to="/view/footer/sections/new/edit"
            >
              <div
                className="w-full h-12 border-dashed border-2 border-indigo-600 flex items-center content-center"
                style={{ height: '50px', justifyContent: 'center' }}
              >
                <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>

                <span className="mx-8 items-center content-center font-bold">
                  {t('ADD')} {t('FRONT')} {t('FRAGMENT')}
                </span>
              </div>
            </ListItem>
          ) : (
            ''
          )}
          <FooterDragAndDrop
            data={sections.filter((val) => val.type === 'before')}
            update={changeOrderSection}
            isDragDisabled={!canManage}
          >
            <FooterListItem canManage={canManage} />
          </FooterDragAndDrop>
        </div>
      </ListItem>
      <div className="w-ful flex items-center content-center">
        <Button className="mx-8" variant="contained">
          <span className="mx-8 items-center content-center">
            {t('MIDDLE')} {t('FRAGMENT')}
          </span>
        </Button>
      </div>
      <div>
        <ListItem className="flex m-0 p-0">
          <div
            className="flex"
            style={{
              minHeight: '200px',
            }}
          >
            {!!canManage && (
              <ListItem
                onClick={() => dispatch(addType('middle'))}
                component={NavLinkAdapter}
                to="/view/footer/sections/new/edit"
                sx={{ width: 'auto' }}
              >
                <div
                  className="h-12 border-dashed border-2 border-indigo-600 flex items-center content-center"
                  style={{
                    width: '100px',
                    height: '370px',
                    justifyContent: 'center',
                  }}
                >
                  <FuseSvgIcon size={23}>heroicons-outline:plus</FuseSvgIcon>

                  <p
                    className="flex font-bold"
                    style={{
                      fontSize: '13px',
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright',
                    }}
                  >
                    {t('ADD')} {t('MIDDLE')} {t('FRAGMENT')}
                  </p>
                </div>
              </ListItem>
            )}
            <FooterDragAndDrop
              data={sections.filter((val) => val.type === 'middle')}
              update={changeOrderSection}
              direction="horizontal"
              isDragDisabled={!canManage}
            >
              <FooterListItem canManage={canManage} />
            </FooterDragAndDrop>
          </div>
        </ListItem>
      </div>
      <div className="w-ful flex items-center content-center">
        <Button className="mx-8" variant="contained">
          <span className="mx-8">
            {t('BOTTOM')} {t('FRAGMENT')}
          </span>
        </Button>
      </div>
      <div className="w-full">
        <ListItem className=" flex m-0 p-0">
          <div
            className="w-full"
            style={{
              minHeight: '200px',
            }}
          >
            {canManage ? (
              <ListItem
                onClick={() => dispatch(addType('after'))}
                component={NavLinkAdapter}
                to="/view/footer/sections/new/edit"
              >
                <div
                  className="w-full h-12 border-dashed border-2 border-indigo-600 flex items-center content-center"
                  style={{ height: '50px', justifyContent: 'center' }}
                >
                  <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>

                  <span className="mx-8 items-center content-center font-bold">
                    {t('ADD')} {t('BOTTOM')} {t('FRAGMENT')}
                  </span>
                </div>
              </ListItem>
            ) : (
              ''
            )}
            <FooterDragAndDrop
              data={sections.filter((val) => val.type === 'after')}
              update={changeOrderSection}
              isDragDisabled={!canManage}
            >
              <FooterListItem canManage={canManage} />
            </FooterDragAndDrop>
          </div>
        </ListItem>
      </div>
      <div className="w-ful flex items-center content-center">
        <Button className="mx-8" variant="contained">
          <span className="mx-8 items-center content-center">
            {t('COPYRIGTH')} {t('FRAGMENT')}
          </span>
        </Button>
      </div>
      {!sections.find((val) => val.type === 'copyright') && (
        <div className="w-full">
          <ListItem className=" flex m-0 p-0">
            <div className="w-full">
              <ListItem className=" flex m-0 p-0">
                <div
                  className="w-full"
                  style={{
                    minHeight: '200px',
                  }}
                >
                  {canManage ? (
                    <ListItem
                      onClick={() => dispatch(addType('copyright'))}
                      component={NavLinkAdapter}
                      to="/view/footer/sections/new/edit"
                    >
                      <div
                        className="w-full h-12 border-dashed border-2 border-indigo-600 flex items-center content-center"
                        style={{ height: '50px', justifyContent: 'center' }}
                      >
                        <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
                        <span className="font-bold">
                          {t('ADD')} {t('COPYRIGTH')} {t('FRAGMENT')}
                        </span>
                        dfgdfgf
                      </div>
                    </ListItem>
                  ) : (
                    ''
                  )}
                </div>
              </ListItem>
            </div>
          </ListItem>
        </div>
      )}
      <FooterDragAndDrop
        data={sections.filter((val) => val.type === 'copyright')}
        update={changeOrderSection}
        isDragDisabled={!canManage}
      >
        <FooterListItem canManage={canManage} />
      </FooterDragAndDrop>
      <div className="w-full flex flex-col min-h-200" />
    </motion.div>
  );
}

export default FooterList;
