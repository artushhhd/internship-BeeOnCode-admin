import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import Logo from 'app/theme-layouts/shared-components/Logo';
import NavbarToggleButton from 'app/theme-layouts/shared-components/NavbarToggleButton';
import Navigation from 'app/theme-layouts/shared-components/Navigation';
import DevMode from 'app/shared-components/DevMode';
import { Link } from '@mui/material';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '& ::-webkit-scrollbar-thumb': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
    }`,
  },
  '& ::-webkit-scrollbar-thumb:active': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
    }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(({ theme }) => ({
  overscrollBehavior: 'contain',
  overflowX: 'hidden',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 40px, 100% 10px',
  backgroundAttachment: 'local, scroll',
}));

function NavbarStyle1Content(props) {
  return (
    <Root className={clsx('flex flex-auto flex-col overflow-hidden h-full', props.className)}>
      <div className="flex flex-row items-center shrink-0 h-48 md:h-72 px-20">
        <div className="flex flex-1 mx-4">
          <Logo />
        </div>

        <NavbarToggleButton className="w-40 h-40 p-0" />
      </div>

      <StyledContent
        className="flex flex-1 flex-col min-h-0"
        option={{ suppressScrollX: true, wheelPropagation: false }}
      >
        {/* <UserNavbarHeader /> */}
        <DevMode>
          <Link
            href={`${process.env.REACT_APP_API_URL}/doc`}
            target="_blank"
            style={{
              textDecoration: 'none', // Remove underline
              backgroundColor: 'red', // Set background color to red
              color: 'white', // Set text color to white (or your preferred color)
              marginLeft: '15px', // Add padding for better visual appearance
              borderRadius: '4px', // Add border radius for rounded corners
              display: 'inline-block', // Make the link a block element
              transition: 'background-color 0.2s ease', // Add a smooth transition
              '&:hover': {
                backgroundColor: 'darkred', // Change background color on hover
              },
            }}
          >
            {`${process.env.REACT_APP_API_URL}/doc`}
          </Link>
        </DevMode>
        <div className="mt-[-30px]">
          <Navigation layout="vertical" />
        </div>

        <div className="flex flex-0 z-50 items-center justify-center py-48 opacity-80">
          <img
            className="w-[70%] max-h-64"
            src="assets/images/logo/beeonstudio.svg"
            alt="footer logo"
          />
        </div>
      </StyledContent>
    </Root>
  );
}

export default memo(NavbarStyle1Content);
