import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("cq_v2_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem("cq_v2_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const isBookmarked = (surahNumber, ayahNumber) => {
    return favorites.some(
      (item) => item.surahNumber === surahNumber && item.ayahNumber === ayahNumber
    );
  };

  const toggleBookmark = (item) => {
    // item: { surahNumber, ayahNumber, surahName, arabic, translation, tafsir, audioUrl }
    if (isBookmarked(item.surahNumber, item.ayahNumber)) {
      setFavorites((prev) =>
        prev.filter(
          (f) =>
            !(
              f.surahNumber === item.surahNumber &&
              f.ayahNumber === item.ayahNumber
            )
        )
      );
      showToast(
        `Ayat Surah ${item.surahName} (${item.surahNumber}:${item.ayahNumber}) dihapus dari favorit`,
        "info"
      );
    } else {
      setFavorites((prev) => [
        {
          ...item,
          savedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      showToast(
        `Ayat Surah ${item.surahName} (${item.surahNumber}:${item.ayahNumber}) berhasil disimpan ke favorit! 💖`,
        "success"
      );
    }
  };

  const removeBookmark = (surahNumber, ayahNumber) => {
    setFavorites((prev) =>
      prev.filter(
        (f) =>
          !(f.surahNumber === surahNumber && f.ayahNumber === ayahNumber)
      )
    );
    showToast("Ayat dihapus dari favorit", "info");
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    showToast("Semua bookmark dibersihkan", "info");
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleBookmark,
        removeBookmark,
        isBookmarked,
        clearAllFavorites,
        toasts,
        showToast,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
export default FavoritesContext;
