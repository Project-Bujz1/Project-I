import React, { useState, useEffect, useRef } from 'react';
import './speechRecognitionui.css';

const SpeechRecognitionUI = ({ isListening, onStart, onStop, onResult, onError }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const containerRef = useRef(null);
  
  const suggestions = [
    "Chicken Biryani",
    "Pizza Margherita",
    "Burger Combo"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onStop();
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onStop]);

  const handleError = () => {
    setErrorMessage("Sorry, I didn't get that. Try one of these:");
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onResult(suggestion);
    setShowSuggestions(false);
  };

  if (!isListening && !showSuggestions) return null;

  return (
    <div ref={containerRef}>
      <div className={`speech-recognition-overlay ${isListening || showSuggestions ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      
      <div className={`speech-recognition-container ${isListening || showSuggestions ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center space-y-6">
          <div className={`mic-button ${isListening ? 'listening' : ''}`}>
            <svg 
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
              />
            </svg>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              {errorMessage || "Hey, I'm listening!"}
            </h3>
            <p className="text-gray-600 mt-2">
              Try saying something like "chicken soup"
            </p>
          </div>

          {isListening && !errorMessage && (
            <div className="sound-wave">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="sound-wave-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}

          {showSuggestions && (
            <div className="w-full space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="suggestion-button"
                >
                  {suggestion}
                </button>
              ))}
              <button
                onClick={() => {
                  setErrorMessage('');
                  setShowSuggestions(false);
                  onStart();
                }}
                className="try-again-button"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognitionUI;