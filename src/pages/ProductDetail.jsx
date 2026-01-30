import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { getProductDetail, addToCart } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify'; 
import './ProductDetail.css';
import LazyImage from '../components/LazyImage';

const ProductDetail = () => {
  const { id } = useParams();
  const { addCount } = useCart();
  
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetail(id)
  });

 
  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      addCount(1);
      toast.success('¡Producto añadido al carrito correctamente!');
    },
    onError: () => toast.error('Hubo un problema al añadir el producto.')
  });

  if (isLoading) return <div className="loading">Cargando detalle...</div>;
  if (!product) return <div>Producto no encontrado</div>;


  const singleColorOption = product.options?.colors?.length === 1 ? product.options.colors[0].code : null;
  const singleStorageOption = product.options?.storages?.length === 1 ? product.options.storages[0].code : null;


  const activeColor = selectedColor || singleColorOption || '';
  const activeStorage = selectedStorage || singleStorageOption || '';

  const handleAddToCart = () => {
    
    if (!activeColor || !activeStorage) {
        alert("Por favor selecciona color y almacenamiento");
        return;
    }
    mutation.mutate({ id, colorCode: activeColor, storageCode: activeStorage });
  };

  return (
    <div className="pdp-container">
      <Link to="/" className="back-link">← Volver al listado</Link>
      
      <div className="pdp-content">
        
        <div className="pdp-image">
        <LazyImage 
                src={product.imgUrl} 
                alt={`${product.brand} ${product.model}`} 
              />
        </div>

       
        <div className="pdp-details">
            <div className="details-info">
                <h2>{product.brand} - {product.model}</h2>
                <p>Precio: {product.price ? `${product.price}€` : 'Consultar'}</p>
                <ul>
                    <li>CPU: {product.cpu}</li>
                    <li>RAM: {product.ram}</li>
                    <li>OS: {product.os}</li>
                    <li>Resolución: {product.displayResolution}</li>
                    <li>Batería: {product.battery}</li>
                    <li>Cámaras: {Array.isArray(product.primaryCamera) ? product.primaryCamera.join(', ') : product.primaryCamera} / {product.secondaryCmera}</li>
                    <li>Dimensiones: {product.dimentions}</li>
                    <li>Peso: {product.weight}g</li>
                </ul>
            </div>

            <div className="details-actions">
                
                <div className="selector">
                    
                    <label htmlFor="storage-select">Almacenamiento:</label>
                    <select 
                      id="storage-select" 
                      value={activeStorage} 
                      onChange={(e) => setSelectedStorage(e.target.value)}
                      disabled={!!singleStorageOption}
                    >
                        <option value="" disabled>Seleccionar</option>
                        {product.options?.storages.map(s => (
                            <option key={s.code} value={s.code}>{s.name}</option>
                        ))}
                    </select>
                </div>

                
                <div className="selector">
                    
                    <label htmlFor="color-select">Color:</label>
                    <select 
                      id="color-select" 
                      value={activeColor} 
                      onChange={(e) => setSelectedColor(e.target.value)}
                      disabled={!!singleColorOption}
                    >
                        <option value="" disabled>Seleccionar</option>
                        {product.options?.colors.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <button 
                    onClick={handleAddToCart} 
                    className="add-btn"
                    disabled={!activeColor || !activeStorage} 
                >
                    Añadir al carrito
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;