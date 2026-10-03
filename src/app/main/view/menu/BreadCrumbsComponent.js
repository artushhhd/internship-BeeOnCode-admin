import { Breadcrumbs } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

const BreadCrumbsComponent = ({ data, object }) => {
  const { translationLanguage } = useSelector((state) => state.i18n);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {data.length > 0 &&
        data.map((item) => {
          return (
            <Typography color="text.primary">
              {item.translations?.find((tr) => tr.language_id === translationLanguage)?.name}
            </Typography>
          );
        })}
      {object.id && (
        <Typography color="text.primary">
          {object.translations?.find((tr) => tr.language_id === translationLanguage)?.name}
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export default BreadCrumbsComponent;
