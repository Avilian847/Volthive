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
   
   // ── API fetch helper ──────────────────────────────────────────
   async function apiFetch(endpoint, options = {}) {
     try {
       const res = await fetch(`${API}${endpoint}`, {
         headers: authHeaders(),
         ...options
       });
       const data = await res.json();
       if (!res.ok) throw new Error(data.error || 'Request failed');
       return data;
     } catch (err) {
       throw err;
     }
   }