import DevMode from 'app/shared-components/DevMode';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';

const TabSection = ({ item: tab }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);

  return (
    <div
      className={clsx(
        'productImageItem flex flex-col justify-center items-center relative w-72 h-72 rounded-2 mt-12 mr-12 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
      )}
    >
      <DevMode>id: {tab.id}</DevMode>
      <Typography
        className="whitespace-nowrap w-[95%] text-center overflow-hidden overflow-ellipsis"
        variant="subtitle2"
      >
        {tab.translations.find((val) => val.language_id === translationLanguage)?.title}
      </Typography>
    </div>
  );
};

export default TabSection;
