import Footer from "../partials/Footer";
import Header from "../partials/Header";

const LayoutApp = ({ children }) => (
  <>
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-fill">{children}</div>
      <Footer />
    </div>
  </>
);

export default LayoutApp;
