import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import Box from '@mui/system/Box';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFiles } from '../../../administration/store/fileManagerSlice';

export default function CountSelect({ pageSize }) {
  const { t } = useTranslation('navigation');
  const [numbers, setNumbers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const filesData = useSelector(selectFiles);
  const { total } = filesData;
  const label = t('PAGES');
  const delta = 20;

  useEffect(() => {
    setNumbers(
      Array.from({ length: Math.ceil(total / delta) })
        .map((_, i) => (i + 1) * delta)
        .filter((v) => v <= 100)
    );
  }, [total]);

  return (
    numbers?.length > 0 && (
      <Box className="flex flex-col justify-center">
        <FormControl sx={{ width: 120, justifyContent: 'center' }} size="small">
          <InputLabel id="demo-simple-select-label">{t(label)}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={pageSize}
            label="Pages"
          >
            {numbers?.map((item) => {
              return (
                <MenuItem
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(searchParams);

                    newSearchParams.set('file_manager_page', `1`);
                    newSearchParams.set('file_manager_page_size', item);

                    setSearchParams(newSearchParams);
                  }}
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    )
  );
}
