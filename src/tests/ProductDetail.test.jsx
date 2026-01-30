import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductDetail from '../pages/ProductDetail';
import { CartProvider } from '../context/CartProvider';
import * as api from '../services/api';
import { toast } from 'react-toastify';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));


const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderComponent = (id = '1') => {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <CartProvider>
        <MemoryRouter initialEntries={[`/product/${id}`]}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    </QueryClientProvider>
  );
};

const mockDetail = {
  id: '1',
  brand: 'Apple',
  model: 'iPhone 13',
  price: '900',
  cpu: 'A15',
  ram: '4GB',
  os: 'iOS',
  displayResolution: 'FHD',
  battery: '3000mAh',
  primaryCamera: ['12MP'],
  secondaryCmera: '12MP',
  dimentions: '10x5',
  weight: '170',
  imgUrl: 'iphone.jpg',
  options: {
    colors: [
      { code: 100, name: 'Negro' },
      { code: 200, name: 'Blanco' }
    ],
    storages: [
      { code: 1000, name: '128GB' },
      { code: 2000, name: '256GB' }
    ]
  }
};

describe('ProductDetail Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Renderiza los detalles del producto correctamente', async () => {
    vi.spyOn(api, 'getProductDetail').mockResolvedValue(mockDetail);
    renderComponent('1');

    await waitFor(() => {
      expect(screen.getByText('Apple - iPhone 13')).toBeInTheDocument();
      expect(screen.getByText('Precio: 900€')).toBeInTheDocument();
      expect(screen.getByText(/CPU: A15/i)).toBeInTheDocument();
    });
  });

  it('El botón de añadir debe estar deshabilitado hasta seleccionar opciones', async () => {
    vi.spyOn(api, 'getProductDetail').mockResolvedValue(mockDetail);
    renderComponent('1');

    const addBtn = await screen.findByText(/Añadir al carrito/i);
    expect(addBtn).toBeDisabled();
  });

  it('Permite añadir al carrito cuando se seleccionan las opciones y muestra Toast', async () => {
    vi.spyOn(api, 'getProductDetail').mockResolvedValue(mockDetail);
    const addToCartSpy = vi.spyOn(api, 'addToCart').mockResolvedValue({ count: 5 });
    
    renderComponent('1');

    await screen.findByText('Apple - iPhone 13');

    const storageSelect = screen.getByLabelText(/Almacenamiento/i);
    const colorSelect = screen.getByLabelText(/Color/i);

    fireEvent.change(storageSelect, { target: { value: '1000' } });
    fireEvent.change(colorSelect, { target: { value: '100' } });

    const addBtn = screen.getByText(/Añadir al carrito/i);
    expect(addBtn).not.toBeDisabled();

    fireEvent.click(addBtn);

    await waitFor(() => {
        expect(addToCartSpy).toHaveBeenCalledWith(
          {
            id: '1',
            colorCode: '100',
            storageCode: '1000'
          },
          expect.anything()
        );

        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining('añadido al carrito')
        );
    });
  });
});