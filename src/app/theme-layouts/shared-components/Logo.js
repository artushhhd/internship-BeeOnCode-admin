import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const Root = styled('div')(({ theme }) => ({
  '& > .logo-icon': {
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  '& > .badge': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo() {
  return (
    <Root className="flex items-center justify-between  w-full">
      <img className="logo-icon h-32" src="assets/images/logo/logo.png" alt="logo" />

      <Typography component="h6" color="disabled" className="font-bold uppercase ">
        {process.env.REACT_APP_MODE}
      </Typography>
    </Root>
  );
}

export default Logo;
