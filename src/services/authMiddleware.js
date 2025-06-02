const VITE_ENV = import.meta.env.VITE_API_URL;
const BASE_URL = `${VITE_ENV}/auth`;

export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const text = await response.text();
    console.log('[registerUser] Réponse brute:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('[registerUser] Réponse non-JSON:', text);
      throw new Error(`Réponse non-JSON du serveur : ${text}`);
    }

    if (!response.ok) {
      console.error('[registerUser] Erreur backend:', data.message);
      throw new Error(data.message || 'Erreur à l’inscription');
    }

    console.log('[registerUser] Succès:', data);
    return data;
  } catch (error) {
    console.error('[registerUser] Erreur lors de l’inscription:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    console.log('[loginUser] Réponse brute:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('[loginUser] Réponse non-JSON:', text);
      throw new Error(`Réponse non-JSON du serveur : ${text}`);
    }

    if (!response.ok) {
      console.error('[loginUser] Erreur backend:', data.message);
      throw new Error(data.message || 'Erreur à la connexion');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    console.log('[loginUser] Succès:', data);
    return data;
  } catch (error) {
    console.error('[loginUser] Erreur lors de la connexion:', error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await response.text();
    console.log('[getUser] Réponse brute:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('[getUser] Réponse non-JSON:', text);
      throw new Error(`Réponse non-JSON du serveur : ${text}`);
    }

    if (!response.ok) {
      console.error('[getUser] Erreur backend:', data.message);
      throw new Error(data.message || 'Erreur de récupération utilisateur');
    }

    console.log('[getUser] Succès:', data);
    return data;
  } catch (error) {
    console.error('[getUser] Erreur lors de la récupération utilisateur:', error);
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  console.log('[logoutUser] Token supprimé');
};
