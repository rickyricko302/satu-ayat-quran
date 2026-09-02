import { useState } from "react";
import { X, Search, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Standard 114 Surah Reference list
const SURAH_LIST = [
  { n: 1, name: "Al-Fatihah", ar: "الفاتحة", tr: "Pembukaan", count: 7, type: "Makkiyyah" },
  { n: 2, name: "Al-Baqarah", ar: "البقرة", tr: "Sapi Betina", count: 286, type: "Madaniyyah" },
  { n: 3, name: "Ali 'Imran", ar: "آل عمران", tr: "Keluarga Imran", count: 200, type: "Madaniyyah" },
  { n: 4, name: "An-Nisa'", ar: "النساء", tr: "Wanita", count: 176, type: "Madaniyyah" },
  { n: 5, name: "Al-Ma'idah", ar: "المائدة", tr: "Hidangan", count: 120, type: "Madaniyyah" },
  { n: 6, name: "Al-An'am", ar: "الأنعام", tr: "Binatang Ternak", count: 165, type: "Makkiyyah" },
  { n: 7, name: "Al-A'raf", ar: "الأعراف", tr: "Tempat Tertinggi", count: 206, type: "Makkiyyah" },
  { n: 8, name: "Al-Anfal", ar: "الأنفال", tr: "Rampasan Perang", count: 75, type: "Madaniyyah" },
  { n: 9, name: "At-Taubah", ar: "التوبة", tr: "Pengampunan", count: 129, type: "Madaniyyah" },
  { n: 10, name: "Yunus", ar: "يونس", tr: "Nabi Yunus", count: 109, type: "Makkiyyah" },
  { n: 11, name: "Hud", ar: "هود", tr: "Nabi Hud", count: 123, type: "Makkiyyah" },
  { n: 12, name: "Yusuf", ar: "يوسف", tr: "Nabi Yusuf", count: 111, type: "Makkiyyah" },
  { n: 13, name: "Ar-Ra'd", ar: "الرعد", tr: "Guruh", count: 43, type: "Madaniyyah" },
  { n: 14, name: "Ibrahim", ar: "إبراهيم", tr: "Nabi Ibrahim", count: 52, type: "Makkiyyah" },
  { n: 15, name: "Al-Hijr", ar: "الحجر", tr: "Gunung Al-Hijr", count: 99, type: "Makkiyyah" },
  { n: 16, name: "An-Nahl", ar: "النحل", tr: "Lebah", count: 128, type: "Makkiyyah" },
  { n: 17, name: "Al-Isra'", ar: "الإسراء", tr: "Perjalanan Malam", count: 111, type: "Makkiyyah" },
  { n: 18, name: "Al-Kahf", ar: "الكهف", tr: "Gua", count: 110, type: "Makkiyyah" },
  { n: 19, name: "Maryam", ar: "مريم", tr: "Siti Maryam", count: 98, type: "Makkiyyah" },
  { n: 20, name: "Taha", ar: "طه", tr: "Ta Ha", count: 135, type: "Makkiyyah" },
  { n: 21, name: "Al-Anbiya'", ar: "الأنبياء", tr: "Para Nabi", count: 112, type: "Makkiyyah" },
  { n: 22, name: "Al-Hajj", ar: "الحج", tr: "Haji", count: 78, type: "Madaniyyah" },
  { n: 23, name: "Al-Mu'minun", ar: "المؤمنون", tr: "Orang-Orang Mukmin", count: 118, type: "Makkiyyah" },
  { n: 24, name: "An-Nur", ar: "النور", tr: "Cahaya", count: 64, type: "Madaniyyah" },
  { n: 25, name: "Al-Furqan", ar: "الفرقان", tr: "Pembeda", count: 77, type: "Makkiyyah" },
  { n: 26, name: "Asy-Syu'ara'", ar: "الشعراء", tr: "Para Penyair", count: 227, type: "Makkiyyah" },
  { n: 27, name: "An-Naml", ar: "النمل", tr: "Semut", count: 93, type: "Makkiyyah" },
  { n: 28, name: "Al-Qasas", ar: "القصص", tr: "Kisah-Kisah", count: 88, type: "Makkiyyah" },
  { n: 29, name: "Al-'Ankabut", ar: "العنكبوت", tr: "Laba-Laba", count: 69, type: "Makkiyyah" },
  { n: 30, name: "Ar-Rum", ar: "الروم", tr: "Bangsa Romawi", count: 60, type: "Makkiyyah" },
  { n: 31, name: "Luqman", ar: "لقمان", tr: "Keluarga Luqman", count: 34, type: "Makkiyyah" },
  { n: 32, name: "As-Sajdah", ar: "السجدة", tr: "Sujud", count: 30, type: "Makkiyyah" },
  { n: 33, name: "Al-Ahzab", ar: "الأحزاب", tr: "Golongan yang Bersekutu", count: 73, type: "Madaniyyah" },
  { n: 34, name: "Saba'", ar: "سبإ", tr: "Kaum Saba'", count: 54, type: "Makkiyyah" },
  { n: 35, name: "Fatir", ar: "فاطر", tr: "Pencipta", count: 45, type: "Makkiyyah" },
  { n: 36, name: "Ya Sin", ar: "يس", tr: "Ya Sin", count: 83, type: "Makkiyyah" },
  { n: 37, name: "As-Saffat", ar: "الصافات", tr: "Barisan-Barisan", count: 182, type: "Makkiyyah" },
  { n: 38, name: "Sad", ar: "ص", tr: "Shad", count: 88, type: "Makkiyyah" },
  { n: 39, name: "Az-Zumar", ar: "الزمر", tr: "Rombongan", count: 75, type: "Makkiyyah" },
  { n: 40, name: "Ghafir", ar: "غافر", tr: "Maha Pengampun", count: 85, type: "Makkiyyah" },
  { n: 41, name: "Fussilat", ar: "فصلت", tr: "Yang Dijelaskan", count: 54, type: "Makkiyyah" },
  { n: 42, name: "Asy-Syura", ar: "الشورى", tr: "Musyawarah", count: 53, type: "Makkiyyah" },
  { n: 43, name: "Az-Zukhruf", ar: "الزخرف", tr: "Perhiasan", count: 89, type: "Makkiyyah" },
  { n: 44, name: "Ad-Dukhan", ar: "الدخان", tr: "Kabut", count: 59, type: "Makkiyyah" },
  { n: 45, name: "Al-Jasiyah", ar: "الجاثية", tr: "Yang Berlutut", count: 37, type: "Makkiyyah" },
  { n: 46, name: "Al-Ahqaf", ar: "الأحقاف", tr: "Bukit Pasir", count: 35, type: "Makkiyyah" },
  { n: 47, name: "Muhammad", ar: "محمد", tr: "Nabi Muhammad", count: 38, type: "Madaniyyah" },
  { n: 48, name: "Al-Fath", ar: "الفتح", tr: "Kemenangan", count: 29, type: "Madaniyyah" },
  { n: 49, name: "Al-Hujurat", ar: "الحجرات", tr: "Kamar-Kamar", count: 18, type: "Madaniyyah" },
  { n: 50, name: "Qaf", ar: "ق", tr: "Qaf", count: 45, type: "Makkiyyah" },
  { n: 51, name: "Az-Zariyat", ar: "الذاريات", tr: "Angin yang Menerbangkan", count: 60, type: "Makkiyyah" },
  { n: 52, name: "At-Tur", ar: "الطور", tr: "Bukit", count: 49, type: "Makkiyyah" },
  { n: 53, name: "An-Najm", ar: "النجم", tr: "Bintang", count: 62, type: "Makkiyyah" },
  { n: 54, name: "Al-Qamar", ar: "القمر", tr: "Bulan", count: 55, type: "Makkiyyah" },
  { n: 55, name: "Ar-Rahman", ar: "الرحمن", tr: "Maha Pemurah", count: 78, type: "Madaniyyah" },
  { n: 56, name: "Al-Waqi'ah", ar: "الواقعة", tr: "Hari Kiamat", count: 96, type: "Makkiyyah" },
  { n: 57, name: "Al-Hadid", ar: "الحديد", tr: "Besi", count: 29, type: "Madaniyyah" },
  { n: 58, name: "Al-Mujadilah", ar: "المجادلة", tr: "Wanita yang Mengajukan Gugatan", count: 22, type: "Madaniyyah" },
  { n: 59, name: "Al-Hasyr", ar: "الحشر", tr: "Pengusiran", count: 24, type: "Madaniyyah" },
  { n: 60, name: "Al-Mumtahanah", ar: "الممتحنة", tr: "Wanita yang Diuji", count: 13, type: "Madaniyyah" },
  { n: 61, name: "As-Saff", ar: "الصف", tr: "Barisan", count: 14, type: "Madaniyyah" },
  { n: 62, name: "Al-Jumu'ah", ar: "الجمعة", tr: "Hari Jumat", count: 11, type: "Madaniyyah" },
  { n: 63, name: "Al-Munafiqun", ar: "المنافقون", tr: "Orang-Orang Munafik", count: 11, type: "Madaniyyah" },
  { n: 64, name: "At-Tagabun", ar: "التغابن", tr: "Hari Dinampakkan Kesalahan", count: 18, type: "Madaniyyah" },
  { n: 65, name: "At-Talaq", ar: "الطلاق", tr: "Talak", count: 12, type: "Madaniyyah" },
  { n: 66, name: "At-Tahrim", ar: "التحريم", tr: "Pengharaman", count: 12, type: "Madaniyyah" },
  { n: 67, name: "Al-Mulk", ar: "الملك", tr: "Kerajaan", count: 30, type: "Makkiyyah" },
  { n: 68, name: "Al-Qalam", ar: "القلم", tr: "Pena", count: 52, type: "Makkiyyah" },
  { n: 69, name: "Al-Haqqah", ar: "الحاقة", tr: "Hari Kiamat Sebenarnya", count: 52, type: "Makkiyyah" },
  { n: 70, name: "Al-Ma'arij", ar: "المعارج", tr: "Tempat Naik", count: 44, type: "Makkiyyah" },
  { n: 71, name: "Nuh", ar: "نوح", tr: "Nabi Nuh", count: 28, type: "Makkiyyah" },
  { n: 72, name: "Al-Jinn", ar: "الجن", tr: "Jin", count: 28, type: "Makkiyyah" },
  { n: 73, name: "Al-Muzzammil", ar: "المزمل", tr: "Orang yang Berselimut", count: 20, type: "Makkiyyah" },
  { n: 74, name: "Al-Muddassir", ar: "المدثر", tr: "Orang yang Berkemul", count: 56, type: "Makkiyyah" },
  { n: 75, name: "Al-Qiyamah", ar: "القيامة", tr: "Hari Kiamat", count: 40, type: "Makkiyyah" },
  { n: 76, name: "Al-Insan", ar: "الإنسان", tr: "Manusia", count: 31, type: "Madaniyyah" },
  { n: 77, name: "Al-Mursalat", ar: "المرسلات", tr: "Malaikat-Malaikat yang Diutus", count: 50, type: "Makkiyyah" },
  { n: 78, name: "An-Naba'", ar: "النبإ", tr: "Berita Besar", count: 40, type: "Makkiyyah" },
  { n: 79, name: "An-Nazi'at", ar: "النازعات", tr: "Malaikat yang Mencabut", count: 46, type: "Makkiyyah" },
  { n: 80, name: "'Abasa", ar: "عبس", tr: "Bermuka Masam", count: 42, type: "Makkiyyah" },
  { n: 81, name: "At-Takwir", ar: "التكوير", tr: "Menggulung", count: 29, type: "Makkiyyah" },
  { n: 82, name: "Al-Infitar", ar: "الانفطار", tr: "Terbelah", count: 19, type: "Makkiyyah" },
  { n: 83, name: "Al-Mutaffifin", ar: "المطففين", tr: "Orang-Orang Curang", count: 36, type: "Makkiyyah" },
  { n: 84, name: "Al-Insyiqaq", ar: "الانشقاق", tr: "Terbelah", count: 25, type: "Makkiyyah" },
  { n: 85, name: "Al-Buruj", ar: "البروج", tr: "Gugusan Bintang", count: 22, type: "Makkiyyah" },
  { n: 86, name: "At-Tariq", ar: "الطارق", tr: "Yang Datang di Malam Hari", count: 17, type: "Makkiyyah" },
  { n: 87, name: "Al-A'la", ar: "الأعلى", tr: "Yang Paling Tinggi", count: 19, type: "Makkiyyah" },
  { n: 88, name: "Al-Ghasyiyah", ar: "الغاشية", tr: "Hari Pembalasan", count: 26, type: "Makkiyyah" },
  { n: 89, name: "Al-Fajr", ar: "الفجر", tr: "Fajar", count: 30, type: "Makkiyyah" },
  { n: 90, name: "Al-Balad", ar: "البلد", tr: "Negeri", count: 20, type: "Makkiyyah" },
  { n: 91, name: "Asy-Syams", ar: "الشمس", tr: "Matahari", count: 15, type: "Makkiyyah" },
  { n: 92, name: "Al-Lail", ar: "الليل", tr: "Malam", count: 21, type: "Makkiyyah" },
  { n: 93, name: "Ad-Duha", ar: "الضحى", tr: "Waktu Duha", count: 11, type: "Makkiyyah" },
  { n: 94, name: "Asy-Syarh", ar: "الشرح", tr: "Melapangkan", count: 8, type: "Makkiyyah" },
  { n: 95, name: "At-Tin", ar: "التين", tr: "Buah Tin", count: 8, type: "Makkiyyah" },
  { n: 96, name: "Al-'Alaq", ar: "العلق", tr: "Segumpal Darah", count: 19, type: "Makkiyyah" },
  { n: 97, name: "Al-Qadr", ar: "القدر", tr: "Kemuliaan", count: 5, type: "Makkiyyah" },
  { n: 98, name: "Al-Bayyinah", ar: "البينة", tr: "Bukti Nyata", count: 8, type: "Madaniyyah" },
  { n: 99, name: "Az-Zalzalah", ar: "الزلزلة", tr: "Kegoncangan", count: 8, type: "Madaniyyah" },
  { n: 100, name: "Al-'Adiyat", ar: "العاديات", tr: "Kuda yang Berlari Kencang", count: 11, type: "Makkiyyah" },
  { n: 101, name: "Al-Qari'ah", ar: "القارعة", tr: "Hari Kiamat", count: 11, type: "Makkiyyah" },
  { n: 102, name: "At-Takasur", ar: "التكاثر", tr: "Bermegah-Megahan", count: 8, type: "Makkiyyah" },
  { n: 103, name: "Al-'Asr", ar: "العصر", tr: "Masa/Waktu", count: 3, type: "Makkiyyah" },
  { n: 104, name: "Al-Humazah", ar: "الهمزة", tr: "Pengumpat", count: 9, type: "Makkiyyah" },
  { n: 105, name: "Al-Fil", ar: "الفيل", tr: "Gajah", count: 5, type: "Makkiyyah" },
  { n: 106, name: "Quraisy", ar: "قريش", tr: "Suku Quraisy", count: 4, type: "Makkiyyah" },
  { n: 107, name: "Al-Ma'un", ar: "الماعون", tr: "Barang-Barang Berguna", count: 7, type: "Makkiyyah" },
  { n: 108, name: "Al-Kausar", ar: "الكوثر", tr: "Nikmat yang Banyak", count: 3, type: "Makkiyyah" },
  { n: 109, name: "Al-Kafirun", ar: "الكافرون", tr: "Orang-Orang Kafir", count: 6, type: "Makkiyyah" },
  { n: 110, name: "An-Nasr", ar: "النصر", tr: "Pertolongan", count: 3, type: "Madaniyyah" },
  { n: 111, name: "Al-Lahab", ar: "اللهب", tr: "Gejolak Api", count: 5, type: "Makkiyyah" },
  { n: 112, name: "Al-Ikhlas", ar: "الإخلاص", tr: "Memurnikan Keesaan Allah", count: 4, type: "Makkiyyah" },
  { n: 113, name: "Al-Falaq", ar: "الفلق", tr: "Waktu Subuh", count: 5, type: "Makkiyyah" },
  { n: 114, name: "An-Nas", ar: "الناس", tr: "Manusia", count: 6, type: "Makkiyyah" },
];

const SurahSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const filtered = SURAH_LIST.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.tr.toLowerCase().includes(q) ||
      String(s.n).includes(q) ||
      s.type.toLowerCase().includes(q)
    );
  });

  const handleSelectSurah = (surahNum) => {
    onClose();
    navigate(`/v2/full-surah/${surahNum}`);
  };

  return (
    <div className="cinema-modal-backdrop" onClick={onClose}>
      <div
        className="cinema-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px" }}
      >
        <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: "var(--cq-border-light)" }}>
          <div className="d-flex align-items-center gap-2">
            <Search size={20} className="text-warning" />
            <h5 className="mb-0 fw-bold font-serif-cinematic" style={{ color: "var(--cq-text-main)" }}>
              Daftar 114 Surah Al-Qur'an
            </h5>
          </div>

          <button
            className="cinema-btn cinema-btn-glass cinema-btn-icon"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="position-relative mb-3">
          <input
            type="text"
            className="form-control py-2 ps-4 pe-4 rounded-pill"
            style={{
              background: "var(--cq-surface-elevated)",
              border: "1px solid var(--cq-card-border)",
              color: "var(--cq-text-main)",
            }}
            placeholder="Ketik nama surah, nomor, atau arti (cth: Al-Mulk, 67, Kerajaan)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              className="btn btn-sm text-muted position-absolute end-0 top-50 translate-middle-y me-2"
              onClick={() => setQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Surah List */}
        <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: "55vh" }}>
          {filtered.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              Tidak ditemukan surah dengan kata kunci "{query}".
            </div>
          ) : (
            filtered.map((s) => (
              <div
                key={s.n}
                onClick={() => handleSelectSurah(s.n)}
                className="d-flex align-items-center justify-content-between p-3 rounded-3 cursor-pointer"
                style={{
                  background: "var(--cq-surface-elevated)",
                  border: "1px solid var(--cq-border-light)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--cq-accent-gold)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--cq-border-light)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="cinema-ayah-num-badge">
                    {s.n}
                  </div>
                  <div>
                    <div className="fw-bold" style={{ color: "var(--cq-text-main)" }}>
                      {s.name}
                    </div>
                    <div className="text-muted small">
                      {s.tr} • {s.count} Ayat • {s.type}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span
                    className="font-arabic fs-5"
                    style={{ color: "var(--cq-text-arabic)" }}
                  >
                    {s.ar}
                  </span>
                  <ArrowRight size={16} className="text-muted" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SurahSearchModal;
