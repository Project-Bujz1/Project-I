// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   Loader2, Utensils, Coffee, Pizza, ChefHat, Apple, Beer, 
//   UtensilsCrossed, Sandwich, Wine, Soup, Cookie, Beef,
//   BookOpen, Clock, DollarSign, Star
// } from 'lucide-react';
// import FoodLoader from './FoodLoader';

// const QREntry = () => {
    // const { orgId, tableNumber } = useParams();
    // const [restaurant, setRestaurant] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const [animationPhase, setAnimationPhase] = useState('initial');
    // const API_URL = 'https://stage-smart-server-default-rtdb.firebaseio.com/restaurants';

//     const animationStyles = `
//         @keyframes floatIcon {
//             0%, 100% { transform: translateY(0) rotate(0deg); }
//             25% { transform: translateY(-15px) rotate(5deg); }
//             75% { transform: translateY(15px) rotate(-5deg); }
//         }
//         @keyframes fadeInOut {
//             0%, 100% { opacity: 0.1; }
//             50% { opacity: 0.3; }
//         }
//         @keyframes lettering {
//             0% { letter-spacing: -3px; opacity: 0; }
//             50% { letter-spacing: 1px; opacity: 0.5; }
//             100% { letter-spacing: 3px; opacity: 1; }
//         }
//         @keyframes scaleUp {
//             0% { transform: scale(0.8); opacity: 0; }
//             100% { transform: scale(1); opacity: 1; }
//         }
//         .floating-icon {
//             animation: floatIcon 3s ease-in-out infinite, fadeInOut 4s ease-in-out infinite;
//             position: absolute;
//             color: #ff4d4d;
//             opacity: 0.2;
//         }
//         .card-icon {
//             position: absolute;
//             color: #ff4d4d;
//             opacity: 0.1;
//             transform: scale(0.8);
//         }
//         .icon-1 { animation-delay: 0s; left: 10%; top: 20%; }
//         .icon-2 { animation-delay: 0.5s; right: 15%; top: 30%; }
//         .icon-3 { animation-delay: 1s; left: 20%; bottom: 20%; }
//         .icon-4 { animation-delay: 1.5s; right: 20%; bottom: 30%; }
//         .icon-5 { animation-delay: 2s; left: 30%; top: 50%; }
//         .icon-6 { animation-delay: 2.5s; right: 30%; top: 40%; }
//         .icon-7 { animation-delay: 3s; left: 40%; bottom: 40%; }
//         .icon-8 { animation-delay: 3.5s; right: 40%; bottom: 50%; }
//         .icon-9 { animation-delay: 4s; left: 50%; top: 30%; }
//         .icon-10 { animation-delay: 4.5s; right: 50%; top: 60%; }
//         .scale-up {
//             animation: scaleUp 0.5s ease-out forwards;
//         }
//     `;


    // useEffect(() => {
    //     const fetchRestaurantData = async () => {
    //         try {
    //             const response = await fetch(`${API_URL}.json`);
    //             if (!response.ok) throw new Error('Failed to fetch restaurant data');

    //             const data = await response.json();
    //             const restaurantArray = Object.values(data);
    //             const restaurantData = restaurantArray.find(r => r.orgId === orgId);

    //             if (restaurantData) {
    //                 setRestaurant(restaurantData);
    //                 localStorage.setItem('role', 'customer');
    //                 localStorage.setItem('orgId', orgId);
    //                 localStorage.setItem('tableNumber', tableNumber);

    //                 const sequence = async () => {
    //                     setAnimationPhase('appLogoEnter');
    //                     await new Promise(r => setTimeout(r, 800));
    //                     setAnimationPhase('restaurantLogoEnter');
    //                     await new Promise(r => setTimeout(r, 800));
    //                     setAnimationPhase('infoAppear');
    //                     await new Promise(r => setTimeout(r, 1500));
                        
    //                     sessionStorage.setItem('justSetOrgIdAndTable', 'true');
    //                     window.location.href = '/home';
    //                 };
    //                 sequence();
    //             } else {
    //                 throw new Error('Restaurant not found');
    //             }
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (orgId && tableNumber) {
    //         fetchRestaurantData();
    //     } else {
    //         setError('No orgId or tableNumber provided');
    //         setLoading(false);
    //     }
    // }, [orgId, tableNumber]);

//     const backgroundStyle = {
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: '#fff8f8',
//         overflow: 'hidden',
//         zIndex: -1,
//     };

//     const containerStyle = {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         padding: '20px',
//         position: 'relative',
//     };

//     const cardStyle = {
//         background: 'white',
//         borderRadius: '30px',
//         padding: '40px 30px',
//         boxShadow: '0 10px 30px rgba(255, 77, 77, 0.2)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: '24px',
//         maxWidth: '90%',
//         width: '400px',
//         position: 'relative',
//         overflow: 'hidden',
//     };

//     const titleStyle = {
//         fontSize: '28px',
//         fontWeight: '700',
//         color: 'white',
//         textAlign: 'center',
//         animation: 'lettering 2s ease-in-out forwards',
//         textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
//         backgroundColor: '#ff4d4d',
//         padding: '12px 24px',
//         borderRadius: '20px',
//         boxShadow: '0 4px 15px rgba(255, 77, 77, 0.5)',
//         marginBottom: '20px',
//     };

//     if (loading) {
//         return (
//             <div style={backgroundStyle}>
//                 <style>{animationStyles}</style>
//                 <div style={containerStyle}>
//                     <FoodLoader />
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div style={backgroundStyle}>
//                 <div style={containerStyle}>
//                     <p className="text-red-500 text-lg font-semibold">{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={containerStyle}>
//             <style>{animationStyles}</style>
//             <div style={backgroundStyle}></div>
            
//             {/* Background Floating Icons */}
//             <Utensils size={32} className="floating-icon icon-1" />
//             <Coffee size={32} className="floating-icon icon-2" />
//             <Pizza size={32} className="floating-icon icon-3" />
//             <ChefHat size={32} className="floating-icon icon-4" />
//             <Apple size={32} className="floating-icon icon-5" />
//             <Beer size={32} className="floating-icon icon-6" />
//             <UtensilsCrossed size={32} className="floating-icon icon-7" />
//             <Sandwich size={32} className="floating-icon icon-8" />
//             <Wine size={32} className="floating-icon icon-9" />
//             <Soup size={32} className="floating-icon icon-10" />
            
//             <div style={cardStyle} className="scale-up">
//                 {/* Card Corner Icons */}
//                 <Cookie size={24} className="card-icon" style={{ top: 20, left: 20 }} />
//                 <Beef size={24} className="card-icon" style={{ top: 20, right: 20 }} />
//                 <BookOpen size={24} className="card-icon" style={{ bottom: 20, left: 20 }} />
//                 <Star size={24} className="card-icon" style={{ bottom: 20, right: 20 }} />
                
//                 <div style={titleStyle}>
//                     Smart Server Menu
//                 </div>
//                 <div>
//                     <img
//                         src="/assets/logo-png_1.png"
//                         alt="App Logo"
//                         style={{ 
//                             width: '150px', 
//                             height: 'auto',
//                             animation: 'scaleUp 0.5s ease-out forwards',
//                             opacity: 0
//                         }}
//                     />
//                 </div>
//                 {restaurant && (
//                     <>
//                         <img
//                             src={restaurant.logo}
//                             alt={restaurant.name}
//                             style={{ 
//                                 width: '180px', 
//                                 height: '180px', 
//                                 borderRadius: '50%',
//                                 boxShadow: '0 6px 20px rgba(255, 77, 77, 0.3)',
//                                 animation: 'scaleUp 0.5s ease-out forwards',
//                                 opacity: 0,
//                                 animationDelay: '0.2s'
//                             }}
//                         />
//                         <h1 style={{ 
//                             fontSize: '24px', 
//                             fontWeight: '600', 
//                             color: '#ff4d4d',
//                             textAlign: 'center',
//                             animation: 'scaleUp 0.5s ease-out forwards',
//                             opacity: 0,
//                             animationDelay: '0.4s'
//                         }}>
//                             Welcome to {restaurant.name}
//                         </h1>
//                         <div style={{ 
//                             backgroundColor: '#ff4d4d', 
//                             padding: '10px 20px', 
//                             borderRadius: '20px', 
//                             color: 'white', 
//                             fontSize: '20px',
//                             animation: 'scaleUp 0.5s ease-out forwards',
//                             opacity: 0,
//                             animationDelay: '0.6s'
//                         }}>
//                             Table {tableNumber}
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default QREntry;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Loader2, Utensils, Coffee, Pizza, ChefHat, Apple, Beer, 
  UtensilsCrossed, Sandwich, Wine, Soup, Cookie, Beef,
  BookOpen, Clock, DollarSign, Star, Soup as Bowl,
  GlassWater, Dessert, Croissant, Fish, Clock3,
  ShoppingBag, Bell, Salad, IceCream2
} from 'lucide-react';
import FoodLoader from './FoodLoader';

