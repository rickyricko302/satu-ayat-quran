import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("cq_v2_theme") || "emerald";
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("cq_v2_font_size") || "lg";
  });

  const [showLatin, setShowLatin] = useState(() => {
    return localStorage.getItem("cq_v2_show_latin") === "true";
  });

  useEffect(() => {
    localStorage.setItem("cq_v2_theme", theme);
    document.documentElement.setAttribute("data-v2-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cq_v2_font_size", fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("cq_v2_show_latin", String(showLatin));
  }, [showLatin]);

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === "emerald") return "celestial";
      if (prev === "celestial") return "alabaster";
      return "emerald";
    });
  };

  const cycleFontSize = () => {
    setFontSize((prev) => {
      if (prev === "sm") return "md";
      if (prev === "md") return "lg";
      if (prev === "lg") return "xl";
      return "sm";
    });
  };

  const toggleLatin = () => setShowLatin((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        cycleTheme,
        fontSize,
        setFontSize,
        cycleFontSize,
        showLatin,
        toggleLatin,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useCinemaTheme = () => useContext(ThemeContext);
export default ThemeContext;
