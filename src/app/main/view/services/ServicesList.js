import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import EmptyContent from 'app/shared-components/EmptyContent';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import {
  changeServicesOrder,
  selectFilteredServices,
  selectGroupedFilteredServices,
} from './store/servicesSlice';
import ServicesListItem from './ServicesListItem';

function ServicesList({ canManage }) {
  const filteredData = useSelector(selectFilteredServices);

  const { loading } = useSelector((state) => state.ServicesApp.services);
  const services = useSelector(selectGroupedFilteredServices);
  if (!filteredData) {
    return null;
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (filteredData.length === 0) {
    return <EmptyContent name="services" />;
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="w-full"
    >
      <List className="w-full m-0 p-0 relative ">
        <DragAndDrop data={services} update={changeServicesOrder} disableKey={!canManage}>
          <ServicesListItem canManage={canManage} />
        </DragAndDrop>
      </List>
    </motion.div>
  );
}

export default ServicesList;
