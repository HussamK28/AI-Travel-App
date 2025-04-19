import React, { useState } from 'react';
// imports modules from Google Map's API that we need such as the map, its markers and autocomplete any location searches
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
const GoogleMapsAPIKEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;



function LoadMap() {
    // This function sets the size of the map
const containerStyle = {
    width: '100%',
    height: '800px'
  };
  
  // The default centre of the map is London 
  const defaultCentre = {
    lat: 51.5074456,
    lng: -0.1277653
  };

  const [currentCentre, setCurrentCentre] = useState(defaultCentre)
  const [attractions, setAttractions] = useState([])
  const [searchResults, setSearchResult] = useState()

  const loadTouristAttractions = (location,map) => {
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location,
      radius: 5000,
      type: ['tourist_attraction']
    };
    service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setAttractions(results);
        }
      });
    };



  return (
    <LoadScript googleMapsApiKey={GoogleMapsAPIKEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCentre}
        zoom={12}
      >
        <Marker position={defaultCentre} />
      </GoogleMap>
    </LoadScript>
  );
}

export default LoadMap;
