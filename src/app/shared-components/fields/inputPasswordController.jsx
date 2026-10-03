import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

const InputPasswordController = ({
  control,
  name,
  errors,
  label = name,
  className = 'mt-32 font-bold',
  disabled = false,
  value = '',
}) => {
  const { translationLanguageInModal } = useSelector((state) => state.i18n);
  const [showPassword, setShowPassword] = React.useState(true);
  const { t } = useTranslation('navigation');
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        if (!field.value) {
          field.value = '';
        }
        return (
          <TextField
            type={!showPassword ? 'text' : 'password'}
            className={className}
            disabled={disabled}
            {...field}
            value={value || field.value}
            label={t(label)}
            placeholder={t(label)}
            id={`${name}${translationLanguageInModal}`}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            variant="outlined"
            required
            fullWidth
            InputProps={{
              style: { fontWeight: '700' },

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        );
      }}
    />
  );
};

export default InputPasswordController;
