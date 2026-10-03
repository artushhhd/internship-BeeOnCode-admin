import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const InputDateController = ({
  control,
  name,
  errors,
  label = name,
  className = 'mt-16 font-bold w-full',
  disabled = false,
}) => {
  const { translationLanguageInModal } = useSelector((state) => state.i18n);

  const { t } = useTranslation('navigation');

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <DesktopDatePicker
              label={t(label)}
              inputFormat="dd/MM/yyyy"
              renderInput={(params) => (
                <TextField
                  className={className}
                  sx={{
                    '& div': {
                      fontWeight: 'bold',
                    },
                  }}
                  error={!!errors[name]}
                  helperText={errors[name]?.message}
                  disabled={disabled}
                  {...params}
                />
              )}
              id={`${name}${translationLanguageInModal}`}
              {...field}
            />
          );
        }}
      />
    </>
  );
};

export default InputDateController;
