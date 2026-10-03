import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import Box from '@mui/system/Box';
import GoogleMapsComponent from 'app/shared-components/GoogleMaps';
import { getPermissionsByPage } from '../administration/store/permissionsSlice';
import PieChartWidget from './PieChartWidget';
import RecentChangesWidget from './RecentChangesWidget';
import { getDashboard, selectDashboardData } from './store/dashboardSlice';
import ProjectsWidget from './ProjectsWidget';
import { getLogo, selectLogo } from '../view/logo/store/logoSlice';

function ExamplePage(props) {
  const { t } = useTranslation('navigation');
  const { id: userId } = useSelector(selectUser);
  const dashboard = useSelector(selectDashboardData);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLogo());
  }, [dispatch]);
  const logo = useSelector(selectLogo);
  const gkey = logo?.gmap_id || 'AIzaSyAtnP-63Xgrx31Hu0R08sXUlKgEpLQ5VUc';
  const { translationLanguage } = useSelector((state) => state.i18n);

  const allNews = dashboard?.publishedNews + dashboard.unpublishedNews;
  const unPublishedNews = Math.round((dashboard?.unpublishedNews / allNews) * 100);
  const publishedNews = 100 - unPublishedNews;

  const allProjects = dashboard?.publishedProjects + dashboard.unpublishedProjects;
  const unPublishedProjects = Math.round((dashboard?.unpublishedProjects / allProjects) * 100);
  const publishedProjects = 100 - unPublishedProjects;
  const [totalProjects, setTotalProjects] = useState(0);
  const [projectsRegionsName, setProjectsRegionName] = useState([]);
  const [projectsRegionsCount, setProjectsRegionCount] = useState([]);
  const [projectsSum, setProjectsSum] = useState([]);
  const sgpColors = ['#F2A71D', '#82BC40', '#0269B9'];
  const [projectsStatusOrder, setProjecsStatusOrder] = useState([]);

  useEffect(() => {
    const projectsRegions = dashboard?.projectsByRegions?.map(({ translations }) => {
      return translations.find((item) => item.language_id === translationLanguage).title;
    });
    const projectsRegionCount = dashboard?.projectsByRegions?.map((item) => item.projects_count);
    const projectsSumsAdd = dashboard?.projectsByRegions?.map((item, i) => {
      return ` ${projectsRegions[i]} , ${t('GRANT_AMOUNT')}   ${
        item.projects_sum_grant_amount
      } , ${t('SPONSOR_AMOUNT')} ${item.projects_sum_sponsor_amount}`;
    });
    const projectStatus = dashboard?.projectsByStatus?.map((item) => {
      if (item.is_completed === 1) {
        return 'complited';
      }
      if (item.is_terminate === 1) {
        return 'terminated';
      }
      return 'INPROGRESS';
    });
    setProjecsStatusOrder(projectStatus);
    setProjectsSum(projectsSumsAdd);
    setProjectsRegionCount(projectsRegionCount);
    setProjectsRegionName(projectsRegions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Dashboards' }));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);
  useEffect(() => {
    const totalProjectsRegion = dashboard?.projectsByRegions?.reduce(
      (accumulator, currentObject) => {
        return accumulator + currentObject.projects_count;
      },
      0
    );
    setTotalProjects(totalProjectsRegion);
  }, [dashboard]);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const allCount =
    dashboard.projectsByStatus?.[0]?.projects_count +
    dashboard.projectsByStatus?.[1]?.projects_count +
    dashboard.projectsByStatus?.[2]?.projects_count;
  const terminated = Math.round((dashboard.projectsByStatus?.[0]?.projects_count / allCount) * 100);
  const complited = Math.round((dashboard.projectsByStatus?.[2]?.projects_count / allCount) * 100);
  const inprogress = 100 - terminated - complited;

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3  row-span-2 gap-32 w-full p-24 md:p-32"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="w-full mt-16 sm:col-span-3 ">
        <Typography className="text-2xl font-semibold tracking-tight leading-6">
          {t('STATISTICS')}
        </Typography>
      </div>
      <div className="sm:col-span-3 grid grid-cols-3 grid-rows-2 gap-32 w-full">
        <motion.div variants={item} className="col-span-1 row-span-2">
          <PieChartWidget
            link="/news/item?page=1"
            count={allNews}
            colors={['#DD6B20', '#F6AD55']}
            uniqueVisitors={[dashboard.unpublishedNews, dashboard.publishedNews]}
            series={[unPublishedNews, publishedNews]}
            title={t('NEWS')}
            labels={[t('UNPUBLISHED'), t('PUBLISHED')]}
          />
        </motion.div>
        <motion.div variants={item} className="col-span-1 row-span-2">
          <PieChartWidget
            link="/projects/item?page=1"
            count={allProjects}
            colors={['#3182CE', '#63B3ED']}
            uniqueVisitors={[dashboard.unpublishedProjects, dashboard.publishedProjects]}
            series={[unPublishedProjects, publishedProjects]}
            title={t('PROJECTS')}
            labels={[t('UNPUBLISHED'), t('PUBLISHED')]}
          />
        </motion.div>

        <motion.div variants={item} className="col-span-1 row-span-2 	">
          <RecentChangesWidget
            dataNews={dashboard?.latestNews}
            dataProj={dashboard?.latestProjects}
            title={t('CHANGEHISTORY')}
          />
        </motion.div>
        <Typography className="text-5xl  text-center  font-bold tracking-tighter leading-tight col-span-3 row-span-1">
          {t('PROJECTS')}
        </Typography>
        {dashboard?.projectStatistics?.map((val, i) => {
          let checked = 0;
          if (val?.is_amount === 1) {
            checked = val?.stats?.amount;
          } else if (val?.is_count === 1) {
            checked = val?.stats?.count;
          } else if (val?.is_sponsor === 1) {
            checked = val?.stats?.sponsor_amount;
          }
          return (
            <motion.div key={val.id} variants={item} className="col-span-1">
              <ProjectsWidget
                count={checked}
                name={
                  val?.translations?.find((el) => el.language_id === translationLanguage)?.title
                }
                colors={['#9d1e51', sgpColors[i]]}
              />
            </motion.div>
          );
        })}
      </div>
      <Box className="w-[75vw] flex flex-col gap-10  min-h-[500px] ">
        <Box className="w-full flex">
          <Box className="w-1/2 flex justify-center">
            <Typography className="text-5xl  text-center  font-bold tracking-tighter leading-tight col-span-3 row-span-1">
              {t('PROJECTBYREGION')}
            </Typography>
          </Box>
          <Box className="w-1/2 flex justify-center">
            <Typography className="text-5xl  text-center  font-bold tracking-tighter leading-tight col-span-3 row-span-1">
              {t('PROJECTBYSTATUS')}
            </Typography>
          </Box>
        </Box>
        <Box className="w-full flex justify-between">
          <Box className="w-[48%] h-[1500px] ">
            {' '}
            <PieChartWidget
              count={totalProjects}
              colors={[
                '#c47830',
                '#33b057',
                '#6a799f',
                '#c8dec5',
                '#3f2d86',
                '#8b5434',
                '#6b6a6f',
                '#cd135e',
                '#471605',
                '#2fcba1',
                '#DD6B20',
              ]}
              series={projectsRegionsCount}
              uniqueVisitors={projectsRegionsCount}
              // title={translations.find((val) => val.language_id === translationLanguage)?.title}
              labels={projectsRegionsName}
              statusSum={projectsSum}
              // id={id}
            />
          </Box>
          <Box className="w-[48%] h-[700px] ">
            <PieChartWidget
              count={
                dashboard.projectsByStatus?.[0]?.projects_count +
                dashboard.projectsByStatus?.[1]?.projects_count +
                dashboard.projectsByStatus?.[2]?.projects_count
              }
              colors={[
                dashboard.projectsByStatus?.[0]?.color,
                dashboard.projectsByStatus?.[1]?.color,
                dashboard.projectsByStatus?.[2]?.color,
              ]}
              series={[terminated || 0, inprogress || 0, complited || 0]}
              uniqueVisitors={[
                dashboard.projectsByStatus?.[0]?.projects_count || 0,
                dashboard.projectsByStatus?.[1]?.projects_count || 0,
                dashboard.projectsByStatus?.[2]?.projects_count || 0,
              ]}
              // title={translations.find((val) => val.language_id === translationLanguage)?.title}
              labels={[
                t(projectsStatusOrder?.[0]),
                t(projectsStatusOrder?.[1]),
                t(projectsStatusOrder?.[2]),
              ]}
              statusSum={[
                [
                  ` ${t(projectsStatusOrder?.[0])} ,  ${t('GRANT_AMOUNT')} ${
                    dashboard.projectsByStatus?.[0]?.projects_sum_grant_amount
                  }`,
                  `  ${t('SPONSOR_AMOUNT')} ${
                    dashboard.projectsByStatus?.[0]?.projects_sum_sponsor_amount
                  }`,
                ],
                [
                  ` ${t(projectsStatusOrder?.[1])} , ${t('GRANT_AMOUNT')} ${
                    dashboard.projectsByStatus?.[1]?.projects_sum_grant_amount
                  }`,
                  ` ${t('SPONSOR_AMOUNT')} ${
                    dashboard.projectsByStatus?.[1]?.projects_sum_sponsor_amount
                  }`,
                ],
                [
                  ` ${t(projectsStatusOrder?.[2])} , ${t('GRANT_AMOUNT')} ${
                    dashboard.projectsByStatus?.[2]?.projects_sum_grant_amount
                  }`,
                  ` ${t('SPONSOR_AMOUNT')} ${
                    dashboard.projectsByStatus?.[2]?.projects_sum_sponsor_amount
                  }`,
                ],
              ]}
              // id={id}
            />
          </Box>
        </Box>
      </Box>
      <GoogleMapsComponent key={gkey} />
    </motion.div>
  );
}

export default ExamplePage;
