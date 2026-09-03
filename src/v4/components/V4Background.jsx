import { memo } from "react";

const V4Background = memo(() => {
  return (
    <div className="v4-background" aria-hidden="true">
      <div className="v4-bg-radial-aurora" />
      <div className="v4-bg-radial-bottom" />
      <div className="v4-starfield" />
      <div className="v4-pattern-overlay" />
    </div>
  );
});

V4Background.displayName = "V4Background";

export default V4Background;
