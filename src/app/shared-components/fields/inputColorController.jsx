import { Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import { InputLabel, Select } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const InputColorController = ({
  control,
  errors,
  name = 'color',
  label = 'COLORS',
  palette = 1,
}) => {
  const colorState = useMemo(() => {
    let colors = [];
    if (palette === 2) {
      colors = [
        '#FAAC34',
        '#7FBA4D',
        '#0768B4',
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFFF00',
        '#FFA500',
        '#800080',
        '#520000',
        '#A52A2A',
        '#808080',
        '#000000',
        '#00FFFF',
        '#FF00FF',
        '#00FF00',
        '#008080',
        '#4B0082',
        '#800000',
        '#000080',
        '#FFD700',
        '#EE82EE',
        '#40E0D0',
        '#FF6A6A',
        '#DA70D6',
        '#DC143C',
        '#4682B4',
        '#006400',
        '#FF4500',
        '#C71585',
      ];
    } else {
      colors = [
        '#1678c5',
        '#338fd1',
        '#AFCDE4',
        '#000000',
        '#FFFFFF',
        '#FFA502',
        '#FFCC00',
        '#ffcc00',
        '#F7DC6F',
        '#FCF3CF',
        '#1D8348',
        '#28B463',
        '#2ECC71',
        '#82E0AA',
        '#ABEBC6',
        '#119244',
        '#3C7B00',
        '#6AC610',
        '#79e212',
        '#69AF24',
      ];
    }

    return colors.map((color, i) => ({
      id: i + 1,
      color,
    }));
  }, [palette]);

  const { t } = useTranslation('navigation');

  return (
    <Controller
      render={({ field }) => {
        if (!field.value) {
          field.value = '';
        }
        return (
          <FormControl className="flex w-full mt-32" error={!!errors.Select} required fullWidth>
            <InputLabel id="category-select-label1">{t(label)}</InputLabel>
            <Select
              {...field}
              variant="outlined"
              fullWidth
              label={t(label)}
              style={{ display: 'flex', flexWrap: 'wrap' }}
            >
              {colorState.map((color) => (
                <MenuItem
                  className="m-0 p-0 bg-white inline-block w-1/5 "
                  value={color.color}
                  key={color.id}
                >
                  <div
                    className="flex content-center border border-slate-300 hover:border-current w-full h-[30px]"
                    style={{
                      backgroundColor: color.color,
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors?.Select?.message}</FormHelperText>
          </FormControl>
        );
      }}
      name={name}
      control={control}
    />
  );
};

export default InputColorController;
