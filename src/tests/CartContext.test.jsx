import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartProvider } from '../context/CartProvider';
import { useCart } from '../context/CartContext';

const TestComponent = () => {
  const { cartCount, addCount } = useCart();

  return (
    <div>
      <span data-testid="count-value">{cartCount}</span>
      <button onClick={() => addCount(1)}>Add 1</button>
      <button onClick={() => addCount(5)}>Add 5</button>
    </div>
  );
};

describe('CartContext & Provider', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Provee un valor inicial de 0 (si localStorage está vacío)', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('count-value')).toHaveTextContent('0');
  });

  it('Lee el valor inicial desde localStorage si existe', () => {
    localStorage.setItem('cartCount', '5');

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('count-value')).toHaveTextContent('5');
  });

  it('Actualiza el estado y el localStorage al añadir productos', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('count-value')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('Add 1'));
    
    expect(screen.getByTestId('count-value')).toHaveTextContent('1');
    
    await waitFor(() => {
      expect(localStorage.getItem('cartCount')).toBe('1');
    });

    fireEvent.click(screen.getByText('Add 5'));
    expect(screen.getByTestId('count-value')).toHaveTextContent('6');
    
    await waitFor(() => {
      expect(localStorage.getItem('cartCount')).toBe('6');
    });
  });

  it('Lanza un error si useCart se usa fuera del CartProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useCart debe usarse dentro de un CartProvider'
    );

    consoleSpy.mockRestore();
  });
});