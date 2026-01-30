import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import './ProductList.css'; 
import LazyImage from '../components/LazyImage';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  if (isLoading) return <div className="loading">Cargando productos...</div>;
  if (isError) return <div className="error">Error al cargar productos</div>;

  const filteredProducts = products ? products.filter(product => 
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="plp-container">
      

      <div className="search-container">
        <input 
          type="text" 
          className="search-input"
          placeholder="Buscar marca o modelo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      <div className="product-grid">
        {filteredProducts.map(product => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <div className="image-container">
            <LazyImage 
                src={product.imgUrl} 
                alt={`${product.brand} ${product.model}`} 
              />
            </div>
            <div className="product-info">
              <h3>{product.brand} {product.model}</h3>
              {product.price ? <p>{product.price}€</p> : <p>Consultar</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;