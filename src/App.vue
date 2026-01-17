<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Navigation Bar -->
    <nav class="bg-gray-900/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span class="text-2xl font-bold text-white">News Portal</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <router-link to="/" class="text-gray-300 hover:text-white transition-colors">
              Home
            </router-link>
            <router-link v-if="user" to="/create" class="text-gray-300 hover:text-white transition-colors">
              Create News
            </router-link>
            
            <div v-if="user" class="flex items-center space-x-4">
              <span class="text-gray-400">Welcome, <span class="text-white font-semibold">{{ user.name }}</span></span>
              <button @click="handleLogout" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                Logout
              </button>
            </div>
            <router-link v-else to="/login" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Login
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-700">
          <router-link to="/" class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded">
            Home
          </router-link>
          <router-link v-if="user" to="/create" class="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded">
            Create News
          </router-link>
          <div v-if="user" class="px-4 py-2">
            <span class="text-gray-400 text-sm">Logged in as: <span class="text-white">{{ user.name }}</span></span>
            <button @click="handleLogout" class="mt-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Logout
            </button>
          </div>
          <router-link v-else to="/login" class="block mx-4 mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center">
            Login
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>

    <!-- Toast Notification -->
    <div v-if="notification" class="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div :class="[
        'px-6 py-4 rounded-lg shadow-lg',
        notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
      ]">
        <p class="text-white font-medium">{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, logout } from './app.js';

export default {
  data() {
    return {
      user: null,
      mobileMenuOpen: false,
      notification: null
    };
  },
  created() {
    this.user = getCurrentUser();
    // Listen for user changes
    window.addEventListener('user-updated', () => {
      this.user = getCurrentUser();
    });
  },
  methods: {
    handleLogout() {
      logout();
      this.user = null;
      this.$router.push('/login');
      this.showNotification('Logged out successfully', 'success');
    },
    showNotification(message, type = 'success') {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    }
  }
};
</script>

<style>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
