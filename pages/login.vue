<<template>
  <div class="auth-page">
    <!-- Animated Background -->
    <div class="ambient-bg">
      <div class="orb orb-red"></div>
      <div class="orb orb-orange"></div>
      <div class="orb orb-pink"></div>
      <div class="noise-overlay"></div>
    </div>

    <v-container class="fill-height d-flex align-center justify-center relative z-10">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          
          <!-- Logo -->
          <div class="text-center mb-8 logo-reveal">
            <div class="logo-glow mb-4 d-inline-block">
              <v-avatar color="red darken-2" size="80" class="elevation-8">
                <v-icon color="white" size="40">mdi-food-steak</v-icon>
              </v-avatar>
            </div>
            <h1 class="text-h3 font-weight-black white--text tracking-tight">MeatPro</h1>
            <p class="text-subtitle-2 grey--text text--lighten-1 mt-2 font-weight-medium">Meat Business Management</p>
          </div>

          <!-- Glass Auth Card -->
          <v-card class="glass-card rounded-3xl overflow-hidden" elevation="0">
            <!-- Tabs -->
            <div class="tab-header d-flex">
              <button
                v-for="(tab, i) in ['Sign In', 'Register']"
                :key="i"
                class="tab-btn flex-grow-1 py-4 text-body-2 font-weight-bold text-uppercase tracking-wide"
                :class="{ 'tab-active': authMode === i, 'tab-inactive': authMode !== i }"
                @click="authMode = i"
              >
                {{ tab }}
              </button>
              <div class="tab-indicator" :style="{ transform: `translateX(${authMode * 100}%)` }"></div>
            </div>

            <v-progress-linear v-if="loading" indeterminate color="red" height="2" />

            <div class="pa-6 pa-sm-8">
              <!-- Login Form -->
              <v-scroll-x-transition mode="out-in">
                <v-form v-if="authMode === 0" key="login" ref="loginForm" v-model="loginValid" lazy-validation>
                  <v-text-field
                    v-model="login.email"
                    label="Email Address"
                    type="email"
                    outlined
                    dark
                    color="red"
                    background-color="rgba(255,255,255,0.03)"
                    class="modern-input rounded-xl mb-4"
                    prepend-inner-icon="mdi-email-outline"
                    :rules="[v => !!v || 'Required', v => /.+@.+\..+/.test(v) || 'Invalid email']"
                    @keyup.enter="handleLogin"
                  />
                  <v-text-field
                    v-model="login.password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dark
                    color="red"
                    background-color="rgba(255,255,255,0.03)"
                    class="modern-input rounded-xl mb-6"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="[v => !!v || 'Required', v => v.length >= 6 || 'Min 6 chars']"
                    @click:append="showPassword = !showPassword"
                    @keyup.enter="handleLogin"
                  />
                  
                  <v-btn
                    block
                    x-large
                    color="red darken-2"
                    dark
                    class="rounded-xl text-capitalize font-weight-bold elevation-4 hover-lift"
                    :loading="loading"
                    :disabled="!loginValid"
                    @click="handleLogin"
                  >
                    <v-icon left>mdi-arrow-right-circle</v-icon>
                    Sign In
                  </v-btn>
                </v-form>

                <!-- Register Form -->
                <v-form v-else key="register" ref="registerForm" v-model="registerValid" lazy-validation>
                  <v-text-field
                    v-model="register.name"
                    label="Full Name"
                    outlined
                    dark
                    color="red"
                    background-color="rgba(255,255,255,0.03)"
                    class="modern-input rounded-xl mb-3"
                    prepend-inner-icon="mdi-account-outline"
                    :rules="[v => !!v || 'Required']"
                  />
                  <v-text-field
                    v-model="register.email"
                    label="Email Address"
                    type="email"
                    outlined
                    dark
                    color="red"
                    background-color="rgba(255,255,255,0.03)"
                    class="modern-input rounded-xl mb-3"
                    prepend-inner-icon="mdi-email-outline"
                    :rules="[v => !!v || 'Required', v => /.+@.+\..+/.test(v) || 'Invalid email']"
                  />
                  <v-text-field
                    v-model="register.phone"
                    label="Phone (2547XXXXXXXX)"
                    outlined
                    dark
                    color="red"
                    background-color="rgba(255,255,255,0.03)"
                    class="modern-input rounded-xl mb-3"
                    prepend-inner-icon="mdi-phone-outline"
                    :rules="[v => !!v || 'Required', v => /^254\d{9}$/.test(v) || 'Format: 254712345678']"
                  />
                  <v-text-field
                    v-model="register.password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dark
                    color="red"
                    background-color="rgba(255,255,255,0.03)"
                    class="modern-input rounded-xl mb-3"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :rules="[v => !!v || 'Required', v => v.length >= 6 || 'Min 6 chars']"
                    @click:append="showPassword = !showPassword"
                  />
                  <v-text-field
                    v-model="register.confirmPassword"
                    label="Confirm Password"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dark
                    color="red"
                    background-color="rgba(255,255,255,0.03)"
                    class="modern-input rounded-xl mb-6"
                    prepend-inner-icon="mdi-lock-check-outline"
                    :rules="[v => !!v || 'Required', v => v === register.password || 'Passwords do not match']"
                  />
                  
                  <v-btn
                    block
                    x-large
                    color="red darken-2"
                    dark
                    class="rounded-xl text-capitalize font-weight-bold elevation-4 hover-lift"
                    :loading="loading"
                    :disabled="!registerValid"
                    @click="handleRegister"
                  >
                    <v-icon left>mdi-account-plus</v-icon>
                    Create Account
                  </v-btn>
                </v-form>
              </v-scroll-x-transition>
            </div>
          </v-card>

          <!-- Footer -->
          <div class="text-center mt-8">
            <p class="text-caption grey--text text--darken-1">
              By continuing, you agree to our <span class="red--text cursor-pointer">Terms</span> & <span class="red--text cursor-pointer">Privacy</span>
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" bottom rounded="lg" class="mb-4">
      <div class="d-flex align-center">
        <v-icon left small>{{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  layout: 'public',
  name: 'Login',
  
  data() {
    return {
      authMode: 0,
      loading: false,
      showPassword: false,
      loginValid: false,
      registerValid: false,
      login: { email: '', password: '' },
      register: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
      snackbar: { show: false, text: '', color: 'success' }
    }
  },

  methods: {
    showSnackbar(text, color = 'success') {
      this.snackbar = { show: true, text, color }
    },

    async handleLogin() {
      if (!this.$refs.loginForm.validate()) return
      this.loading = true
      try {
        const { user } = await this.$fire.auth.signInWithEmailAndPassword(this.login.email, this.login.password)
        await this.syncUser(user)
        this.showSnackbar('Welcome back!')
        this.checkBusinessAndRedirect(user.uid)
      } catch (error) {
        this.showSnackbar(this.getError(error.code), 'error')
      } finally {
        this.loading = false
      }
    },

    async handleRegister() {
      if (!this.$refs.registerForm.validate()) return
      this.loading = true
      try {
        const { user } = await this.$fire.auth.createUserWithEmailAndPassword(this.register.email, this.register.password)
        await user.updateProfile({ displayName: this.register.name })
        await this.syncUser(user, { name: this.register.name, phone: this.register.phone })
        this.showSnackbar('Account created!')
        this.$router.push('/setup')
      } catch (error) {
        this.showSnackbar(this.getError(error.code), 'error')
      } finally {
        this.loading = false
      }
    },

    async syncUser(user, extra = {}) {
      try {
        await api.post('/users/sync', {
          firebase_uid: user.uid,
          name: user.displayName || extra.name || 'User',
          email: user.email || extra.email || null,
          phone: user.phoneNumber || extra.phone || null
        })
      } catch (e) {
        console.error('Sync error:', e)
      }
    },

    async checkBusinessAndRedirect(uid) {
      try {
        const { data } = await api.get(`/users/${uid}/profile`)
        this.$router.push(data.business_id ? '/dashboard' : '/setup')
      } catch {
        this.$router.push('/setup')
      }
    },

    getError(code) {
      const errors = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'This email is already registered',
        'auth/weak-password': 'Password must be at least 6 characters'
      }
      return errors[code] || 'Authentication failed. Please try again.'
    }
  },

  mounted() {
    this.$fire.auth.onAuthStateChanged(user => {
      if (user) this.checkBusinessAndRedirect(user.uid)
    })
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #0a0a0f;
  position: relative;
  overflow: hidden;
}

/* Animated Ambient Background */
.ambient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  animation: float 20s infinite ease-in-out;
}

