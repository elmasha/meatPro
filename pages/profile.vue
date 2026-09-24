<template>
  <div class="d-flex bg-grey-lighten-4 dashboard-root" style="min-height: 100vh;">
    <!-- Desktop Sidebar -->
    <v-navigation-drawer
      v-if="!nav_bars"
      permanent
      width="280"
      class="elevation-2 sidebar-modern"
      color="white"
    >
      <div class="pa-6 pb-4">
        <div class="d-flex align-center cursor-pointer" @click="$router.push('/dashboard')">
          <v-avatar color="red darken-2" size="44" class="mr-3">
            <v-icon color="white" size="22">mdi-food-steak</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold red--text text--darken-2">MeatPro</div>
            <div class="text-caption grey--text text--darken-1 text-truncate" style="max-width: 160px">
              {{ shopName }}
            </div>
          </div>
        </div>
      </div>

      <v-divider class="mx-4 mb-2" />

      <v-list dense nav class="px-3 py-2">
        <v-list-item
          v-for="(item, idx) in menuItems"
          :key="item.title"
          :to="item.to"
          link
          class="mb-1 rounded-xl nav-item-modern"
          active-class="red lighten-5 red--text text--darken-2"
          :style="{ 'animation-delay': idx * 50 + 'ms' }"
        >
          <v-list-item-icon class="mr-3">
            <v-icon color="grey darken-1">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium text-body-2">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4 pb-6">
          <v-btn
            block
            outlined
            color="grey darken-1"
            class="rounded-xl text-capitalize"
            @click="logout"
          >
            <v-icon left size="18">mdi-logout</v-icon> Sign Out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main :class="nav_bars ? 'pb-16' : ''" class="main-modern">
      <!-- Sticky Header -->
      <div class="sticky-header px-4 px-sm-6 py-3">
        <v-container fluid class="pa-0">
          <v-row align="center" no-gutters>
            <v-col cols="12">
              <div class="d-flex align-center">
                <v-btn v-if="nav_bars" icon small class="mr-2" @click="mobileDrawer = true">
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
                <v-btn v-else icon small class="mr-3" to="/dashboard">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <div>
                  <h1 class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                    Account
                  </h1>
                  <div class="text-caption grey--text text--darken-1">
                    Your profile, subscription, and branch
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8 profile-container">

        <!-- ① YOUR ACCOUNT -->
        <v-card class="rounded-xl mb-4 account-card" elevation="0" outlined>
          <v-card-text class="pa-5 pa-sm-6">
            <div class="d-flex align-center flex-wrap flex-sm-nowrap">
              <!-- Avatar -->
              <v-avatar color="red darken-2" size="72" class="mr-4 mb-3 mb-sm-0 account-avatar">
                <span class="white--text text-h5 font-weight-bold">{{ userInitials }}</span>
              </v-avatar>

              <!-- Identity -->
              <div class="flex-grow-1 min-w-0">
                <div class="text-h6 font-weight-bold grey--text text--darken-3 mb-1">
                  {{ userName }}
                </div>
                <div class="text-body-2 grey--text text--darken-1 mb-2">
                  {{ userEmail }}
                </div>
                <div class="d-flex flex-wrap align-center">
                  <v-chip
                    x-small
                    :color="isOwner ? 'red lighten-5' : 'blue lighten-5'"
                    :text-color="isOwner ? 'red darken-2' : 'blue darken-2'"
                    label
                    class="font-weight-bold mr-2 mb-1"
                  >
                    <v-icon x-small left>
                      {{ isOwner ? 'mdi-account-star' : 'mdi-account-tie' }}
                    </v-icon>
                    {{ userRole }}
                  </v-chip>
                  <v-chip
                    x-small
                    color="grey lighten-4"
                    text-color="grey darken-2"
                    label
                    class="font-weight-medium mr-2 mb-1"
                  >
                    {{ stats.totalEntries }} entries
                  </v-chip>
                  <v-chip
                    x-small
                    color="grey lighten-4"
                    text-color="grey darken-2"
                    label
                    class="font-weight-medium mb-1"
                  >
                    {{ stats.daysActive }} days active
                  </v-chip>
                </div>
              </div>

              <!-- Sign Out -->
              <div class="ml-sm-4 mt-3 mt-sm-0">
                <v-btn
                  outlined
                  small
                  color="grey darken-2"
                  class="rounded-lg text-capitalize font-weight-medium"
                  @click="logout"
                >
                  <v-icon left small>mdi-logout</v-icon>
                  Sign Out
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ② SUBSCRIPTION -->
        <v-card class="rounded-xl mb-4" elevation="0" outlined :class="subCardClass">
          <v-card-text class="pa-5 pa-sm-6">
            <div class="d-flex align-center justify-space-between flex-wrap">
              <div class="d-flex align-center flex-grow-1 mb-3 mb-sm-0">
                <v-avatar
                  :color="currentSub?.is_active ? 'green lighten-5' : 'orange lighten-5'"
                  size="52"
                  class="mr-4"
                >
                  <v-icon
                    :color="currentSub?.is_active ? 'green darken-2' : 'orange darken-3'"
                    size="26"
                  >
                    {{ currentSub?.is_active ? 'mdi-crown' : 'mdi-alert-circle' }}
                  </v-icon>
                </v-avatar>
                <div>
                  <div class="d-flex align-center mb-1">
                    <span class="text-h6 font-weight-bold grey--text text--darken-3 mr-2">
                      {{ currentSub?.subscription?.display_name || 'Starter' }}
                    </span>
                    <v-chip
                      x-small
                      :color="currentSub?.is_active ? 'green lighten-5' : 'orange lighten-5'"
                      :text-color="currentSub?.is_active ? 'green darken-2' : 'orange darken-3'"
                      label
                      class="font-weight-bold"
                    >
                      {{ currentSub?.is_active ? 'ACTIVE' : 'INACTIVE' }}
                    </v-chip>
                  </div>
                  <div class="text-body-2 grey--text text--darken-1">
                    <span v-if="currentSub?.is_active">
                      Renews on {{ formatDate(currentSub.subscription.end_date) }}
                      · <strong>{{ currentSub.days_remaining }} days left</strong>
                    </span>
                    <span v-else-if="currentSub?.subscription?.status === 'cancelled'">
                      Cancelled — access ends {{ formatDate(currentSub.subscription.end_date) }}
                    </span>
                    <span v-else>
                      No active subscription. Activate a plan to unlock all features.
                    </span>
                  </div>
                </div>
              </div>
              <!-- Owner sees Manage/Activate; manager sees a passive note -->
              <v-btn
                v-if="isOwner"
                :color="currentSub?.is_active ? 'grey darken-2' : 'red darken-2'"
                :outlined="currentSub?.is_active"
                :depressed="!currentSub?.is_active"
                :dark="!currentSub?.is_active"
                class="rounded-lg text-capitalize font-weight-bold"
                to="/subscription"
              >
                <v-icon left small>mdi-crown</v-icon>
                {{ currentSub?.is_active ? 'Manage Plan' : 'Activate Plan' }}
              </v-btn>
              <div v-else class="text-caption grey--text text--darken-1 mt-2 mt-sm-0">
                <v-icon x-small class="mr-1">mdi-information-outline</v-icon>
                Managed by your business owner
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- ③ BRANCH -->
        <v-card class="rounded-xl mb-4" elevation="0" outlined>
          <v-card-text class="pa-5 pa-sm-6">
            <!-- Header with owner-only "Manage Branches" action -->
            <div class="d-flex align-center justify-space-between mb-4 flex-wrap">
              <div class="d-flex align-center">
                <v-avatar color="blue lighten-5" size="40" class="mr-3">
                  <v-icon color="blue darken-2" size="22">mdi-store</v-icon>
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-bold grey--text text--darken-3">
                    {{ branches.length > 1 ? 'Your Branches' : 'Your Branch' }}
                  </div>
                  <div class="text-caption grey--text text--darken-1">
                    {{ branches.length > 1 ? 'Tap a branch to view details' : 'Business details' }}
                  </div>
                </div>
              </div>
              <v-btn
                v-if="isOwner"
                text
                small
                color="red darken-2"
                class="text-capitalize font-weight-medium rounded-lg mt-2 mt-sm-0"
                to="/setupbranch"
              >
                <v-icon left small>mdi-cog</v-icon>
                Manage Branches
              </v-btn>
            </div>

            <!-- Branch selector (only if multiple) -->
            <div v-if="branches.length > 1" class="mb-4">
              <div class="d-flex flex-wrap" style="gap: 8px;">
                <v-chip
                  v-for="(item, i) in branches"
                  :key="i"
                  large
                  :color="branchId === item.id ? 'red darken-2' : 'grey lighten-4'"
                  :text-color="branchId === item.id ? 'white' : 'grey darken-2'"
                  class="rounded-lg font-weight-medium branch-chip"
                  @click="selectBranch(item)"
                >
                  <v-icon
                    left
                    small
                    :color="branchId === item.id ? 'white' : 'grey darken-2'"
                  >
                    {{ branchId === item.id ? 'mdi-check-circle' : 'mdi-store-outline' }}
                  </v-icon>
                  {{ item.name }}
                </v-chip>
              </div>
            </div>

            <!-- Branch details -->
            <v-divider class="my-4" />

            <v-row dense>
              <v-col cols="6" sm="3">
                <div class="detail-label">Branch Name</div>
                <div class="detail-value">{{ branch.name || '—' }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="detail-label">Business</div>
                <div class="detail-value">{{ branch.business_name || '—' }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="detail-label">Location</div>
                <div class="detail-value">{{ branch.location || '—' }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="detail-label">Phone</div>
                <div class="detail-value">{{ branch.phone || '—' }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ④ PAYMENT HISTORY (owner only) -->
        <v-card v-if="isOwner" class="rounded-xl" elevation="0" outlined>
          <v-card-text class="pa-5 pa-sm-6">
            <div class="d-flex align-center justify-space-between mb-4 flex-wrap">
              <div class="d-flex align-center">
                <v-avatar color="green lighten-5" size="40" class="mr-3">
                  <v-icon color="green darken-2" size="22">mdi-receipt-text</v-icon>
                </v-avatar>
                <div>
                  <div class="text-h6 font-weight-bold grey--text text--darken-3">
                    Payment History
                  </div>
                  <div class="text-caption grey--text text--darken-1">
                    Recent M-Pesa transactions
                  </div>
                </div>
              </div>
              <div v-if="payments.length > 0" class="text-caption grey--text mt-2 mt-sm-0">
                {{ payments.length }} {{ payments.length === 1 ? 'payment' : 'payments' }}
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-if="payments.length === 0"
              class="text-center py-8"
            >
              <v-icon size="48" color="grey lighten-2" class="mb-2">
                mdi-receipt-text-off
              </v-icon>
              <div class="text-body-2 grey--text">
                No payments yet
              </div>
            </div>

            <!-- Payment list -->
            <div v-else class="payment-list">
              <div
                v-for="(item, i) in payments"
                :key="i"
                class="payment-row"
              >
                <div class="d-flex align-center flex-grow-1 min-w-0">
                  <v-avatar
                    :color="item.status === 'success' ? 'green lighten-5' : 'grey lighten-4'"
                    size="40"
                    class="mr-3"
                  >
                    <v-icon
                      :color="item.status === 'success' ? 'green darken-2' : 'grey darken-2'"
                      size="20"
                    >
                      {{ item.status === 'success' ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                    </v-icon>
                  </v-avatar>
                  <div class="min-w-0">
                    <div class="text-body-2 font-weight-bold grey--text text--darken-3">
                      KES {{ formatNumber(item.amount) }}
                    </div>
                    <div class="text-caption grey--text text--darken-1">
                      {{ formatDate(item.created_at) }}
                      <span v-if="item.mpesa_receipt"> · {{ item.mpesa_receipt }}</span>
                    </div>
                  </div>
                </div>
                <v-chip
                  x-small
                  :color="statusColor(item.status)"
                  text-color="white"
                  label
                  class="font-weight-bold flex-shrink-0"
                >
                  {{ item.status }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>

      </v-container>
    </v-main>

    <!-- Mobile Bottom Nav -->
    <v-bottom-navigation
      v-if="nav_bars"
      v-model="bottomNav"
      color="red darken-2"
      grow
      fixed
      class="elevation-8 bottom-nav-modern"
      style="z-index: 100"
    >
      <v-btn to="/dashboard">
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/reports">
        <span>Reports</span>
        <v-icon>mdi-chart-line</v-icon>
      </v-btn>
      <v-btn to="/profile">
        <span>Profile</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn @click="logout">
        <span>Exit</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <!-- Mobile Drawer -->
    <v-navigation-drawer
      v-model="mobileDrawer"
      temporary
      right
      width="280"
      class="mobile-drawer-modern"
    >
      <div class="pa-6">
        <div class="d-flex align-center mb-8">
          <v-avatar color="red darken-2" size="36" class="mr-3">
            <v-icon color="white" size="20">mdi-food-steak</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold red--text text--darken-2">MeatPro</div>
            <div class="text-caption grey--text">{{ shopName }}</div>
          </div>
        </div>
        <v-list dense class="pa-0">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="item.to"
            class="rounded-xl mb-1"
            active-class="red lighten-5 red--text"
          >
            <v-list-item-icon class="mr-3">
              <v-icon color="grey darken-1">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-body-2 font-weight-medium">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-divider class="my-4" />
        <v-btn
          block
          outlined
          color="grey darken-1"
          class="rounded-xl text-capitalize"
          @click="logout"
        >
          <v-icon left size="18">mdi-logout</v-icon> Sign Out
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      bottom
      rounded="pill"
      class="mb-6 snackbar-modern"
      elevation="6"
    >
      <div class="d-flex align-center">
        <v-avatar
          :color="snackbar.color === 'success' ? 'green darken-2' : 'red darken-2'"
          size="28"
          class="mr-3"
        >
          <v-icon color="white" small>
            {{ snackbar.color === 'success' ? 'mdi-check' : 'mdi-alert' }}
          </v-icon>
        </v-avatar>
        <span class="font-weight-medium">{{ snackbar.text }}</span>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
          class="text-capitalize font-weight-bold white--text"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import moment from 'moment'
import numeral from 'numeral'
import apiClient from '../services/api'

export default {
  name: 'Profile',

  data() {
    return {
      nav_bars: false,
      mobileDrawer: false,
      bottomNav: 2,
      loading: false,
      user: null,
      shopName: 'Prime Cuts - CBD',
      branchId: 1,
      branches: [],
      branch: {
        name: '',
        business_name: '',
        location: '',
        phone: '',
      },

      // ── Role state ────────────────────────────────────────────
      role: null,                  // 'owner' | 'manager' | 'none'
      isOwner: false,

      stats: {
        totalEntries: 0,
        daysActive: 0,
      },

      currentSub: null,
      payments: [],

      menuItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
        { title: 'Reports', icon: 'mdi-chart-line', to: '/reports' },
        { title: 'Profile', icon: 'mdi-account', to: '/profile' },
      ],

      snackbar: { show: false, text: '', color: 'success' },
      authUnsubscribe: null,
    }
  },

  computed: {
    userName() {
      return this.user?.displayName || 'Manager'
    },
    userEmail() {
      return this.user?.email || 'manager@meatpro.co.ke'
    },
    userInitials() {
      return this.userName.substring(0, 2).toUpperCase()
    },
    userRole() {
      if (this.isOwner) return 'Business Owner'
      if (this.role === 'manager') return 'Branch Manager'
      return 'Staff'
    },
    subCardClass() {
      if (!this.currentSub) return ''
      return this.currentSub.is_active ? 'sub-active' : 'sub-inactive'
    },
  },

  methods: {
    formatNumber(val) {
      return numeral(val || 0).format('0,0')
    },

    formatDate(date) {
      return date ? moment(date).format('MMM D, YYYY') : 'N/A'
    },

    statusColor(status) {
      return { pending: 'orange', success: 'green', failed: 'red' }[status] || 'grey'
    },

    selectBranch(item) {
      this.branchId = item.id
      this.branch = item
    },

    async apiCall(method, endpoint, data = null) {
      try {
        const response = await apiClient.request({ method, url: endpoint, data })
        return response.data
      } catch (error) {
        const msg = error.response?.data?.message || error.message
        this.showSnackbar(msg, 'error')
        throw error
      }
    },

    async loadRole() {
      if (!this.user?.uid) return
      try {
        const { data } = await apiClient.get(`/users/me/role?firebase_uid=${this.user.uid}`)
        this.role = data.role || 'none'
        this.isOwner = this.role === 'owner'
      } catch (e) {
        console.warn('Role fetch failed — defaulting to none', e)
        this.role = 'none'
        this.isOwner = false
      }
    },

    async loadProfile() {
      try {
        const data = await this.apiCall(
          'get',
          `/branches/my?firebase_uid=${this.user.uid}`
        )
        this.branches = Object.freeze(data || [])
        this.branch = data[0] || this.branch
        if (data[0]) this.branchId = data[0].id

        if (data.branch) {
          this.branch = {
            name: data.name || 'Prime Cuts - CBD',
            business_name: data.business_name || 'MeatPro Ltd',
            location: data.location || 'Nairobi CBD',
            phone: data.phone || '+254 700 000000',
          }
        }

        this.stats = {
          totalEntries: data.stats?.totalEntries || 0,
          daysActive: data.stats?.daysActive || 0,
        }
      } catch (e) {
        console.error('Profile load error', e)
        this.branch = {
          name: 'Prime Cuts - CBD',
          business_name: 'MeatPro Ltd',
          location: 'Nairobi CBD',
          phone: '+254 700 000000',
        }
      }
    },

    async loadStatus() {
      if (!this.user?.uid) return
      try {
        const { data } = await apiClient.get(`/subscriptions/status?firebase_uid=${this.user.uid}`)
        this.currentSub = data
      } catch (e) {
        console.error('Status error', e)
      }
    },

    async loadPayments() {
      if (!this.user?.uid) return
      try {
        const { data } = await apiClient.get(`/subscriptions/history?firebase_uid=${this.user.uid}`)
        this.payments = data || []
      } catch (e) {
        console.error('Payments error', e)
        this.payments = []
      }
    },

    showSnackbar(text, color = 'success') {
      this.snackbar = { show: true, text, color }
    },

    onResize() {
      this.nav_bars = window.innerWidth < 768
    },

    logout() {
      this.$fire.auth.signOut()
      this.$router.push('/login')
    },
  },

  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
    this.authUnsubscribe = this.$fire.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        Promise.all([
          this.loadRole(),
          this.loadProfile(),
          this.loadStatus(),
          this.loadPayments(),
        ])
      } else {
        this.$router.push('/login')
      }
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
    if (this.authUnsubscribe) {
      this.authUnsubscribe()
    }
  },
}
</script>

<style scoped>
/* Base */
.bg-grey-lighten-4 { background-color: #f5f5f5 !important; }
.rounded-xl { border-radius: 16px !important; }
.min-w-0 { min-width: 0; }
.profile-container { max-width: 900px; margin: 0 auto; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

/* Sidebar */
.sidebar-modern { border-right: 1px solid #f0f0f0 !important; }
.nav-item-modern { transition: all 0.25s ease; margin-bottom: 4px; }
.nav-item-modern:hover { background-color: #fafafa; transform: translateX(4px); }

/* Sticky Header */
.main-modern { scroll-behavior: smooth; }
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 5;
  background: rgba(245, 245, 245, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}
@media (max-width: 599px) {
  .sticky-header {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: #f5f5f5 !important;
    border-bottom: 1px solid #eeeeee;
  }
}

/* Account card */
.account-card {
  border-color: #f0f0f0 !important;
  background: white;
}
.account-avatar {
  transition: all 0.25s ease;
}
.account-card:hover .account-avatar {
  transform: scale(1.05);
}

/* Subscription state styles */
.sub-active {
  border-color: #c8e6c9 !important;
  background: #f1f8f4;
}
.sub-inactive {
  border-color: #ffe0b2 !important;
  background: #fff8f0;
}

/* Branch chips */
.branch-chip {
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}
.branch-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
}

/* Detail grid (branch info) */
.detail-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
  margin-bottom: 4px;
}
.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  word-break: break-word;
}

/* Payment list */
.payment-list {
  display: flex;
  flex-direction: column;
}
.payment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.15s ease;
}
.payment-row:last-child { border-bottom: none; }
.payment-row:hover { background-color: #fafafa; }

/* Bottom Nav */
.bottom-nav-modern {
  border-radius: 20px 20px 0 0 !important;
  overflow: hidden;
}

/* Mobile Drawer */
.mobile-drawer-modern { background: white !important; }

/* Snackbar */
.snackbar-modern ::v-deep .v-snackbar__content { padding: 12px 20px; }

/* Responsive */
@media (max-width: 599px) {
  .sticky-header { padding-left: 12px; padding-right: 12px; }
  .account-avatar {
    width: 60px !important;
    height: 60px !important;
    min-width: 60px !important;
  }
  .payment-row { padding: 10px 0; }
}
</style>