import React from "react";
import ContentLoader from "react-content-loader";

const SkeletonLoader = () => (
  <>
    <div className="main-card text-center">
      <ContentLoader
        speed={2}
        className="w-100 pb-4"
        backgroundColor="#e1dddd"
        foregroundColor="#ecebeb"
        height={400}
      >
        <rect x="0" y="0" rx="2" ry="2" className="w-100" height="400" />
      </ContentLoader>
    </div>
  </>
);

export default SkeletonLoader;
