import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LazyImage from '../components/LazyImage';

describe('LazyImage Component', () => {
  it('Muestra el atributo loading="lazy" en la imagen', () => {
    render(<LazyImage src="test.jpg" alt="Test" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('Tiene la clase "loaded" solo después de cargar', () => {
    render(<LazyImage src="test.jpg" alt="Test" />);
    const img = screen.getByRole('img');

    expect(img).not.toHaveClass('loaded');

    fireEvent.load(img);
    expect(img).toHaveClass('loaded');
  });
});