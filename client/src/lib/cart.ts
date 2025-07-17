export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const getCartCount = (): number => {
  const count = localStorage.getItem('cartCount');
  return count ? parseInt(count) : 0;
};

export const setCartCount = (count: number): void => {
  localStorage.setItem('cartCount', count.toString());
};
