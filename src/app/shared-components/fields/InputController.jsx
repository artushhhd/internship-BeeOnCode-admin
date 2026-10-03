import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';

const InputController = ({
  control,
  name,
  errors,
  icon = 'heroicons-outline:globe-alt',
  type = 'text',
  label = name,
  className = 'mt-16 font-bold',
  endAdornment = '',
  disabled = false,
  value = '',
}) => {
  const { translationLanguageInModal } = useSelector((state) => state.i18n);

  const { t } = useTranslation('navigation');

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
            type={type}
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
            sx={{
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
              '& input[type=number]::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            }}
            InputProps={{
              style: { fontWeight: '700' },

              endAdornment: (
                <InputAdornment position="end">
                  {endAdornment}
                  <FuseSvgIcon>{icon}</FuseSvgIcon>
                </InputAdornment>
              ),
            }}
          />
        );
      }}
    />
  );
};

export default InputController;
