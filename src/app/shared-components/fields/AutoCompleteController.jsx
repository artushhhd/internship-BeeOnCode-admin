import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@mui/material';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

const AutoCompleteController = ({
  control,
  name,
  options = [],
  label,
  value = label,
  setValue,
  optionKey = 'title',
  getOptionLabel,
  freeSolo = false,
  multiple = false,
}) => {
  const { translationLanguage } = useSelector((state) => state.i18n);

  const { t } = useTranslation('navigation');

  const defaultOptionLabel = (option) => {
    return option?.translations
      ? `${option.translations.find((tr) => tr.language_id === translationLanguage)[optionKey]} `
      : option[optionKey];
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          multiple={multiple}
          value={value}
          onChange={(e, newValue) => {
            setValue(newValue);
            field.onChange(newValue);
          }}
          onKeyDown={(e, newValue) => {
            setValue(newValue);
            field.onChange(newValue);
          }}
          className="mt-20 w-full"
          options={options}
          freeSolo={freeSolo}
          getOptionLabel={getOptionLabel || defaultOptionLabel}
          renderInput={(params) => {
            return <TextField {...params} label={t(label)} />;
          }}
        />
      )}
    />
  );
};

export default AutoCompleteController;
