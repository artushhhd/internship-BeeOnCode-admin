import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Box from '@mui/system/Box';

function ProjectsWidget({ count, name, colors }) {
  const { t } = useTranslation('navigation');
  return (
    <Paper className="flex flex-col  items-center content-between shadow rounded-2xl overflow-hidden p-12   ">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <Typography className="text-lg font-700 tracking-tight leading-6 ">{name}</Typography>
      </div>
      <div className="flex flex-col items-start mt-12 content-between">
        <div className="flex justify-center items-center h-full">
          <Box
            sx={{
              bgcolor: colors[1],
            }}
            className="w-200 h-200 rounded-full flex justify-center items-center"
          >
            <Box className="text-white text-xl">{count}</Box>
          </Box>
        </div>
      </div>
    </Paper>
  );
}

export default ProjectsWidget;
