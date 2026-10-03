import '../../styles/ReactCrop.css';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Pagination from '@mui/material/Pagination';

const PaginatedItems = ({ pageTotal, keyQuery = 'page', page = 1, setPage }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (keyQuery && !searchParams.get(keyQuery)) {
      setSearchParams({ [keyQuery]: 1 });
    } // eslint-disable-next-line
    },[])

  const handlePageClick = (event, value) => {
    if (keyQuery) {
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set(keyQuery, value.toString());

      setSearchParams(newSearchParams);
    } else {
      setPage(value);
    }
  };

  if (!pageTotal) return null;

  return (
    <Pagination
      variant="outlined"
      color="secondary"
      shape="rounded"
      count={pageTotal}
      page={keyQuery ? +searchParams.get(keyQuery) || 1 : page}
      onChange={handlePageClick}
    />
  );
};
export default PaginatedItems;
