import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductList from '../pages/ProductList';
import * as api from '../services/api'; // Importamos todo para espiar

// --- SETUP ---
const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter>
        <ProductList />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Datos Mock (falsos)
const mockProducts = [
  { id: '1', brand: 'Acer', model: 'Liquid', price: '100', imgUrl: 'acer.jpg' },
  { id: '2', brand: 'Samsung', model: 'Galaxy', price: '200', imgUrl: 'samsung.jpg' }
];

describe('ProductList Page', () => {
  
  beforeEach(() => {
    vi.restoreAllMocks(); // Limpiamos espías antes de cada test
  });

  it('Muestra el loading y luego la lista de productos', async () => {
    vi.spyOn(api, 'getProducts').mockResolvedValue(mockProducts);
    renderComponent();

    // 1. Loading inicial
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    // 2. Esperamos a que lleguen los datos
    await waitFor(() => {
      expect(screen.getByText('Acer Liquid')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();
    });
  });

  it('Filtra correctamente los productos al buscar', async () => {
    vi.spyOn(api, 'getProducts').mockResolvedValue(mockProducts);
    renderComponent();

    // Esperar a que cargue
    await screen.findByText('Acer Liquid');

    // Buscar el input
    const searchInput = screen.getByPlaceholderText(/Buscar marca o modelo/i);
    
    // Simular que el usuario escribe "Sam"
    fireEvent.change(searchInput, { target: { value: 'Sam' } });

    // "Samsung Galaxy" debería seguir ahí
    expect(screen.getByText('Samsung Galaxy')).toBeInTheDocument();

    // "Acer Liquid" debería haber desaparecido
    expect(screen.queryByText('Acer Liquid')).not.toBeInTheDocument();
  });
});