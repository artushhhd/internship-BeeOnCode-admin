import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ReactApexChart from 'react-apexcharts';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';

function StatisticsWidget({ amount = 0, name = '', data = [], colors = [] }) {
  const { t } = useTranslation('navigation');
  const { series, labels } = {
    labels: ['21 Oct - 28 Oct', '29 Oct - 05 Nov', '06 Nov - 13 Nov', '14 Nov - 21 Nov'],
    series: [
      {
        name,
        data,
      },
    ],
  };

  const chartOptions = {
    chart: {
      animations: {
        enabled: false,
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'area',
      sparkline: {
        enabled: true,
      },
    },
    colors: [colors[0]],
    fill: {
      colors: [colors[1]],
      opacity: 0.5,
    },
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      followCursor: true,
      theme: 'dark',
    },
    xaxis: {
      type: 'category',
      categories: labels,
    },
  };

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-start justify-between m-24 mb-0">
        <Typography className="text-lg font-700 tracking-tight leading-6 truncate">
          {name}
        </Typography>
        <div className="ml-8">
          <Chip size="small" className="font-medium text-sm lowercase" label={`28 ${t('DAY')}`} />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center mx-24 mt-12">
        <Typography className="text-7xl font-bold tracking-tighter leading-tight">
          {amount.toLocaleString('en-US')}
        </Typography>
        {data[0] > data[data.length - 1] ? (
          <div className="flex lg:flex-col lg:ml-12">
            <FuseSvgIcon size={20} className="text-red-500">
              heroicons-solid:trending-down
            </FuseSvgIcon>
            <Typography
              className="flex items-center ml-4 lg:ml-0 lg:mt-2 text-md leading-none whitespace-nowrap"
              color="text.secondary"
            >
              <span className="font-medium text-red-500">
                {Math.floor((data[data.length - 1] / data[0]) * 100) - 100}%
              </span>
              <span className="ml-4">{t('BELOWTARGET')}</span>
            </Typography>
          </div>
        ) : (
          <div className="flex lg:flex-col lg:ml-12">
            <FuseSvgIcon size={20} className="text-green-500">
              heroicons-solid:trending-up
            </FuseSvgIcon>
            <Typography
              className="flex items-center ml-4 lg:ml-0 lg:mt-2 text-md leading-none whitespace-nowrap"
              color="text.secondary"
            >
              <span className="font-medium text-green-500">
                {Math.floor((data[data.length - 1] / data[0]) * 100) - 100}%
              </span>
              <span className="ml-4">{t('ABOVETARGET')}</span>
            </Typography>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-auto h-80">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
    </Paper>
  );
}

export default StatisticsWidget;
