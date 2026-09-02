const CinemaSkeleton = ({ fullSurah = false }) => {
  return (
    <div className="cinema-card p-4 p-md-5 my-4 w-100" style={{ maxWidth: "860px" }}>
      {/* Top Meta Shimmer */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="cinema-skeleton-shimmer" style={{ width: "120px", height: "28px" }} />
        <div className="cinema-skeleton-shimmer" style={{ width: "180px", height: "36px" }} />
        <div className="cinema-skeleton-shimmer" style={{ width: "100px", height: "24px" }} />
      </div>

      <div className="cinema-ornament-divider">
        <span>۞</span>
      </div>

      {/* Big Arabic Shimmer */}
      <div className="d-flex flex-column align-items-end gap-3 my-5">
        <div className="cinema-skeleton-shimmer" style={{ width: "95%", height: "42px" }} />
        <div className="cinema-skeleton-shimmer" style={{ width: "70%", height: "42px" }} />
      </div>

      {/* Translation Shimmer */}
      <div className="d-flex flex-column gap-2 my-4">
        <div className="cinema-skeleton-shimmer" style={{ width: "100%", height: "18px" }} />
        <div className="cinema-skeleton-shimmer" style={{ width: "85%", height: "18px" }} />
      </div>

      <hr className="my-4" style={{ borderColor: "var(--cq-border-light)", borderStyle: "dashed" }} />

      {/* Audio Player Shimmer */}
      <div className="cinema-skeleton-shimmer" style={{ width: "100%", height: "80px", borderRadius: "1rem" }} />

      {fullSurah && (
        <div className="d-flex flex-column gap-3 mt-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="cinema-skeleton-shimmer"
              style={{ width: "100%", height: "110px", borderRadius: "1rem" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CinemaSkeleton;
