import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

let id;
function FileManagerSearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('file_manager_search') || '';
  const [search, setSearch] = useState(searchQuery);
  let idTimeout;

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery, setSearch]);

  return (
    <Paper
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex items-center justify-center my-10 ml-auto space-x-8 px-16 rounded-full shadow-0"
    >
      <TextField
        label="Search files"
        placeholder="Search files"
        fullWidth
        value={search}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>
            </InputAdornment>
          ),
        }}
        onChange={(ev) => {
          setSearch(ev.target.value);
          if (idTimeout) {
            clearTimeout(idTimeout);
          }
          id = setTimeout(() => {
            const newSearchParams = new URLSearchParams(searchParams);

            newSearchParams.set('file_manager_search', ev.target.value);
            newSearchParams.delete('file_manager_folder_id');
            newSearchParams.delete('file_manager_type');
            newSearchParams.set('file_manager_page', '1');

            setSearchParams(newSearchParams);
          }, 1000);
        }}
      />
    </Paper>
  );
}

export default FileManagerSearchInput;
