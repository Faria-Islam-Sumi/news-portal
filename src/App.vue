<template>
  <div id="app" class="dark">
    <div class="sidebar">
      <div class="sidebar-header">
        <router-link class="navbar-brand" to="/">News Portal</router-link>
      </div>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item" v-if="user">
          <router-link class="nav-link" to="/create">Create News</router-link>
        </li>
        <li class="nav-item" v-if="!user">
          <router-link class="nav-link" to="/login">Login</router-link>
        </li>
        <li class="nav-item" v-if="user">
          <a class="nav-link" href="#" @click="logout">Logout</a>
        </li>
      </ul>
    </div>
    <div class="main-content">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item" v-if="user">
                <span class="navbar-text me-2">Logged in as: {{ user.name }}</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="container-fluid mt-4">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, logout } from './app.js';

export default {
  data() {
    return {
      user: null
    };
  },
  created() {
    this.user = getCurrentUser();
  },
  methods: {
    logout() {
      logout();
      this.user = null;
      this.$router.push('/login');
    }
  }
};
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';

#app {
  display: flex;
  min-height: 100vh;
}

.dark {
  background-color: #121212;
  color: #fff;
}

.sidebar {
  width: 250px;
  background-color: #1f1f1f;
  padding: 20px;
}

.sidebar-header {
  margin-bottom: 20px;
}

.sidebar .navbar-brand {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
}

.sidebar .nav-link {
  color: #ccc;
}

.sidebar .nav-link:hover {
  color: #fff;
}

.main-content {
  flex: 1;
}

.navbar {
  background-color: #1f1f1f !important;
}

.navbar-text {
  color: #ccc;
}
</style>
