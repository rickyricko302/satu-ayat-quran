const Card = ({ children }) => (
  <div className="card main-card shadow-lg mt-2">
    <div className="card-body p-8">{children}</div>
  </div>
);

export default Card;
