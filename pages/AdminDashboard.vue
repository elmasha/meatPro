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
        <div class="d-flex align-center cursor-pointer" @click="$router.push('/')">
          <div class="logo-container mr-3">
            <v-avatar color="red darken-2" size="44">
              <v-icon color="white" size="22">mdi-shield-account</v-icon>
            </v-avatar>
          </div>
          <div>
            <div class="text-h6 font-weight-bold red--text text--darken-2">MeatPro</div>
            <div class="text-caption grey--text text--darken-1">Admin Panel</div>
          </div>
        </div>
      </div>

      <v-divider class="mx-4 mb-2" />

      <v-list dense nav class="px-3 py-2">
        <v-list-item
          v-for="(item, idx) in menuItems"
          :key="item.title"
          @click="activeSection = item.section"
          link
          class="mb-1 rounded-xl nav-item-modern"
          :class="{ 'red lighten-5 red--text text--darken-2': activeSection === item.section }"
          :style="{ 'animation-delay': idx * 50 + 'ms' }"
        >
          <v-list-item-icon class="mr-3">
            <v-icon :color="activeSection === item.section ? 'red darken-2' : 'grey darken-1'">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium text-body-2">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4 pb-6">
          <v-card class="rounded-xl pa-3 red lighten-5" elevation="0">
            <div class="d-flex align-center mb-2">
              <v-icon color="red" small>mdi-headset</v-icon>
              <span class="text-caption font-weight-bold red--text ml-2">Admin Support</span>
            </div>
            <div class="text-caption grey--text text--darken-1 mb-2">
              Manage plans, users & revenue
            </div>
          </v-card>
          <v-btn
            block
            outlined
            color="grey darken-1"
            class="rounded-xl text-capitalize mt-3"
            @click="logout"
          >
            <v-icon left size="18">mdi-logout</v-icon> Exit Admin
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>


       <!-- Mobile Drawer -->
    <!-- <v-navigation-drawer v-model="mobileDrawer" temporary left width="280" class="mobile-drawer-modern">
      <div class="pa-6">
        <div class="d-flex align-center mb-8">
          <v-avatar color="red darken-2" size="36" class="mr-3">
            <v-icon color="white" size="20">mdi-shield-account</v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold red--text text--darken-2">MeatPro Admin</div>
          </div>
        </div>
        <v-list dense class="pa-0">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            @click="activeSection = item.section; mobileDrawer = false"
            class="rounded-xl mb-1"
            :class="{ 'red lighten-5 red--text': activeSection === item.section }"
          >
            <v-list-item-icon class="mr-3">
              <v-icon :color="activeSection === item.section ? 'red' : 'grey'">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-body-2 font-weight-medium">{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer> -->


    <!-- Mobile Navigation -->
    <v-bottom-navigation
      v-if="nav_bars"
      v-model="mobileDrawer"
      color="red darken-2"
      grow
      fixed
      class="elevation-8 bottom-nav-modern"
      style="z-index: 100"
    >

    <v-list dense nav class="px-1 py-1 d-flex" >
        <v-list-item
          v-for="(item, idx) in menuItems"
          :key="item.title"
          @click="activeSection = item.section"
          link
          class="mb-0 mt-1 rounded-xl nav-item-modern text-center"
          :class="{ 'red lighten-5 red--text text--darken-2': activeSection === item.section }"
          :style="{ 'animation-delay': idx * 50 + 'ms' }"
        >
         
          <v-list-item-content style="min-width: 0; margin: 1px;">
            <v-list-item-title class="font-weight-medium text-body-2"><v-icon  :color="activeSection === item.section ? 'red' : 'grey'" class="text-center">{{ item.icon }}</v-icon> <br> <p style="font-size: 0.75rem;">{{ item.title }}</p></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-bottom-navigation>




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
                <div>
                  <div class="d-flex align-center">
                    <h1 class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                      {{ currentSectionTitle }}
                    </h1>
                    <v-chip
                      x-small
                      color="red lighten-5 red--text"
                      class="ml-2 font-weight-bold hidden-xs-only"
                      label
                    >Admin</v-chip>
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon x-small color="grey" class="mr-1">mdi-shield-check</v-icon>
                    <span class="text-caption grey--text text--darken-1">{{ userName }}</span>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="4" sm="6" class="d-flex justify-end align-center">
              <v-btn
                icon
                outlined
                small
                color="grey lighten-1"
                class="mr-2"
                @click="refreshAll"
                :loading="loading"
              >
                <v-icon small>mdi-refresh</v-icon>
              </v-btn>
              <v-menu offset-y transition="slide-y-transition" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    v-bind="attrs"
                    v-on="on"
                    class="text-capitalize rounded-lg px-2 user-btn-modern"
                  >
                    <v-avatar color="red lighten-4" size="34" class="mr-2">
                      <span class="red--text text--darken-2 font-weight-bold text-caption">{{ userInitials }}</span>
                    </v-avatar>
                    <span class="hidden-sm-and-down text-body-2 grey--text text--darken-2 font-weight-medium">{{ userName }}</span>
                    <v-icon small color="grey">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list dense class="py-2 rounded-xl" min-width="200" elevation="4">
                  <div class="px-4 py-2 mb-1">
                    <div class="text-caption grey--text">Admin User</div>
                    <div class="text-body-2 font-weight-bold grey--text text--darken-2">{{ userName }}</div>
                  </div>
                  <v-divider class="mb-1" />
                  <v-list-item @click="activeSection = 'dashboard'" class="rounded-lg mx-1">
                    <v-list-item-icon class="mr-3">
                      <v-icon small color="grey">mdi-view-dashboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="text-body-2">Dashboard</v-list-item-title>
                  </v-list-item>
                  <v-list-item to="/dashboard" class="rounded-lg mx-1">
                    <v-list-item-icon class="mr-3">
                      <v-icon small color="grey">mdi-arrow-left</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="text-body-2">Back to App</v-list-item-title>
                  </v-list-item>
                  <v-divider class="my-1" />
                  <v-list-item @click="logout" class="rounded-lg mx-1">
                    <v-list-item-icon class="mr-3">
                      <v-icon small color="red">mdi-logout</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="text-body-2 red--text">Sign Out</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- ==================== DASHBOARD SECTION ==================== -->
      <v-container v-if="activeSection === 'dashboard'" :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <!-- KPI Cards -->
        <v-row dense class="mb-4 mb-sm-6">
          <v-col
            cols="6"
            lg="3"
            v-for="(card, i) in kpiCards"
            :key="i"
            class="reveal-card"
            :style="{ 'animation-delay': i * 100 + 'ms' }"
          >
            <v-card
              class="pa-4 pa-sm-5 rounded-xl h-100 kpi-card-modern"
              elevation="1"
            >
              <div class="d-flex align-start justify-space-between mb-3">
                <v-avatar :color="card.iconBg" size="44" class="elevation-1 kpi-avatar">
                  <v-icon :color="card.iconColor" size="22">{{ card.icon }}</v-icon>
                </v-avatar>
                <v-chip
                  v-if="card.trend"
                  x-small
                  :color="card.trend >= 0 ? 'green lighten-5' : 'red lighten-5'"
                  :text-color="card.trend >= 0 ? 'green darken-2' : 'red darken-2'"
                  class="font-weight-bold"
                  label
                >
                  <v-icon x-small left>{{ card.trend >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
                  {{ Math.abs(card.trend) }}%
                </v-chip>
              </div>
              <div class="text-caption font-weight-bold text-uppercase mb-1 tracking-wide grey--text">
                {{ card.label }}
              </div>
              <div class="text-h5 text-sm-h4 font-weight-bold grey--text text--darken-3">
                {{ card.value }}
              </div>
              <div v-if="card.subtitle" class="text-caption mt-1 font-weight-medium grey--text">
                {{ card.subtitle }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-row class="mb-4 mb-sm-6 reveal-card" style="animation-delay: 200ms">
          <v-col cols="12">
            <v-card class="rounded-xl pa-4" elevation="1">
              <v-card-title class="px-0 pt-0 pb-2">
                <v-avatar color="red lighten-5" size="36" class="mr-3">
                  <v-icon color="red">mdi-lightning-bolt</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold grey--text text--darken-2">Quick Actions</span>
              </v-card-title>
              <v-row dense>
                <v-col v-for="action in quickActions" :key="action.section" cols="6" sm="3">
                  <v-btn
                    block
                    @click="activeSection = action.section"
                    class="rounded-xl text-capitalize py-4"
                    :color="action.color"
                    :dark="!!action.dark"
                    elevation="1"
                  >
                    <v-icon left>{{ action.icon }}</v-icon>
                    {{ action.label }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Activity -->
        <v-row class="reveal-card" style="animation-delay: 300ms">
          <v-col cols="12" md="6">
            <v-card class="rounded-xl h-100" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="blue lighten-5" size="36" class="mr-3">
                    <v-icon color="blue">mdi-account-clock</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">Recent Users</div>
                    <div class="text-caption grey--text">New signups</div>
                  </div>
                </div>
              </v-card-title>
              <v-divider />
              <v-list class="pa-0">
                <v-list-item v-for="user in recentUsers" :key="user.id" class="py-2">
                  <v-list-item-avatar color="grey lighten-3">
                    <v-icon color="grey">mdi-account</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">{{ user.name || 'Unknown' }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">{{ user.phone }} • {{ user.user_type }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-chip
                      :color="user.subscription_status === 'active' ? 'green lighten-5' : 'grey lighten-4'"
                      :text-color="user.subscription_status === 'active' ? 'green darken-2' : 'grey darken-1'"
                      x-small
                      label
                    >
                      {{ user.subscription_status }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="rounded-xl h-100" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="orange lighten-5" size="36" class="mr-3">
                    <v-icon color="orange">mdi-cash-clock</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">Pending Payments</div>
                    <div class="text-caption grey--text">Awaiting confirmation</div>
                  </div>
                </div>
              </v-card-title>
              <v-divider />
              <v-list class="pa-0">
                <v-list-item v-for="pay in pendingPayments" :key="pay.id" class="py-2">
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">
                      {{ pay.user_name || 'User #' + pay.user_id }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      KES {{ pay.amount }} • {{ pay.subscription }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn x-small color="success" @click="confirmPayment(pay.id)">
                      Confirm
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- ==================== PLANS SECTION ==================== -->
      <v-container v-if="activeSection === 'plans'" :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <v-row>
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1">
              <v-card-title class="d-flex align-center px-4 px-sm-6 py-4 card-header-modern">
                <v-avatar color="red lighten-5" size="36" class="mr-3">
                  <v-icon color="red">mdi-tag-multiple</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold grey--text text--darken-2">Subscription Plans</span>
                <v-spacer />
                <v-btn color="red darken-2" dark class="rounded-xl" @click="openPlanDialog()">
                  <v-icon left>mdi-plus</v-icon> Add Plan
                </v-btn>
              </v-card-title>
              <v-divider />
              <v-data-table
                :headers="planHeaders"
                :items="plans"
                :loading="loading"
                class="entries-table-modern"
              >
                <template #[`item.price_kes`]="{ item }">
                  <span class="font-weight-bold">KES {{ item.price_kes }}</span>
                </template>
                <template #[`item.is_active`]="{ item }">
                  <v-chip :color="item.is_active ? 'green lighten-5' : 'grey lighten-4'" small label>
                    <v-icon x-small left :color="item.is_active ? 'green' : 'grey'">
                      {{ item.is_active ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                    {{ item.is_active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </template>
                <template #[`item.features`]="{ item }">
                  <v-chip v-for="(feat, i) in parseFeatures(item.features)" :key="i" x-small class="mr-1" label>
                    {{ feat }}
                  </v-chip>
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn icon small class="mr-1" @click="openPlanDialog(item)">
                    <v-icon small color="grey">mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small class="mr-1" @click="togglePlanStatus(item)">
                    <v-icon small :color="item.is_active ? 'warning' : 'success'">
                      {{ item.is_active ? 'mdi-eye-off' : 'mdi-eye' }}
                    </v-icon>
                  </v-btn>
                  <v-btn icon small color="error" @click="deletePlan(item)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- ==================== USERS SECTION ==================== -->
      <v-container v-if="activeSection === 'users'" :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <v-row>
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1">
              <v-card-title class="d-flex align-center px-4 px-sm-6 py-4 card-header-modern">
                <v-avatar color="blue lighten-5" size="36" class="mr-3">
                  <v-icon color="blue">mdi-account-group</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold grey--text text--darken-2">All Users</span>
                <v-spacer />
                <v-text-field
                  v-model="userSearch"
                  placeholder="Search users..."
                  dense
                  outlined
                  rounded
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  class="rounded-lg search-field-modern hidden-xs-only"
                  style="max-width: 220px"
                />
              </v-card-title>
              <v-divider />
              <v-data-table
                :headers="userHeaders"
                :items="filteredUsers"
                :loading="loading"
                class="entries-table-modern"
              >
                <template #[`item.subscription_status`]="{ item }">
                  <v-chip
                    :color="getStatusColor(item.subscription_status)"
                    small
                    dark
                    label
                  >
                    {{ item.subscription_status }}
                  </v-chip>
                </template>
                <template #[`item.days_left`]="{ item }">
                  <span v-if="item.days_left > 0" class="green--text text--darken-2 font-weight-bold">{{ item.days_left }} days</span>
                  <span v-else-if="item.days_left === 0" class="warning--text">Today</span>
                  <span v-else class="grey--text">—</span>
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn icon small @click="openUserDialog(item)">
                    <v-icon small color="grey">mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- ==================== SUBSCRIPTIONS SECTION ==================== -->
      <v-container v-if="activeSection === 'subscriptions'" :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <v-row class="mb-4">
          <v-col v-for="stat in subStats" :key="stat.label" cols="6" sm="3">
            <v-chip :color="stat.color" dark large class="pa-4">
              <v-icon left>{{ stat.icon }}</v-icon>
              <div>
                <div class="font-weight-bold">{{ stat.value }}</div>
                <div class="text-caption">{{ stat.label }}</div>
              </div>
            </v-chip>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1">
              <v-card-title class="d-flex align-center px-4 px-sm-6 py-4 card-header-modern">
                <v-avatar color="purple lighten-5" size="36" class="mr-3">
                  <v-icon color="purple">mdi-calendar-check</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold grey--text text--darken-2">Subscriptions</span>
                <v-spacer />
                <v-select
                  v-model="subFilter.status"
                  :items="[{ text: 'Active', value: 'active' }, { text: 'Pending', value: 'pending' }, { text: 'Expired', value: 'expired' }, { text: 'All', value: 'all' }]"
                  dense
                  outlined
                  rounded
                  hide-details
                  class="rounded-lg mr-2"
                  style="max-width: 140px"
                  @change="fetchSubscriptions"
                />
              </v-card-title>
              <v-divider />
              <v-data-table
                :headers="subHeaders"
                :items="subscriptions"
                :loading="loading"
                class="entries-table-modern"
              >
                <template #[`item.user_name`]="{ item }">
                  <div class="font-weight-medium">{{ item.user_name || 'Unknown' }}</div>
                  <div class="text-caption grey--text">{{ item.user_phone }}</div>
                </template>
                <template #[`item.status`]="{ item }">
                  <v-chip :color="getStatusColor(item.status)" small dark label>{{ item.status }}</v-chip>
                </template>
                <template #[`item.days_remaining`]="{ item }">
                  <v-progress-linear
                    :value="Math.max(0, Math.min(100, (item.days_remaining / 30) * 100))"
                    :color="item.expiry_status === 'critical' ? 'error' : item.expiry_status === 'warning' ? 'warning' : 'success'"
                    height="20"
                    rounded
                  >
                    <template #default>
                      <span class="white--text text-caption">
                        {{ item.days_remaining > 0 ? item.days_remaining + ' days' : 'Expired' }}
                      </span>
                    </template>
                  </v-progress-linear>
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn icon small v-bind="attrs" v-on="on">
                        <v-icon small>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item @click="renewSub(item)">
                        <v-list-item-icon><v-icon color="success" small>mdi-calendar-refresh</v-icon></v-list-item-icon>
                        <v-list-item-title>Renew</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="extendSub(item)">
                        <v-list-item-icon><v-icon color="info" small>mdi-calendar-plus</v-icon></v-list-item-icon>
                        <v-list-item-title>Extend Days</v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list-item @click="cancelSub(item)" :disabled="item.status === 'cancelled'">
                        <v-list-item-icon><v-icon color="error" small>mdi-cancel</v-icon></v-list-item-icon>
                        <v-list-item-title class="error--text">Cancel</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- ==================== PAYMENTS SECTION ==================== -->
      <v-container v-if="activeSection === 'payments'" :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <v-row>
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1">
              <v-card-title class="d-flex align-center px-4 px-sm-6 py-4 card-header-modern">
                <v-avatar color="green lighten-5" size="36" class="mr-3">
                  <v-icon color="green">mdi-cash-multiple</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold grey--text text--darken-2">Payment History</span>
              </v-card-title>
              <v-divider />
              <v-data-table
                :headers="paymentHeaders"
                :items="payments"
                :loading="loading"
                class="entries-table-modern"
              >
                <template #[`item.amount`]="{ item }">
                  <span class="font-weight-bold">KES {{ item.amount }}</span>
                </template>
                <template #[`item.mpesa_receipt`]="{ item }">
                  <v-chip v-if="item.mpesa_receipt" color="green lighten-5" small label>
                    <v-icon x-small left color="green">mdi-check</v-icon>
                    {{ item.mpesa_receipt }}
                  </v-chip>
                  <v-chip v-else color="orange lighten-5" small label>
                    <v-icon x-small left color="orange">mdi-clock</v-icon>
                    Pending
                  </v-chip>
                </template>
                <template #[`item.created_at`]="{ item }">
                  {{ new Date(item.created_at).toLocaleString() }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn v-if="!item.mpesa_receipt" x-small color="success" @click="confirmPayment(item.id)">
                    Confirm
                  </v-btn>
                  <span v-else class="grey--text text-caption">Done</span>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- ==================== FINANCE SECTION ==================== -->
      <v-container v-if="activeSection === 'finance'" :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <!-- Summary Cards -->
        <v-row dense class="mb-4">
          <v-col v-for="card in financeCards" :key="card.title" cols="12" sm="6" md="3">
            <v-card :color="card.color" dark class="pa-4 rounded-xl">
              <div class="text-caption text-uppercase">{{ card.title }}</div>
              <div class="text-h4 font-weight-bold">KES {{ card.value }}</div>
              <div class="text-caption">{{ card.subtitle }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card class="rounded-xl pa-4" elevation="1">
              <v-row align="center">
                <v-col cols="12" sm="3">
                  <v-menu v-model="startMenu" :close-on-content-click="false" offset-y>
                    <template #activator="{ on, attrs }">
                      <v-text-field v-model="financeFilters.start_date" label="Start Date" readonly v-bind="attrs" v-on="on" outlined rounded dense />
                    </template>
                    <v-date-picker v-model="financeFilters.start_date" @input="startMenu = false" />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-menu v-model="endMenu" :close-on-content-click="false" offset-y>
                    <template #activator="{ on, attrs }">
                      <v-text-field v-model="financeFilters.end_date" label="End Date" readonly v-bind="attrs" v-on="on" outlined rounded dense />
                    </template>
                    <v-date-picker v-model="financeFilters.end_date" @input="endMenu = false" />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select v-model="financeFilters.group_by" :items="[{ text: 'Daily', value: 'day' }, { text: 'Monthly', value: 'month' }]" label="Group By" outlined rounded dense />
                </v-col>
                <v-col cols="12" sm="3" class="d-flex">
                  <v-btn color="red darken-2" dark class="rounded-xl mr-2" @click="fetchRevenue">
                    <v-icon left>mdi-refresh</v-icon> Update
                  </v-btn>
                  <v-btn outlined class="rounded-xl" @click="exportCSV">
                    <v-icon left>mdi-download</v-icon> CSV
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Revenue Table -->
        <v-row>
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <v-avatar color="red lighten-5" size="36" class="mr-3">
                  <v-icon color="red">mdi-chart-bar</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold grey--text text--darken-2">Revenue Breakdown</span>
              </v-card-title>
              <v-divider />
              <v-data-table
                :headers="revenueHeaders"
                :items="revenueData"
                :loading="loading"
                class="entries-table-modern"
              >
                <template #[`item.total_revenue`]="{ item }">
                  <span class="font-weight-bold">KES {{ item.total_revenue }}</span>
                </template>
                <template #[`item.confirmed_revenue`]="{ item }">
                  <span class="green--text">KES {{ item.confirmed_revenue }}</span>
                </template>
                <template #[`item.pending_revenue`]="{ item }">
                  <span class="orange--text">KES {{ item.pending_revenue }}</span>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

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
          <v-avatar :color="snackbar.color === 'success' ? 'green darken-2' : 'red darken-2'" size="28" class="mr-3">
            <v-icon color="white" small>{{ snackbar.color === 'success' ? 'mdi-check' : 'mdi-alert' }}</v-icon>
          </v-avatar>
          <span class="font-weight-medium">{{ snackbar.text }}</span>
        </div>
      </v-snackbar>
    </v-main>

    <!-- ==================== DIALOGS ==================== -->

    <!-- Plan Dialog -->
    <v-dialog v-model="planDialog" max-width="600">
      <v-card class="rounded-xl">
        <v-toolbar color="red darken-2" dark flat height="70" class="dialog-toolbar-modern">
          <v-btn icon dark @click="planDialog = false"><v-icon>mdi-close</v-icon></v-btn>
          <v-toolbar-title class="text-h6 font-weight-bold">{{ editPlanMode ? 'Edit Plan' : 'New Plan' }}</v-toolbar-title>
          <v-spacer />
          <v-btn text dark class="text-capitalize font-weight-bold rounded-lg" @click="savePlan" :disabled="!planValid">
            Save
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-4 pa-sm-6 bg-grey-lighten-4">
          <v-form refs="planForm" v-model="planValid">
            <v-text-field v-model="planForm.name" label="Plan Code" :rules="[v => !!v || 'Required']" :disabled="editPlanMode" outlined rounded dense />
            <v-text-field v-model="planForm.display_name" label="Display Name" :rules="[v => !!v || 'Required']" outlined rounded dense />
            <v-text-field v-model.number="planForm.price_kes" label="Price (KES)" type="number" prefix="KES" :rules="[v => v >= 0 || 'Invalid']" outlined rounded dense />
            <v-select v-model="planForm.billing_cycle" :items="['monthly', 'yearly']" label="Billing Cycle" outlined rounded dense />
            <v-textarea v-model="planForm.description" label="Description" rows="2" outlined rounded dense />
            <v-combobox v-model="planForm.features" label="Features (press Enter)" multiple chips clearable outlined rounded dense />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- User Dialog -->
    <v-dialog v-model="userDialog" max-width="500">
      <v-card class="rounded-xl">
        <v-toolbar color="red darken-2" dark flat height="70" class="dialog-toolbar-modern">
          <v-btn icon dark @click="userDialog = false"><v-icon>mdi-close</v-icon></v-btn>
          <v-toolbar-title class="text-h6 font-weight-bold">Edit User</v-toolbar-title>
          <v-spacer />
          <v-btn text dark class="text-capitalize font-weight-bold rounded-lg" @click="saveUser">
            Save
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-4 pa-sm-6 bg-grey-lighten-4">
          <v-form ref="userForm" v-model="userValid">
            <v-text-field v-model="userForm.name" label="Name" outlined rounded dense />
            <v-text-field v-model="userForm.phone" label="Phone" outlined rounded dense />
            <v-select v-model="userForm.user_type" :items="['WholeSeller', 'Retailer', 'Distributor', 'Admin']" label="User Type" outlined rounded dense />
            <v-select v-model="userForm.subscription_status" :items="['free', 'active', 'expired', 'pending', 'cancelled']" label="Subscription Status" outlined rounded dense />
            <v-select v-model="userForm.plan_id" :items="plans" item-text="display_name" item-value="id" label="Assign Plan" clearable outlined rounded dense />
            <v-text-field v-model="userForm.subscription_expires" label="Expires" type="date" outlined rounded dense />
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Renew Dialog -->
    <v-dialog v-model="renewDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold">Renew Subscription</v-card-title>
        <v-card-text>
          <div class="mb-4">
            <strong>{{ selectedSub?.user_name }}</strong><br>
            Current: {{ selectedSub?.plan_name }}<<br>
            Expires: {{ selectedSub?.end_date }}
          </div>
          <v-select v-model="renewMonths" :items="[1, 3, 6, 12]" label="Months" outlined rounded dense />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="renewDialog = false">Cancel</v-btn>
          <v-btn color="success" class="rounded-xl" @click="confirmRenew">Renew</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Extend Dialog -->
    <v-dialog v-model="extendDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold">Extend Subscription</v-card-title>
        <v-card-text>
          <div class="mb-4">Add days to <strong>{{ selectedSub?.user_name }}</strong></div>
          <v-text-field v-model.number="extendDays" label="Days" type="number" outlined rounded dense />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="extendDialog = false">Cancel</v-btn>
          <v-btn color="info" class="rounded-xl" @click="confirmExtend">Extend</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

 
  </div>
</template>

<script>
import api from '../services/api'


export default {
  name: 'AdminPage',
  data() {
    return {
      // Layout
      nav_bars: false,
      mobileDrawer: false,
      activeSection: 'dashboard',
      loading: false,
      userName: 'Admin',

      // Data
      stats: {
        totalUsers: 0,
        totalBusinesses: 0,
        totalBranches: 0,
        activeSubscriptions: 0,
        monthlyRevenue: 0,
        pendingApprovals: 0
      },
      recentUsers: [],
      pendingPayments: [],
      plans: [],
      users: [],
      subscriptions: [],
      payments: [],
      revenueData: [],
      revenueSummary: {},

      // Filters
      userSearch: '',
      subFilter: { status: 'active' },
      financeFilters: {
        start_date: new Date(new Date().setDate(1)).toISOString().substr(0, 10),
        end_date: new Date().toISOString().substr(0, 10),
        group_by: 'day'
      },
      startMenu: false,
      endMenu: false,

      // Dialogs
      planDialog: false,
      editPlanMode: false,
      planValid: false,
      planForm: { name: '', display_name: '', price_kes: 0, billing_cycle: 'monthly', description: '', features: [] },
      selectedPlan: null,

      userDialog: false,
      userValid: false,
      userForm: { name: '', phone: '', user_type: '', subscription_status: '', plan_id: null, subscription_expires: '' },
      selectedUser: null,

      renewDialog: false,
      extendDialog: false,
      selectedSub: null,
      renewMonths: 1,
      extendDays: 7,

      // Snackbar
      snackbar: { show: false, text: '', color: 'success' },
      authUnsubscribe: null
    }
  },
  computed: {
    userInitials() {
      return this.userName.substring(0, 2).toUpperCase()
    },
    currentSectionTitle() {
      const titles = {
        dashboard: 'Dashboard',
        plans: 'Subscription Plans',
        users: 'User Management',
        subscriptions: 'Active Subscriptions',
        payments: 'Payment History',
        finance: 'Revenue & Finance'
      }
      return titles[this.activeSection] || 'Admin'
    },
    menuItems() {
      return [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', section: 'dashboard' },
        { title: 'Plans', icon: 'mdi-tag-multiple', section: 'plans' },
        { title: 'Users', icon: 'mdi-account-group', section: 'users' },
        { title: 'Subscriptions', icon: 'mdi-calendar-check', section: 'subscriptions' },
        { title: 'Payments', icon: 'mdi-cash-multiple', section: 'payments' },
        { title: 'Finance', icon: 'mdi-chart-line', section: 'finance' }
      ]
    },
    kpiCards() {
      return [
        { label: 'Total Users', value: this.stats.totalUsers, subtitle: 'Registered', icon: 'mdi-account-group', iconBg: 'blue lighten-5', iconColor: 'blue' },
        { label: 'Businesses', value: this.stats.totalBusinesses, subtitle: `${this.stats.totalBranches} branches`, icon: 'mdi-store', iconBg: 'purple lighten-5', iconColor: 'purple' },
        { label: 'Active Subs', value: this.stats.activeSubscriptions, subtitle: `${this.stats.pendingApprovals} pending`, icon: 'mdi-calendar-check', iconBg: 'green lighten-5', iconColor: 'green', trend: 12 },
        { label: 'Monthly Revenue', value: 'KES ' + this.stats.monthlyRevenue.toLocaleString(), subtitle: 'Last 30 days', icon: 'mdi-cash-multiple', iconBg: 'red lighten-5', iconColor: 'red' }
      ]
    },
    quickActions() {
      return [
        { label: 'Add Plan', section: 'plans', icon: 'mdi-tag-plus', color: 'red darken-2', dark: true },
        { label: 'View Users', section: 'users', icon: 'mdi-account-search', color: 'white' },
        { label: 'Revenue', section: 'finance', icon: 'mdi-chart-bar', color: 'white' },
        { label: 'Payments', section: 'payments', icon: 'mdi-cash-check', color: 'white' }
      ]
    },
    planHeaders() {
      return [
        { text: 'Name', value: 'display_name' },
        { text: 'Code', value: 'name' },
        { text: 'Price', value: 'price_kes' },
        { text: 'Cycle', value: 'billing_cycle' },
        { text: 'Features', value: 'features', sortable: false },
        { text: 'Status', value: 'is_active' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
      ]
    },
    userHeaders() {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Phone', value: 'phone' },
        { text: 'Type', value: 'user_type' },
        { text: 'Business', value: 'business_name' },
        { text: 'Plan', value: 'plan_name' },
        { text: 'Status', value: 'subscription_status', align: 'center' },
        { text: 'Days Left', value: 'days_left', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
      ]
    },
    filteredUsers() {
      if (!this.userSearch) return this.users
      const q = this.userSearch.toLowerCase()
      return this.users.filter(u => 
        (u.name || '').toLowerCase().includes(q) || 
        (u.phone || '').includes(q)
      )
    },
    subHeaders() {
      return [
        { text: 'User', value: 'user_name' },
        { text: 'Plan', value: 'plan' },
        { text: 'Status', value: 'status', align: 'center' },
        { text: 'Time Left', value: 'days_remaining' },
        { text: 'Dates', value: 'dates' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
      ]
    },
    subStats() {
      const total = this.subscriptions.length
      const active = this.subscriptions.filter(s => s.status === 'active').length
      const expiring = this.subscriptions.filter(s => s.days_remaining <= 7 && s.days_remaining > 0).length
      const expired = this.subscriptions.filter(s => s.days_remaining <= 0).length
      return [
        { label: 'Total', value: total, color: 'primary', icon: 'mdi-account-group' },
        { label: 'Active', value: active, color: 'success', icon: 'mdi-check-circle' },
        { label: 'Expiring', value: expiring, color: 'warning', icon: 'mdi-alert' },
        { label: 'Expired', value: expired, color: 'error', icon: 'mdi-calendar-remove' }
      ]
    },
    paymentHeaders() {
      return [
        { text: 'ID', value: 'id' },
        { text: 'User', value: 'user_name' },
        { text: 'Amount', value: 'amount' },
        { text: 'Plan', value: 'plan_name' },
        { text: 'Receipt', value: 'mpesa_receipt', align: 'center' },
        { text: 'Date', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
      ]
    },
    financeCards() {
      const s = this.revenueSummary
      return [
        { title: 'Today', value: (s.today || 0).toLocaleString(), color: 'primary', subtitle: new Date().toLocaleDateString() },
        { title: '7 Days', value: (s.last_7_days || 0).toLocaleString(), color: 'info', subtitle: 'This week' },
        { title: '30 Days', value: (s.last_30_days || 0).toLocaleString(), color: 'success', subtitle: 'This month' },
        { title: 'All Time', value: (s.total_all_time || 0).toLocaleString(), color: 'accent', subtitle: `${s.paying_customers || 0} customers` }
      ]
    },
    revenueHeaders() {
      return [
        { text: 'Period', value: 'period' },
        { text: 'Transactions', value: 'transaction_count', align: 'center' },
        { text: 'Confirmed', value: 'confirmed_revenue' },
        { text: 'Pending', value: 'pending_revenue' },
        { text: 'Total', value: 'total_revenue' }
      ]
    }
  },
  watch: {
    activeSection(newVal) {
      this.loadSectionData(newVal)
    }
  },
  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
    
    this.authUnsubscribe = this.$fire.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userName = user.displayName || 'Admin'
        this.refreshAll()
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
  methods: {
    getUid() {
    return this.$fire?.auth?.currentUser?.uid || '';
  },
    onResize() {
      this.nav_bars = window.innerWidth < 768
    },
    async refreshAll() {
      this.loading = true
      await this.fetchStats()
      await this.fetchUsers()
      await this.fetchPayments()
      await this.fetchPlans()
      await this.fetchSubscriptions()
      await this.fetchRevenue()
      this.loading = false
    },
    async loadSectionData(section) {
      this.loading = true
      switch(section) {
        case 'dashboard': await Promise.all([this.fetchStats(), this.fetchUsers(), this.fetchPayments()]); break
        case 'plans': await this.fetchPlans(); break
        case 'users': await this.fetchUsers(); break
        case 'subscriptions': await this.fetchSubscriptions(); break
        case 'payments': await this.fetchPayments(); break
        case 'finance': await this.fetchRevenue(); break
      }
      this.loading = false
    },

    // API Calls
    async fetchStats() {
    try {
      const uid = this.getUid();
      const { data } = await api.get(`/admin/stats?uid=${uid}`);
      this.stats = data.data;
    } catch (err) { 
      console.error(err);
    }
  },
    async fetchUsers() {
      try {
        const { data } = await api.get('/admin/users')
        this.users = Object.freeze(data.data)
        this.recentUsers = Object.freeze(data.data.slice(0, 5))
      } catch (err) { console.error(err) }
    },
    async fetchPayments() {
      try {
        const { data } = await api.get('/admin/payments')
        this.payments = Object.freeze(data.data)
        this.pendingPayments = Object.freeze(data.data.filter(p => !p.mpesa_receipt).slice(0, 5))
      } catch (err) { console.error(err) }
    },
    async fetchPlans() {
      try {
        const { data } = await api.get('/admin/plans')
        this.plans = Object.freeze(data.data)
      } catch (err) { console.error(err) }
    },
    async fetchSubscriptions() {
      try {
        const params = { ...this.subFilter }
        if (params.status === 'all') delete params.status
        const { data } = await api.get('/admin/subscriptions', { params })
        this.subscriptions = Object.freeze(data.data)
      } catch (err) { console.error(err) }
    },
    async fetchRevenue() {
      try {
        const { data } = await api.get('/admin/revenue', { params: this.financeFilters })
        this.revenueData = Object.freeze(data.data.timeline)
        this.revenueSummary = data.data.summary
      } catch (err) { console.error(err) }
    },

    // Plan Actions
    parseFeatures(features) {
      if (!features) return []
      if (typeof features === 'string') {
        try { return JSON.parse(features) } catch { return [] }
      }
      return features
    },
    openPlanDialog(item = null) {
      this.editPlanMode = !!item
      if (item) {
        this.planForm = {
          name: item.name,
          display_name: item.display_name,
          price_kes: item.price_kes,
          billing_cycle: item.billing_cycle,
          description: item.description || '',
          features: this.parseFeatures(item.features)
        }
        this.selectedPlan = item
      } else {
        this.planForm = { name: '', display_name: '', price_kes: 0, billing_cycle: 'monthly', description: '', features: [] }
        this.selectedPlan = null
      }
      this.planDialog = true
    },
    async savePlan() {
      
      try {
        if (this.editPlanMode) {
          await api.put(`/admin/plans/${this.selectedPlan.id}`, {
            display_name: this.planForm.display_name,
            price_kes: this.planForm.price_kes,
            billing_cycle: this.planForm.billing_cycle,
            description: this.planForm.description,
            features: this.planForm.features
          })
          this.showSnackbar('Plan updated')
        } else {
          await api.post('/admin/plans', this.planForm)
          this.showSnackbar('Plan created')
        }
        this.planDialog = false
        this.fetchPlans()
      } catch (err) {
        this.showSnackbar(err.response?.data?.error || 'Save failed', 'error')
      }
    },
    async togglePlanStatus(item) {
      const action = item.is_active ? 'deactivate' : 'activate'
      if (!confirm(`${action} "${item.display_name}"?`)) return
      try {
        await api.patch(`/admin/plans/${item.id}/status`, { active: !item.is_active })
        this.showSnackbar(`Plan ${action}d`)
        this.fetchPlans()
      } catch (err) {
        this.showSnackbar('Failed', 'error')
      }
    },
    async deletePlan(item) {
      if (!confirm(`Delete "${item.display_name}" permanently?`)) return
      try {
        await api.delete(`/admin/plans/${item.id}`)
        this.showSnackbar('Plan deleted')
        this.fetchPlans()
      } catch (err) {
        this.showSnackbar(err.response?.data?.error || 'Delete failed', 'error')
      }
    },

    // User Actions
    openUserDialog(item) {
      this.selectedUser = item
      this.userForm = {
        name: item.name || '',
        phone: item.phone || '',
        user_type: item.user_type || 'Retailer',
        subscription_status: item.subscription_status || 'free',
        plan_id: null,
        subscription_expires: item.subscription_expires || ''
      }
      this.userDialog = true
    },
    async saveUser() {
      try {
        await api.put(`/admin/users/${this.selectedUser.id}`, {
          name: this.userForm.name,
          phone: this.userForm.phone,
          user_type: this.userForm.user_type,
          subscription_status: this.userForm.subscription_status,
          subscription_expires: this.userForm.subscription_expires
        })
        if (this.userForm.plan_id && this.userForm.subscription_status === 'active') {
          await api.put(`/admin/users/${this.selectedUser.id}/subscription`, {
            plan_id: this.userForm.plan_id,
            subscription_status: 'active',
            months: 1
          })
        }
        this.showSnackbar('User updated')
        this.userDialog = false
        this.fetchUsers()
      } catch (err) {
        this.showSnackbar(err.response?.data?.error || 'Update failed', 'error')
      }
    },

    // Subscription Actions
    getStatusColor(status) {
      const colors = { active: 'success', pending: 'warning', expired: 'error', cancelled: 'grey', free: 'info' }
      return colors[status] || 'grey'
    },
    renewSub(item) {
      this.selectedSub = item
      this.renewMonths = 1
      this.renewDialog = true
    },
    async confirmRenew() {
      try {
        await api.post(`/admin/subscriptions/${this.selectedSub.id}/renew`, { months: this.renewMonths })
        this.showSnackbar(`Renewed for ${this.renewMonths} month(s)`)
        this.renewDialog = false
        this.fetchSubscriptions()
      } catch (err) {
        this.showSnackbar('Renew failed', 'error')
      }
    },
    extendSub(item) {
      this.selectedSub = item
      this.extendDays = 7
      this.extendDialog = true
    },
    async confirmExtend() {
      try {
        await api.post(`/admin/subscriptions/${this.selectedSub.id}/extend`, { days: this.extendDays })
        this.showSnackbar(`Extended by ${this.extendDays} days`)
        this.extendDialog = false
        this.fetchSubscriptions()
      } catch (err) {
        this.showSnackbar('Extend failed', 'error')
      }
    },
    async cancelSub(item) {
      if (!confirm(`Cancel subscription for ${item.user_name}?`)) return
      try {
        await api.post(`/admin/subscriptions/${item.id}/cancel`)
        this.showSnackbar('Subscription cancelled')
        this.fetchSubscriptions()
      } catch (err) {
        this.showSnackbar('Cancel failed', 'error')
      }
    },

    // Payment Actions
    async confirmPayment(id) {
      if (!confirm('Confirm this payment manually?')) return
      try {
        await api.post('/admin/payments/confirm', { payment_id: id })
        this.showSnackbar('Payment confirmed')
        this.fetchPayments()
        this.fetchStats()
      } catch (err) {
        this.showSnackbar('Confirm failed', 'error')
      }
    },

    // Finance
    exportCSV() {
      let csv = 'Period,Transactions,Confirmed,Pending,Total\n'
      this.revenueData.forEach(row => {
        csv += `${row.period},${row.transaction_count},${row.confirmed_revenue},${row.pending_revenue},${row.total_revenue}\n`
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `revenue_${this.financeFilters.start_date}_to_${this.financeFilters.end_date}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    },

    // Utilities
    showSnackbar(text, color = 'success') {
      this.snackbar = { show: true, text, color }
    },
    logout() {
      this.$fire.auth.signOut()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* ===== EXACT COPY OF YOUR DASHBOARD STYLES ===== */
.cursor-pointer { cursor: pointer; }
.bg-grey-lighten-4 { background-color: #f5f5f5 !important; }
.rounded-xl { border-radius: 16px !important; }
.h-100 { height: 100%; }
.tracking-wide { letter-spacing: 0.08em; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal-card { animation: fadeInUp 0.6s ease-out both; }

.sidebar-modern { border-right: 1px solid #f0f0f0 !important; }
.nav-item-modern {
  transition: all 0.25s ease;
  margin-bottom: 4px;
}
.nav-item-modern:hover {
  background-color: #fafafa;
  transform: translateX(4px);
}

.main-modern { scroll-behavior: smooth; }

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 5;
  background: rgba(245, 245, 245, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.user-btn-modern { transition: all 0.25s ease; }
.user-btn-modern:hover { background: #fafafa; }

.kpi-card-modern {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f5f5f5;
}
.kpi-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08) !important;
  border-color: #eeeeee;
}
.kpi-avatar { transition: all 0.3s ease; }
.kpi-card-modern:hover .kpi-avatar { transform: scale(1.05); }

.card-header-modern {
  background: linear-gradient(to bottom, #ffffff, #fafafa);
}

.entries-table-modern tbody tr {
  transition: background-color 0.2s ease;
}
.entries-table-modern tbody tr:hover {
  background-color: #fafafa;
}

.dialog-toolbar-modern {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%) !important;
}

.search-field-modern ::v-deep .v-input__slot {
  transition: all 0.25s ease;
}
.search-field-modern ::v-deep .v-input__slot:hover,
.search-field-modern.v-input--is-focused ::v-deep .v-input__slot {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.snackbar-modern ::v-deep .v-snackbar__content {
  padding: 12px 20px;
}

.mobile-drawer-modern { background: white !important; }

@media (max-width: 599px) {
  .sticky-header { padding-left: 12px; padding-right: 12px; }
  .reveal-card { animation-duration: 0.4s; }
  .kpi-card-modern { padding: 16px !important; }
}
</style>