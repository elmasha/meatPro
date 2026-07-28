<template>
  <div class="auth-page">
    <!-- Ambient Background -->
    <div class="ambient-bg">
      <div class="orb orb-red"></div>
      <div class="orb orb-orange"></div>
      <div class="orb orb-pink"></div>
      <div class="noise-overlay"></div>
    </div>

    <v-container class="fill-height d-flex align-center justify-center relative z-10">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          
          <!-- Header -->
          <div class="text-center mb-8 logo-reveal">
            <div class="logo-glow mb-4 d-inline-block">
              <v-avatar color="red darken-2" size="64" class="elevation-6">
                <v-icon color="white" size="32">mdi-food-steak</v-icon>
              </v-avatar>
            </div>
            <h1 class="text-h4 font-weight-black white--text tracking-tight">Add Your Branch</h1>
            <p class="text-subtitle-2 grey--text text--lighten-1 mt-2">Set up your shop location</p>
          </div>

          <!-- Glass Card -->
          <v-card class="glass-card rounded-3xl overflow-hidden" elevation="0">
            <div class="pa-6 pa-sm-8">
              <div class="d-flex align-center mb-6">
                <v-avatar color="red darken-2" size="40" class="mr-3">
                  <v-icon color="white">mdi-map-marker</v-icon>
                </v-avatar>
                <div>
                  <h2 class="text-h6 font-weight-bold white--text">Branch Details</h2>
                  <p class="text-caption grey--text">Where is your shop located?</p>
                </div>
              </div>

              <v-text-field
                v-model="branch.name"
                label="Branch Name"
                placeholder="e.g. CBD Shop"
                outlined
                dark
                color="red"
                background-color="rgba(255,255,255,0.03)"
                class="modern-input rounded-xl mb-4"
                prepend-inner-icon="mdi-source-branch"
                :rules="[v => !!v || 'Required']"
                :disabled="!isPro"
              />
              <v-text-field
                v-model="branch.location"
                label="Location"
                placeholder="e.g. Nairobi CBD, Moi Avenue"
                outlined
                dark
                color="red"
                background-color="rgba(255,255,255,0.03)"
                class="modern-input rounded-xl mb-6"
                prepend-inner-icon="mdi-map-marker"
                :rules="[v => !!v || 'Required']"
                :disabled="!isPro"
              />

              <v-btn
                block
                x-large
                color="red darken-2"
                dark
                class="rounded-xl text-capitalize font-weight-bold elevation-4 hover-lift"
                :loading="loading"
                :disabled="!isPro || !businessId"
                @click="createBranch"
              >
                Create Branch
                <v-icon right>mdi-check-circle</v-icon>
              </v-btn>

              <v-alert
                v-if="profileLoaded && !isPro"
                type="warning"
                text
                dense
                class="mt-4 rounded-xl"
                color="orange"
              >
                Branch creation requires a Pro subscription.
                <v-btn text small color="orange" class="ml-2" @click="$router.push('/subscription')">
                  Upgrade
                </v-btn>
              </v-alert>

              <v-alert
                v-if="profileLoaded && isPro && !businessId"
                type="warning"
                text
                dense
                class="mt-4 rounded-xl"
                color="orange"
              >
                No business found. Please create a business first.
              </v-alert>
            </div>
          </v-card>

          <!-- Skip -->
          <div class="text-center mt-6">
            <v-btn text small color="grey darken-1" class="text-capitalize rounded-lg" @click="skipSetup">
              Skip for now
            </v-btn>
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
  name: 'SetupBranch',
  
  data() {
    return {
      loading: false,
      uid: null,
      businessId: null,
      isPro: false,
      profileLoaded: false,
      branches: [], // <-- Added: stores existing branches
      branch: { name: '', location: '' },
      snackbar: { show: false, text: '', color: 'success' },
      authUnsubscribe: null
    }
  },

  methods: {
    async loadBranches() {
      try {
        if (!this.uid) return
        const { data } = await api.get(`/branches/my?firebase_uid=${this.uid}`)
        this.branches = data || []
        console.log('Branches loaded:', this.branches)
      } catch (e) {
        console.error('Branches load error:', e)
        this.branches = []
      }
    },

    checkDuplicateBranch() {
      const nameLower = this.branch.name.trim().toLowerCase()
      const locationLower = this.branch.location.trim().toLowerCase()

      return this.branches.find(b => {
        const existingName = (b.name || '').toLowerCase()
        const existingLocation = (b.location || '').toLowerCase()
        return existingName === nameLower || existingLocation === locationLower
      })
    },

    async loadUserProfile() {
      try {
        if (!this.uid) return
        const { data } = await api.get(`/users/${this.uid}/profile`)
        
        // Check Pro subscription status
        if (data.subscription_status === 'pro' || data.subscription === 'pro') {
          this.isPro = true
        } else {
          this.isPro = false
          this.$router.push('/subscription')
          return
        }

        // Load business_id only if Pro
        if (data.business_id) {
          this.businessId = data.business_id
        }

        // Load existing branches after profile is confirmed Pro
        await this.loadBranches()
      } catch (e) {
        console.error('Profile load error:', e)
      } finally {
        this.profileLoaded = true
      }
    },

    showSnackbar(text, color = 'success') {
      this.snackbar = { show: true, text, color }
    },

    async createBranch() {
      if (!this.branch.name || !this.branch.location) {
        this.showSnackbar('Please fill all fields', 'warning')
        return
      }
      if (!this.businessId) {
        this.showSnackbar('No business found. Cannot create branch.', 'error')
        return
      }
      if (!this.isPro) {
        this.showSnackbar('Pro subscription required to create branches', 'error')
        return
      }

      // Check for duplicates
      const duplicate = this.checkDuplicateBranch()
      if (duplicate) {
        this.showSnackbar(
          `A branch already exists with name "${duplicate.name}" or location "${duplicate.location}"`,
          'error'
        )
        return
      }

      this.loading = true
      try {
        await api.post('/branches', {
          business_id: this.businessId,
          name: this.branch.name,
          location: this.branch.location,
          firebase_uid: this.uid
        })
        this.showSnackbar('Branch created! Redirecting...')
        setTimeout(() => this.$router.push('/dashboard'), 1200)
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'Failed to create branch', 'error')
      } finally {
        this.loading = false
      }
    },

    skipSetup() {
      this.$router.push('/dashboard')
    }
  },

  mounted() {
    this.authUnsubscribe = this.$fire.auth.onAuthStateChanged(user => {
      if (!user) {
        this.$router.push('/login')
      } else {
        this.uid = user.uid
        this.loadUserProfile()
      }
    })
  },

  beforeDestroy() {
    if (this.authUnsubscribe) {
      this.authUnsubscribe()
    }
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

/* Ambient Background */
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
  opacity: 0.35;
  animation: float 20s infinite ease-in-out;
}

.orb-red {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #d32f2f 0%, transparent 70%);
  top: -10%;
  right: -10%;
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

/* Button */
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

.rounded-3xl {
  border-radius: 24px !important;
}

.rounded-xl {
  border-radius: 16px !important;
}
</style>