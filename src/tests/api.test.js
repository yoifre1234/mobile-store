import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProducts, getProductDetail, addToCart } from '../services/api';

// Definimos un Mock global para fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('API Service', () => {
  
  // Limpiamos el historial del mock antes de cada test
  beforeEach(() => {
    fetchMock.mockClear();
  });

  // Aseguramos que limpiamos todo al terminar
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('Debe retornar la lista de productos si la respuesta es OK', async () => {
      // 1. Simulamos una respuesta exitosa
      const mockData = [{ id: '1', model: 'Test' }];
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      // 2. Ejecutamos la función
      const result = await getProducts();

      // 3. Verificamos
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('https://itx-frontend-test.onrender.com/api/product');
    });

    it('Debe lanzar un error si la respuesta NO es OK', async () => {
      // 1. Simulamos un error del servidor (ej. 500)
      fetchMock.mockResolvedValue({
        ok: false,
      });

      // 2. Verificamos que lance la excepción
      await expect(getProducts()).rejects.toThrow('Error fetching products');
    });
  });

  describe('getProductDetail', () => {
    it('Debe retornar el detalle y llamar a la URL con el ID correcto', async () => {
      const mockDetail = { id: '123', model: 'Detalle' };
      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDetail),
      });

      const result = await getProductDetail('123');

      expect(result).toEqual(mockDetail);
      // Verificamos que la URL incluyó el ID
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/product/123'));
    });

    it('Debe lanzar error si falla la petición', async () => {
      fetchMock.mockResolvedValue({ ok: false });
      await expect(getProductDetail('999')).rejects.toThrow('Error fetching details');
    });
  });

  describe('addToCart', () => {
    it('Debe retornar el JSON si el status es 200', async () => {
      const mockResponse = { count: 1 };
      
      // Simulamos respuesta de éxito estricta (status 200)
      fetchMock.mockResolvedValue({
        status: 200, // Tu código verifica esto explícitamente
        json: () => Promise.resolve(mockResponse),
      });

      const dataToSend = { id: '1', colorCode: '1', storageCode: '2' };
      const result = await addToCart(dataToSend);

      expect(result).toEqual(mockResponse);
      
      // Verificamos que se envió como POST y con el body correcto
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cart'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(dataToSend),
        })
      );
    });

    it('Debe lanzar error si el status NO es 200 (aunque fetch no falle)', async () => {
      // Simulamos un caso raro donde no explota, pero devuelve un 201 o 400
      fetchMock.mockResolvedValue({
        status: 400, // Status diferente a 200
        json: () => Promise.resolve({}),
      });

      await expect(addToCart({})).rejects.toThrow('Error al añadir al carrito');
    });
  });
});