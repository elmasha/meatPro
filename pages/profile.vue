<<template>
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
        <div class="d-flex align-center">
          <div class="logo-container mr-3">
            <v-avatar color="red darken-2" size="44">
              <v-icon color="white" size="22">mdi-food-steak</v-icon>
            </v-avatar>
          </div>
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
            <v-list-item-title class="font-weight-medium text-body-2">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4 pb-6">
          <v-card class="rounded-xl pa-3 red lighten-5" elevation="0">
            <div class="d-flex align-center mb-2">
              <v-icon color="red" small>mdi-headset</v-icon>
              <span class="text-caption font-weight-bold red--text ml-2">Need Help?</span>
            </div>
            <div class="text-caption grey--text text--darken-1 mb-2">
              WhatsApp support available
            </div>
            <v-btn block small text color="red" class="text-capitalize rounded-lg">
              Contact Us
            </v-btn>
          </v-card>
          <v-btn
            block
            outlined
            color="grey darken-1"
            class="rounded-xl text-capitalize mt-3"
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
            <v-col cols="8" sm="6">
              <div class="d-flex align-center">
                <v-btn v-if="nav_bars" icon small class="mr-2" @click="mobileDrawer = true">
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
                <v-btn v-else icon small class="mr-3" to="/">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <div>
                  <h1 class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                    Profile & Settings
                  </h1>
                  <div class="d-flex align-center mt-1">
                    <v-icon x-small color="grey" class="mr-1">mdi-store</v-icon>
                    <span class="text-caption grey--text text--darken-1"
                      >Manage your business</span
                    >
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <!-- User Profile + Branch Info -->
        <v-row class="mb-4 mb-sm-6">
          <!-- User Profile Card -->
          <v-col cols="12" md="4" class="reveal-card" style="animation-delay: 0ms">
            <v-card class="rounded-xl pa-6 text-center h-100 profile-card-modern" elevation="1">
              <div class="avatar-wrapper-modern mb-4">
                <v-avatar color="red darken-2" size="110" class="elevation-4 profile-avatar">
                  <span class="white--text text-h3 font-weight-bold">{{ userInitials }}</span>
                </v-avatar>
                <div class="online-indicator"></div>
              </div>
              <div class="text-h6 font-weight-bold grey--text text--darken-3 mb-1">
                {{ userName }}
              </div>
              <div class="text-body-2 grey--text mb-1">{{ userEmail }}</div>
              <div class="text-body-2 grey--text text--darken-1 mb-3 font-weight-medium">
                {{ branch.business_name }}
              </div>
              <v-chip
                small
                color="red lighten-5"
                text-color="red darken-2"
                label
                class="font-weight-bold mb-4"
              >
                {{ userRole }}
              </v-chip>

              <v-divider class="my-4" />

              <div class="d-flex justify-space-around">
                <div class="text-center stat-item-modern">
                  <div class="text-h5 font-weight-bold grey--text text--darken-2">
                    {{ stats.totalEntries }}
                  </div>
                  <div class="text-caption grey--text text--darken-1">Entries</div>
                </div>
                <v-divider vertical class="mx-2" />
                <div class="text-center stat-item-modern">
                  <div class="text-h5 font-weight-bold grey--text text--darken-2">
                    {{ stats.daysActive }}
                  </div>
                  <div class="text-caption grey--text text--darken-1">Days Active</div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Branch Info + Prices -->
          <v-col cols="12" md="8">
            <!-- Branch Selector -->
            <v-card class="rounded-xl mb-4 reveal-card" elevation="1" style="animation-delay: 100ms">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="red lighten-5" size="36" class="mr-3">
                    <v-icon color="red">mdi-store</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Select Branch
                    </div>
                    <div class="text-caption grey--text">Switch between your locations</div>
                  </div>
                </div>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <v-chip-group
                  v-model="branchId"
                  column
                  active-class="red darken-2 white--text"
                  class="branch-chips-modern"
                >
                  <v-chip
                    v-for="(item, i) in branches"
                    :key="i"
                    large
                    class="rounded-xl px-4 branch-chip-modern"
                    :value="item.id"
                    @click="branch = item"
                    filter
                  >
                    <v-icon color="red darken-2" class="mr-2">mdi-store</v-icon>
                    <span class="font-weight-medium">{{ item.name }}</span>
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>

            <!-- Branch Information -->
            <v-card class="rounded-xl mb-4 reveal-card" elevation="1" style="animation-delay: 200ms">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="blue lighten-5" size="36" class="mr-3">
                    <v-icon color="blue">mdi-office-building</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Branch Information
                    </div>
                    <div class="text-caption grey--text">Your business details</div>
                  </div>
                </div>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="branch.name"
                      label="Branch Name"
                      outlined
                      rounded
                      dense
                      readonly
                      filled
                      class="rounded-lg"
                      prepend-inner-icon="mdi-store-marker"
                      hide-details
                      background-color="grey lighten-4"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="branch.business_name"
                      label="Business Name"
                      outlined
                      rounded
                      dense
                      readonly
                      filled
                      class="rounded-lg"
                      prepend-inner-icon="mdi-office-building"
                      hide-details
                      background-color="grey lighten-4"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="branch.location"
                      label="Location"
                      outlined
                      rounded
                      dense
                      readonly
                      filled
                      class="rounded-lg"
                      prepend-inner-icon="mdi-map-marker"
                      hide-details
                      background-color="grey lighten-4"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="branch.phone"
                      label="Phone"
                      outlined
                      rounded
                      dense
                      readonly
                      filled
                      class="rounded-lg"
                      prepend-inner-icon="mdi-phone"
                      hide-details
                      background-color="grey lighten-4"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Default Prices -->
            <v-card class="rounded-xl reveal-card" elevation="1" style="animation-delay: 300ms">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="green lighten-5" size="36" class="mr-3">
                    <v-icon color="green">mdi-cash</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Default Prices
                    </div>
                    <div class="text-caption grey--text">Auto-fill values for daily entries</div>
                  </div>
                </div>
                <v-spacer />
                <v-btn
                  small
                  text
                  color="red darken-2"
                  class="text-capitalize font-weight-medium rounded-lg"
                  @click="editingPrices = !editingPrices"
                >
                  <v-icon left small>{{
                    editingPrices ? 'mdi-close' : 'mdi-pencil'
                  }}</v-icon>
                  {{ editingPrices ? 'Cancel' : 'Edit' }}
                </v-btn>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <v-row dense align="end">
                  <v-col cols="12" sm="5">
                    <v-text-field
                      v-model="prices.cost_per_kg"
                      label="Cost per kg"
                      prefix="KES"
                      type="number"
                      outlined
                      rounded
                      dense
                      :readonly="!editingPrices"
                      :filled="!editingPrices"
                      :background-color="!editingPrices ? 'grey lighten-4' : 'white'"
                      class="rounded-lg"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="5">
                    <v-text-field
                      v-model="prices.selling_price_per_kg"
                      label="Selling Price per kg"
                      prefix="KES"
                      type="number"
                      outlined
                      rounded
                      dense
                      :readonly="!editingPrices"
                      :filled="!editingPrices"
                      :background-color="!editingPrices ? 'grey lighten-4' : 'white'"
                      class="rounded-lg"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-btn
                      v-if="editingPrices"
                      block
                      color="red darken-2"
                      dark
                      depressed
                      class="rounded-xl text-capitalize font-weight-bold"
                      @click="savePrices"
                      :loading="saving"
                      height="40"
                    >
                      Save
                    </v-btn>
                  </v-col>
                </v-row>
                <div class="text-caption grey--text mt-3 d-flex align-center">
                  <v-icon x-small color="grey" class="mr-1">mdi-information</v-icon>
                  These prices auto-fill when closing a new day. Update when market prices change.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-row class="mb-4 mb-sm-6 reveal-card" style="animation-delay: 400ms">
          <v-col cols="12">
            <h3 class="text-h6 font-weight-bold grey--text text--darken-2 mb-4">
              Quick Actions
            </h3>
            <v-row dense>
              <v-col
                v-for="(action, i) in quickActions"
                :key="i"
                cols="6"
                sm="4"
                md="3"
              >
                <v-hover v-slot="{ hover }">
                  <v-card
                    class="rounded-xl pa-4 text-center h-100 action-card-modern"
                    elevation="1"
                    :class="{ 'elevation-6': hover }"
                    :style="hover ? 'transform: translateY(-4px)' : ''"
                    @click="action.click"
                  >
                    <v-avatar :color="action.color" size="52" class="mb-3 elevation-2 action-avatar">
                      <v-icon color="white" size="26">{{ action.icon }}</v-icon>
                    </v-avatar>
                    <div class="text-body-2 font-weight-bold grey--text text--darken-2 mb-1">
                      {{ action.title }}
                    </div>
                    <div class="text-caption grey--text">{{ action.subtitle }}</div>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Danger Zone -->
        <v-row class="reveal-card" style="animation-delay: 500ms">
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1" color="red lighten-5">
              <v-card-title class="px-4 px-sm-6 py-4 red--text text--darken-2">
                <v-avatar color="red lighten-4" size="36" class="mr-3">
                  <v-icon color="red">mdi-alert</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold">Account</span>
              </v-card-title>
              <v-divider class="red lighten-3" />
              <v-card-text class="pa-4 pa-sm-6">
                <div class="d-flex align-center justify-space-between flex-wrap">
                  <div class="mb-2 mb-sm-0">
                    <div class="text-body-1 font-weight-bold grey--text text--darken-2">
                      Sign Out
                    </div>
                    <div class="text-caption grey--text">
                      Log out of MeatPro on this device
                    </div>
                  </div>
                  <v-btn
                    color="red darken-2"
                    dark
                    depressed
                    class="rounded-xl text-capitalize font-weight-bold px-6"
                    @click="logout"
                    height="44"
                  >
                    <v-icon left>mdi-logout</v-icon>
                    Sign Out
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
      <v-btn to="/">
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
            <v-list-item-title class="text-body-2 font-weight-medium">{{
              item.title
            }}</v-list-item-title>
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
          <v-icon color="white" small>{{
            snackbar.color === 'success' ? 'mdi-check' : 'mdi-alert'
          }}</v-icon>
        </v-avatar>
        <span class="font-weight-medium">{{ snackbar.text }}</span>
      </div>
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
          class="text-capitalize font-weight-bold white--text"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import moment from 'moment'
