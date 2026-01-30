import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '../context/CartProvider';
import * as api from '../services/api';
import App from '../App';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});


const renderApp = (initialRoute = '/') => {
  const testClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testClient}>
      <CartProvider>
  
        <MemoryRouter initialEntries={[initialRoute]}>
          <App />
        </MemoryRouter>
      </CartProvider>
    </QueryClientProvider>
  );
};



describe('App Integration Tests', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });
  

  it('Renderiza el Header y la Lista de Productos en la ruta "/"', async () => {

    const mockProducts = [
      { id: '1', brand: 'Acer', model: 'Iconia', price: '200', imgUrl: 'test.jpg' }
    ];
    vi.spyOn(api, 'getProducts').mockResolvedValue(mockProducts);


    renderApp('/');
 
    expect(screen.getByText('MobileStore')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();


    await waitFor(() => {
      expect(screen.getByText('Acer Iconia')).toBeInTheDocument();
    });
  });


  it('Renderiza el Header y el Detalle cuando la ruta es "/product/:id"', async () => {
   
    const mockDetail = { 
      id: '1', brand: 'Acer', model: 'Iconia', price: '200', imgUrl: '', 
      options: { colors: [], storages: [] } 
    };
    vi.spyOn(api, 'getProductDetail').mockResolvedValue(mockDetail);
    
    renderApp('/product/1');
    expect(screen.getByText('MobileStore')).toBeInTheDocument();
    expect(screen.getByText('Detalle')).toBeInTheDocument();
  });

});