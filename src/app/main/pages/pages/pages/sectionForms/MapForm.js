import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from 'app/shared-components/LanguageSwitcher';
import InputTranslationController from 'app/shared-components/fields/InputTranslationController';
import InputController from 'app/shared-components/fields/InputController';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import TextField from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';
import { getPageSections } from '../../store/pageSectionsSlice';
import { selectLogo } from '../../../../view/logo/store/logoSlice';

const MapForm = ({ control, section, edit, reset, handleSubmit, errors, watch }) => {
  const { translationLanguages } = useSelector((state) => state.i18n);
  const logo = useSelector(selectLogo);
  const key = logo?.gmap_id || 'AIzaSyAtnP-63Xgrx31Hu0R08sXUlKgEpLQ5VUc';
  const { id, sectionId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation('navigation');
  const form = watch();

  // map
  const [address, setAddress] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const handlePlaceSelect = (autocomplete) => {
    const place = autocomplete.getPlace();
    setAddress(place.formatted_address);

    // Get the latitude and longitude
    const { lat, lng } = place.geometry.location;
    const latitude = lat();
    const longitude = lng();

    // Update the map center
    setMapCenter({ lat: latitude, lng: longitude });
    reset({ ...form, latitude, longitude });
  };

  const handleMarkerDrag = (event) => {
    setMapCenter({
      lat: event.center.lat(),
      lng: event.center.lng(),
    });
    reset({ ...form, latitude: event.center.lat(), longitude: event.center.lng() });
  };

  // get data
  useEffect(() => {
    dispatch(getPageSections(id));
  }, [dispatch, id, sectionId]);

  // edit
  const copySection = useMemo(() => {
    return { ...section.map[0] };
  }, [section]);

  useEffect(() => {
    if (section) {
      if (section.type === 'map') {
        if (edit) {
          copySection.latitude = +section.map[0].latitude;
          copySection.longitude = +section.map[0].longitude;
          section?.map[0].translations?.forEach((item, i) => {
            copySection[`title${item.language_id}`] = item.title;
          });
          setMapCenter({ lat: +section.map[0].latitude, lng: +section.map[0].longitude });
          if (key) {
            getAddressFromLatLng(+section.map[0].latitude, +section.map[0].longitude).then(() => {
              console.log('success fetching');
            });
          }
        } else {
          section?.map[0].translations.forEach((item, i) => {
            copySection[`title${item.language_id}`] = '';
          });
          copySection.latitude = 0;
          copySection.longitude = 0;
        }
      }

      reset({ ...copySection });
    } // eslint-disable-next-line
  }, [section, copySection, edit, reset, translationLanguages, handleSubmit]);

  console.log(section);

  const getAddressFromLatLng = (lat, lng) => {
    if (key) {
      const apiKey = key;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${mapCenter.lat},${mapCenter.lng}&key=${apiKey}`;

      return fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            setAddress(data.results[0].formatted_address);
            return data.results[0].formatted_address;
          }
          return console.error('Fail fetching');
        });
    }
    return null;
  };

  const Marker = (props) => (
    <FuseSvgIcon
      className="text-48"
      size={24}
      style={{
        color: 'red',
      }}
    >
      heroicons-solid:location-marker
    </FuseSvgIcon>
  );
  return (
    <div className={edit ? 'p-24 ' : undefined}>
      <div className="flex flex-auto items-end">
        <LanguageSwitcher inModal />
      </div>

      <div style={{ height: '300px', width: '100%' }} className="flex flex-col items-center">
        <TextField
          id="autocomplete-input"
          label={t('ADDRESS')}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {key ? (
          <>
            <GoogleMapReact
              bootstrapURLKeys={{ key }}
              defaultCenter={
                edit
                  ? { lat: +copySection.latitude, lng: +copySection.longitude }
                  : { lat: 0, lng: 0 }
              }
              center={mapCenter}
              defaultZoom={16}
              draggable
              onDrag={handleMarkerDrag}
              onGoogleApiLoaded={({ map, maps }) => {
                const autocomplete = new maps.places.Autocomplete(
                  document.getElementById('autocomplete-input')
                );
                autocomplete.addListener('place_changed', () => {
                  handlePlaceSelect(autocomplete);
                });
              }}
            >
              <Marker
                draggable
                onDrag={handleMarkerDrag}
                lat={mapCenter.lat}
                lng={mapCenter.lng}
                text="Marker"
              />
            </GoogleMapReact>
          </>
        ) : null}
      </div>
      <InputTranslationController control={control} errors={errors} name="title" />
      <InputController control={control} errors={errors} name="latitude" label="LATITUDE" />
      <InputController control={control} errors={errors} name="longitude" label="LONGITUDE" />
    </div>
  );
};

export default MapForm;
