import { createContext, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isPlayed, setIsPlayed] = useState(false);

  const setStatus = ({ value }) => {
    setIsPlayed(value);
  };
  return (
    <AudioContext.Provider value={{ isPlayed, setStatus }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;
