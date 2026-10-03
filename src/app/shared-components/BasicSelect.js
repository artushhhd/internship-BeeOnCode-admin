import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';

export default function BasicSelect({ data: newData, pageSize, setPageSize }) {
  const { t } = useTranslation('navigation');
  const select = 20;
  const totalData = Math.ceil(newData?.total / select) || 1;
  const [numbers, setNumbers] = useState([20]);

  useEffect(() => {
    if (newData?.total > 90) {
      setNumbers([20, 40, 60, 100]);
    } else {
      setNumbers(Array.from({ length: totalData }).map((_, i) => (i + 1) * 20));
    }
    //  eslint-disable-next-line
    }, [newData,totalData]);

  useEffect(() => {
    setPageSize(20);
    //  eslint-disable-next-line
  },[])
  return (
    numbers?.length > 0 && (
      <FormControl sx={{ m: 1, width: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">{t('PAGES')}</InputLabel>
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
                  setPageSize(item);
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
    )
  );
}
