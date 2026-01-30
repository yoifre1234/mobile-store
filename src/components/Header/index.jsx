import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { cartCount } = useCart(); 
  
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-wrapper">
        <div className="header-left">
          <Link to="/" className="app-logo">MobileStore</Link>
          <nav className="breadcrumbs">
            <Link to="/" className="breadcrumb-link">Inicio</Link>
            {!isHome && (
              <>
                <span className="separator">/</span>
                <span className="current-page">Detalle</span>
              </>
            )}
          </nav>
        </div>
        <div className="header-right">
          <div className="cart-icon">
            🛒 <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;