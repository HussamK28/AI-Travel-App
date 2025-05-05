// Imports React, Google Map and the map markers from google
import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './Styles/LoadMap.css';
import axios from 'axios';

// containerStyle sets the size of the Google Map
function LoadMap() {
  const containerStyle = {
    width: '100%',
    height: '650px'
  };
// The centre of the map is London when the page is opened
  const defaultCentre = {
    lat: 51.5074456,
    lng: -0.1277653
  };

  const [location, setLocation] = useState('');
  const [mapMarkers, setMapMarkers] = useState([]);
  const [selectedMapMarkers, setSelectedMapMarkers] = useState(null);
  const [PopupBox, setPopupBox] = useState(false);
  const [centre, setCentre] = useState(defaultCentre);
  const mapRef = useRef(null);

  const newLocation = (e) => {
    setLocation(e.target.value);
  };
  // This fetches wheelchair accessible places from OpenStreetMap
  // using the latitude and llongitude of the location
  const fetchWheelchairAccessiblePlaces = async (lat, lon) => {
    const query = `
      [out:json];
      (
        node[wheelchair](around:2000,${lat},${lon});
        way[wheelchair](around:2000,${lat},${lon});
        relation[wheelchair](around:2000,${lat},${lon});
      );
      out center;
    `;
    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await response.json();

      // This iterates through the data JSON to get the latitude and longitude
      const markers = data.elements.map((element) => {
        const coords = element.type === "node"
          ? { lat: element.lat, lng: element.lon }
          : { lat: element.center.lat, lng: element.center.lon };

        const iswheelchairAccessible = element.tags?.wheelchair || "unknown";

        // Colour coding indicates if a place is fully wheelchair accessible or not
        let markerColour = 'gray';
        if (iswheelchairAccessible === "yes") {
          markerColour = 'green';
        } else if (iswheelchairAccessible === "limited") {
          markerColour = 'orange';
        } else if (iswheelchairAccessible === "no") {
          markerColour = 'red';
        }

        return {
          lat: coords.lat,
          lng: coords.lng,
          name: element.tags?.name || "Accessible Place",
          wheelchair: iswheelchairAccessible,
          markerColor: markerColour,
        };
      });

      return markers;
    } catch (error) {
      console.error("Error fetching Overpass API data:", error);
      return [];
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const geocoder = new window.google.maps.Geocoder();
    // Geocoder converts the user input into coordinates of longitude and latitude
    geocoder.geocode({ address: location }, async (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const coords = results[0].geometry.location;
        const lat = coords.lat();
        const lng = coords.lng();
      

        setCentre({ lat, lng });

        // Fetch only wheelchair accessible places
        const accessibleMarkers = await fetchWheelchairAccessiblePlaces(lat, lng);
        setMapMarkers(accessibleMarkers);

      } else {
        alert('Location not found.');
      }
    });
  };
// Sends the name of the place to the database
  const addToItinerary = async (placeName, wheelchair, location) => {
    try {
      const userID = localStorage.getItem("userID")
      console.log("The user id is: ", userID)
        if(!userID) {
            alert("Please log in to add flights")
            return
        }
      const response = await axios.post("http://127.0.0.1:8000/addToItinerary/", { name: placeName, isWheelchairAccessible: wheelchair, city: location, userID: userID });
      alert(response.data.message || "Added to itinerary");
    } catch (error) {
      console.error(error);
      alert("We were unable to add attraction");
    }
  };

  return (
    <div className="container">
      <h1>Find Wheelchair Accessible Places</h1>
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
      {/* The API key for Google Maps Places API */}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centre}
          zoom={12}
          onLoad={map => (mapRef.current = map)}
        > {/* iterates through each map marker to change the icon to its colour coded one */}
          {mapMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              icon={{
                url: `http://maps.google.com/mapfiles/ms/icons/${marker.markerColor}-dot.png`,
                scaledSize: new window.google.maps.Size(20, 20), 
              }}
              onClick={() => {
                setSelectedMapMarkers(marker);
                setPopupBox(true);
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      
      {/* This is the popup box which shows the name of the place and wheelchair accessibility */}
      {PopupBox && selectedMapMarkers && (
        <div className="modal-backdrop" onClick={() => setPopupBox(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2>{selectedMapMarkers.name}</h2>

            <p>
              <strong>Wheelchair Accessible:</strong>
              {selectedMapMarkers.wheelchair === "yes" && (
                <span>
                  Fully Accessible

                </span>
              )}
              {selectedMapMarkers.wheelchair === "limited" && (
                <span>
                  Partially Accessible
                </span>
              )}
              {selectedMapMarkers.wheelchair === "no" && (
                <span>
                  Not Accessible
                </span>
              )}
              {selectedMapMarkers.wheelchair === "unknown" && (
                <span>
                  Accessibility Unknown
                </span>
              )}
            </p>


            <button onClick={() => addToItinerary(selectedMapMarkers.name, selectedMapMarkers.wheelchair, location)}>Add Place</button>

            <button onClick={() => setPopupBox(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadMap;
