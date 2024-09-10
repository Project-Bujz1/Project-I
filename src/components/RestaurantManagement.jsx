import React, { useState, useRef, useEffect } from 'react';
import { Utensils, MapPin, Phone, Mail, Clock, Users, ChefHat, DollarSign, Camera, Loader2, PlusCircle, MapIcon, Crosshair, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RestaurantManagement = () => {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const fileInputRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/api/placeholder/32/32',
      iconUrl: '/api/placeholder/32/32',
      shadowUrl: '/api/placeholder/32/32',
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
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
      setAddress(data.display_name);
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
    setPosition([parseFloat(result.lat), parseFloat(result.lon)]);
    setAddress(result.display_name);
    setSearchResults([]);
    setSearchQuery('');
  };

  const MapEvents = () => {
    const map = useMap();
    
    React.useEffect(() => {
      if (position) {
        map.setView(position, 13);
      }
    }, [position, map]);

    map.on('click', (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
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
        <Loader2 size={48} color="#FF0000" style={{ animation: 'spin 1s linear infinite' }} />
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
    <h1 style={headerStyle}>Restaurant Management</h1>
    <form onSubmit={onSubmit}>
      <div style={sectionStyle}>
        <h2 style={{ color: '#FF0000', marginBottom: '1rem', textAlign: 'center' }}>Restaurant Logo</h2>
        <div onClick={triggerFileInput} style={logoContainerStyle}>
          {logo ? (
            <img src={logo} alt="Restaurant logo" style={logoStyle} />
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
          <input type="text" style={inputStyle} placeholder="e.g. Red Plate Bistro" />
        </div>

          {/* Phone and Email inputs remain the same */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                <Phone size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Phone
              </label>
              <input type="tel" style={inputStyle} placeholder="(123) 456-7890" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                <Mail size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Email
              </label>
              <input type="email" style={inputStyle} placeholder="info@redplatebistro.com" />
            </div>
         </div>
         <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>
              <MapPin size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Address
            </label>
            <textarea 
              style={{ ...inputStyle, height: '5rem' }} 
              placeholder="123 Gourmet Street, Foodie City, 12345"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
                <MapContainer center={position || [0, 0]} zoom={13} style={{ height: '100%' }} ref={mapRef}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {position && <Marker position={position} />}
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
                Seating Capacity
              </label>
              <input type="number" style={inputStyle} min="1" placeholder="e.g. 50" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>
                <ChefHat size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Cuisine Type
              </label>
              <input type="text" style={inputStyle} placeholder="e.g. Italian, Asian Fusion" />
            </div>
          </div>
        </div>
        {/* Restaurant Details section remains the same */}

        <button type="submit" style={buttonStyle}>
          <Utensils size={18} style={{ marginRight: '0.5rem' }} />
          Save Restaurant Information
        </button>
      </form>
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