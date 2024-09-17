// import React, { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// const QREntry = () => {
//     const { orgId } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (orgId) {
//             console.log("orgId from url is",orgId)
//             console.log("orgId from url is")
//             // Store the role and orgId in localStorage
//             localStorage.setItem('role', 'customer');
//             localStorage.setItem('orgId', orgId);

//             // Navigate to the home page
//             navigate('/home');
//         } else {
//             // If no orgId is provided, redirect to the landing page
//             navigate('/');
//         }
//     }, [orgId, navigate]);

//     return (
//         <div>
//             <p>Processing QR code...</p>
//         </div>
//     );
// };

// export default QREntry;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodLoader from './FoodLoader';

const QREntry = () => {
    const { orgId } = useParams();
    const navigate = useNavigate();
    const [debug, setDebug] = useState('');

    useEffect(() => {
        setDebug(prev => prev + `\nParams orgId: ${orgId}`);

        if (orgId) {
            // Store the role and orgId in localStorage
            localStorage.setItem('role', 'customer');
            localStorage.setItem('orgId', orgId);
            setDebug(prev => prev + '\nSet localStorage items');

            // Log the values to verify they were set
            const storedRole = localStorage.getItem('role');
            const storedOrgId = localStorage.getItem('orgId');
            setDebug(prev => prev + `\nStored role: ${storedRole}, Stored orgId: ${storedOrgId}`);

            // Navigate to the home page after a short delay
            setTimeout(() => {
                setDebug(prev => prev + '\nNavigating to /home');
                navigate('/home');
            }, 2000); // 2-second delay for debugging
        } else {
            setDebug(prev => prev + '\nNo orgId found, navigating to /');
            navigate('/');
        }
    }, [orgId, navigate]);

    return (
        <div style={{marginTop: '75px'}}>
            {/* <h2>QR Entry Processing</h2>
            <p>orgId from URL: {orgId}</p>
            <p>Debug Info:</p>
            <pre>{debug}</pre> */}
            <FoodLoader />
        </div>
    );
};

export default QREntry;