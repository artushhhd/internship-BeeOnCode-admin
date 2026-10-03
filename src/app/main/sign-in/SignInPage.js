import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from 'app/theme-layouts/shared-components/LanguageSwitcher';
import jwtService from '../../auth/services/jwtService';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(4, 'Password is too short - must be at least 4 chars.'),
});

const defaultValues = {
  email: '',
  password: '',
  remember: true,
};

function SignInPage() {
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation('navigation');

  useEffect(() => {
    if (process.env.REACT_APP_MODE !== 'prod') {
      setValue('email', 'superadmin@gtpq.am', { shouldDirty: true, shouldValidate: true });
      setValue('password', 'superadmin@gtpq.am', { shouldDirty: true, shouldValidate: true });
    }
  }, [setValue]);

  function onSubmit({ email, password }) {
    jwtService
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // No need to do anything, admin data will be set at app/auth/AuthContext
      })
      .catch((_errors) => {
        _errors.forEach((error) => {
          setError(error.type, {
            type: 'manual',
            message: error.message,
          });
        });
      });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center w-full sm:w-auto md:h-full md:w-2/5 py-8 px-16 sm:p-48 md:p-64 justify-center sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          {/* <img className="w-48" src="assets/images/logo/logo.png" alt="logo" /> */}

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            {t('ADMIN')}
          </Typography>
          {/* <div className="flex items-baseline mt-2 font-medium"> */}
          {/*  <Typography>Don't have an account?</Typography> */}
          {/*  <Link className="ml-4" to="/sign-up"> */}
          {/*    Sign up */}
          {/*  </Link> */}
          {/* </div> */}

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label={t('EMAIL')}
                  autoFocus
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label={t('PASSWORD')}
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {/* <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between"> */}
            {/*  <Controller */}
            {/*    name="remember" */}
            {/*    control={control} */}
            {/*    render={({ field }) => ( */}
            {/*      <FormControl> */}
            {/*        <FormControlLabel */}
            {/*          label="Remember me" */}
            {/*          control={<Checkbox size="small" {...field} />} */}
            {/*        /> */}
            {/*      </FormControl> */}
            {/*    )} */}
            {/*  /> */}
            {/*  <Link className="text-md font-medium" to="/pageTemplates/auth/forgot-password"> */}
            {/*    Forgot password? */}
            {/*  </Link> */}
            {/* </div> */}
            <LanguageSwitcher />
            <Button
              variant="contained"
              // style={{ backgroundColor: '#0f3f76', color: 'white' }}
              className=" w-full mt-16 text-light-blue-50 bg-[#0f3f76] hover:bg-[#ff3d00]"
              aria-label="ՄՈՒՏՔ"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              {t('LOGIN')}
            </Button>
            {/* <div className="flex items-center mt-32"> */}
            {/*  <div className="flex-auto mt-px border-t" /> */}
            {/*  <Typography className="mx-8" color="text.secondary"> */}
            {/*    Or continue with */}
            {/*  </Typography> */}
            {/*  <div className="flex-auto mt-px border-t" /> */}
            {/* </div> */}
            {/* <div className="flex items-center mt-32 space-x-16"> */}
            {/*  <Button variant="outlined" className="flex-auto"> */}
            {/*    <FuseSvgIcon size={20} color="action"> */}
            {/*      feather:facebook */}
            {/*    </FuseSvgIcon> */}
            {/*  </Button> */}
            {/*  <Button variant="outlined" className="flex-auto"> */}
            {/*    <FuseSvgIcon size={20} color="action"> */}
            {/*      feather:twitter */}
            {/*    </FuseSvgIcon> */}
            {/*  </Button> */}
            {/*  <Button variant="outlined" className="flex-auto"> */}
            {/*    <FuseSvgIcon size={20} color="action"> */}
            {/*      feather:github */}
            {/*    </FuseSvgIcon> */}
            {/*  </Button> */}
            {/* </div> */}
          </form>
        </div>
      </Paper>
      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: 'rgb(22 30 37)' }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: '#000000' }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: 'primary.light' }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="250" height="202" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)" />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="flex flex-col gap-6">
            <div className="text-7xl font-bold leading-none text-gray-100">{t('WELCOME')}</div>
            <img src="assets/images/logo/logo.png" alt="logo" width="200px" />

            {/* <div>our community</div> */}
          </div>
          {/* <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400"> */}
          {/*  Fuse helps developers to build organized and well coded dashboards full of beautiful and */}
          {/*  rich modules. Join us and start building your application today. */}
          {/* </div> */}
          {/* <div className="flex items-center mt-32"> */}
          {/*  <AvatarGroup */}
          {/*    sx={{ */}
          {/*      '& .MuiAvatar-root': { */}
          {/*        borderColor: 'primary.main', */}
          {/*      }, */}
          {/*    }} */}
          {/*  > */}
          {/*    <Avatar src="assets/images/avatars/female-18.jpg" /> */}
          {/*    <Avatar src="assets/images/avatars/female-11.jpg" /> */}
          {/*    <Avatar src="assets/images/avatars/male-09.jpg" /> */}
          {/*    <Avatar src="assets/images/avatars/male-16.jpg" /> */}
          {/*  </AvatarGroup> */}

          {/*  <div className="ml-16 font-medium tracking-tight text-gray-400"> */}
          {/*    More than 17k people joined us, it's your turn */}
          {/*  </div> */}
          {/* </div> */}
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
