import FusePageSimple from '@fuse/core/FusePageSimple';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { selectUser } from 'app/store/userSlice';
import RightBarLayout from 'app/shared-components/RightBarLayout';
import { changeMaximize } from 'app/store/RightBarSlice';
import Box from '@mui/system/Box';
import { motion } from 'framer-motion';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Error404Page from '../../404/Error404Page';
import FileManagerList from './FileManagerList';
import { selectPermission } from '../../administration/store/permissionsSlice';
import FileManagerHeader from './FileManagerHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function FileManagerApp() {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const { maximize } = useSelector((state) => state.rightBarSlice);
  const location = useLocation();
  const { id: userId } = useSelector(selectUser);
  const { canView, canManage } = useSelector(selectPermission);
  const [inModal, setInModal] = useState(false);

  useEffect(() => {
    const globalRegex = new RegExp('edit', 'gm');
    if (globalRegex.test(location.pathname)) {
      setRightSidebarOpen(true);
      setInModal(false);
    } else {
      setRightSidebarOpen(false);
      dispatch(changeMaximize({ maximize: false }));
    }
  }, [location.pathname, dispatch, userId]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  function handleToggleLeftSidebar() {
    setLeftSidebarOpen(!leftSidebarOpen);
  }

  return canView ? (
    <Root
      header={
        <FileManagerHeader pageLayout={pageLayout} onToggleLeftSidebar={handleToggleLeftSidebar} />
      }
      content={
        inModal ? (
          <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={inModal}
            onClose={() => setInModal(false)}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '99%',
                height: '99%',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Button
                size="small"
                className="absolute top-0 right-0 min-w-0 rounded-none"
                sx={{
                  border: 'solid',
                  borderWidth: '0 0 2px 2px',
                }}
                onClick={() => {
                  setInModal(false);
                }}
              >
                <FuseSvgIcon>feather:minimize-2</FuseSvgIcon>
              </Button>
              <FileManagerList />
            </Box>
          </Modal>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex flex-col flex-auto w-full max-h-full "
          >
            <Box
              sx={{
                width: '100%',
                height: '710px',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 2,
                pt: 1,
                position: 'relative',
              }}
            >
              <Button
                size="small"
                className="absolute top-0 right-0 min-w-0 rounded-none"
                sx={{
                  border: 'solid',
                  borderWidth: '0 0 2px 2px',
                }}
                onClick={() => {
                  setInModal(!inModal);
                }}
              >
                <FuseSvgIcon>feather:maximize-2</FuseSvgIcon>
              </Button>
              <FileManagerList />
            </Box>
          </motion.div>
        )
      }
      ref={pageLayout}
      rightSidebarContent={
        <RightBarLayout buttonXto={`/view/fileManager${location.search}`} name="FILEMANAGER">
          <Outlet canManage={canManage} />
        </RightBarLayout>
      }
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarWidth={maximize ? '100%' : 640}
      leftSidebarOpen={leftSidebarOpen && !maximize}
      scroll="content"
    />
  ) : (
    <Error404Page />
  );
}

export default FileManagerApp;
