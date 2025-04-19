import React, { useState } from 'react';
// imports modules from Google Map's API that we need such as the map, its markers and autocomplete any location searches
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';



function Map() {
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
  const [locations, setLocations] = useState([])
  const [searchResults, setSearchResult] = useState()


  return (
    <LoadScript googleMapsApiKey="AIzaSyBcMsINbIrAZ_gChuZvQ_6SWD2hdFowrWc">
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

export default Map;
