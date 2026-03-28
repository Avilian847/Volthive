/* ============================================================
   VOLTHIVE — auth.js
   Login, register, form validation, session management
   ============================================================ */

   const AUTH_KEY = 'volthive_user';

   // ── Get current user ─────────────────────────────────────────
   function getCurrentUser() {
     try { return JSON.parse(localStorage.getItem(AUTH_KEY)); }
     catch { return null; }
   }
   
   // ── Save user session ────────────────────────────────────────
   function saveUserSession(user) {
     localStorage.setItem(AUTH_KEY, JSON.stringify(user));
     return user;
   }
   
   // ── Clear session ─────────────────────────────────────────────
   function logout() {
     localStorage.removeItem(AUTH_KEY);
     showToast('Logged out successfully', 'info');
     setTimeout(() => window.location.href = 'index.html', 800);
   }
   
   // ── Update nav for logged-in state ────────────────────────────
   function updateNavAuthState() {
     const user = getCurrentUser();
     const profileBtn = document.getElementById('profileBtn');
     const loginLink = document.getElementById('loginLink');
   
     if (profileBtn) {
       if (user) {
         profileBtn.title = user.name;
         profileBtn.textContent = '👤';
         profileBtn.onclick = () => window.location.href = 'profile.html';
       } else {
         profileBtn.onclick = () => window.location.href = 'login.html';
       }
     }
   
     if (loginLink) {
       if (user) {
         loginLink.textContent = user.name.split(' ')[0];
         loginLink.href = 'profile.html';
       }
     }
   }
   
   updateNavAuthState();
   
   // ── Validation Helpers ────────────────────────────────────────
   const validators = {
     name: val => val.trim().length >= 2
       ? null
       : 'Name must be at least 2 characters',
   
     email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
       ? null
       : 'Please enter a valid email address',
   
     password: val => val.length >= 8
       ? null
       : 'Password must be at least 8 characters',
   
     confirmPassword: (val, form) => val === form.querySelector('#registerPassword')?.value
       ? null
       : 'Passwords do not match',
   
     phone: val => !val || /^\+?[\d\s\-().]{7,}$/.test(val)
       ? null
       : 'Enter a valid phone number',
   
     required: val => val.trim().length > 0
       ? null
       : 'This field is required'
   };
   
   function showFieldError(inputEl, message) {
     inputEl.classList.add('error');
     let err = inputEl.parentElement.querySelector('.form-error');
     if (!err) {
       err = document.createElement('div');
       err.className = 'form-error';
       inputEl.parentElement.appendChild(err);
     }
     err.textContent = message;
   }
   
   function clearFieldError(inputEl) {
     inputEl.classList.remove('error');
     const err = inputEl.parentElement.querySelector('.form-error');
     if (err) err.remove();
   }
   
   function validateField(inputEl, validatorKey, form) {
     const error = validators[validatorKey]?.(inputEl.value, form);
     if (error) { showFieldError(inputEl, error); return false; }
     clearFieldError(inputEl);
     return true;
   }
   
   // ── Attach real-time validation ───────────────────────────────
   function attachLiveValidation(form) {
     const rules = {
       '#loginEmail':        'email',
       '#loginPassword':     'password',
       '#registerName':      'name',
       '#registerEmail':     'email',
       '#registerPassword':  'password',
       '#confirmPassword':   'confirmPassword'
     };
   
     Object.entries(rules).forEach(([selector, rule]) => {
       const el = form.querySelector(selector);
       if (el) {
         el.addEventListener('blur', () => validateField(el, rule, form));
         el.addEventListener('input', () => clearFieldError(el));
       }
     });
   }
   
   // ── LOGIN FORM ────────────────────────────────────────────────
   const loginForm = document.getElementById('loginForm');
   if (loginForm) {
     attachLiveValidation(loginForm);
   
     const emailInput    = document.getElementById('loginEmail');
     const passwordInput = document.getElementById('loginPassword');
     const submitBtn     = document.getElementById('loginSubmit');
   
     loginForm.addEventListener('submit', async (e) => {
       e.preventDefault();
   
       let valid = true;
       valid = validateField(emailInput, 'email') && valid;
       valid = validateField(passwordInput, 'password') && valid;
       if (!valid) return;
   
       submitBtn.disabled = true;
       submitBtn.textContent = 'Signing in...';
   
       try {
         const data = await apiFetch('/auth/login', {
           method: 'POST',
           body: JSON.stringify({
             email: emailInput.value.trim(),
             password: passwordInput.value
           })
         });
   
         saveUserSession({ ...data.user, token: data.token });
         showToast(`Welcome back, ${data.user.name.split(' ')[0]}! 👋`, 'success');
         setTimeout(() => {
           window.location.href = localStorage.getItem('volthive_redirect') || 'index.html';
           localStorage.removeItem('volthive_redirect');
         }, 800);
   
       } catch (err) {
         showToast(err.message || 'Invalid email or password', 'error');
         submitBtn.disabled = false;
         submitBtn.textContent = 'Sign In';
         passwordInput.value = '';
       }
     });
   }
   
   // ── REGISTER FORM ─────────────────────────────────────────────
   const registerForm = document.getElementById('registerForm');
   if (registerForm) {
     attachLiveValidation(registerForm);
   
     const firstNameInput = document.getElementById('registerFirstName');
     const lastNameInput  = document.getElementById('registerLastName');
     const emailInput    = document.getElementById('registerEmail');
     const passwordInput = document.getElementById('registerPassword');
     const confirmInput  = document.getElementById('confirmPassword');
     const submitBtn     = document.getElementById('registerSubmit');
   
     registerForm.addEventListener('submit', async (e) => {
       e.preventDefault();
   
       let valid = true;
       valid = validateField(firstNameInput, 'name') && valid;
       valid = validateField(lastNameInput, 'name') && valid;
       valid = validateField(emailInput, 'email') && valid;
       valid = validateField(passwordInput, 'password') && valid;
       if (confirmInput) {
         valid = validateField(confirmInput, 'confirmPassword', registerForm) && valid;
       }
       if (!valid) return;
   
       submitBtn.disabled = true;
       submitBtn.textContent = 'Creating account...';
   
       try {
         const data = await apiFetch('/auth/register', {
           method: 'POST',
           body: JSON.stringify({
            name: `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`,
             email: emailInput.value.trim(),
             password: passwordInput.value
           })
         });
   
         saveUserSession({ ...data.user, token: data.token });
         showToast(`Account created! Welcome, ${data.user.name.split(' ')[0]}! 🎉`, 'success');
         setTimeout(() => window.location.href = 'index.html', 800);
   
       } catch (err) {
         showToast(err.message || 'Registration failed', 'error');
         submitBtn.disabled = false;
         submitBtn.textContent = 'Create Account';
       }
     });
   }
   
   // ── Password Visibility Toggle ────────────────────────────────
   document.querySelectorAll('.toggle-eye').forEach(btn => {
     btn.addEventListener('click', () => {
       const input = btn.previousElementSibling;
       if (!input) return;
       const isText = input.type === 'text';
       input.type = isText ? 'password' : 'text';
       btn.textContent = isText ? '👁️' : '🙈';
     });
   });
   
   // ── Logout buttons ────────────────────────────────────────────
   document.querySelectorAll('.logout-btn').forEach(btn => {
     btn.addEventListener('click', logout);
   });
   
   // ── Protect pages that require auth ──────────────────────────
   function requireAuth() {
     const user = getCurrentUser();
     if (!user) {
       localStorage.setItem('volthive_redirect', window.location.href);
       window.location.href = 'login.html';
     }
     return user;
   }
   
   // ── CHECKOUT FORM ─────────────────────────────────────────────
   const checkoutForm = document.getElementById('checkoutForm');
   if (checkoutForm) {
     const requiredFields = checkoutForm.querySelectorAll('[required]');
   
     checkoutForm.addEventListener('submit', async (e) => {
       e.preventDefault();
   
       let valid = true;
       requiredFields.forEach(field => {
         if (!field.value.trim()) {
           showFieldError(field, 'This field is required');
           valid = false;
         } else {
           clearFieldError(field);
         }
       });
   
       const emailField = document.getElementById('checkoutEmail');
       if (emailField && emailField.value) {
         const emailErr = validators.email(emailField.value);
         if (emailErr) { showFieldError(emailField, emailErr); valid = false; }
       }
   
       if (!valid) {
         showToast('Please fill in all required fields', 'error');
         return;
       }
   
       const placeBtn = document.getElementById('placeOrderBtn');
       if (placeBtn) {
         placeBtn.disabled = true;
         placeBtn.textContent = 'Processing...';
       }
   
       try {
         const cart = getCart();
         const summary = JSON.parse(localStorage.getItem('volthive_checkout_summary') || '{}');
         const user = getCurrentUser();
   
         const items = cart.map(item => ({
           product_id: item.id,
           quantity: item.qty,
           price: item.price
         }));
   
         const data = await apiFetch('/orders', {
           method: 'POST',
           body: JSON.stringify({
             name: `${document.getElementById('checkoutFirstName')?.value} ${document.getElementById('checkoutLastName')?.value}`,
             email: document.getElementById('checkoutEmail')?.value,
             total: summary.total || 0,
             items
           })
         });
   
         // Trigger M-Pesa STK Push
         const phone = document.getElementById('checkoutPhone')?.value;
         if (phone) {
           await apiFetch('/orders/mpesa/stk', {
             method: 'POST',
             body: JSON.stringify({
               phone,
               amount: summary.total,
               orderId: data.order.id
             })
           });
           showToast('Check your phone for M-Pesa PIN prompt', 'info');
         }
   
         saveCart([]);
   
         localStorage.setItem('volthive_last_order', JSON.stringify({
           orderId: `VH-${data.order.id}`,
           email: data.order.email,
           name: data.order.name,
           total: data.order.total
         }));
   
         window.location.href = 'confirmation.html';
   
       } catch (err) {
         showToast(err.message || 'Order failed. Please try again.', 'error');
         if (placeBtn) {
           placeBtn.disabled = false;
           placeBtn.textContent = 'Place Order';
         }
       }
     });
   
     document.querySelectorAll('.payment-method').forEach(btn => {
       btn.addEventListener('click', () => {
         document.querySelectorAll('.payment-method').forEach(b => b.classList.remove('active'));
         btn.classList.add('active');
         const cardFields = document.getElementById('cardFields');
         if (cardFields) {
           cardFields.classList.toggle('hidden', btn.dataset.method !== 'card');
         }
       });
     });
   }
   
   // ── PROFILE PAGE ──────────────────────────────────────────────
   const profilePage = document.getElementById('profilePage');
   if (profilePage) {
     const user = requireAuth();
     if (user) {
       const setEl = (id, val) => {
         const el = document.getElementById(id);
         if (el) el.textContent = val;
       };
   
       setEl('profileName', user.name);
       setEl('profileEmail', user.email);
       setEl('profileInitials', user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase());
       setEl('profileDisplayName', user.name);
       setEl('profileDisplayEmail', user.email);
       setEl('profileJoined', user.joined || 'N/A');
   
       const nameInput  = document.getElementById('profileNameInput');
       const emailInput = document.getElementById('profileEmailInput');
       if (nameInput)  nameInput.value  = user.name;
       if (emailInput) emailInput.value = user.email;
   
       // Load orders from API
       apiFetch('/orders').then(orders => {
         const ordersTableBody = document.getElementById('ordersTableBody');
         if (ordersTableBody) {
           if (orders.length === 0) {
             ordersTableBody.innerHTML = `
               <tr>
                 <td colspan="5" style="text-align:center;color:var(--text-2);padding:2rem">
                   No orders yet. <a href="products.html" style="color:var(--accent)">Start shopping!</a>
                 </td>
               </tr>`;
           } else {
             ordersTableBody.innerHTML = orders.map(order => `
               <tr>
                 <td><span style="color:var(--accent);font-weight:600">VH-${order.id}</span></td>
                 <td>${new Date(order.created_at).toLocaleDateString()}</td>
                 <td>${order.items.length} item${order.items.length !== 1 ? 's' : ''}</td>
                 <td style="font-family:var(--font-display);font-weight:700">${formatPrice(parseFloat(order.total))}</td>
                 <td><span class="badge badge-${order.status === 'Delivered' ? 'success' : 'warning'}">${order.status}</span></td>
               </tr>
             `).join('');
           }
         }
       }).catch(() => {});
   
       document.querySelectorAll('.profile-nav__item').forEach(item => {
         item.addEventListener('click', () => {
           document.querySelectorAll('.profile-nav__item').forEach(i => i.classList.remove('active'));
           item.classList.add('active');
           const tab = item.dataset.tab;
           document.querySelectorAll('.profile-tab').forEach(t => {
             t.classList.toggle('hidden', t.dataset.tab !== tab);
           });
         });
       });
   
       const saveProfileBtn = document.getElementById('saveProfile');
       if (saveProfileBtn) {
         saveProfileBtn.addEventListener('click', () => {
           const newName = document.getElementById('profileNameInput')?.value.trim();
           if (newName && newName.length >= 2) {
             const updated = { ...user, name: newName };
             saveUserSession(updated);
             setEl('profileName', newName);
             setEl('profileDisplayName', newName);
             setEl('profileInitials', newName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase());
             showToast('Profile updated!', 'success');
           } else {
             showToast('Name must be at least 2 characters', 'error');
           }
         });
       }
     }
   }