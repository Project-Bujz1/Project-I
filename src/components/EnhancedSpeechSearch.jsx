import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Modal, Space } from 'antd';
import { AudioOutlined, SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import _ from 'lodash';

const { Search } = Input;

const EnhancedSpeechSearch = ({ onSearch, placeholder = "Search for food..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const timeoutRef = useRef(null);

  const foodSuggestions = [
    { text: "Butter Chicken", icon: "🍗" },
    { text: "Pizza Margherita", icon: "🍕" },
    { text: "Grilled Fish", icon: "🐟" }
  ];

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Debounced handleSearch function
  const debouncedSearch = useRef(_.debounce((value) => {
    if (onSearch) onSearch(value);
  }, 500)).current;

  useEffect(() => {
    if (transcript) {
      setSearchText(transcript);
      debouncedSearch(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (isListening) {
      timeoutRef.current = setTimeout(() => {
        if (!transcript) {
          handleStopListening();
          setErrorState(true);
        }
      }, 10000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isListening, transcript]);

  const startListening = () => {
    setIsListening(true);
    setErrorState(false);
    setShowModal(true);
    setShowSuccess(false);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
  };

  const handleStopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!transcript) setErrorState(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    debouncedSearch(value);
    setShowSuccess(true);
    setTimeout(() => handleCloseModal(), 1500);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsListening(false);
    setErrorState(false);
    setShowSuccess(false);
  };

  const handleVoiceButtonClick = () => {
    if (!browserSupportsSpeechRecognition) {
      Modal.error({
        title: 'Browser Not Supported',
        content: "Your browser doesn't support speech recognition."
      });
      return;
    }
    if (isListening) handleStopListening();
    else startListening();
  };

  const suffixIcon = (
    <AudioOutlined
      style={{
        fontSize: '18px',
        color: isListening ? '#ff4d4f' : undefined,
        cursor: 'pointer'
      }}
      onClick={handleVoiceButtonClick}
      className={isListening ? 'anticon-spin' : ''}
    />
  );

  const modalContent = showSuccess ? (
    <div style={{ textAlign: 'center' }}>
      <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
      <h3 style={{ fontSize: '18px', marginTop: '16px' }}>Search Successful!</h3>
    </div>
  ) : errorState ? (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Sorry, I didn't get that</h3>
      <p style={{ color: '#666', marginBottom: '16px' }}>Try one of these suggestions:</p>
      <Space direction="vertical" style={{ width: '100%' }}>
        {foodSuggestions.map((suggestion, index) => (
          <Button
            key={index}
            type="text"
            onClick={() => handleSearch(suggestion.text)}
            style={{
              height: 'auto',
              padding: '12px',
              textAlign: 'left',
              backgroundColor: '#fff1f0',
              color: '#ff4d4f',
              width: '100%'
            }}
          >
            <span style={{ marginRight: '8px', fontSize: '1.2em' }}>{suggestion.icon}</span>
            {suggestion.text}
          </Button>
        ))}
      </Space>
      <Button type="primary" danger onClick={startListening} style={{ marginTop: '16px' }}>
        Try Again
      </Button>
    </div>
  ) : (
    <div style={{ textAlign: 'center' }}>
      <AudioOutlined style={{ fontSize: '32px', color: '#ff4d4f', animation: 'antFadeScale 1.2s infinite' }} />
      <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Listening...</h3>
      <p style={{ color: '#666', minHeight: '24px', marginBottom: '16px' }}>{transcript || "Say something..."}</p>
    </div>
  );

  return (
    <>
      <Search
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder={placeholder}
        enterButton={<SearchOutlined />}
        suffix={suffixIcon}
        style={{ width: '100%' }}
        className="custom-search-input"
      />

      <Modal
        open={showModal}
        onCancel={handleCloseModal}
        footer={null}
        closable={true}
        width={400}
        centered
        bodyStyle={{ padding: '24px' }}
      >
        {modalContent}
      </Modal>

      <style jsx global>{`
        .custom-search-input .ant-input-wrapper {
          background-color: #ffffff;
        }
        .custom-search-input .ant-input {
          border-color: #ff4d4f;
        }
        .custom-search-input .ant-input:hover,
        .custom-search-input .ant-input:focus {
          border-color: #ff7875;
          box-shadow: none;
        }
        .custom-search-input .ant-input-search-button {
          background-color: #ff4d4f;
          border-color: #ff4d4f;
        }
        .custom-search-input .ant-input-search-button:hover {
          background-color: #ff7875;
          border-color: #ff7875;
        }
        @keyframes antFadeScale {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      `}</style>
    </>
  );
};

export default EnhancedSpeechSearch;