.orb-red {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #d32f2f 0%, transparent 70%);
  top: -10%;
  right: -10%;
  animation-delay: 0s;
}

.orb-orange {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #ff6f00 0%, transparent 70%);
  bottom: -10%;
  left: -10%;
  animation-delay: -7s;
}

.orb-pink {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #c2185b 0%, transparent 70%);
  top: 40%;
  left: 30%;
  animation-delay: -14s;
  opacity: 0.2;
}

.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Glass Card */
.glass-card {
  background: rgba(20, 20, 30, 0.6) !important;
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 
              0 0 0 1px rgba(255, 255, 255, 0.02) inset;
}

/* Logo */
.logo-glow {
  position: relative;
}

.logo-glow::before {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(211, 47, 47, 0.4) 0%, transparent 70%);
  animation: pulse-glow 3s infinite ease-in-out;
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 0.3; }
}

.logo-reveal {
  animation: fade-up 0.8s ease-out;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Modern Tabs */
.tab-header {
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.tab-active {
  color: white;
}

.tab-inactive {
  color: rgba(255, 255, 255, 0.4);
}

.tab-inactive:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.02);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, #d32f2f, #ff5252);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 10px rgba(211, 47, 47, 0.5);
}

/* Modern Inputs */
.modern-input >>> .v-input__slot {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
}

.modern-input >>> .v-input__slot:hover {
  border-color: rgba(255, 255, 255, 0.15) !important;
  background: rgba(255, 255, 255, 0.05) !important;
}

.modern-input.v-input--is-focused >>> .v-input__slot {
  border-color: rgba(211, 47, 47, 0.6) !important;
  background: rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.modern-input >>> .v-label {
  color: rgba(255, 255, 255, 0.4) !important;
}

.modern-input >>> .v-icon {
  color: rgba(255, 255, 255, 0.3) !important;
}

.modern-input.v-input--is-focused >>> .v-icon {
  color: rgba(211, 47, 47, 0.8) !important;
}

/* Button Hover */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(211, 47, 47, 0.4) !important;
}

/* Utilities */
.z-10 {
  position: relative;
  z-index: 10;
}

.tracking-tight {
  letter-spacing: -0.02em;
}

.cursor-pointer {
  cursor: pointer;
}

.rounded-3xl {
  border-radius: 24px !important;
}
</style>