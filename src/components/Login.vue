
<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="text-center mb-4">News Portal</h2>
      <div v-if="showLogin">
        <h3 class="text-center mb-3">Login</h3>
        <form @submit.prevent="login">
          <div class="form-group mb-3">
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" v-model="email" required />
          </div>
          <div class="form-group mb-4">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <p class="text-center mt-3">
          Don't have an account? <a href="#" @click="showLogin = false">Sign up</a>
        </p>
      </div>
      <div v-else>
        <h3 class="text-center mb-3">Sign Up</h3>
        <form @submit.prevent="signup">
          <div class="form-group mb-3">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" v-model="name" required />
          </div>
          <div class="form-group mb-3">
            <label for="signup-email">Email</label>
            <input type="email" class="form-control" id="signup-email" v-model="email" required />
          </div>
          <div class="form-group mb-4">
            <label for="signup-password">Password</label>
            <input type="password" class="form-control" id="signup-password" v-model="password" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Sign Up</button>
        </form>
        <p class="text-center mt-3">
          Already have an account? <a href="#" @click="showLogin = true">Login</a>
        </p>
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
      name: ''
    };
  },
  methods: {
    async login() {
      try {
        await login(this.email, this.password);
        this.$router.push(this.$route.query.redirect || '/');
      } catch (error) {
        alert(error.message);
      }
    },
    async signup() {
      try {
        await signup(this.name, this.email, this.password);
        this.showLogin = true;
      } catch (error) {
        alert(error.message);
      }
    }
  }
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
}

.login-box {
  width: 400px;
  padding: 40px;
  background-color: #1f1f1f;
  border-radius: 10px;
}

.login-box h2 {
  color: #fff;
}

.login-box h3 {
  color: #fff;
}

.login-box label {
  color: #ccc;
}

.login-box .form-control {
  background-color: #2c2c2c;
  border: 1px solid #444;
  color: #fff;
}

.login-box .btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.login-box a {
  color: #007bff;
}
</style>
