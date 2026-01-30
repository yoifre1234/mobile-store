import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';
// Importamos el hook desde el archivo de definición (CartContext.js)
import { useCart } from '../context/CartContext';

// --- MOCKING ---
// Le decimos a Vitest: "Intercepta las llamadas a este archivo"
vi.mock('../context/CartContext', () => ({
  useCart: vi.fn(), // Reemplazamos useCart con una función espía vacía
}));

describe('Header Component', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Renderiza el título y los breadcrumbs base en la Home', () => {
    // 1. Configuramos el Mock: Simulamos que el carrito tiene 0 items
    vi.mocked(useCart).mockReturnValue({ cartCount: 0 });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>
    );

    // Assertions
    expect(screen.getByText('MobileStore')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    // En la home NO debe aparecer "Detalle"
    expect(screen.queryByText('Detalle')).not.toBeInTheDocument();
  });

  it('Muestra el breadcrumb de "Detalle" cuando no estamos en la Home', () => {
    vi.mocked(useCart).mockReturnValue({ cartCount: 0 });

    render(
      <MemoryRouter initialEntries={['/product/1']}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Detalle')).toBeInTheDocument();
  });

  it('Muestra el número correcto de items en el carrito', () => {
    // 1. Configuramos el Mock: Simulamos que el carrito tiene 5 items
    vi.mocked(useCart).mockReturnValue({ cartCount: 5 });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // Buscamos el texto "5" dentro del icono del carrito
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});