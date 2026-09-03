const V4Skeleton = () => {
  return (
    <div className="v4-sanctuary-card v4-skeleton-wrapper" aria-busy="true">
      <div className="d-flex justify-content-between align-items-center">
        <div className="v4-skeleton-pulse" style={{ width: "130px", height: "30px" }} />
        <div className="v4-skeleton-pulse" style={{ width: "220px", height: "36px" }} />
        <div className="v4-skeleton-pulse" style={{ width: "110px", height: "30px" }} />
      </div>

      <div className="my-4 d-flex flex-column align-items-end gap-3">
        <div className="v4-skeleton-pulse" style={{ width: "85%", height: "42px" }} />
        <div className="v4-skeleton-pulse" style={{ width: "100%", height: "42px" }} />
        <div className="v4-skeleton-pulse" style={{ width: "65%", height: "42px" }} />
      </div>

      <div className="d-flex flex-column gap-2 mt-3">
        <div className="v4-skeleton-pulse" style={{ width: "20%", height: "16px" }} />
        <div className="v4-skeleton-pulse" style={{ width: "95%", height: "22px" }} />
        <div className="v4-skeleton-pulse" style={{ width: "90%", height: "22px" }} />
      </div>

      <div className="v4-skeleton-pulse mt-4" style={{ width: "100%", height: "70px", borderRadius: "14px" }} />
    </div>
  );
};

export default V4Skeleton;
