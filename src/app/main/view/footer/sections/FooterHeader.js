import { useSelector } from 'react-redux';
import HeaderContent from 'app/shared-components/HeaderContent';
import { selectFilteredSections } from './store/footersSlice';

function FooterHeader(props) {
  const filteredData = useSelector(selectFilteredSections);

  return <HeaderContent name="FOOTER" data={filteredData} addButtonTo="new/edit" disableSearch />;
}

export default FooterHeader;
