<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin">
        <input type="email" v-model="email" placeholder="Admin Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit" class="login-btn">Secure Login</button>
      </form>
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { supabase } from './supabase'

export default {
  data() {
    return { email: '', password: '', error: '' }
  },
  methods: {
    async handleLogin() {
      this.error = '';
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });
      if (error) {
        this.error = error.message;
      } else {
        this.$router.push('/admin');
      }
    }
  }
}
</script>

<style scoped>
.login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #faf8f3; }
.login-card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(58,125,68,0.1); width: 100%; max-width: 400px; text-align: center; }
.login-card h2 { margin-bottom: 24px; color: #1a2310; font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 700; }
input { width: 100%; padding: 14px; margin-bottom: 16px; border: 1px solid #dde8d5; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 15px; }
input:focus { outline: none; border-color: #3a7d44; }
.login-btn { width: 100%; padding: 14px; background: #3a7d44; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: 0.3s; }
.login-btn:hover { background: #2a5a31; }
.error-msg { color: #d32f2f; margin-top: 16px; font-size: 14px; }
</style>
