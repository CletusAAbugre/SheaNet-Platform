// auth.js - Combined implementation
class AuthUI {
    constructor() {
      this.token = localStorage.getItem('sheaToken');
      this.user = JSON.parse(localStorage.getItem('sheaUser'));
    }
  
    updateUI() {
      const authMenu = document.getElementById('authMenu');
      const authIcon = document.getElementById('authIcon');
      
      if (!authMenu) return;
  
      if (this.token && this.user) {
        // User is logged in
        authMenu.innerHTML = `
          <li><h6 class="dropdown-header">Signed in as</h6></li>
          <li><span class="dropdown-item-text">${this.user.name}</span></li>
          <li><span class="dropdown-item-text text-muted small">${this.user.role}</span></li>
          <li><hr class="dropdown-divider"></li>
          ${this.user.role === 'seller' ? 
            '<li><a class="dropdown-item" href="seller-dashboard.html"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>' : 
            '<li><a class="dropdown-item" href="profile.html"><i class="fas fa-user me-2"></i>Profile</a></li>'}
          <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
        `;
        
        if (authIcon) {
          authIcon.classList.add('text-success');
        }
        
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
        });
      } else {
        // User is not logged in
        authMenu.innerHTML = `
          <li><a class="dropdown-item" href="login.html"><i class="fas fa-sign-in-alt me-2"></i>Login</a></li>
          <li><a class="dropdown-item" href="login.html?register=true"><i class="fas fa-user-plus me-2"></i>Register</a></li>
        `;
        if (authIcon) {
          authIcon.classList.remove('text-success');
        }
      }
    }
  
    logout() {
      localStorage.removeItem('sheaToken');
      localStorage.removeItem('sheaUser');
      window.location.href = 'index.html';
    }
  
    protectRoutes() {
      const protectedRoutes = {
        'seller-dashboard.html': 'seller',
        'profile.html': ['seller', 'buyer']
      };
  
      const currentPage = window.location.pathname.split('/').pop();
      
      if (protectedRoutes[currentPage]) {
        const allowedRoles = Array.isArray(protectedRoutes[currentPage]) 
          ? protectedRoutes[currentPage] 
          : [protectedRoutes[currentPage]];
        
        if (!this.token || !allowedRoles.includes(this.user?.role)) {
          window.location.href = 'login.html';
        }
      }
    }
  }
  
  // Initialize when page loads
  document.addEventListener('DOMContentLoaded', () => {
    const authUI = new AuthUI();
    authUI.updateUI();
    authUI.protectRoutes();
  });