import numeral from 'numeral'
import axios from 'axios'
import apiClient from '../services/api'

export default {
  name: 'Profile',

  data() {
    return {
      nav_bars: false,
      mobileDrawer: false,
      bottomNav: 2,
      loading: false,
      saving: false,
      editingPrices: false,
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

      prices: {
        cost_per_kg: 420,
        selling_price_per_kg: 650,
      },

      stats: {
        totalEntries: 0,
        daysActive: 0,
      },

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
      return 'Store Manager'
    },
    quickActions() {
      return [
        {
          title: 'Dashboard',
          subtitle: 'View daily stats',
          icon: 'mdi-view-dashboard',
          color: 'red darken-2',
          click: () => this.$router.push('/'),
        },
        {
          title: 'Reports',
          subtitle: 'Analytics & trends',
          icon: 'mdi-chart-line',
          color: 'blue darken-2',
          click: () => this.$router.push('/reports'),
        },
        {
          title: 'Close Day',
          subtitle: 'Record today',
          icon: 'mdi-store-check',
          color: 'green darken-2',
          click: () => this.$router.push('/'),
        },
        {
          title: 'Export Data',
          subtitle: 'Download CSV',
          icon: 'mdi-download',
          color: 'purple darken-2',
          click: () => this.$router.push('/reports'),
        },
      ]
    },
  },

  methods: {
    formatNumber(val) {
      return numeral(val || 0).format('0,0')
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

    async loadProfile() {
      try {
        const data = await this.apiCall(
          'get',
          `/branches/my?firebase_uid=${this.user.uid}`
        )
        this.branches = Object.freeze(data || [])
        this.branch = data[0] || this.branch
        console.log('Profile data', this.branches)

        if (data.branch) {
          this.branch = {
            name: data.name || 'Prime Cuts - CBD',
            business_name: data.business_name || 'MeatPro Ltd',
            location: data.location || 'Nairobi CBD',
            phone: data.phone || '+254 700 000000',
          }
        }
        console.log('Branch data', this.branch)
        if (data.latestPrices) {
          this.prices = {
            cost_per_kg: data.latestPrices.cost_per_kg || 420,
            selling_price_per_kg: data.latestPrices.selling_price_per_kg || 650,
          }
        }

        this.stats = {
          totalEntries: data.stats?.totalEntries || 0,
          daysActive: data.stats?.daysActive || 0,
        }
      } catch (e) {
        console.error('Profile load error', e)
        // Use defaults if API fails
        this.branch = {
          name: 'Prime Cuts - CBD',
          business_name: 'MeatPro Ltd',
          location: 'Nairobi CBD',
          phone: '+254 700 000000',
        }
      }
    },

    async savePrices() {
      this.saving = true
      try {
        await this.apiCall('put', '/profile/prices', {
          branch_id: this.branchId,
          cost_per_kg: parseFloat(this.prices.cost_per_kg),
          selling_price_per_kg: parseFloat(this.prices.selling_price_per_kg),
        })
        this.showSnackbar('Prices updated successfully', 'success')
        this.editingPrices = false
      } catch (e) {
        console.error(e)
      } finally {
        this.saving = false
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
        this.loadProfile()
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
/* Base Utilities */
.bg-grey-lighten-4 {
  background-color: #f5f5f5 !important;
}

.rounded-xl {
  border-radius: 16px !important;
}

.h-100 {
  height: 100%;
}

.tracking-wide {
  letter-spacing: 0.08em;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-card {
  animation: fadeInUp 0.6s ease-out both;
}

/* Sidebar */
.sidebar-modern {
  border-right: 1px solid #f0f0f0 !important;
}

.nav-item-modern {
  transition: all 0.25s ease;
  margin-bottom: 4px;
}

.nav-item-modern:hover {
  background-color: #fafafa;
  transform: translateX(4px);
}

/* Main & Header */
.main-modern {
  scroll-behavior: smooth;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 5;
  background: rgba(245, 245, 245, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
  /* Prevent ghosting/black bars during scroll */
  backface-visibility: hidden;
  transform: translateZ(0);
}

@media (max-width: 599px) {
  .sticky-header {
    /* Backdrop filter is extremely expensive on mobile GPUs and causes scroll lag/black screens */
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: #f5f5f5 !important;
    border-bottom: 1px solid #eeeeee;
  }
}

.sticky-header.scrolled {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* Profile Card */
.profile-card-modern {
  transition: all 0.3s ease;
  border: 1px solid #f5f5f5;
}

.profile-card-modern:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08) !important;
  border-color: #eeeeee;
}

.avatar-wrapper-modern {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  transition: all 0.3s ease;
}

.profile-card-modern:hover .profile-avatar {
  transform: scale(1.03);
}

.online-indicator {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  background: #4caf50;
  border: 3px solid white;
  border-radius: 50%;
}

.stat-item-modern {
  transition: all 0.2s ease;
}

.stat-item-modern:hover {
  transform: scale(1.05);
}

/* Card Headers */
.card-header-modern {
  background: linear-gradient(to bottom, #ffffff, #fafafa);
}

/* Branch Chips */
.branch-chips-modern ::v-deep .v-slide-group__content {
  gap: 8px;
}

.branch-chip-modern {
  transition: all 0.25s ease;
  border: 1px solid #eeeeee;
}

.branch-chip-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Action Cards */
.action-card-modern {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f5f5f5;
  cursor: pointer;
}

.action-card-modern:hover {
  border-color: #eeeeee;
}

.action-avatar {
  transition: all 0.3s ease;
}

.action-card-modern:hover .action-avatar {
  transform: scale(1.08) rotate(-3deg);
}

/* Bottom Nav */
.bottom-nav-modern {
  border-radius: 20px 20px 0 0 !important;
  overflow: hidden;
}

/* Mobile Drawer */
.mobile-drawer-modern {
  background: white !important;
}

/* Snackbar */
.snackbar-modern ::v-deep .v-snackbar__content {
  padding: 12px 20px;
}

/* Responsive */
@media (max-width: 599px) {
  .sticky-header {
    padding-left: 12px;
    padding-right: 12px;
  }

  .reveal-card {
    animation-duration: 0.4s;
  }

  .profile-card-modern {
    padding: 20px !important;
  }

  .profile-avatar {
    width: 88px !important;
    height: 88px !important;
    min-width: 88px !important;
  }

  .action-card-modern {
    padding: 16px !important;
  }

  .action-avatar {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
  }
}
</style>