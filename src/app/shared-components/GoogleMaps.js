import { useEffect } from 'react';

const GoogleMapsComponent = ({ key = 'AIzaSyAtnP-63Xgrx31Hu0R08sXUlKgEpLQ5VUc' }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }; // eslint-disable-next-line
  }, [key]);

  return null;
};

export default GoogleMapsComponent;
