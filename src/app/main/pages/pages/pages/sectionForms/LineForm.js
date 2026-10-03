import { useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import Box from '@mui/system/Box';
import FormControl from '@mui/material/FormControl';
import { InputLabel, Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FuseUtils from '@fuse/utils';
import InputColorController from 'app/shared-components/fields/inputColorController';
import InputController from 'app/shared-components/fields/InputController';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';

const LineForm = ({ reset, control, edit, errors, section }) => {
  const { translationLanguages } = useSelector((state) => state.i18n);
  const lineTypes = [
    { id: FuseUtils.generateGUID(), name: 'solid' },
    { id: FuseUtils.generateGUID(), name: `dashed` },
    { id: FuseUtils.generateGUID(), name: `dotted` },
    { id: FuseUtils.generateGUID(), name: `double` },
    { id: FuseUtils.generateGUID(), name: `groove` },
    { id: FuseUtils.generateGUID(), name: `ridge` },
    { id: FuseUtils.generateGUID(), name: `inset` },
    { id: FuseUtils.generateGUID(), name: `outset` },
  ];

  const copySection = useMemo(() => {
    return { ...section };
  }, [section]);

  useEffect(() => {
    if (section) {
      if (section.type === 'line') {
        if (edit) {
          section.translations.forEach((item) => {
            copySection[`title${item.language_id}`] = item.title;
          });
          copySection.color = section.line.color;
          copySection.lineType = section.line.line_type;
          copySection.height = section.line.height;
        } else {
          translationLanguages.forEach((language) => {
            copySection[`title${language.id}`] = '';
          });
        }
      }

      reset({ ...copySection });
    }
  }, [copySection, edit, reset, section, translationLanguages]);

  return (
    <Box className={edit ? 'p-24' : undefined}>
      <div className="w-full">
        <InputTranslationController name="title" control={control} errors={errors} />

        <Controller
          render={({ field }) => {
            if (!field.value) {
              field.value = 'solid';
            }
            return (
              <FormControl className="flex w-full mt-32" error={!!errors.Select} required fullWidth>
                <InputLabel id="category-select-label1">Border</InputLabel>
                <Select {...field} variant="outlined" fullWidth label="Line Type">
                  {lineTypes.map((lineType) => (
                    <MenuItem value={lineType.name} key={lineType.id}>
                      {lineType.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors?.Select?.message}</FormHelperText>
              </FormControl>
            );
          }}
          name="lineType"
          control={control}
          placeholder="Line Type"
        />

        <InputColorController control={control} errors={errors} />

        <InputController
          name="height"
          control={control}
          errors={errors}
          type="number"
          label="HEIGHT"
          icon=""
        />
      </div>
    </Box>
  );
};

export default LineForm;
