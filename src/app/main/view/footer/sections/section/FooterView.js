import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Divider from '@mui/material/Divider';
import { selectCurrentLanguage } from 'app/store/i18nSlice';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { getSection, selectSection } from '../store/footerSlice';

const FooterView = () => {
  const section = useSelector(selectSection);
  const { index } = useSelector(selectCurrentLanguage);
  const routeParams = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSection(routeParams.id));
  }, [dispatch, routeParams]);

  if (!section) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl">
          <div className="flex flex-auto items-end -mt-64">
            <Typography className="mt-12 mr-12 text-4xl font-bold truncate">
              {section.translations[index].title}
            </Typography>
            <div className="flex items-center ml-auto mb-4">
              <Button variant="contained" color="secondary" component={NavLinkAdapter} to="edit">
                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                <span className="mx-8">Edit</span>
              </Button>
            </div>
          </div>
          <Divider className="mt-16 mb-24" />
          <div className="flex flex-col space-y-32">
            {section.translations[index].content && (
              <div
                dangerouslySetInnerHTML={{
                  __html: JSON.parse(section.translations[index].content).htmlValue,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterView;
