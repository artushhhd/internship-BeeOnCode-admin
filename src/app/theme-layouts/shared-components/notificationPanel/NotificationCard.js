import Card from '@mui/material/Card';
import clsx from 'clsx';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { formatDistanceToNow } from 'date-fns';

function NotificationCard(props) {
  const { item, className } = props;
  const variant = item?.variant || '';

  return (
    <Card
      className={clsx(
        'flex items-center relative w-full rounded-16 p-20 min-h-64 shadow space-x-8',
        variant === 'success' && 'bg-green-600 text-white',
        variant === 'info' && 'bg-blue-700 text-white',
        variant === 'error' && 'bg-red-600 text-white',
        variant === 'warning' && 'bg-orange-600 text-white',
        className
      )}
      elevation={0}
    >
      {item.icon && !item.image && (
        <Box
          sx={{ backgroundColor: 'background.default' }}
          className="flex shrink-0 items-center justify-center w-32 h-32 mr-12 rounded-full"
        >
          <FuseSvgIcon className="opacity-75" color="inherit">
            {item.icon}
          </FuseSvgIcon>
        </Box>
      )}

      {item.image && (
        <img
          className="shrink-0 w-32 h-32 mr-12 rounded-full overflow-hidden object-cover object-center"
          src={item.image}
          alt="Notification"
        />
      )}

      <div className="flex flex-col flex-auto">
        {item.title && <Typography className="font-semibold line-clamp-1">{item.title}</Typography>}

        {item.description && (
          <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }} />
        )}

        {item.item && (
          <Typography className="mt-8 text-sm leading-none " color="text.secondary">
            {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
          </Typography>
        )}
      </div>

      {item.children}
    </Card>
  );
}

export default NotificationCard;
