const BASE_URL = 'https://itx-frontend-test.onrender.com/api';

export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/product`);
  if (!response.ok) throw new Error('Error fetching products');
  return response.json();
};

export const getProductDetail = async (id) => {
  const response = await fetch(`${BASE_URL}/product/${id}`);
  if (!response.ok) throw new Error('Error fetching details');
  return response.json();
};

export const addToCart = async (data) => {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  // AQUÍ: Verificamos estrictamente que sea un 200 OK
  if (response.status !== 200) {
    throw new Error('Error al añadir al carrito');
  }

  return response.json();
};