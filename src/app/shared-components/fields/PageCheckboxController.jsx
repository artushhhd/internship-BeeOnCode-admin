import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import SwitchController from 'app/shared-components/fields/SwitchController';
import { Controller } from 'react-hook-form';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

export default function PageCheckboxController({ control, name, errors, data, link, watch, edit }) {
  const { translationLanguage, translationLanguageInModal } = useSelector((state) => state.i18n);
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation('navigation');
  const page = watch(name);
  const [defaultValue, setDefaultValue] = useState();

  useEffect(() => {
    if (page?.id) {
      setChecked(true);
      setDefaultValue(page);
    } // eslint-disable-next-line
  }, [translationLanguageInModal,edit]);


  return (
    <div>
      <SwitchController
        checked={checked}
        setChecked={setChecked}
        labels={{ first: 'EXTERNAL_PAGES', second: 'INTERNAL_PAGES' }}
      />

      {/* {checked ? 'autocomplete' : 'url'} */}
      {checked ? (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange } }) => {
            return (
              <Autocomplete
                className="mt-20 w-full"
                defaultValue={defaultValue}
                options={data}
                getOptionLabel={(option) => {
                  return `${
                    option.translations?.find((tr) => tr.language_id === translationLanguage)?.title
                  } (${option.slug})`;
                }}
                renderInput={(params) => {
                  return <TextField {...params} label={t('PAGES')} />;
                }}
                onChange={(event, newValue) => {
                  onChange(newValue);
                }}
              />
            );
          }}
        />
      ) : (
        <Controller
          name={link}
          control={control}
          render={({ field }) => (
            <TextField
              className="w-full"
              {...field}
              label="URL"
              error={!!errors?.[link]}
              helperText={errors?.[link].message}
            />
          )}
        />
      )}
    </div>
  );
}
