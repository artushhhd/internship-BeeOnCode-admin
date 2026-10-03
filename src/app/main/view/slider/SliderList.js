import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import DragAndDrop from 'app/shared-components/DragAndDrop';
import FuseLoading from '@fuse/core/FuseLoading';
import EmptyContent from 'app/shared-components/EmptyContent';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useState, useEffect } from 'react';
import Slider from './slider';
import SliderListItem from './SliderListItem';
import { reorderSlider, selectSlider } from './store/sliderSlice';

function SliderList({ collapseAll, setCollapseAll, canManage }) {
  const [value, setValue] = useState([]);
  useEffect(() => {}, [value]);
  const slider = useSelector(selectSlider);
  const { loading } = useSelector((state) => state.sliderApp.slider);

  if (!slider) {
    return null;
  }

  if (slider.length === 0) {
    return <EmptyContent />;
  }

  if (loading) {
    return <FuseLoading />;
  }

  return (
    <List className="w-full m-0 p-0 relative ">
      <DragAndDrop data={slider} update={reorderSlider} disableKey={!canManage}>
        <SliderListItem setValue={setValue} canManage={canManage} />
      </DragAndDrop>
      <Slider setCollapseAll={setCollapseAll} collapseAll={collapseAll} value={value} />
    </List>
  );
}

export default SliderList;
