import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import Box from '@mui/system/Box';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function RecentChangesWidget({ title = 'history', dataNews = [], dataProj = [] }) {
  const { t } = useTranslation('navigation');
  const { translationLanguage } = useSelector((state) => state.i18n);
  const nav = useNavigate();

  return (
    <Paper className="flex w-full flex-col flex-auto shadow rounded-2xl  overflow-x-scroll overflow-y-scroll p-24 h-[85vh]">
      <div className="flex flex-col sm:flex-row items-center justify-center">
        <Typography className="text-3xl  text-center  font-bold tracking-tighter leading-tight">
          {title}
        </Typography>
      </div>
      <div className="flex flex-col overflow-x-scroll overflow-y-scroll  mt-24">
        <Typography className="text-2xl  text-center  font-bold tracking-tighter leading-tight">
          {t('NEWS')}
        </Typography>
        <Paper className="flex w-full text-start flex-col flex-auto shadow rounded-2xl  p-24 h-[35vh]">
          {dataNews?.length > 0 &&
            dataNews.map((el) => {
              return (
                <Box key={`news${el.id}`} className="shadow rounded-2xl ">
                  <Button
                    style={{ width: '100%' }}
                    onClick={() => {
                      nav(`/news/item/${el.id}/edit`);
                    }}
                  >
                    <Typography className="truncate ">
                      {
                        el?.translations.find((trs) => trs.language_id === translationLanguage)
                          ?.title
                      }
                    </Typography>
                  </Button>
                </Box>
              );
            })}
        </Paper>
        <Typography className="text-2xl mt-10  text-center  font-bold tracking-tighter leading-tight">
          {t('PROJECTS')}
        </Typography>
        <Paper className="flex w-full text-start flex-col flex-auto shadow rounded-2xl  p-24 h-[35vh]">
          {dataProj?.length > 0 &&
            dataProj.map((el) => {
              return (
                <Box key={`proj${el.id}`} className="shadow rounded-2xl w-full">
                  <Button
                    style={{ width: '100%' }}
                    onClick={() => {
                      nav(`/projects/item/${el.id}/edit`);
                    }}
                  >
                    <Typography className="truncate">
                      {
                        el?.translations.find((trs) => trs.language_id === translationLanguage)
                          ?.title
                      }
                    </Typography>
                  </Button>
                </Box>
              );
            })}
        </Paper>
      </div>
    </Paper>
  );
}
