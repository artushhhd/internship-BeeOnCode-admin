import Box from '@mui/system/Box';
import Skeleton from '@mui/material/Skeleton';

function FilesSkeleton() {
  return Array.from({ length: 200 }).map((_, i) => {
    return (
      <Box
        className="flex flex-col relative w-144 h-128 m-8 p-16 justify-center shadow rounded-16 cursor-pointer overflow-hidden"
        key={i}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    );
  });
}

export default FilesSkeleton;
