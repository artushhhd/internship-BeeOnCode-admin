import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectUser } from 'app/store/userSlice';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import GoogleMapReact from 'google-map-react';
import Box from '@mui/system/Box';
import { getPermissionsByPage } from '../../../../administration/store/permissionsSlice';

const MapSection = ({ section, gkey }) => {
  const { id: userId } = useSelector(selectUser);
  const { translationLanguage } = useSelector((state) => state.i18n);
  const { t } = useTranslation('navigation');
  const dispatch = useDispatch();
  const [defaultProps, setDefaultProps] = useState({
    center: {
      lat: +section?.map[0]?.latitude,
      lng: +section?.map[0]?.longitude,
    },
    zoom: 16,
  });
  useEffect(() => {
    setDefaultProps({
      center: {
        lat: +section?.map[0]?.latitude,
        lng: +section?.map[0]?.longitude,
      },
      zoom: 16,
    });
    // eslint-disable-next-line
  }, [section]);

  useEffect(() => {
    dispatch(getPermissionsByPage({ userId, pageName: 'Pages' }));
    // eslint-disable-next-line
  }, [userId]);

  const Marker = ({ text }) => (
    <FuseSvgIcon className="text-48" size={24} sx={{ color: 'red', bgColor: 'red' }}>
      heroicons-solid:location-marker
    </FuseSvgIcon>
  );
  return (
    <Accordion sx={{ width: '90%' }}>
      <AccordionSummary>
        <FuseSvgIcon className="text-48" size={24} color="action">
          material-twotone:map
        </FuseSvgIcon>
        <Typography className="text-[1rem] ml-5">
          {t('SECTION')} {t('MAP')}
        </Typography>
        <Typography className="leading-[3rem] ml-[20px]">
          {
            section?.map[0]?.translations?.find((trs) => trs.language_id === translationLanguage)
              ?.title
          }
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {gkey ? (
          <Box style={{ height: '200px', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ gkey }}
              center={defaultProps.center}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
            >
              <Marker lat={defaultProps.center.lat} lng={defaultProps.center.lng} text="Marker" />
            </GoogleMapReact>
          </Box>
        ) : null}
      </AccordionDetails>
    </Accordion>
  );
};

export default MapSection;
