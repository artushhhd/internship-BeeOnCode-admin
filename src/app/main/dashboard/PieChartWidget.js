import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function PieChartWidget({
  uniqueVisitors = 0,
  series = [],
  title = '',
  labels = [],
  colors = [],
  count = 0,
  link = '',
  statusSum = '',
}) {
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const { t } = useTranslation('navigation');
  const nav = useNavigate();
  const chartOptions = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '80%',
      type: 'donut',
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels,
    statusSum,
    plotOptions: {
      pie: {
        customScale: 0.9,
        expandOnClick: false,
        donut: {
          size: '70%',
        },
      },
    },
    stroke: {
      colors: [theme.palette.background.paper],
    },
    series,
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: 'dark',
      custom: ({ seriesIndex, w }) =>
        `<div class="flex items-center h-32 min-h-32 max-h-23 px-12 z-[99999999] ">
            <div class="w-12 h-12 rounded-full" style="background-color: ${
              w.config.colors[seriesIndex]
            };"></div>
            <div class="ml-8 text-md leading-none">${
              !statusSum ? w.config.labels[seriesIndex] : w.config.statusSum[seriesIndex]
            }:</div>
            <div class="ml-8 text-md font-bold leading-none">${
              !statusSum ? `${w.config.series[seriesIndex]}%` : ''
            }</div>
        </div>`,
    },
  };

  useEffect(() => {
    setAwaitRender(false);
  }, []);

  if (awaitRender) {
    return null;
  }
  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl  p-24 h-full w-100">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <Button onClick={() => nav(link)}>
          <Typography className="text-lg font-700 tracking-tight leading-6 ">{title}</Typography>
        </Button>
        <div className="ml-8">
          <Chip size="small" className="font-medium text-sm" label={`${t('COUNT')}  ${count} `} />
        </div>
      </div>

      <div className="flex flex-col flex-auto mt-24 h-192">
        <ReactApexChart
          className="flex flex-auto items-center justify-center w-100 h-full"
          options={chartOptions}
          series={series}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
      <div className="mt-32">
        <div className="-my-12 divide-y">
          {series.map((dataset, i) => (
            <div className="grid grid-cols-3 py-12 relative " key={i}>
              <div className="flex items-center ">
                <Box
                  className="flex-0  h-8 rounded-full"
                  sx={{ backgroundColor: chartOptions.colors[i] }}
                />
                {link ? (
                  <Link to={`${link}&isPubleshed=${i}`}>
                    <Typography className="ml-12 break-words ">{labels[i]}</Typography>
                  </Link>
                ) : (
                  <Box>
                    <div className="flex">
                      <div
                        style={{
                          background: colors[i],
                        }}
                        className="w-[20px] h-[20px] "
                      />
                      <Typography className="ml-12 break-words ">{labels[i]}</Typography>
                    </div>
                    <div className="w-[30vw] mt-[5px]">{statusSum[i]}</div>
                  </Box>
                )}
              </div>
              <div className="font-medium w-[200px] absolute mt-[20px]  right-[40px]    text-right">
                {uniqueVisitors[i]}
              </div>
              <Typography className="text-right absolute right-0 mt-[20px] " color="text.secondary">
                {dataset}%
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
}

export default memo(PieChartWidget);
