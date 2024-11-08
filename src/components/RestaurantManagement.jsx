import React, { useState, useRef, useEffect } from 'react';
import { Utensils, MapPin, Phone, Mail, Clock, Users, ChefHat, DollarSign, Camera, Loader2, PlusCircle, MapIcon, Crosshair, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import FoodLoader from './FoodLoader';

const RestaurantManagement = () => {
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);

  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  useEffect(() => {
    fetchRestaurantData();
  }, []);
  
  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const orgId = localStorage.getItem('orgId');
      const response = await fetch('https://smart-server-stage-db-default-rtdb.firebaseio.com/restaurants.json');
  
      if (response.ok) {
        const data = await response.json();
        const restaurantsArray = Object.entries(data);
        const [id, restaurantData] = restaurantsArray.find(([_, r]) => r.orgId === orgId) || [];
  
        if (restaurantData) {
          setRestaurant({ ...restaurantData, id });
        } else {
          console.error("No restaurant found for this orgId");
        }
      } else {
        console.error("Failed to fetch restaurant data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { id, ...restaurantData } = restaurant;
      const response = await fetch(`https://smart-server-stage-db-default-rtdb.firebaseio.com/restaurants/${id}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      });
  
      if (response.ok) {
        console.log("Restaurant information updated successfully");
        fetchRestaurantData(); // Refetch the data to ensure we have the latest version
      } else {
        console.error("Failed to update restaurant information");
      }
    } catch (error) {
      console.error("Error updating restaurant information:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRestaurant(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setRestaurant(prev => ({ ...prev, position: [latitude, longitude] }));
        setShowMap(true);
        fetchAddress(latitude, longitude);
      }, (error) => {
        console.error("Error getting location:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      setRestaurant(prev => ({ ...prev, address: data.display_name }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const searchLocation = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching for location:", error);
    }
  };

  const selectSearchResult = (result) => {
    setRestaurant(prev => ({
      ...prev,
      position: [parseFloat(result.lat), parseFloat(result.lon)],
      address: result.display_name
    }));
    setSearchResults([]);
    setSearchQuery('');
  };

  const MapEvents = () => {
    const map = useMap();
    
    React.useEffect(() => {
      if (restaurant.position) {
        map.setView(restaurant.position, 13);
      }
    }, [restaurant.position, map]);

    map.on('click', (e) => {
      setRestaurant(prev => ({ ...prev, position: [e.latlng.lat, e.latlng.lng] }));
      fetchAddress(e.latlng.lat, e.latlng.lng);
    });

    return null;
  };

  // Styles remain the same as in the original component

  const searchContainerStyle = {
    position: 'relative',
    marginBottom: '1rem',
  };

  const searchResultsStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #FFB3B3',
    borderRadius: '0.25rem',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
  };

  const searchResultItemStyle = {
    padding: '0.5rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#FFE5E5',
    },
  };

  
  const RestaurantLoader = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 1000,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <FoodLoader/>
        <div style={{
          marginTop: '1rem',
          color: '#FF0000',
          fontWeight: 'bold',
          fontSize: '1.2rem',
        }}>
          Updating restaurant information...
        </div>
      </div>
    </div>
  );

  const containerStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(255, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    fontFamily: 'Arial, sans-serif',
    marginTop: '85px'
  };

  const headerStyle = {
    textAlign: 'center',
    color: '#FF0000',
    marginBottom: '2rem',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  };

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    border: '2px solid #FFE5E5',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#FF0000',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #FFB3B3',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
  };

  const buttonStyle = {
    backgroundColor: '#FF0000',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };

  const logoContainerStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '2px dashed #FF0000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    margin: '0 auto 1rem auto',
  };

  const logoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };


  return (
    <div style={containerStyle}>
      {loading && <RestaurantLoader />}
      {restaurant ? (
        <>
          <h1 style={headerStyle}>Restaurant Management</h1>
          <form onSubmit={onSubmit}>
          <div style={sectionStyle}>
          <h2 style={{ color: '#FF0000', marginBottom: '1rem', textAlign: 'center' }}>Restaurant Logo</h2>
          <div onClick={triggerFileInput} style={logoContainerStyle}>
            {restaurant.logo ? (
              <img src={restaurant.logo} alt="Restaurant logo" style={logoStyle} />
            ) : (
              <PlusCircle size={48} color="#FF0000" />
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleLogoChange} 
            style={{ display: 'none' }}
            accept="image/*"
          />
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1rem' }}>
            Click to upload or change logo
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ color: '#FF0000', marginBottom: '1rem' }}>Basic Information</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>
              <Utensils size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Restaurant Name
            </label>
            <input
              type="text"
              name="name"
              value={restaurant.name}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="e.g. Red Plate Bistro"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                <Phone size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={restaurant.phone}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="(123) 456-7890"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                <Mail size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={restaurant.email}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="info@redplatebistro.com"
              />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>
              <MapPin size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Address
            </label>
            <textarea 
              name="address"
              value={restaurant.address}
              onChange={handleInputChange}
              style={{ ...inputStyle, height: '5rem' }} 
              placeholder="123 Gourmet Street, Foodie City, 12345"
            ></textarea>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={getCurrentLocation} style={{ ...buttonStyle, flex: 1 }}>
                <Crosshair size={18} style={{ marginRight: '0.5rem' }} />
                Use Current Location
              </button>
              <button type="button" onClick={() => setShowMap(!showMap)} style={{ ...buttonStyle, flex: 1 }}>
                <MapIcon size={18} style={{ marginRight: '0.5rem' }} />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>
          {showMap && (
            <>
              <div style={searchContainerStyle}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a location"
                  style={inputStyle}
                />
                <button type="button" onClick={searchLocation} style={{ ...buttonStyle, marginTop: '0.5rem' }}>
                  <Search size={18} style={{ marginRight: '0.5rem' }} />
                  Search
                </button>
                {searchResults.length > 0 && (
                  <div style={searchResultsStyle}>
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => selectSearchResult(result)}
                        style={searchResultItemStyle}
                      >
                        {result.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ height: '300px', marginBottom: '1rem' }}>
              <MapContainer center={restaurant.position || [0, 0]} zoom={13} style={{ height: '100%' }} ref={mapRef}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {restaurant.position && (
                <Marker position={restaurant.position} icon={customIcon}>
<Popup>
          <div style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'center',
          }}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.address}</p>
          </div>
        </Popup>                </Marker>
              )}
              <MapEvents />
            </MapContainer>
              </div>
            </>
          )}
        </div>
                 
        <div style={sectionStyle}>
          <h2 style={{ color: '#FF0000', marginBottom: '1rem' }}>Restaurant Details</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                <Users size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Table Count
              </label>
              <input
                type="number"
                name="seatingCapacity"
                value={restaurant.seatingCapacity}
                onChange={handleInputChange}
                style={inputStyle}
                min="1"
                placeholder="e.g. 50"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                <ChefHat size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Count
              </label>
              <input
                type="text"
                name="peopleCount"
                value={restaurant.peopleCount}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="e.g. 20, 45"
              />
            </div>
          </div>
        </div>

        <button type="submit" style={buttonStyle}>
          <Utensils size={18} style={{ marginRight: '0.5rem' }} />
          Save Restaurant Information
        </button>
      </form>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#FF0000' }}>
          <h2>No restaurant data found for this organization.</h2>
          <p>Please check your login or contact support.</p>
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #FF0000;
        }
        button:hover {
          background-color: #E60000;
        }
      `}</style>
    </div>
  );
};

export default RestaurantManagement;
