import { InputLabel, Select } from '@mui/material';
import { Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import { useTranslation } from 'react-i18next';

const SelectController = ({
  getValue,
  name,
  control,
  errors,
  data = [],
  label,
  getOption,
  disableHelperText = false,
}) => {
  const { t } = useTranslation('navigation');

  return (
    <Controller
      render={({ field }) => {
        if (!field.value) field.value = '';
        return (
          <FormControl className="flex w-full mt-16" error={!!errors[name]} required fullWidth>
            <InputLabel id="category-select-label">{t(label)}</InputLabel>
            <Select
              {...field}
              variant="outlined"
              fullWidth
              label={t(label)}
              sx={{ fontWeight: '700' }}
            >
              {data.map((item) => (
                <MenuItem
                  value={getValue ? getValue(item) : item.id}
                  key={item.id || Math.random()}
                >
                  {getOption ? getOption(item) : `id: ${item.id}`}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{disableHelperText && errors[name]?.message}</FormHelperText>
          </FormControl>
        );
      }}
      name={name}
      control={control}
    />
  );
};

export default SelectController;
