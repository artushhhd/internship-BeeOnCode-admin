import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FILE_API_URL } from '@api/http';

const InputTranslationController = ({
  control,
  name,
  errors,
  label = 'TITLE',
  disable = false,
  className = 'mt-16',
  ...fields
}) => {
  const { t } = useTranslation('navigation');
  const { translationLanguages, translationLanguageInModal } = useSelector((state) => state.i18n);
  return (
    <>
      {translationLanguages.map((l) => {
        return (
          translationLanguageInModal === l.id && (
            <Controller
              key={l.id}
              control={control}
              name={`${name}${l.id}`}
              render={({ field: { value, onChange } }) => {
                return (
                  <TextField
                    sx={{ fontWeight: 'bold' }}
                    disabled={disable}
                    className={className}
                    label={t(label)}
                    placeholder={t(label)}
                    id={`${translationLanguageInModal}`}
                    error={!!errors[`${name}${l.id}`]}
                    helperText={errors[`${name}${l.id}`]?.message}
                    variant="outlined"
                    value={value || ''}
                    onChange={onChange}
                    required
                    fullWidth
                    {...fields}
                    InputProps={{
                      style: { fontWeight: '700' },
                      endAdornment: (
                        <InputAdornment position="end">
                          <img
                            src={`${FILE_API_URL}/${l.flag}`}
                            alt={l.slug}
                            className="w-[20px] h-[15px] max-w-2xl shadow-5"
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                );
              }}
            />
          )
        );
      })}
    </>
  );
};

export default InputTranslationController;
