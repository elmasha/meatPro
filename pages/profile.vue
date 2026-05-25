<<template>
  <div class="d-flex bg-grey-lighten-4" style="min-height: 100vh;">
    <!-- Desktop Sidebar -->
    <v-navigation-drawer
      v-if="!nav_bars"
      permanent
      width="260"
      class="elevation-1"
      color="white"
    >
      <div class="pa-6">
        <div class="d-flex align-center mb-1">
          <v-avatar color="red" size="36" class="mr-3">
            <v-icon color="white" size="20">mdi-food-steak</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold red--text">MeatPro</div>
            <div class="text-caption grey--text text--darken-1">{{ shopName }}</div>
          </div>
        </div>
      </div>
      <v-divider class="mx-4" />
      <v-list dense nav class="px-3 py-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          link
          class="mb-1 rounded-lg"
          active-class="red lighten-5 red--text"
        >
          <v-list-item-icon class="mr-3">
            <v-icon color="grey darken-1">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium text-body-2">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-4">
          <v-btn block outlined color="grey" class="rounded-lg text-capitalize" @click="logout">
            <v-icon left size="18">mdi-logout</v-icon> Sign Out
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main :class="nav_bars ? 'pb-16' : ''">
      <v-container :fluid="nav_bars" class="px-4 px-sm-6 pt-4 pt-sm-6">
        
        <!-- Header -->
        <v-row align="center" class="mb-4 mb-sm-6">
          <v-col cols="12" sm="8">
            <div class="d-flex align-center">
              <v-btn icon class="mr-2" to="/">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <div>
                <h1 class="text-h5 text-sm-h4 font-weight-bold grey--text text--darken-3">Profile & Settings</h1>
                <div class="d-flex align-center mt-1">
                  <v-icon x-small color="grey" class="mr-1">mdi-store</v-icon>
                  <span class="text-caption grey--text">Manage your business</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- User Profile Card -->
        <v-row class="mb-4 mb-sm-6">
          <v-col cols="12" md="4">
            <v-card class="rounded-xl pa-6 text-center" elevation="1">
              <v-avatar color="red" size="100" class="mb-4 elevation-2">
                <span class="white--text text-h3 font-weight-bold">{{ userInitials }}</span>
              </v-avatar>
              <div class="text-h6 font-weight-bold grey--text text--darken-3">{{ userName }}</div>
              <div class="text-body-2 grey--text mb-2">{{ userEmail }}</div>
               <div class="text-body-2 grey--text mb-2">{{ branch.business_name }}</div>
              <v-chip small color="red lighten-5 red--text" label class="font-weight-medium">
                {{ userRole }}
              </v-chip>
              
              <v-divider class="my-4" />
              
              <div class="d-flex justify-space-around">
                <div class="text-center">
                  <div class="text-h6 font-weight-bold grey--text text--darken-2">{{ stats.totalEntries }}</div>
                  <div class="text-caption grey--text">Entries</div>
                </div>
                <v-divider vertical />
                <div class="text-center">
                  <div class="text-h6 font-weight-bold grey--text text--darken-2">{{ stats.daysActive }}</div>
                  <div class="text-caption grey--text">Days Active</div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Branch Info -->
          <v-col cols="12" md="8">
            <v-card class="rounded-xl" elevation="1">
              <div>
                <v-chip-group
                  v-model="branchId"
                  class="ma-4"
                  column
                   v-for="(item, i) in branches"
          :key="i">
        <v-chip large @click="branch = item"><v-icon color="red" class="mr-2">mdi-store</v-icon> {{ item.name }}  </v-chip>
        </v-chip-group>
              </div>
              <v-card-title class="px-4 px-sm-6 py-4">
                <v-icon color="red" class="mr-2">mdi-store</v-icon>
                <span class="text-h6 font-weight-bold grey--text text--darken-2">Branch Information</span>
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
                      class="rounded-lg"
                      prepend-inner-icon="mdi-store-marker"
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
                      class="rounded-lg"
                      prepend-inner-icon="mdi-office-building"
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
                      class="rounded-lg"
                      prepend-inner-icon="mdi-map-marker"
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
                      class="rounded-lg"
                      prepend-inner-icon="mdi-phone"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Default Prices -->
            <v-card class="rounded-xl mt-4" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4">
                <v-icon color="red" class="mr-2">mdi-cash</v-icon>
                <span class="text-h6 font-weight-bold grey--text text--darken-2">Default Prices</span>
                <v-spacer />
                <v-btn
                  small
                  text
                  color="red"
                  class="text-capitalize"
                  @click="editingPrices = !editingPrices"
                >
                  <v-icon left small>{{ editingPrices ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
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
                      class="rounded-lg"
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
                      class="rounded-lg"
                    />
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-btn
                      v-if="editingPrices"
                      block
                      color="red"
                      dark
                      class="rounded-lg text-capitalize"
                      @click="savePrices"
                      :loading="saving"
                    >
                      Save
                    </v-btn>
                  </v-col>
                </v-row>
                <div class="text-caption grey--text mt-2">
                  <v-icon x-small>mdi-information</v-icon>
                  These prices auto-fill when closing a new day. Update when market prices change.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-row class="mb-4 mb-sm-6">
          <v-col cols="12">
            <h3 class="text-h6 font-weight-bold grey--text text--darken-2 mb-4">Quick Actions</h3>
            <v-row dense>
              <v-col
                v-for="(action, i) in quickActions"
                :key="i"
                cols="6"
                sm="4"
                md="3"
              >
                <v-card
                  class="rounded-xl pa-4 text-center h-100"
                  elevation="1"
                  hover
                  @click="action.click"
                >
                  <v-avatar :color="action.color" size="48" class="mb-3 elevation-2">
                    <v-icon color="white">{{ action.icon }}</v-icon>
                  </v-avatar>
                  <div class="text-body-2 font-weight-bold grey--text text--darken-2">{{ action.title }}</div>
                  <div class="text-caption grey--text">{{ action.subtitle }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Danger Zone -->
        <v-row>
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1" color="red lighten-5">
              <v-card-title class="px-4 px-sm-6 py-4 red--text">
                <v-icon color="red" class="mr-2">mdi-alert</v-icon>
                <span class="text-h6 font-weight-bold">Account</span>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <div class="d-flex align-center justify-space-between">
                  <div>
                    <div class="text-body-1 font-weight-bold grey--text text--darken-2">Sign Out</div>
                    <div class="text-caption grey--text">Log out of MeatPro on this device</div>
                  </div>
                  <v-btn
                    color="red"
                    dark
                    class="rounded-lg text-capitalize"
                    @click="logout"
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
      color="red"
      grow
      fixed
      class="elevation-8"
      style="z-index: 100; border-radius: 16px 16px 0 0;"
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

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      bottom
      rounded="lg"
      class="mb-4"
    >
      <div class="d-flex align-center">
        <v-icon left small>{{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        {{ snackbar.text }}
      </div>
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
      bottomNav: 2,
      loading: false,
      saving: false,
      editingPrices: false,
      user: null,
      shopName: 'Prime Cuts - CBD',
      branchId: 1,
      branches : [],
      branch: {
        name: '',
        business_name: '',
        location: '',
        phone: ''
      },
      
      prices: {
        cost_per_kg: 420,
        selling_price_per_kg: 650
      },
      
      stats: {
        totalEntries: 0,
        daysActive: 0
      },
      
      menuItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
        { title: 'Reports', icon: 'mdi-chart-line', to: '/reports' },
        { title: 'Profile', icon: 'mdi-account', to: '/profile' }
      ],
      
      snackbar: { show: false, text: '', color: 'success' }
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
          color: 'red',
          click: () => this.$router.push('/')
        },
        {
          title: 'Reports',
          subtitle: 'Analytics & trends',
          icon: 'mdi-chart-line',
          color: 'blue',
          click: () => this.$router.push('/reports')
        },
        {
          title: 'Close Day',
          subtitle: 'Record today',
          icon: 'mdi-store-check',
          color: 'green',
          click: () => this.$router.push('/')
        },
        {
          title: 'Export Data',
          subtitle: 'Download CSV',
          icon: 'mdi-download',
          color: 'purple',
          click: () => this.$router.push('/reports')
        }
      ]
    }
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
        const data = await this.apiCall('get', `/branches/my?firebase_uid=${this.user.uid}`)
        this.branches = data;
        this.branch = data[0];
        console.log('Profile data', this.branches)

        if (data.branch) {
          this.branch = {
            name: data.name || 'Prime Cuts - CBD',
            business_name: data.business_name || 'MeatPro Ltd',
            location: data.location || 'Nairobi CBD',
            phone: data.phone || '+254 700 000000'
          }
        }
        console.log('Branch data', this.branch)
        if (data.latestPrices) {
          this.prices = {
            cost_per_kg: data.latestPrices.cost_per_kg || 420,
            selling_price_per_kg: data.latestPrices.selling_price_per_kg || 650
          }
        }
        
        this.stats = {
          totalEntries: data.stats?.totalEntries || 0,
          daysActive: data.stats?.daysActive || 0
        }
      } catch (e) {
        console.error('Profile load error', e)
        // Use defaults if API fails
        this.branch = {
          name: 'Prime Cuts - CBD',
          business_name: 'MeatPro Ltd',
          location: 'Nairobi CBD',
          phone: '+254 700 000000'
        }
      }
    },

    async savePrices() {
      this.saving = true
      try {
        await this.apiCall('put', '/profile/prices', {
          branch_id: this.branchId,
          cost_per_kg: parseFloat(this.prices.cost_per_kg),
          selling_price_per_kg: parseFloat(this.prices.selling_price_per_kg)
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
    }
  },

  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
    this.$fire.auth.onAuthStateChanged((user) => {
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
  }
}
</script>

<style scoped>
.bg-grey-lighten-4 { background-color: #f5f5f5 !important; }
.rounded-xl { border-radius: 16px !important; }
.h-100 { height: 100%; }
</style>