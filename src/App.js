import React, { useState,useEffect  } from 'react';
import { FaSearch, FaMicrophone, FaCamera, FaVolumeUp, FaCopy } from 'react-icons/fa';
import { IconContext } from 'react-icons';
//import { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from 'react-webcam';
import { Configuration, OpenAIApi } from "openai";

import medicine_img from'./medicine.webp';
const App = () => {
  const [textInput, setTextInput] = useState('');
  const [cameraMode, setCameraMode] = useState(false);
  const [language, setLanguage] = useState('english'); // Add language state 
//  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const [apiResponse, setApiResponse] = useState('');

  const handleVoiceRecognition = () => {
    // resetTranscript();
    // if (listening) {
    //   stopListening();
    // } else {
    //   startListening();
    // }
  };

  const handleCameraMode = () => {
    setCameraMode(!cameraMode);
  };

  const handleSearch = async () => {
    // Perform search logic here
    let apiResponseText = 'processing ....';
    setApiResponse(apiResponseText);
    const configuration = new Configuration({
      apiKey: ""//openai token
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `share usage, side effects,  direction to use, Composition , Consume Type, medical practice about ${textInput} medicine, share details in tabular format in ${language} language`,
      temperature: 0.7,
      max_tokens: 250,
    });
    apiResponseText = response?.data?.choices[0]?.text || '';
    setApiResponse(apiResponseText);
  };

  useEffect(() => {
    if(textInput){
      handleSearch(); // Call handleSearch whenever language state changes
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'hindi' : 'english');
  };
  return (
    <div className="container">
      <div className="search-bar">
        <input type="text" value={textInput} onChange={handleTextChange} placeholder="Search..." />
        <FaMicrophone className="icon" onClick={handleVoiceRecognition} />
        <FaCamera className="icon" onClick={handleCameraMode} />
        <FaSearch className="icon" onClick={handleSearch} />
      </div>
      <div className="content-container">
        <div className="image-container">
          <img src={medicine_img} alt="Medicine Packet" />
        </div>
        <div className="information-section">
        <div className="section-header">
            <IconContext.Provider value={{ className: 'icon' }}>
              <FaVolumeUp />
              <FaCopy />
            </IconContext.Provider>
            <button className={`language-switcher ${language}`} onClick={toggleLanguage}>
              {language === 'english' ? 'English' : 'हिन्दी'}
            </button>
          </div>
        <div className="information">
            <p>
            {apiResponse || 'Information...'}
            </p>
          </div>
        </div>
      </div>
      {cameraMode && (
        <div className="camera-container">
          <Webcam />
        </div>
      )}
    </div>
  );
};

export default App;
