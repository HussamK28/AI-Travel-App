import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './Styles/LoadMap.css'
import axios from 'axios';

// This is the load map function which sets the size of the google map
function LoadMap() {
  const containerStyle = {
    width: '100%',
    height: '650px'
  };

  // This sets the default centre of the map to London when page first loads
  const defaultCentre = {
    lat: 51.5074456,
    lng: -0.1277653
  };

  // This is the getter and setter variabes that are used on this page
  const [location, setLocation] = useState('');
  const [mapMarkers, setMapMarkers] = useState([]);
  const [selectedMapMarkers, setSelectedMapMarkers] = useState(null)
  const [PopupBox, setPopupBox] = useState(false)
  const [centre, setCentre] = useState(defaultCentre);
  const mapRef = useRef(null);

  // This takes in the location inputted by the user
  const newLocation = (e) => {
    setLocation(e.target.value);
  };

  // 
  const submitForm = async (e) => {
    e.preventDefault();
  
    const geocoder = new window.google.maps.Geocoder();
  
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const coords = results[0].geometry.location;
        setCentre({ lat: coords.lat(), lng: coords.lng() });
  
        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const types = ['tourist_attraction', 'restaurant', 'museum', 'amusement_park', 'shopping_mall', 'park'];
  
        let allMarkers = [];
  
        // Function to perform nearbySearch for a specific type
        const searchByType = (type) => {
          return new Promise((resolve) => {
            const request = {
              location: coords,
              radius: 10000, // You might want to reduce from 1,000,000 for relevance
              type: type,
            };
  
            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                const markers = results.map(place => ({
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  name: place.name,
                }));
                resolve(markers);
              } else {
                resolve([]); // If error or no results
              }
            });
          });
        };
  
        // Run all the searches
        Promise.all(types.map(searchByType)).then(resultsArrays => {
          // Flatten the array of arrays and set markers
          const combinedMarkers = resultsArrays.flat();
          setMapMarkers(combinedMarkers);
        });
  
      } else {
        alert('Location not found.');
      }
    });
  };
  

  const addToItinerary = async (placeName) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/addToItinerary/", { name: placeName });
      alert(response.data.message || "Added to itinerary");
    } catch (error) {
      console.error(error);
      alert("We were unable to add attraction");
    }
  };
  

  return (
    <div className="container">
      <h1>Find Activities</h1>
      <form onSubmit={submitForm}>
        <div className="location">
          <label>Location:</label>
          <input
            type="text"
            placeholder="Enter your Location"
            value={location}
            onChange={newLocation}
            required
          />
          <button className="submit-button" type="submit">Search</button>
        </div>
      </form>

      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centre}
          zoom={10}
          onLoad={map => (mapRef.current = map)}
        >
          {mapMarkers.map((mapMarkers, index) => (
            <Marker
              key={index}
              position={{ lat: mapMarkers.lat, lng: mapMarkers.lng }}
              onClick={() => {
                setSelectedMapMarkers(mapMarkers)
                setPopupBox(true)
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      {PopupBox && selectedMapMarkers && (
        <div className="modal-backdrop" onClick={() => setPopupBox(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>{selectedMapMarkers.name}</h2>
            <button onClick={() => addToItinerary(selectedMapMarkers.name)}>Add to Itinerary</button>

            <button onClick={() => setPopupBox(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadMap;
