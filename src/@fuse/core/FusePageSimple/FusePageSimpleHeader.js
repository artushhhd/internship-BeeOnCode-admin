import clsx from 'clsx';
import Box from '@mui/material/Box';

function FusePageSimpleHeader(props) {
  return (
    <div className={clsx('FusePageSimple-header', props.className)}>
      <Box className="container">{props.header && props.header}</Box>
    </div>
  );
}

export default FusePageSimpleHeader;
