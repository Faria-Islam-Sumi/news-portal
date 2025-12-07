<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-4xl font-bold text-white mb-2">
          {{ showLogin ? 'Welcome Back' : 'Create Account' }}
        </h2>
        <p class="text-gray-400">
          {{ showLogin ? 'Sign in to your account' : 'Join our news community' }}
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
        {{ errorMessage }}
      </div>

      <!-- Login Form -->
      <div v-if="showLogin" class="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-700">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Don't have an account?
            <button @click="showLogin = false; errorMessage = ''" class="text-blue-500 hover:text-blue-400 font-medium ml-1">
              Sign up
            </button>
          </p>
        </div>
      </div>

      <!-- Signup Form -->
      <div v-else class="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-700">
        <form @submit.prevent="handleSignup" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              v-model="name"
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label for="signup-email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="signup-email"
              v-model="email"
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label for="signup-password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="signup-password"
              v-model="password"
              required
              minlength="6"
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
            <p class="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Already have an account?
            <button @click="showLogin = true; errorMessage = ''" class="text-blue-500 hover:text-blue-400 font-medium ml-1">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, signup } from '../app.js';

export default {
  data() {
    return {
      showLogin: true,
      email: '',
      password: '',
      name: '',
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';
      try {
        await login(this.email, this.password);
        this.$router.push(this.$route.query.redirect || '/');
      } catch (error) {
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
      } finally {
        this.loading = false;
      }
    },
    async handleSignup() {
      this.loading = true;
      this.errorMessage = '';
      try {
        await signup(this.name, this.email, this.password);
        this.errorMessage = '';
        this.showLogin = true;
        this.password = '';
        // Show success message
        alert('Account created successfully! Please log in.');
      } catch (error) {
        this.errorMessage = error.message || 'Signup failed. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