const QREntry = () => {
    const { orgId, tableNumber } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animationPhase, setAnimationPhase] = useState('initial');
    const API_URL = 'https://stage-smart-server-default-rtdb.firebaseio.com/restaurants';

    const animationStyles = `
        @keyframes floatIcon {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-15px) rotate(5deg); }
            75% { transform: translateY(15px) rotate(-5deg); }
        }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
        }
        @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes lettering {
            0% { letter-spacing: -3px; opacity: 0; }
            50% { letter-spacing: 1px; opacity: 0.5; }
            100% { letter-spacing: 3px; opacity: 1; }
        }
        @keyframes scaleUp {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .floating-icon {
            animation: floatIcon 3s ease-in-out infinite, fadeInOut 4s ease-in-out infinite;
            position: absolute;
            color: #ff4d4d;
            opacity: 0.2;
        }
        .card-icon {
            position: absolute;
            color: #ff4d4d;
            opacity: 0.15;
        }
        .spin-icon {
            animation: spinSlow 20s linear infinite;
            position: absolute;
            color: #ff4d4d;
            opacity: 0.1;
        }
        .decoration-icon {
            color: #ff4d4d;
            opacity: 0.2;
            margin: 0 8px;
        }
        .icon-circle {
            position: absolute;
            width: 250px;
            height: 250px;
            animation: spinSlow 30s linear infinite;
        }
        .icon-1 { animation-delay: 0s; left: 10%; top: 20%; }
        .icon-2 { animation-delay: 0.5s; right: 15%; top: 30%; }
        .icon-3 { animation-delay: 1s; left: 20%; bottom: 20%; }
        .icon-4 { animation-delay: 1.5s; right: 20%; bottom: 30%; }
        .icon-5 { animation-delay: 2s; left: 30%; top: 50%; }
        .icon-6 { animation-delay: 2.5s; right: 30%; top: 40%; }
        .icon-7 { animation-delay: 3s; left: 40%; bottom: 40%; }
        .icon-8 { animation-delay: 3.5s; right: 40%; bottom: 50%; }
        .icon-9 { animation-delay: 4s; left: 50%; top: 30%; }
        .icon-10 { animation-delay: 4.5s; right: 50%; top: 60%; }
    `;

    

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await fetch(`${API_URL}.json`);
                if (!response.ok) throw new Error('Failed to fetch restaurant data');

                const data = await response.json();
                const restaurantArray = Object.values(data);
                const restaurantData = restaurantArray.find(r => r.orgId === orgId);

                if (restaurantData) {
                    setRestaurant(restaurantData);
                    localStorage.setItem('role', 'customer');
                    localStorage.setItem('orgId', orgId);
                    localStorage.setItem('tableNumber', tableNumber);

                    const sequence = async () => {
                        setAnimationPhase('appLogoEnter');
                        await new Promise(r => setTimeout(r, 800));
                        setAnimationPhase('restaurantLogoEnter');
                        await new Promise(r => setTimeout(r, 800));
                        setAnimationPhase('infoAppear');
                        await new Promise(r => setTimeout(r, 1500));
                        
                        sessionStorage.setItem('justSetOrgIdAndTable', 'true');
                        window.location.href = '/home';
                    };
                    sequence();
                } else {
                    throw new Error('Restaurant not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orgId && tableNumber) {
            fetchRestaurantData();
        } else {
            setError('No orgId or tableNumber provided');
            setLoading(false);
        }
    }, [orgId, tableNumber]);

    
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative',
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '30px',
        padding: '40px 30px',
        boxShadow: '0 10px 30px rgba(255, 77, 77, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        maxWidth: '90%',
        width: '400px',
        position: 'relative',
        overflow: 'hidden',
    };

    const titleStyle = {
        fontSize: '28px',
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
        animation: 'lettering 2s ease-in-out forwards',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        backgroundColor: '#ff4d4d',
        padding: '12px 24px',
        borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.5)',
        marginBottom: '20px',
        position: 'relative',
    };

    const IconCircle = ({ children, rotation }) => (
        <div className="icon-circle" style={{ transform: `rotate(${rotation}deg)` }}>
            {children}
        </div>
    );

    if (loading) {
        return (
            <div style={{ backgroundColor: '#fff8f8', minHeight: '100vh' }}>
                <style>{animationStyles}</style>
                <div style={containerStyle}>
                    <FoodLoader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ backgroundColor: '#fff8f8', minHeight: '100vh' }}>
                <div style={containerStyle}>
                    <p className="text-red-500 text-lg font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <style>{animationStyles}</style>
            <div style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: '#fff8f8', 
                zIndex: -1 
            }} />
            
            {/* Background Floating Icons */}
            <Utensils size={32} className="floating-icon icon-1" />
            <Coffee size={32} className="floating-icon icon-2" />
            <Pizza size={32} className="floating-icon icon-3" />
            <ChefHat size={32} className="floating-icon icon-4" />
            <Apple size={32} className="floating-icon icon-5" />
            <Beer size={32} className="floating-icon icon-6" />
            <UtensilsCrossed size={32} className="floating-icon icon-7" />
            <Sandwich size={32} className="floating-icon icon-8" />
            <Wine size={32} className="floating-icon icon-9" />
            <Soup size={32} className="floating-icon icon-10" />
            
            <div style={cardStyle} className="scale-up">
                {/* Card Corner Icons */}
                <Cookie size={24} className="card-icon" style={{ top: 20, left: 20 }} />
                <Beef size={24} className="card-icon" style={{ top: 20, right: 20 }} />
                <BookOpen size={24} className="card-icon" style={{ bottom: 20, left: 20 }} />
                <Star size={24} className="card-icon" style={{ bottom: 20, right: 20 }} />
                
                {/* Title with Decorative Icons */}
                <div style={titleStyle}>
                    <UtensilsCrossed size={16} className="decoration-icon" style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)' }} />
                    Smart Server Menu
                    <ChefHat size={16} className="decoration-icon" style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                {/* Logo Section with Rotating Icons */}
                <div style={{ position: 'relative' }}>
                    <IconCircle rotation={0}>
                        <Pizza size={20} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }} />
                        <Coffee size={20} style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }} />
                        <Beer size={20} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }} />
                        <Wine size={20} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }} />
                    </IconCircle>
                    <img
                        src="/assets/logo-png_1.png"
                        alt="App Logo"
                        style={{ 
                            width: '150px', 
                            height: 'auto',
                            position: 'relative',
                            zIndex: 2,
                            animation: 'scaleUp 0.5s ease-out forwards',
                            opacity: 0
                        }}
                    />
                </div>

                {restaurant && (
                    <>
                        {/* Restaurant Logo with Decorative Frame */}
                        <div style={{ position: 'relative' }}>
                            <IconCircle rotation={45}>
                                <Croissant size={20} style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) rotate(-45deg)' }} />
                                <Fish size={20} style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%) rotate(-45deg)' }} />
                                <IceCream2 size={20} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%) rotate(-45deg)' }} />
                                <Salad size={20} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) rotate(-45deg)' }} />
                            </IconCircle>
                            <img
                                src={restaurant.logo}
                                alt={restaurant.name}
                                style={{ 
                                    width: '180px', 
                                    height: '180px', 
                                    borderRadius: '50%',
                                    boxShadow: '0 6px 20px rgba(255, 77, 77, 0.3)',
                                    animation: 'scaleUp 0.5s ease-out forwards',
                                    opacity: 0,
                                    animationDelay: '0.2s',
                                    position: 'relative',
                                    zIndex: 2
                                }}
                            />
                        </div>

                        {/* Restaurant Name with Icons */}
                        <div style={{ 
                            position: 'relative',
                            textAlign: 'center',
                            animation: 'scaleUp 0.5s ease-out forwards',
                            opacity: 0,
                            animationDelay: '0.4s'
                        }}>
                            <Bell size={16} className="decoration-icon" style={{ verticalAlign: 'middle' }} />
                            <h1 style={{ 
                                display: 'inline-block',
                                fontSize: '24px', 
                                fontWeight: '600', 
                                color: '#ff4d4d',
                                margin: '0 10px'
                            }}>
                                Welcome to {restaurant.name}
                            </h1>
                            <ShoppingBag size={16} className="decoration-icon" style={{ verticalAlign: 'middle' }} />
                        </div>

                        {/* Table Number with Icons */}
                        <div style={{ 
                            position: 'relative',
                            backgroundColor: '#ff4d4d', 
                            padding: '10px 20px', 
                            borderRadius: '20px', 
                            color: 'white', 
                            fontSize: '20px',
                            animation: 'scaleUp 0.5s ease-out forwards',
                            opacity: 0,
                            animationDelay: '0.6s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <GlassWater size={16} />
                            Table {tableNumber}
                            <Dessert size={16} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QREntry;