import React, { useState, useRef, useEffect } from 'react';
import { Utensils, MapPin, Phone, Mail, Clock, Users, ChefHat, DollarSign, Camera, Loader2, PlusCircle, MapIcon, Crosshair, Search, Settings, Shield, RefreshCcw, Info, ChevronRight } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState(null);

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
      const response = await fetch('https://smart-server-menu-database-default-rtdb.firebaseio.com/restaurants.json');
  
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
      const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/restaurants/${id}.json`, {
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
    maxWidth: '100%',
    margin: '0 auto',
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    marginTop: '85px',
    paddingBottom: '100px',
    '@media (min-width: 768px)': {
      maxWidth: '800px',
      padding: '2rem',
      paddingBottom: '100px',
    },
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

  const ProfileCard = ({ title, icon: Icon, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        border: '1px solid #FFE5E5',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Icon size={24} color="#FF0000" />
        <span style={{ color: '#333', fontWeight: 'bold' }}>{title}</span>
      </div>
      <ChevronRight size={20} color="#666" />
    </div>
  );

  const handleLogoSave = async () => {
    setLoading(true);
    try {
      const { id } = restaurant;
      const response = await fetch(`https://smart-server-menu-database-default-rtdb.firebaseio.com/restaurants/${id}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logo: restaurant.logo }),
      });

      if (response.ok) {
        console.log("Logo updated successfully");
      } else {
        console.error("Failed to update logo");
      }
    } catch (error) {
      console.error("Error updating logo:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'basic':
      case 'location':
        return (
          <form onSubmit={onSubmit}>
            {activeSection === 'basic' ? (
              // Basic Information Form
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
                    value={restaurant?.name || ''}
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
                      value={restaurant?.phone || ''}
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
                      value={restaurant?.email || ''}
                      onChange={handleInputChange}
                      style={inputStyle}
                      placeholder="info@restaurant.com"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Location Information Form
              <div style={sectionStyle}>
                <h2 style={{ color: '#FF0000', marginBottom: '1rem' }}>Location Settings</h2>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>
                    <MapPin size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Address
                  </label>
                  <textarea 
                    name="address"
                    value={restaurant?.address || ''}
                    onChange={handleInputChange}
                    style={{ ...inputStyle, height: '5rem' }} 
                    placeholder="123 Restaurant Street, City, Country"
                  />
                  
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

                {/* Map and search components */}
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
            )}

            {/* Original Save Information Button */}
            <button type="submit" style={{ ...buttonStyle, marginTop: '1rem' }}>
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                'Save Information'
              )}
            </button>
          </form>
        );

      case 'privacy':
        return (
          <div style={sectionStyle}>
            <h2 style={{ color: '#FF0000', marginBottom: '1.5rem' }}>Privacy Policy</h2>
            <div style={{ color: '#333', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                At Smart Server, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Information We Collect</h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Basic contact information (name, email, phone number)</li>
                <li style={{ marginBottom: '0.5rem' }}>Restaurant details and preferences</li>
                <li style={{ marginBottom: '0.5rem' }}>Order history and transaction data</li>
                <li style={{ marginBottom: '0.5rem' }}>Device information and usage statistics</li>
              </ul>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>How We Use Your Information</h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Provide and improve our services</li>
                <li style={{ marginBottom: '0.5rem' }}>Process transactions and orders</li>
                <li style={{ marginBottom: '0.5rem' }}>Send important updates and notifications</li>
                <li style={{ marginBottom: '0.5rem' }}>Enhance platform security and prevent fraud</li>
              </ul>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Data Security</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                We implement industry-standard security measures to protect your data. This includes encryption, secure servers, and regular security audits.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Contact Us</h3>
              <p>For privacy-related inquiries, please contact us at:</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> support@smartserver.in</p>
              <p style={{ marginBottom: '1.5rem' }}><strong>Phone:</strong> +91 955 331 3334</p>

              <div style={{ 
                borderTop: '1px solid #FFE5E5', 
                paddingTop: '1.5rem', 
                marginTop: '1.5rem',
                fontSize: '0.9rem',
                color: '#666' 
              }}>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

      case 'refund':
        return (
          <div style={sectionStyle}>
            <h2 style={{ color: '#FF0000', marginBottom: '1.5rem' }}>Refund Policy</h2>
            <div style={{ color: '#333', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Smart Server is committed to ensuring customer satisfaction. This policy outlines our refund procedures for our services.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Subscription Refunds</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                We offer a 7-day money-back guarantee on new subscriptions. Refund requests must be submitted within 7 days of the initial purchase.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Eligible Refunds</h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Service unavailability due to technical issues</li>
                <li style={{ marginBottom: '0.5rem' }}>Incorrect subscription charges</li>
                <li style={{ marginBottom: '0.5rem' }}>Duplicate transactions</li>
              </ul>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Refund Process</h3>
              <ol style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Submit a refund request via email</li>
                <li style={{ marginBottom: '0.5rem' }}>Include order details and reason for refund</li>
                <li style={{ marginBottom: '0.5rem' }}>Receive confirmation within 48 hours</li>
                <li style={{ marginBottom: '0.5rem' }}>Refund processed within 5-7 business days</li>
              </ol>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Contact Information</h3>
              <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> support@smartserver.in</p>
              <p style={{ marginBottom: '1.5rem' }}><strong>Phone:</strong> +91 955 331 3334</p>

              <div style={{ 
                borderTop: '1px solid #FFE5E5', 
                paddingTop: '1.5rem', 
                marginTop: '1.5rem',
                fontSize: '0.9rem',
                color: '#666' 
              }}>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div style={sectionStyle}>
            <h2 style={{ color: '#FF0000', marginBottom: '1.5rem' }}>Terms & Conditions</h2>
            <div style={{ color: '#333', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                By using Smart Server's platform and services, you agree to comply with and be bound by the following terms and conditions.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Service Usage</h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Users must be 18 years or older</li>
                <li style={{ marginBottom: '0.5rem' }}>Accurate information must be provided during registration</li>
                <li style={{ marginBottom: '0.5rem' }}>Account credentials must not be shared</li>
                <li style={{ marginBottom: '0.5rem' }}>Platform must be used in compliance with local laws</li>
              </ul>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Subscription Terms</h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Subscription fees are billed in advance</li>
                <li style={{ marginBottom: '0.5rem' }}>Automatic renewal unless cancelled</li>
                <li style={{ marginBottom: '0.5rem' }}>30-day notice required for cancellation</li>
              </ul>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Intellectual Property</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                All content, features, and functionality are owned by Smart Server and protected by international copyright laws.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Limitation of Liability</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Smart Server shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Contact Information</h3>
              <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> support@smartserver.in</p>
              <p style={{ marginBottom: '1.5rem' }}><strong>Phone:</strong> +91 955 331 3334</p>

              <div style={{ 
                borderTop: '1px solid #FFE5E5', 
                paddingTop: '1.5rem', 
                marginTop: '1.5rem',
                fontSize: '0.9rem',
                color: '#666' 
              }}>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div style={sectionStyle}>
            <h2 style={{ color: '#FF0000', marginBottom: '1.5rem' }}>About Us</h2>
            <div style={{ color: '#333', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Smart Server is a cutting-edge digital restaurant management platform that transforms traditional dining experiences through innovative technology solutions. As industry leaders in restaurant digitization, we specialize in providing seamless QR-based ordering systems that enhance both customer satisfaction and operational efficiency.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Our Mission</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                We are dedicated to revolutionizing the restaurant industry by providing state-of-the-art digital solutions that streamline operations, reduce wait times, and create exceptional dining experiences. Our platform empowers restaurants to embrace digital transformation while maintaining their unique identity and service quality.
              </p>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Key Features</h3>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Dynamic QR-based digital menu system</li>
                <li style={{ marginBottom: '0.5rem' }}>Real-time order management</li>
                <li style={{ marginBottom: '0.5rem' }}>Seamless payment integration</li>
                <li style={{ marginBottom: '0.5rem' }}>Comprehensive analytics and reporting</li>
                <li style={{ marginBottom: '0.5rem' }}>Custom branding solutions</li>
              </ul>

              <h3 style={{ color: '#FF0000', marginBottom: '1rem', fontSize: '1.2rem' }}>Contact Information</h3>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Customer Support:</strong> +91 955 331 3334
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong>Email:</strong> support@smartserver.in
              </p>

              <div style={{ 
                borderTop: '1px solid #FFE5E5', 
                paddingTop: '1.5rem', 
                marginTop: '1.5rem',
                fontSize: '0.9rem',
                color: '#666' 
              }}>
                <p>
                  © {new Date().getFullYear()} Smart Server. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Add useEffect to handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      setActiveSection(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Modify the section selection to add to browser history
  const handleSectionClick = (section) => {
    setActiveSection(section);
    window.history.pushState({ section }, '');
  };

  return (
    <div style={containerStyle}>
      {loading && <RestaurantLoader />}
      {restaurant ? (
        <>
          {/* Only show Profile Header when no section is active */}
          {!activeSection && (
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem',
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
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
              <h2 style={{ color: '#333', marginTop: '1rem' }}>{restaurant.name}</h2>
              <p style={{ color: '#666' }}>{restaurant.email}</p>
              <button 
                onClick={handleLogoSave} 
                style={{ ...buttonStyle, maxWidth: '200px', margin: '1rem auto 0' }}
              >
                {loading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  'Save Logo'
                )}
              </button>
            </div>
          )}

          {/* Show section content if active, otherwise show menu */}
          {activeSection ? (
            <div>
              <button 
                onClick={() => handleSectionClick(null)} 
                style={{ ...buttonStyle, marginBottom: '1rem' }}
              >
                Back to Profile
              </button>
              {renderSection()}
            </div>
          ) : (
            /* Profile Menu Cards */
            <div>
              <ProfileCard 
                title="Basic Information" 
                icon={Utensils} 
                onClick={() => handleSectionClick('basic')} 
              />
              <ProfileCard 
                title="Location Settings" 
                icon={MapPin} 
                onClick={() => handleSectionClick('location')} 
              />
              <ProfileCard 
                title="Privacy Policy" 
                icon={Shield} 
                onClick={() => handleSectionClick('privacy')} 
              />
              <ProfileCard 
                title="Refund Policy" 
                icon={RefreshCcw} 
                onClick={() => handleSectionClick('refund')} 
              />
              <ProfileCard 
                title="Terms & Conditions" 
                icon={Settings} 
                onClick={() => handleSectionClick('terms')} 
              />
              <ProfileCard 
                title="About Us" 
                icon={Info} 
                onClick={() => handleSectionClick('about')} 
              />
            </div>
          )}
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
