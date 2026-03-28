/* ============================================================
   VOLTHIVE — api.js
   Base API URL and fetch helper
   ============================================================ */

   const API = 'http://localhost:3000/api';

   // ── Auth header helper ────────────────────────────────────────
   function authHeaders() {
     const user = getCurrentUser();
     return {
       'Content-Type': 'application/json',
       'Authorization': user ? `Bearer ${user.token}` : ''
     };
   }
   
   async function apiFetch(endpoint, options = {}) {
    try {
      const res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
          ...authHeaders(),
          ...(options.headers || {})
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err) {
      throw err;
    }
  }
   