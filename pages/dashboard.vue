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
          <v-slide-y-transition>
            <v-btn
              v-if="canManageBranches"
              block
              color="red darken-2"
              dark
              class="rounded-xl text-capitalize font-weight-bold mb-3"
              to="/setupbranch"
            >
              <v-icon left small>mdi-store-plus</v-icon>
              Setup Branches
            </v-btn>
          </v-slide-y-transition>

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
                <div>
                  <div class="d-flex align-center flex-wrap">
                    <h1 class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                      {{ formattedToday }}
                    </h1>
                    <v-chip
                      x-small
                      color="red lighten-5 red--text"
                      class="ml-2 font-weight-bold hidden-xs-only"
                      label
                    >
                      {{ isConsolidated ? 'All Branches' : `Branch ${branchId || '—'}` }}
                    </v-chip>
                    <v-chip
                      v-if="role"
                      x-small
                      :color="isOwner ? 'purple lighten-5' : 'blue lighten-5'"
                      :text-color="isOwner ? 'purple darken-2' : 'blue darken-2'"
                      class="ml-1 font-weight-bold hidden-xs-only"
                      label
                    >
                      <v-icon x-small left>
                        {{ isOwner ? 'mdi-account-star' : 'mdi-account-tie' }}
                      </v-icon>
                      {{ isOwner ? 'Owner' : 'Manager' }}
                    </v-chip>
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon x-small color="grey" class="mr-1">mdi-map-marker</v-icon>
                    <span class="text-caption grey--text text--darken-1">{{ shopName }} </span>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="4" sm="6" class="d-flex justify-end align-center">
              <v-btn
                v-if="canManageBranches"
                color="red darken-2"
                dark
                icon
                class="rounded-xl text-capitalize font-weight-bold mb-0"
                to="/setupbranch"
              >
                <v-icon left small>mdi-store-plus</v-icon>
              </v-btn>
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
                      <span class="red--text text--darken-2 font-weight-bold text-caption">{{
                        userInitials
                      }}</span>
                    </v-avatar>
                    <span
                      class="hidden-sm-and-down text-body-2 grey--text text--darken-2 font-weight-medium"
                      >{{ userName }}</span
                    >
                    <v-icon small color="grey">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list dense class="py-2 rounded-xl" min-width="200" elevation="4">
                  <div class="px-4 py-2 mb-1">
                    <div class="text-caption grey--text">Signed in as</div>
                    <div class="text-body-2 font-weight-bold grey--text text--darken-2">
                      {{ userName }}
                    </div>
                    <div v-if="role" class="text-caption grey--text mt-1">
                      {{ isOwner ? 'Business Owner' : 'Branch Manager' }}
                    </div>
                  </div>
                  <v-divider class="mb-1" />
                  <v-list-item to="/profile" class="rounded-lg mx-1">
                    <v-list-item-icon class="mr-3">
                      <v-icon small color="grey">mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="text-body-2">Profile</v-list-item-title>
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

      <v-container :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <!-- SUBSCRIPTION BANNER -->
        <v-slide-y-transition>
          <v-alert
            v-if="!subActive && !subLoading"
            dense
            type="error"
            class="mb-4 mb-sm-6 rounded-xl alert-modern"
            text
            border="left"
            colored-border
            elevation="2"
          >
            <div class="d-flex align-center flex-wrap">
              <v-avatar color="red lighten-5" size="40" class="mr-3 hidden-xs-only">
                <v-icon color="red darken-2">mdi-lock-alert</v-icon>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-body-1 font-weight-bold grey--text text--darken-2">
                  Subscription Required
                </div>
                <div class="text-body-2 grey--text text--darken-1">
                  {{ subData?.subscription?.status === 'cancelled'
                    ? 'Your subscription was cancelled. Renew to continue recording daily entries.'
                    : 'Activate a Starter, Business, or Pro plan to record daily stock, sales, and expenses.' }}
                </div>
              </div>
              <v-btn
                v-if="isOwner"
                small
                color="red darken-2"
                dark
                class="text-capitalize font-weight-bold rounded-lg mt-2 mt-sm-0"
                to="/subscription"
              >
                <v-icon left small>mdi-crown</v-icon>
                {{ subData?.subscription?.status === 'cancelled' ? 'Renew Now' : 'Activate Now' }}
              </v-btn>
            </div>
          </v-alert>
        </v-slide-y-transition>

        <!-- Manager role notice -->
        <v-slide-y-transition>
          <v-alert
            v-if="role === 'manager' && subActive"
            dense
            type="info"
            class="mb-4 mb-sm-6 rounded-xl"
            text
            border="left"
            colored-border
            elevation="1"
          >
            <div class="d-flex align-center">
              <v-icon color="info" small class="mr-2">mdi-information</v-icon>
              <span class="text-body-2">
                You're signed in as a <strong>Branch Manager</strong>.
                You can record daily entries for your branch.
                Contact your business owner for administrative changes.
              </span>
            </div>
          </v-alert>
        </v-slide-y-transition>

        <!-- Missed Entry Alert -->
        <v-slide-y-transition>
          <v-alert
            v-if="showMissedEntryAlert && subActive"
            dense
            type="warning"
            class="mb-4 mb-sm-6 rounded-xl alert-modern"
            text
            border="left"
            colored-border
            elevation="2"
          >
            <div class="d-flex align-center flex-wrap">
              <span class="text-body-2 mr-2"
                ><strong>Missed yesterday's entry?</strong> No record found for
                {{ formatDateShort(yesterday) }}.</span
              >
              <v-spacer />
              <v-btn
                small
                text
                color="warning darken-1"
                class="text-capitalize font-weight-bold mt-1 mt-sm-0"
                @click="selectDate(yesterday)"
              >
                Add Now
              </v-btn>
            </div>
          </v-alert>
        </v-slide-y-transition>

        <!-- Branch Selector Bar (owner with 2+ branches) -->
        <v-row v-if="canSwitchBranches" dense class="mb-2 reveal-card">
          <v-col cols="12">
            <v-card class="rounded-xl pa-3 d-flex align-center" elevation="1" outlined>
              <v-icon small color="grey darken-1" class="mr-3">mdi-store</v-icon>
              <span class="text-caption grey--text text--darken-1 font-weight-medium mr-3 hidden-xs-only">Switch Branch</span>
              <v-select
                v-model="selectedBranch"
                :items="branchSelectItems"
                @change="SelectionChange(selectedBranch)"
                dense
                outlined
                hide-details
                rounded
                placeholder="Select Branch"
                class="rounded-lg branch-select-modern"
                style="max-width: 280px;"
              ></v-select>
              <v-chip
                v-if="isConsolidated"
                x-small
                color="purple lighten-5"
                text-color="purple darken-2"
                class="ml-3 font-weight-bold"
                label
              >
                <v-icon x-small left>mdi-view-dashboard-variant</v-icon>
                Consolidated
              </v-chip>
              <v-spacer />
              <v-btn
                v-if="canManageBranches"
                small
                text
                color="red darken-2"
                class="text-capitalize font-weight-medium rounded-lg"
                to="/setupbranch"
              >
                <v-icon left x-small>mdi-store-plus</v-icon>
                <span class="hidden-xs-only">Setup</span>
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- KPI Cards -->
        <v-row dense class="mb-4 mb-sm-6">
          <v-col
            cols="6"
            sm="3"
            v-for="(card, i) in kpiCards"
            :key="i"
            class="reveal-card"
            :style="{ 'animation-delay': i * 100 + 'ms' }"
          >
            <v-card
              class="pa-4 pa-sm-5 rounded-xl h-100 kpi-card-modern"
              :class="card.bgClass"
              elevation="1"
            >
              <div class="d-flex align-start justify-space-between mb-3">
                <v-avatar :color="card.iconBg" size="44" class="elevation-1 kpi-avatar">
                  <v-icon :color="card.iconColor" size="22">{{ card.icon }}</v-icon>
                </v-avatar>
              </div>
              <div
                class="text-caption font-weight-bold text-uppercase mb-1 tracking-wide"
                :class="card.labelColor || 'grey--text'"
              >
                {{ card.label }}
              </div>
              <div
                class="text-h5 text-sm-h4 font-weight-bold"
                :class="card.valueColor || 'grey--text text--darken-3'"
              >
                {{ card.value }}
              </div>
              <div
                v-if="card.subtitle"
                class="text-caption mt-1 font-weight-medium"
                :class="card.subtitleColor || 'grey--text'"
              >
                {{ card.subtitle }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Revenue Variance Alert -->
        <v-slide-y-transition>
          <v-row v-if="todayStats.revenueVariance && Math.abs(todayStats.revenueVariance) > 1 && todayStats.revenue > 0" class="mb-4 mb-sm-6 reveal-card" style="animation-delay: 150ms">
            <v-col cols="12">
              <v-alert
                :type="todayStats.revenueVariance > 0 ? 'error' : 'success'"
                dense
                text
                class="rounded-xl alert-modern"
                border="left"
                colored-border
                elevation="2"
              >
                <div class="d-flex align-center flex-wrap">
                  <v-avatar :color="todayStats.revenueVariance > 0 ? 'red lighten-5' : 'green lighten-5'" size="40" class="mr-3 hidden-xs-only">
                    <v-icon :color="todayStats.revenueVariance > 0 ? 'red darken-2' : 'green darken-2'">
                      {{ todayStats.revenueVariance > 0 ? 'mdi-alert-circle' : 'mdi-check-circle' }}
                    </v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="text-body-1 font-weight-bold grey--text text--darken-2">
                      Revenue Variance: KES {{ formatNumber(Math.abs(todayStats.revenueVariance)) }}
                    </div>
                    <div class="text-body-2 grey--text text--darken-1">
                      {{ todayStats.revenueVariance > 0
                        ? 'Revenue shortfall: Expected revenue exceeds payments received. Check for unrecorded sales, theft, or pricing errors.'
                        : 'Revenue surplus: Great! You collected more than expected. This is normal for nyama choma (extras, tips, rounding).' }}
                    </div>
                  </div>
                  <div class="text-right hidden-xs-only">
                    <div class="text-caption grey--text">Expected</div>
                    <div class="text-body-2 font-weight-bold">{{ formatNumber(todayStats.revenue) }}</div>
                    <div class="text-caption grey--text mt-1">Received</div>
                    <div class="text-body-2 font-weight-bold">{{ formatNumber(todayStats.actualRevenue) }}</div>
                  </div>
                </div>
              </v-alert>
            </v-col>
          </v-row>
        </v-slide-y-transition>

        <!-- Main Action -->
        <v-row class="mb-4 mb-sm-6 reveal-card" style="animation-delay: 200ms">
          <v-col cols="12">
            <v-hover v-slot="{ hover }">
              <v-card
                class="rounded-xl overflow-hidden action-card-modern"
                elevation="3"
                :class="{
                  'action-complete': dateAlreadyEntered && subActive,
                  'action-pending': !dateAlreadyEntered && subActive,
                  'action-locked': !subActive,
                  'elevation-8': hover && !dateAlreadyEntered && subActive,
                }"
              >
                <v-card-text class="pa-0">
                  <v-btn
                    block
                    x-large
                    :color="getActionButtonColor"
                    :dark="subActive && !dateAlreadyEntered && !isConsolidated"
                    elevation="0"
                    class="rounded-0 py-6 py-sm-7 action-btn-modern"
                    @click="handleCloseDayClick"
                    :disabled="dateAlreadyEntered && !isConsolidated && subActive"
                  >
                    <div class="d-flex align-center justify-center w-100 px-4">
                      <v-avatar
                        :color="getActionAvatarColor"
                        size="52"
                        class="mr-4 action-avatar"
                      >
                        <v-icon
                          :color="getActionIconColor"
                          size="28"
                        >
                          {{ getCloseButtonIcon }}
                        </v-icon>
                      </v-avatar>
                      <div class="text-left flex-grow-1">
                        <div class="text-h6 text-sm-h5 font-weight-bold">
                          {{ getActionButtonText }}
                        </div>
                        <div
                          class="text-caption mt-1"
                          :class="getActionSubtitleColor"
                        >
                          {{ getActionSubtitle }}
                        </div>
                      </div>
                      <v-icon v-if="!subActive || isConsolidated || !dateAlreadyEntered" large class="ml-2">mdi-arrow-right</v-icon>
                      <v-chip
                        v-else
                        small
                        label
                        color="green lighten-5"
                        text-color="green darken-2"
                        class="font-weight-bold ml-2"
                      >
                        <v-icon x-small left>mdi-check</v-icon> Done
                      </v-chip>
                    </div>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <!-- Performance + Stats -->
        <v-row class="mb-4 mb-sm-6">
          <v-col cols="12" lg="7" class="reveal-card" style="animation-delay: 300ms">
            <v-card class="rounded-xl h-100" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="red lighten-5" size="36" class="mr-3">
                    <v-icon color="red">mdi-chart-bar</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Performance
                    </div>
                    <div class="text-caption grey--text">Revenue vs Cost breakdown</div>
                  </div>
                </div>
                <v-spacer />
                <v-btn
                  text
                  small
                  color="red darken-2"
                  class="text-capitalize rounded-lg font-weight-medium"
                  to="/reports"
                >
                  Full Report
                  <v-icon right small>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider />
              <v-simple-table class="rounded-b-xl performance-table-modern">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left text-subtitle-2 font-weight-medium grey--text text--darken-1">
                        Period
                      </th>
                      <th class="text-right text-subtitle-2 font-weight-medium grey--text text--darken-1">
                        Revenue
                      </th>
                      <th class="text-right text-subtitle-2 font-weight-medium grey--text text--darken-1">
                        Total Cost (Expenses)
                      </th>
                      <th class="text-right text-subtitle-2 font-weight-medium grey--text text--darken-1">
                        Net Profit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in performanceRows" :key="i" class="text-body-2 row-modern">
                      <td class="font-weight-medium py-3">
                        <v-icon x-small :color="row.iconColor" class="mr-2">{{
                          row.icon
                        }}</v-icon>
                        {{ row.label }}
                      </td>
                      <td class="text-right font-weight-medium py-3">
                        {{ formatNumber(row.revenue) }}
                      </td>
                      <td class="text-right grey--text py-3">
                        {{ formatNumber(row.cost) }}
                      </td>
                      <td
                        class="text-right font-weight-bold py-3"
                        :class="
                          row.margin >= 0
                            ? 'green--text text--darken-2'
                            : 'red--text text--darken-2'
                        "
                      >
                        {{ formatNumber(row.margin) }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>

          <v-col cols="12" lg="5" class="reveal-card" style="animation-delay: 400ms">
            <v-card class="rounded-xl h-100" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="blue lighten-5" size="36" class="mr-3">
                    <v-icon color="blue">mdi-poll</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Quick Stats
                    </div>
                    <div class="text-caption grey--text">Today's key metrics</div>
                  </div>
                </div>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <!-- Waste Rate -->
                <div class="mb-5">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-body-2 grey--text text--darken-1 font-weight-medium"
                      >Waste Rate</span
                    >
                    <span
                      class="text-h6 font-weight-bold"
                      :class="wasteAlert ? 'red--text' : 'green--text text--darken-2'"
                    >
                      {{ wastePct }}%
                    </span>
                  </div>
                  <v-progress-linear
                    :value="Math.min(wastePct * 10, 100)"
                    :color="wasteAlert ? 'red' : 'green'"
                    rounded
                    height="10"
                    class="rounded-lg progress-modern"
                    background-color="grey lighten-3"
                  />
                  <div class="text-caption grey--text mt-2 d-flex align-center">
                    <v-icon x-small :color="wasteAlert ? 'red' : 'green'" class="mr-1">{{
                      wasteAlert ? 'mdi-alert-circle' : 'mdi-check-circle'
                    }}</v-icon>
                    {{
                      wasteAlert
                        ? 'Above 5% threshold — investigate immediately'
                        : 'Within normal operating range'
                    }}
                  </div>
                </div>

                <v-divider class="my-4" />

                <!-- Payment Mix -->
                <div class="mb-5">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <span class="text-body-2 grey--text text--darken-1 font-weight-medium"
                      >Payment Mix</span
                    >
                  </div>
                  <div class="d-flex align-center mb-3">
                    <div class="flex-grow-1 mr-4">
                      <div class="d-flex justify-space-between text-caption mb-1">
                        <span class="font-weight-medium grey--text text--darken-1"
                          >M-Pesa</span
                        >
                        <span class="font-weight-bold green--text text--darken-2"
                          >{{ mpesaPct }}%</span
                        >
                      </div>
                      <v-progress-linear
                        :value="mpesaPct"
                        color="green"
                        rounded
                        height="8"
                        class="rounded-lg progress-modern mb-3"
                        background-color="grey lighten-3"
                      />
                      <div class="d-flex justify-space-between text-caption">
                        <span class="font-weight-medium grey--text text--darken-1"
                          >Cash</span
                        >
                        <span class="font-weight-bold blue--text text--darken-2"
                          >{{ cashPct }}%</span
                        >
                      </div>
                      <v-progress-linear
                        :value="cashPct"
                        color="blue"
                        rounded
                        height="8"
                        class="rounded-lg progress-modern"
                        background-color="grey lighten-3"
                      />
                    </div>
                  </div>
                </div>

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between align-center">
                  <div class="text-center flex-grow-1">
                    <div class="text-h5 font-weight-bold grey--text text--darken-2">
                      {{ recentEntries.length }}
                    </div>
                    <div class="text-caption grey--text text--darken-1">Days Recorded</div>
                  </div>
                  <v-divider vertical class="mx-4" />
                  <div class="text-center flex-grow-1">
                    <div class="text-h5 font-weight-bold grey--text text--darken-2">
                      {{ formatNumber(avgDailyRevenue) }}
                    </div>
                    <div class="text-caption grey--text text--darken-1">Avg Revenue/Day</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Entries -->
        <v-row class="reveal-card" style="animation-delay: 500ms">
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="orange lighten-5" size="36" class="mr-3">
                    <v-icon color="orange">mdi-history</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      {{ isConsolidated ? 'All Branches – Recent Entries' : 'Recent Entries' }}
                    </div>
                    <div class="text-caption grey--text">
                      {{ isConsolidated ? `Combined view across ${branches.length} branches` : 'Last 180 days of business records' }}
                    </div>
                  </div>
                </div>
                <v-spacer />
                <v-text-field
                  v-model="searchQuery"
                  placeholder="Search dates..."
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
                :headers="tableHeaders"
                :items="filteredEntries"
                :items-per-page="isConsolidated ? 8 : 5"
                dense
                hide-default-footer
                class="rounded-b-xl entries-table-modern"
                mobile-breakpoint="600"
              >
                <template v-slot:item.branch_name="{ item }">
                  <v-chip
                    x-small
                    color="blue lighten-5"
                    text-color="blue darken-2"
                    label
                    class="font-weight-medium"
                  >
                    {{ item.branch_name || '—' }}
                  </v-chip>
                </template>
                <template v-slot:item.date="{ item }">
                  <div class="d-flex align-center py-2">
                    <v-avatar :color="dateColor(item.date)" size="32" class="mr-3">
                      <span class="white--text text-caption font-weight-bold">{{
                        formatDay(item.date)
                      }}</span>
                    </v-avatar>
                    <div>
                      <div class="font-weight-medium text-body-2 grey--text text--darken-2">
                        {{ formatDateShort(item.date) }}
                      </div>
                      <div class="text-caption grey--text">
                        {{ formatDayName(item.date) }}
                      </div>
                    </div>
                  </div>
                </template>
                <template v-slot:item.sold_kg="{ item }">
                  <v-chip
                    x-small
                    :color="item.sold_kg > 100 ? 'red lighten-5' : 'grey lighten-4'"
                    label
                    class="font-weight-bold"
                  >
                    {{ item.sold_kg }} kg
                  </v-chip>
                </template>
                <template v-slot:item.actual_revenue="{ item }">
                  <span class="font-weight-bold text-body-2 purple--text text--darken-2">{{
                    formatNumber(item.actual_revenue)
                  }}</span>
                </template>
                <template v-slot:item.revenue="{ item }">
                  <span class="font-weight-medium text-caption grey--text">{{
                    formatNumber(item.revenue)
                  }}</span>
                </template>
                <template v-slot:item.total_cost="{ item }">
                  <span class="text-body-2 grey--text">{{
                    formatNumber(item.cogs)
                  }}</span>
                </template>
                <template v-slot:item.profit="{ item }">
                  <v-chip
                    x-small
                    :color="item.profit >= 0 ? 'green lighten-5' : 'red lighten-5'"
                    :text-color="item.profit >= 0 ? 'green darken-2' : 'red darken-2'"
                    label
                    class="font-weight-bold"
                  >
                    {{ formatNumber(item.profit) }}
                  </v-chip>
                </template>
                <template v-slot:item.closing_stock_kg="{ item }">
                  <span class="text-body-2 grey--text">{{ item.closing_stock_kg }} kg</span>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon
                    x-small
                    color="grey darken-1"
                    class="hover-red"
                    @click="editEntry(item)"
                    :disabled="!subActive || isConsolidated"
                    title="View entry"
                  >
                    <v-icon x-small>mdi-eye</v-icon>
                  </v-btn>
                </template>
                <template v-slot:no-data>
                  <div class="pa-8 text-center">
                    <v-icon size="48" color="grey lighten-2">mdi-calendar-blank</v-icon>
                    <div class="text-h6 grey--text mt-3">No entries yet</div>
                    <div class="text-body-2 grey--text text--lighten-1 mb-4">
                      {{ subActive ? (isConsolidated ? 'No entries across branches yet' : 'Start by closing today\'s business day') : 'Activate subscription to start recording' }}
                    </div>
                    <v-btn
                      v-if="subActive && !isConsolidated"
                      color="red darken-2"
                      dark
                      class="rounded-lg text-capitalize"
                      @click="openCloseDay"
                    >
                      <v-icon left>mdi-plus</v-icon> Add First Entry
                    </v-btn>
                    <v-btn
                      v-else-if="isOwner"
                      color="red darken-2"
                      dark
                      class="rounded-lg text-capitalize"
                      to="/subscription"
                    >
                      <v-icon left>mdi-crown</v-icon> Activate Subscription
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Mobile Navigation -->
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

      <v-btn
        @click="handleCloseDayClick"
        class="close-nav-btn"
        :disabled="dateAlreadyEntered && !isConsolidated && subActive"
      >
        <span>{{ getCloseButtonText }}</span>
        <v-icon>{{ getCloseButtonIcon }}</v-icon>
        <v-badge
          v-if="dateAlreadyEntered && subActive && !isConsolidated"
          color="green"
          dot
          class="close-badge"
        ></v-badge>
      </v-btn>

      <v-btn to="/reports">
        <span>Reports</span>
        <v-icon>mdi-chart-line</v-icon>
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
            <div class="text-caption grey--text">{{ shopName }} </div>
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

        <v-slide-y-transition>
          <v-btn
            v-if="canManageBranches"
            block
            color="red darken-2"
            dark
            class="rounded-xl text-capitalize font-weight-bold mb-3"
            to="/setupbranch"
          >
            <v-icon left small>mdi-store-plus</v-icon>
            Setup Branches
          </v-btn>
        </v-slide-y-transition>

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

    <!-- Close Day Dialog -->
    <v-dialog
      v-model="showForm"
      :fullscreen="nav_bars"
      :max-width="nav_bars ? undefined : 900"
      persistent
      scrollable
      transition="dialog-bottom-transition"
    >
      <v-card
        class="rounded-xl dialog-modern"
        :class="nav_bars ? '' : 'overflow-hidden'"
      >
        <v-toolbar
          :color="formReadOnly ? 'grey darken-2' : 'red darken-2'"
          dark
          flat
          height="70"
          class="dialog-toolbar-modern"
        >
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="text-h6 font-weight-bold">
            {{ formReadOnly ? 'View Entry (Read Only)' : (isEditing ? 'Edit Entry' : 'Close Business Day') }}
          </v-toolbar-title>
          <v-spacer />
          <v-menu
            v-model="dialogDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :disabled="formReadOnly"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                dark
                outlined
                class="mr-3 hidden-xs-only cursor-pointer"
                color="white"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon left small>mdi-calendar</v-icon>
                {{ formattedSelectedDate }}
              </v-chip>
            </template>
            <v-date-picker
              v-model="searchDate2"
              @input="onDialogDateChange"
              :max="todayDate"
              color="red darken-2"
              header-color="red darken-2"
              class="rounded-xl"
            ></v-date-picker>
          </v-menu>
          <v-btn
            icon
            dark
            class="hidden-sm-and-up mr-2"
            @click="mobileDatePicker = true"
            :disabled="formReadOnly"
          >
            <v-icon small>mdi-calendar</v-icon>
          </v-btn>
          <v-dialog v-model="mobileDatePicker" fullscreen hide-overlay transition="dialog-bottom-transition" class="hidden-sm-and-up">
            <v-card>
              <v-toolbar dark color="red darken-2">
                <v-btn icon dark @click="mobileDatePicker = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Select Date</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn text dark @click="mobileDatePicker = false">Done</v-btn>
              </v-toolbar>
              <v-date-picker
                v-model="searchDate2"
                @input="onMobileDateChange"
                :max="todayDate"
                color="red darken-2"
                header-color="red darken-2"
                full-width
              ></v-date-picker>
            </v-card>
          </v-dialog>
          <v-tooltip bottom :disabled="formValid && !formReadOnly">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn
                  text
                  dark
                  class="text-capitalize font-weight-bold rounded-lg"
                  @click="saveDailyEntry"
                  :loading="saving"
                  :disabled="!formValid || formReadOnly"
                >
                  Save
                </v-btn>
              </div>
            </template>
            <span>{{ formReadOnly ? 'Entry already recorded — cannot edit' : formValidationMessage }}</span>
          </v-tooltip>
        </v-toolbar>

        <v-card-text class="pa-4 pa-sm-6 bg-grey-lighten-4 dialog-content-modern">
          <!-- Date Alert -->
          <v-slide-y-transition>
            <v-alert
              v-if="!isToday && !formReadOnly"
              dense
              text
              type="info"
              class="mb-4 rounded-xl"
              border="left"
              colored-border
            >
              You are recording for <strong>{{ formattedSelectedDate }}</strong>
            </v-alert>
          </v-slide-y-transition>

          <!-- Locked Warning Banner -->
          <v-slide-y-transition>
            <v-alert
              v-if="formReadOnly"
              dense
              type="info"
              class="mb-4 rounded-xl"
              text
              border="left"
              colored-border
              elevation="2"
            >
              <div class="d-flex align-center flex-wrap">
                <v-avatar color="blue lighten-5" size="40" class="mr-3 hidden-xs-only">
                  <v-icon color="blue darken-2">mdi-lock</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-body-1 font-weight-bold grey--text text--darken-2">
                    Entry Already Recorded
                  </div>
                  <div class="text-body-2 grey--text text--darken-1">
                    This date has already been captured and cannot be edited.
                    Records are final once saved.
                  </div>
                </div>
              </div>
            </v-alert>
          </v-slide-y-transition>

          <!-- Tabs -->
          <v-card class="rounded-xl mb-4 overflow-hidden" elevation="1">
            <v-tabs
              v-model="activeTab"
              color="red darken-2"
              grow
              height="52"
              slider-color="red darken-2"
              class="tabs-modern"
            >
              <v-tab class="text-capitalize font-weight-medium text-body-2">
                <v-icon left small class="mr-1">mdi-package-variant</v-icon> Stock
              </v-tab>
              <v-tab class="text-capitalize font-weight-medium text-body-2">
                <v-icon left small class="mr-1">mdi-cash-register</v-icon> Sales
              </v-tab>
              <v-tab class="text-capitalize font-weight-medium text-body-2">
                <v-icon left small class="mr-1">mdi-receipt-text</v-icon> Expenses
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="activeTab" class="pa-4 pa-sm-6 transparent">
              <!-- STOCK -->
              <v-tab-item class="pa-0">
                <v-row dense>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="form.opening_stock_kg"
                      label="Opening Stock"
                      suffix="kg"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg mb-3"
                      :hint="lastClosingHint"
                      persistent-hint
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="form.supply_kg"
                      label="Supply Received"
                      suffix="kg"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg mb-3"
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="form.waste_kg"
                      label="Waste"
                      suffix="kg"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg mb-3"
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="form.closing_stock_kg"
                      label="Closing Stock"
                      suffix="kg"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg mb-3"
                      @input="calculateSold"
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="form.cost_per_kg"
                      label="Cost per kg"
                      prefix="KES"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg"
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="form.selling_price_per_kg"
                      label="Target Price"
                      prefix="KES"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg"
                      hint="Your planned selling price per kg"
                      persistent-hint
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex align-center justify-center py-2 py-md-0">
                    <v-card
                      class="pa-4 px-6 rounded-xl red lighten-5 w-100 text-center"
                      elevation="0"
                    >
                      <div
                        class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1"
                      >
                        Volume Sold
                      </div>
                      <div class="text-h3 font-weight-bold red--text text--darken-2">
                        {{ volumeSold }} <span class="text-h5">kg</span>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-tab-item>

              <!-- SALES -->
              <v-tab-item class="pa-0">
                <v-row dense>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.payment_cash"
                      label="Cash Payment"
                      prefix="KES"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg"
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="form.payment_mpesa"
                      label="M-Pesa Payment"
                      prefix="KES"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg"
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                </v-row>

                <v-row dense class="mt-4">
                  <v-col cols="12" md="4">
                    <v-card class="pa-4 rounded-xl green lighten-5" elevation="0">
                      <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1">
                        Expected Revenue
                      </div>
                      <div class="text-h5 font-weight-bold green--text text--darken-2">
                        {{ formatNumber(expectedRevenue) }}
                      </div>
                      <div class="text-caption grey--text mt-1">
                        {{ volumeSold }} kg × KES {{ form.selling_price_per_kg }} (target)
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card class="pa-4 rounded-xl purple lighten-5" elevation="0">
                      <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1">
                        Actual Revenue
                      </div>
                      <div class="text-h5 font-weight-bold purple--text text--darken-2">
                        {{ formatNumber(actualRevenue) }}
                      </div>
                      <div class="text-caption grey--text mt-1">
                        Cash + M-Pesa payments
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card class="pa-4 rounded-xl blue lighten-5" elevation="0">
                      <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1">
                        Actual Price / kg
                      </div>
                      <div class="text-h5 font-weight-bold blue--text text--darken-2">
                        KES {{ actualPricePerKg }}
                      </div>
                      <div class="text-caption mt-1" :class="priceDeltaClass">
                        {{ priceDeltaText }}
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Variance Alert -->
                <v-alert
                  v-if="Math.abs(expectedRevenue - actualRevenue) > 1"
                  dense
                  text
                  :type="expectedRevenue > actualRevenue ? 'warning' : 'info'"
                  class="mt-4 rounded-xl"
                  border="left"
                  colored-border
                >
                  <div class="d-flex justify-space-between align-center">
                    <span class="font-weight-medium">
                      Variance: KES {{ formatNumber(Math.abs(expectedRevenue - actualRevenue)) }}
                    </span>
                    <span class="text-caption grey--text">
                      {{ expectedRevenue > actualRevenue ? 'Expected > Received (shortfall)' : 'Received > Expected (surplus ✓)' }}
                    </span>
                  </div>
                </v-alert>
              </v-tab-item>

              <!-- EXPENSES -->
              <v-tab-item class="pa-0">
                <v-row dense align="end" class="mb-4">
                  <v-col cols="5">
                    <v-select
                      v-model="expenseForm.title"
                      :items="expenseTypes"
                      label="Expense Type"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="expenseForm.amount"
                      label="Amount"
                      prefix="KES"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg"
                      autocomplete="off"
                      :disabled="formReadOnly"
                    />
                  </v-col>
                  <v-col cols="2" class="text-center">
                    <v-btn
                      fab
                      small
                      color="red darken-2"
                      dark
                      elevation="2"
                      class="rounded-lg"
                      @click="addExpenseInline"
                      :disabled="formReadOnly"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-card
                  v-if="todayExpenses.length > 0"
                  class="rounded-xl overflow-hidden"
                  elevation="1"
                >
                  <v-simple-table dense>
                    <template v-slot:default>
                      <thead class="grey lighten-4">
                        <tr>
                          <th class="text-left text-body-2 font-weight-medium grey--text text--darken-1 py-3">
                            Item
                          </th>
                          <th class="text-right text-body-2 font-weight-medium grey--text text--darken-1 py-3">
                            Amount
                          </th>
                          <th class="text-right py-3" style="width: 50px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(exp, i) in todayExpenses" :key="i" class="row-modern">
                          <td class="text-body-2 py-3">
                            <v-icon x-small color="grey" class="mr-2">mdi-circle-small</v-icon>
                            {{ exp.title }}
                          </td>
                          <td class="text-right text-body-2 font-weight-medium py-3">
                            {{ formatNumber(exp.amount) }}
                          </td>
                          <td class="text-right py-3">
                            <v-btn
                              icon
                              x-small
                              color="grey lighten-1"
                              class="hover-red"
                              @click="removeExpense(i)"
                              :disabled="formReadOnly"
                            >
                              <v-icon x-small>mdi-close</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                        <tr class="grey lighten-4">
                          <td class="text-body-2 font-weight-bold py-3">Total Expenses</td>
                          <td class="text-right text-body-2 font-weight-bold py-3">
                            {{ formatNumber(todayExpenseTotal) }}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
                <v-alert
                  v-else
                  dense
                  text
                  type="info"
                  class="rounded-xl"
                  border="left"
                  colored-border
                >
                  <div class="d-flex align-center">
                    <v-icon color="info" class="mr-2">mdi-information</v-icon>
                    No expenses added yet. Add rent, salaries, or supplies above.
                  </div>
                </v-alert>
              </v-tab-item>
            </v-tabs-items>
          </v-card>

          <!-- Summary -->
          <v-card class="rounded-xl pa-5" elevation="2" color="white">
            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-subtitle-1 font-weight-bold grey--text text--darken-2"
                >Day Summary</span
              >
              <v-chip
                small
                :color="expectedProfit >= 0 ? 'green lighten-5' : 'red lighten-5'"
                :text-color="expectedProfit >= 0 ? 'green darken-2' : 'red darken-2'"
                label
                class="font-weight-bold"
              >
                {{ expectedProfit >= 0 ? 'PROJECTED PROFIT' : 'PROJECTED LOSS' }}
              </v-chip>
            </div>
            <v-row dense class="text-center">
              <v-col cols="3">
                <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1">
                  Expected Revenue
                </div>
                <div class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                  {{ formatNumber(expectedRevenue) }}
                </div>
              </v-col>
              <v-col cols="3">
                <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1">
                  Actual Revenue
                </div>
                <div class="text-h6 text-sm-h5 font-weight-bold purple--text text--darken-2">
                  {{ formatNumber(actualRevenue) }}
                </div>
              </v-col>
              <v-col cols="3">
                <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1">
                  COGS
                </div>
                <div class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                  {{ formatNumber(expectedCost) }}
                </div>
              </v-col>
              <v-col cols="3">
                <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1">
                  Net Profit
                </div>
                <div
                  class="text-h6 text-sm-h5 font-weight-bold"
                  :class="
                    expectedProfit >= 0
                      ? 'green--text text--darken-2'
                      : 'red--text text--darken-2'
                  "
                >
                  {{ formatNumber(expectedProfit) }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-card-text>

        <v-card-actions class="pa-4 pa-sm-6 pt-0 bg-grey-lighten-4 flex-column">
          <div
            v-if="!formValid || formReadOnly"
            class="text-caption grey--text text--darken-1 mb-2 text-center"
          >
            <v-icon x-small color="warning" class="mr-1">mdi-alert-circle-outline</v-icon>
            {{ formReadOnly ? 'This entry has already been recorded and cannot be edited.' : formValidationMessage }}
          </div>
          <v-btn
            block
            x-large
            :color="formReadOnly ? 'grey lighten-3' : 'red darken-2'"
            :dark="!formReadOnly"
            elevation="2"
            class="rounded-xl text-capitalize font-weight-bold"
            @click="saveDailyEntry"
            :loading="saving"
            :disabled="!formValid || formReadOnly"
            height="56"
          >
            <v-icon left>{{ formReadOnly ? 'mdi-lock' : 'mdi-content-save' }}</v-icon>
            {{ formReadOnly ? 'Entry Locked — Already Recorded' : (isEditing ? 'Update Record' : 'Close Day & Save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="460" persistent>
      <v-card class="rounded-xl pa-2" elevation="4">
        <v-card-title class="text-h6 font-weight-bold px-4 pt-4 pb-2">
          <v-avatar color="red lighten-5" size="40" class="mr-3">
            <v-icon color="red darken-2">mdi-check-circle-outline</v-icon>
          </v-avatar>
          Confirm Entry
        </v-card-title>
        <v-card-text class="px-4 py-3">
          <v-simple-table dense class="transparent confirm-table-modern">
            <template v-slot:default>
              <tbody>
                <tr v-for="(row, i) in confirmRows" :key="i" class="confirm-row">
                  <td class="text-body-2 grey--text py-3">
                    <div>{{ row.label }}</div>
                    <div
                      v-if="row.breakdown"
                      class="text-caption grey--text text--darken-1"
                      style="font-size: 11px; font-weight: 400; line-height: 1.3;"
                    >
                      {{ row.breakdown }}
                    </div>
                  </td>
                  <td
                    class="text-right text-body-2 font-weight-bold py-3"
                    :class="row.class || ''"
                  >
                    {{ row.value }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-alert
            v-if="wasteAlert"
            dense
            text
            type="warning"
            class="mt-4 rounded-xl"
            border="left"
            colored-border
          >
            <div class="d-flex align-center">
              <v-icon color="warning" small class="mr-2">mdi-alert</v-icon>
              <span class="text-body-2"
                >Waste is <strong>{{ wastePct }}%</strong> — above normal threshold</span
              >
            </div>
          </v-alert>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-btn
            text
            class="text-capitalize rounded-lg font-weight-medium"
            @click="confirmDialog = false"
            >Edit</v-btn
          >
          <v-spacer />
          <v-btn
            color="red darken-2"
            dark
            class="text-capitalize rounded-xl px-6 font-weight-bold"
            @click="submitConfirmed"
            elevation="2"
          >
            Confirm & Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import apiClient from '../services/api'

export default {
  name: 'Dashboard',

  data() {
    return {
      total_expenses: 0,
      total_expenses7: 0,
      total_expenses30: 0,
      // ── Subscription Gate ───────────────────────────────────────
      subLoading: true,
      subActive: false,
      subData: null,
      userProfile: null,
      planTier: 'free',
      // ── Role ───────────────────────────────────────────────────
      role: null,
      isOwner: false,
      accessibleBranchIds: [],
      // ── Existing Data ───────────────────────────────────────────
      proStatus: false,
      branches: [],
      isConsolidated: false,
      nav_bars: false,
      mobileDrawer: false,
      bottomNav: 0,
      loading: false,
      saving: false,
      user: null,
      shopName: 'Prime Cuts - CBD',
      branchId: 0,
      searchDate2: moment().format('YYYY-MM-DD'),
      todayDate: moment().format('YYYY-MM-DD'),
      searchQuery: '',
      showForm: false,
      activeTab: 0,
      confirmDialog: false,
      isEditing: false,
      lastClosingStock: null,
      todayEntryTime: null,
      selectedBranch: null,
      dialogDateMenu: false,
      mobileDatePicker: false,

      stats: {
        last: { revenue: 0, cost: 0, margin: 0 },
        week: { revenue: 0, cost: 0, margin: 0 },
        month: { revenue: 0, cost: 0, margin: 0 },
      },
      todayStats: {
        revenue: 0,
        profit: 0,
        marginPct: 0,
        wasteKg: 0,
        mpesa: 0,
        cash: 0,
      },
      weekTrend: { revenue: 0 },
      form: {
        date: moment().format('YYYY-MM-DD'),
        opening_stock_kg: '',
        supply_kg: '',
        waste_kg: '',
        closing_stock_kg: '',
        cost_per_kg: '',
        selling_price_per_kg: '',
        payment_cash: '',
        payment_mpesa: '',
      },
      expenseForm: { title: '', amount: '' },
      todayExpenses: [],
      sevenExpenses: [],
      thirtyExpenses: [],
      expenseTypes: ['rent', 'shopping', 'gas', 'labour', 'charcoal', 'electricity', 'other'],
      headers: [
        { text: 'Date', value: 'date', width: '120' },
        { text: 'Sold', value: 'sold_kg', align: 'end' },
        { text: 'Actual Revenue', value: 'actual_revenue', align: 'end' },
        { text: 'Expected Revenue', value: 'revenue', align: 'end' },
        { text: 'Profit', value: 'profit', align: 'end' },
        { text: 'Total Cost', value: 'total_cost', align: 'end' },
        { text: '', value: 'actions', align: 'end', sortable: false, width: '40' },
      ],
      recentEntries: [],
      snackbar: { show: false, text: '', color: 'success' },
      authUnsubscribe: null,
      mpesaReceipt: null,
      subscription: null,
      PaymentStatus: null,
      menuItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
        { title: 'Reports', icon: 'mdi-chart-line', to: '/reports' },
        { title: 'Profile', icon: 'mdi-account', to: '/profile' },
      ],
    }
  },

  computed: {
    userName() {
      return this.user?.displayName || this.userProfile?.name || 'Manager'
    },
    userInitials() {
      return this.userName.substring(0, 2).toUpperCase()
    },
    canRecordDaily() {
      return this.subActive === true
    },

    // ── Role + Plan gated capabilities ─────────────────────────
    // Owner on ANY active plan can reach /setupbranch (limit enforced by backend)
    canManageBranches() {
      return this.isOwner && this.subActive
    },

    // Show the branch switcher only when the owner has 2+ branches
    canSwitchBranches() {
      return this.canManageBranches && this.branches.length > 1
    },

    // Legacy alias for template buttons
    canUseMultiBranch() {
      return this.canManageBranches
    },

    canViewAdvancedReports() {
      return this.subActive && (this.planTier === 'business' || this.planTier === 'pro')
    },
    planDisplayName() {
      const map = { starter: 'Starter', business: 'Business', pro: 'Professional', free: 'Free' }
      return map[this.planTier] || 'Free'
    },
    branchSelectItems() {
      if (!this.branches || this.branches.length === 0) return []
      return ['All Branches', ...this.branches.map(b => b.name)]
    },
    tableHeaders() {
      if (this.isConsolidated) {
        return [
          { text: 'Branch', value: 'branch_name', width: '110' },
          { text: 'Date', value: 'date', width: '120' },
          { text: 'Sold', value: 'sold_kg', align: 'end' },
          { text: 'Actual Revenue', value: 'actual_revenue', align: 'end' },
          { text: 'Expected Revenue', value: 'revenue', align: 'end' },
          { text: 'Profit', value: 'profit', align: 'end' },
          { text: 'Total Cost', value: 'total_cost', align: 'end' },
          { text: '', value: 'actions', align: 'end', sortable: false, width: '40' },
        ]
      }
      return this.headers
    },
    formattedToday() {
      return moment().format('dddd, MMM D')
    },
    formattedSelectedDate() {
      return moment(this.searchDate2).format('dddd, MMM D, YYYY')
    },
    isToday() {
      return this.searchDate2 === moment().format('YYYY-MM-DD')
    },
    yesterday() {
      return moment().subtract(1, 'day').format('YYYY-MM-DD')
    },
    volumeSold() {
      const open = parseFloat(this.form.opening_stock_kg) || 0
      const supply = parseFloat(this.form.supply_kg) || 0
      const waste = parseFloat(this.form.waste_kg) || 0
      const close = parseFloat(this.form.closing_stock_kg) || 0
      return Math.max(0, open + supply - waste - close)
    },
    expectedRevenue() {
      return this.volumeSold * (parseFloat(this.form.selling_price_per_kg) || 0)
    },
    expectedCost() {
      return this.volumeSold * (parseFloat(this.form.cost_per_kg) || 0)
    },
    expectedProfit() {
      return this.expectedRevenue - this.todayExpenseTotal
    },

    // ── Actual Revenue & Actual Price / kg ─────────────────────
    actualRevenue() {
      return (parseFloat(this.form.payment_cash) || 0) + (parseFloat(this.form.payment_mpesa) || 0)
    },
    actualPricePerKg() {
      if (!this.volumeSold) return '0.00'
      return (this.actualRevenue / this.volumeSold).toFixed(2)
    },
    priceDelta() {
      const target = parseFloat(this.form.selling_price_per_kg) || 0
      const actual = parseFloat(this.actualPricePerKg) || 0
      if (!this.volumeSold || !target) return 0
      return actual - target
    },
    priceDeltaText() {
      if (!this.volumeSold || !this.form.selling_price_per_kg) {
        return 'Enter volume & target price'
      }
      const d = this.priceDelta
      if (Math.abs(d) < 0.5) {
        return `On target (KES ${parseFloat(this.form.selling_price_per_kg).toFixed(2)})`
      }
      if (d > 0) return `+KES ${d.toFixed(2)} above target`
      return `−KES ${Math.abs(d).toFixed(2)} below target`
    },
    priceDeltaClass() {
      if (!this.volumeSold) return 'grey--text'
      const d = this.priceDelta
      if (Math.abs(d) < 0.5) return 'green--text text--darken-2'
      return d > 0 ? 'green--text text--darken-2' : 'red--text text--darken-2'
    },

    todayExpenseTotal() {
      return this.todayExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    },
    wastePct() {
      const total = (parseFloat(this.form.opening_stock_kg) || 0) + (parseFloat(this.form.supply_kg) || 0)
      if (!total) return 0
      return (((parseFloat(this.form.waste_kg) || 0) / total) * 100).toFixed(1)
    },
    wasteAlert() {
      return parseFloat(this.wastePct) > 5
    },
    showMissedEntryAlert() {
      if (this.isConsolidated) return false
      const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')
      return !this.recentEntries.find((e) => e.date === yesterday) && this.isToday
    },
    lastClosingHint() {
      return this.lastClosingStock !== null ? `Yesterday: ${this.lastClosingStock}kg` : ''
    },
    todayEntryExists() {
      if (this.isConsolidated) return false
      return this.recentEntries.some((e) => e.date === this.searchDate2)
    },

    // ── Form Validation ────────────────────────────────────────
    formValid() {
      const has = (v) => v !== '' && v !== null && v !== undefined && !isNaN(parseFloat(v))

      const opening = has(this.form.opening_stock_kg)
      const supply  = has(this.form.supply_kg)
      const waste   = has(this.form.waste_kg)
      const closing = has(this.form.closing_stock_kg)
      const cost    = has(this.form.cost_per_kg)
      const target  = has(this.form.selling_price_per_kg)
      const cash    = has(this.form.payment_cash)
      const mpesa   = has(this.form.payment_mpesa)

      const volumeOk = this.volumeSold >= 0

      return opening && supply && waste && closing && cost && target && cash && mpesa && volumeOk
    },
    formValidationMessage() {
      if (this.formValid) return ''
      const has = (v) => v !== '' && v !== null && v !== undefined && !isNaN(parseFloat(v))
      const missing = []
      if (!has(this.form.opening_stock_kg)) missing.push('Opening Stock')
      if (!has(this.form.supply_kg))        missing.push('Supply')
      if (!has(this.form.waste_kg))         missing.push('Waste')
      if (!has(this.form.closing_stock_kg)) missing.push('Closing Stock')
      if (!has(this.form.cost_per_kg))      missing.push('Cost per kg')
      if (!has(this.form.selling_price_per_kg)) missing.push('Target Price')
      if (!has(this.form.payment_cash))     missing.push('Cash Payment')
      if (!has(this.form.payment_mpesa))    missing.push('M-Pesa Payment')
      if (this.volumeSold < 0)              missing.push('Valid volume')
      return 'Required: ' + missing.join(', ')
    },
    dateAlreadyEntered() {
      if (this.isConsolidated) return false
      if (!this.searchDate2) return false
      return this.recentEntries.some((e) => e.date === this.searchDate2)
    },

    // ── Hard lock: any date with an entry is read-only ─────────
    formReadOnly() {
      if (this.isConsolidated) return true
      if (!this.searchDate2) return false
      return this.recentEntries.some((e) => e.date === this.searchDate2)
    },

    mpesaPct() {
      const total = this.todayStats.mpesa + this.todayStats.cash
      return total ? Math.round((this.todayStats.mpesa / total) * 100) : 50
    },
    cashPct() {
      return 100 - this.mpesaPct
    },
    avgDailyRevenue() {
      if (!this.recentEntries.length) return 0
      const total = this.recentEntries.reduce((sum, e) => {
        const actual = parseFloat(e.actual_revenue) || 0
        return sum + actual
      }, 0)
      return total / this.recentEntries.length
    },
    filteredEntries() {
      let list = this.recentEntries
      if (this.planTier === 'starter') {
        const cutoff = moment().subtract(14, 'days').format('YYYY-MM-DD')
        list = list.filter((e) => e.date >= cutoff)
      }
      if (!this.searchQuery) return list
      const q = this.searchQuery.toLowerCase()
      return list.filter((e) =>
        e.date.includes(this.searchQuery) ||
        (e.branch_name && e.branch_name.toLowerCase().includes(q))
      )
    },

    // ── Close Button Computed Properties ─────────────────────
    getCloseButtonText() {
      if (!this.subActive) return 'Locked'
      if (this.isConsolidated) return 'Select Branch'
      if (this.dateAlreadyEntered) return 'Completed'
      return 'Close Day'
    },
    getCloseButtonIcon() {
      if (!this.subActive) return 'mdi-lock'
      if (this.isConsolidated) return 'mdi-store'
      if (this.dateAlreadyEntered) return 'mdi-check-circle'
      return 'mdi-plus-circle'
    },
    getActionButtonText() {
      if (!this.subActive) return 'Activate Subscription to Record'
      if (this.isConsolidated) return 'Select a Branch to Close Day'
      if (this.dateAlreadyEntered) return "Today's Entry Complete"
      return 'Close Business Day'
    },
    getActionButtonColor() {
      if (!this.subActive) return 'grey lighten-3'
      if (this.isConsolidated) return 'orange lighten-4'
      if (this.dateAlreadyEntered) return 'grey lighten-3'
      return 'red darken-2'
    },
    getActionAvatarColor() {
      if (!this.subActive) return 'grey'
      if (this.isConsolidated) return 'orange'
      if (this.dateAlreadyEntered) return 'grey'
      return 'white'
    },
    getActionIconColor() {
      if (!this.subActive) return 'white'
      if (this.isConsolidated) return 'white'
      if (this.dateAlreadyEntered) return 'white'
      return 'red darken-2'
    },
    getActionSubtitle() {
      if (!this.subActive) return this.isOwner
        ? 'Activate a plan to unlock daily stock & sales recording'
        : 'Ask your business owner to renew the subscription'
      if (this.isConsolidated) return 'Switch to a specific branch to record daily stock, sales & expenses'
      if (this.dateAlreadyEntered) return `Recorded at ${this.todayEntryTime || ''}`
      return 'Record stock, sales & expenses to lock in your daily numbers'
    },
    getActionSubtitleColor() {
      if (!this.subActive || this.isConsolidated || this.dateAlreadyEntered) {
        return 'grey--text'
      }
      return 'red--text text--lighten-4'
    },

    kpiCards() {
      const totalPayments = (this.todayStats.mpesa || 0) + (this.todayStats.cash || 0)
      const expectedRevenue = this.todayStats.revenue || 0
      const actualRevenue = this.todayStats.actualRevenue || totalPayments
      const revenueVariance = this.todayStats.revenueVariance || (expectedRevenue - actualRevenue)
      const hasVariance = Math.abs(revenueVariance) > 1 && expectedRevenue > 0

      const todayExpenses = this.todayStats?.totalExpenses || this.total_expenses || 0
      const cogs = this.todayStats?.cogs || this.expectedCost || 0
      const netProfit = actualRevenue - todayExpenses
      const marginPct = actualRevenue > 0 ? ((netProfit / actualRevenue) * 100).toFixed(1) : 0

      return [
        {
          label: 'Revenue',
          value: this.formatNumber(actualRevenue),
          subtitle: `Expected: ${this.formatNumber(expectedRevenue)}`,
          icon: 'mdi-cash-register',
          iconBg: 'green lighten-5',
          iconColor: 'green darken-2',
          bgClass: 'white',
          labelColor: 'grey--text',
          valueColor: 'grey--text text--darken-3',
          fullWidth: false,
        },
        {
          label: 'COGS (Meat)',
          value: this.formatNumber(cogs),
          subtitle: 'Cost of goods sold',
          icon: 'mdi-food-steak',
          iconBg: 'grey lighten-4',
          iconColor: 'grey darken-2',
          bgClass: 'white',
          labelColor: 'grey--text',
          valueColor: 'grey--text text--darken-2',
          fullWidth: false,
        },
        {
          label: 'Operating Expenses',
          value: this.formatNumber(todayExpenses),
          subtitle: 'Rent, labour, supplies',
          icon: 'mdi-receipt-text-outline',
          iconBg: 'orange lighten-5',
          iconColor: 'orange darken-2',
          bgClass: 'white',
          labelColor: 'grey--text',
          valueColor: 'orange--text text--darken-2',
          fullWidth: false,
        },
        {
          label: 'Net Profit',
          value: this.formatNumber(netProfit),
          subtitle: `${marginPct}% margin · Revenue − Expenses`,
          icon: 'mdi-cash-multiple',
          iconBg: netProfit >= 0 ? 'green lighten-5' : 'red lighten-5',
          iconColor: netProfit >= 0 ? 'green darken-2' : 'red',
          bgClass: 'white',
          labelColor: 'grey--text',
          valueColor: netProfit >= 0 ? 'green--text text--darken-2' : 'red--text',
          fullWidth: false,
        },
      ]
    },

    profitBreakdown() {
      const revenue = this.todayStats.actualRevenue ||
        (this.todayStats.mpesa || 0) + (this.todayStats.cash || 0) ||
        this.todayStats.revenue || 0
      const cogs = this.todayStats?.cogs || this.expectedCost || 0
      const expenses = this.todayStats?.totalExpenses || this.total_expenses || 0
      const netProfit = revenue - expenses
      const grossProfit = revenue - cogs

      return {
        revenue,
        cogs,
        expenses,
        grossProfit,
        netProfit,
        cogsPct: revenue > 0 ? ((cogs / revenue) * 100).toFixed(1) : 0,
        expensesPct: revenue > 0 ? ((expenses / revenue) * 100).toFixed(1) : 0,
        netMarginPct: revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0,
      }
    },
    performanceRows() {
      return [
        {
          label: 'Last entry',
          icon: 'mdi-calendar-today',
          iconColor: 'grey',
          revenue: this.stats.last.actualRevenue || this.stats.last.revenue,
          cost: this.stats.last.cost,
          cogs: this.stats.last.cogs,
          margin: this.stats.last.margin,
        },
        {
          label: 'Last 7 Days',
          icon: 'mdi-calendar-week',
          iconColor: 'blue',
          revenue: this.stats.week.actualRevenue || this.stats.week.revenue,
          cost: this.stats.week.cost,
          cogs: this.stats.week.cogs,
          margin: this.stats.week.margin,
        },
        {
          label: 'This Month',
          icon: 'mdi-calendar-month',
          iconColor: 'red',
          revenue: this.stats.month.actualRevenue || this.stats.month.revenue,
          cost: this.stats.month.cost,
          cogs: this.stats.month.cogs,
          margin: this.stats.month.margin,
        },
      ]
    },

    // ── Confirm Dialog Rows with kg breakdown ──────────────────
    confirmRows() {
      const targetPrice = parseFloat(this.form.selling_price_per_kg) || 0
      const actualRate = parseFloat(this.actualPricePerKg) || 0
      const costPerKg = parseFloat(this.form.cost_per_kg) || 0
      const vol = this.volumeSold
      const expenseCount = this.todayExpenses.length

      return [
        {
          label: 'Volume Sold',
          value: `${vol} kg`,
          breakdown: '',
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Expected Revenue',
          value: this.formatNumber(this.expectedRevenue),
          breakdown: vol && targetPrice
            ? `${vol} kg × KES ${targetPrice.toFixed(2)}/kg`
            : '',
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Actual Revenue',
          value: this.formatNumber(this.actualRevenue),
          breakdown: vol && actualRate
            ? `${vol} kg × KES ${actualRate.toFixed(2)}/kg${
                targetPrice && Math.abs(actualRate - targetPrice) >= 0.5
                  ? ` (${actualRate > targetPrice ? '+' : '−'}KES ${Math.abs(actualRate - targetPrice).toFixed(2)} vs target)`
                  : ''
              }`
            : '',
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Actual Price / kg',
          value: `KES ${this.actualPricePerKg}`,
          breakdown: vol
            ? `Revenue ÷ Volume (${this.formatNumber(this.actualRevenue)} ÷ ${vol} kg)`
            : '',
          class: 'blue--text text--darken-2',
        },
        {
          label: 'Cost of Goods',
          value: this.formatNumber(this.expectedCost),
          breakdown: vol && costPerKg
            ? `${vol} kg × KES ${costPerKg.toFixed(2)}/kg`
            : '',
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Expenses',
          value: this.formatNumber(this.todayExpenseTotal),
          breakdown: expenseCount
            ? `${expenseCount} item${expenseCount !== 1 ? 's' : ''}`
            : 'No expenses',
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Net Profit',
          value: this.formatNumber(this.expectedProfit),
          breakdown: 'Revenue − Expenses',
          class: this.expectedProfit >= 0 ? 'green--text font-weight-bold' : 'red--text font-weight-bold',
        },
      ]
    },
  },

  methods: {
    async checkSubscription() {
      this.subLoading = true
      try {
        if (!this.user?.uid) {
          this.subActive = false
          this.planTier = 'free'
          this.proStatus = false
          return
        }
        const { data } = await apiClient.get(`/subscriptions/status?firebase_uid=${this.user.uid}`)
        this.subData = data
        this.subActive = data?.is_active === true

        const planName = (
          data?.subscription?.plan ||
          data?.subscription?.tier ||
          data?.plan ||
          data?.tier ||
          ''
        ).toString().trim().toLowerCase()
        if (planName === 'pro' || planName === 'professional') {
          this.planTier = 'pro'
          this.proStatus = this.subActive
        } else if (planName === 'business') {
          this.planTier = 'business'
          this.proStatus = false
        } else if (planName === 'starter') {
          this.planTier = 'starter'
          this.proStatus = false
        } else if (!this.subActive) {
          this.planTier = 'free'
          this.proStatus = false
        }
      } catch (e) {
        console.error('Subscription check error:', e)
        this.subActive = false
        this.subData = null
        this.planTier = 'free'
        this.proStatus = false
      } finally {
        this.subLoading = false
      }
    },

    async loadRole() {
      if (!this.user?.uid) return
      try {
        const { data } = await apiClient.get(`/users/me/role?firebase_uid=${this.user.uid}`)
        this.role = data.role || 'none'
        this.isOwner = this.role === 'owner'
        this.accessibleBranchIds = data.accessible_branch_ids || []
      } catch (e) {
        console.warn('Role fetch failed — defaulting to none', e)
        this.role = 'none'
        this.isOwner = false
        this.accessibleBranchIds = []
      }
    },

    SelectionChange(branchName) {
      if (!branchName) return

      this.resetDashboardData()

      if (branchName === 'All Branches') {
        this.isConsolidated = true
        this.selectedBranch = 'All Branches'
        this.branchId = 0
        this.refreshAll()
        return
      }

      const branch = this.branches.find(b => b.name === branchName)
      if (!branch) return

      this.isConsolidated = false
      this.selectedBranch = branchName
      this.branchId = Number(branch.id)
      this.refreshAll()
    },

    handleCloseDayClick() {
      if (!this.subActive) {
        if (this.isOwner) {
          this.$router.push('/subscription')
        } else {
          this.showSnackbar('Subscription inactive. Contact your business owner.', 'warning')
        }
        return
      }
      if (this.isConsolidated) {
        this.showSnackbar('Select a specific branch to close the business day', 'warning')
        return
      }

      if (this.dateAlreadyEntered) {
        this.showSnackbar(
          `Entry for ${this.formatDateShort(this.searchDate2)} has already been recorded. Editing is disabled.`,
          'warning'
        )
        return
      }

      this.openCloseDay()
    },

    resetDashboardData() {
      this.recentEntries = []
      this.todayExpenses = []
      this.lastClosingStock = null
      this.todayEntryTime = null
      this.isEditing = false
      this.stats = {
        last: { revenue: 0, cost: 0, margin: 0 },
        week: { revenue: 0, cost: 0, margin: 0 },
        month: { revenue: 0, cost: 0, margin: 0 },
      }
      this.todayStats = {
        revenue: 0,
        profit: 0,
        marginPct: 0,
        wasteKg: 0,
        mpesa: 0,
        cash: 0,
      }
      this.weekTrend = { revenue: 0 }
      this.resetForm()
    },

    checkPaymentInfo() {
      if (!this.mpesaReceipt) {
        this.showSnackbar('Please set your M-Pesa receipt number in your profile.', 'error')
        this.$router.push('/subscription')
      }
    },

    formatNumber(val) {
      return numeral(val || 0).format('0,0')
    },

    formatDateShort(date) {
      return moment(date).format('MMM D, YYYY')
    },

    formatDay(date) {
      return moment(date).format('D')
    },

    formatDayName(date) {
      return moment(date).format('dddd')
    },

    dateColor(date) {
      const day = moment(date).day()
      return day === 0 || day === 6 ? 'red lighten-4' : 'grey lighten-3'
    },

    async apiCall(method, endpoint, data = null) {
      try {
        const response = await apiClient.request({ method, url: endpoint, data })
        return response.data
      } catch (error) {
        throw error
      }
    },

    async refreshAll() {
      if (this.loading) return
      this.loading = true
      try {
        await this.loadUserProfile()

        // Always attempt to load branches — managers need their single branch
        // loaded too, and owners on any paid plan need it for the selector.
        await this.loadBranches()

        if (!this.canSwitchBranches) {
          this.isConsolidated = false
        }

        if (this.isConsolidated && this.branches.length > 0) {
          await this.loadConsolidatedRecentEntries()
          await Promise.all([
            this.loadConsolidatedStats(),
            this.loadConsolidatedTodayStats(),
          ])
        } else if (this.branchId) {
          await Promise.all([
            this.loadStats(),
            this.loadRecentEntries(),
            this.loadLastEntry(),
            this.loadExpensesForDate7(this.get7DaysBefore(moment(new Date()).format('YYYY-MM-DD'))),
            this.loadExpensesForDate30(this.get30DaysBefore(moment(new Date()).format('YYYY-MM-DD'))),
          ])
        }
      } catch (e) {
        console.error('Refresh error', e)
      } finally {
        this.loading = false
      }
    },

    get7DaysBefore(date) {
      return moment(date).subtract(7, 'days').format('YYYY-MM-DD')
    },

    get30DaysBefore(date) {
      return moment(date).subtract(30, 'days').format('YYYY-MM-DD')
    },

    async loadStats() {
      try {
        const [last, week, month] = await Promise.all([
          this.apiCall('get', `/daily-operations/last?branch_id=${this.branchId}`),
          this.apiCall('get', `/reports/last-7-days?branch_id=${this.branchId}`),
          this.apiCall('get', `/reports/month-to-date?branch_id=${this.branchId}`),
        ])

        const lastActualRevenue = parseFloat(last.actualRevenue) || parseFloat(last.totalRevenue) || 0
        const lastCogs = parseFloat(last.cogs) || parseFloat(last.totalCogs) || 0
        const lastTotalCost = parseFloat(last.totalCost) || parseFloat(last.totalExpenses) || 0

        this.stats.last = {
          revenue: parseFloat(last.expectedRevenue) || parseFloat(last.totalRevenue) || 0,
          actualRevenue: lastActualRevenue,
          cost: lastTotalCost,
          cogs: lastCogs,
          expenses: lastTotalCost,
          margin: lastActualRevenue - lastTotalCost,
          expectedMargin: parseFloat(last.expectedMargin) || 0,
          revenueVariance: parseFloat(last.revenueVariance) || 0,
          paymentCash: parseFloat(last.paymentCash) || 0,
          paymentMpesa: parseFloat(last.paymentMpesa) || 0,
        }

        const weekRevenue = parseFloat(week.totalActualRevenue) || parseFloat(week.totalRevenue) || 0
        const weekCogs = parseFloat(week.totalCogs) || 0
        const weekCost = parseFloat(week.totalCost) || parseFloat(week.totalExpenses) || 0

        this.stats.week = {
          revenue: parseFloat(week.totalRevenue) || 0,
          actualRevenue: weekRevenue,
          cost: weekCost,
          cogs: weekCogs,
          expenses: weekCost,
          margin: weekRevenue - weekCost,
        }

        const monthRevenue = parseFloat(month.totalActualRevenue) || parseFloat(month.totalRevenue) || 0
        const monthCogs = parseFloat(month.totalCogs) || 0
        const monthCost = parseFloat(month.totalCost) || parseFloat(month.totalExpenses) || 0

        this.stats.month = {
          revenue: parseFloat(month.totalRevenue) || 0,
          actualRevenue: monthRevenue,
          cost: monthCost,
          cogs: monthCogs,
          expenses: monthCost,
          margin: monthRevenue - monthCost,
        }

        this.weekTrend.revenue = (this.stats.last.actualRevenue || this.stats.last.revenue) - (this.stats.week.revenue / 7)
      } catch (e) {
        console.error('Stats error', e)
      }
    },

    async loadRecentEntries() {
      try {
        const entries = await this.apiCall('get', `/daily-operations?branch_id=${this.branchId}&limit=180`)
        this.recentEntries = Object.freeze(entries || [])

        const todayEntry = this.recentEntries.find((e) => e.date === this.searchDate2)
        if (todayEntry) {
          this.populateForm(todayEntry)
          this.todayEntryTime = moment(todayEntry.created_at).format('h:mm A')
        }
      } catch (e) {
        console.error('Entries error', e)
      }
    },

    async loadLastEntry() {
      try {
        const entry = await this.apiCall('get', `/daily-operations/last?branch_id=${this.branchId}`)

        if (entry) {
          this.lastClosingStock = entry.closing_stock_kg
          if (!this.form.opening_stock_kg && this.isToday && !this.isEditing) {
            this.form.opening_stock_kg = entry.closing_stock_kg
          }

          let totalExpenses = 0
          try {
            const expenseData = await this.apiCall('get', `/expenses/${entry.date}?branch_id=${this.branchId}`)
            totalExpenses = expenseData?.totalPaid || 0
            this.todayExpenses = expenseData?.expenses || []
            this.total_expenses = totalExpenses
          } catch (expError) {
            this.todayExpenses = []
            this.total_expenses = 0
          }

          const expectedRevenue = parseFloat(entry.revenue) || 0
          const paymentCash = parseFloat(entry.payment_cash) || 0
          const paymentMpesa = parseFloat(entry.payment_mpesa) || 0
          const actualRevenue = parseFloat(entry.actual_revenue) || (paymentCash + paymentMpesa)
          const cogs = parseFloat(entry.cogs) || ((parseFloat(entry.sold_kg) || 0) * (parseFloat(entry.cost_per_kg) || 0))
          const actualProfit = actualRevenue - totalExpenses
          const expectedProfit = expectedRevenue - totalExpenses
          const revenueVariance = expectedRevenue - actualRevenue

          this.todayStats = {
            revenue: expectedRevenue,
            actualRevenue: actualRevenue,
            paymentCash: paymentCash,
            paymentMpesa: paymentMpesa,
            revenueVariance: revenueVariance,
            profit: actualProfit,
            expectedProfit: expectedProfit,
            cogs: cogs,
            totalExpenses: totalExpenses,
            marginPct: actualRevenue ? ((actualProfit / actualRevenue) * 100).toFixed(1) : 0,
            wasteKg: parseFloat(entry.waste_kg) || 0,
            mpesa: paymentMpesa,
            cash: paymentCash,
          }
        }
      } catch (e) {
        console.error('Last entry error', e)
      }
    },

    async loadConsolidatedStats() {
      try {
        const branchIds = this.branches.map(b => b.id)
        const results = await Promise.all(
          branchIds.map(async (id) => {
            try {
              const [last, week, month] = await Promise.all([
                this.apiCall('get', `/daily-operations/last?branch_id=${id}`),
                this.apiCall('get', `/reports/last-7-days?branch_id=${id}`),
                this.apiCall('get', `/reports/month-to-date?branch_id=${id}`),
              ])
              return { last, week, month }
            } catch (err) {
              console.warn(`Stats failed for branch ${id}`, err)
              return null
            }
          })
        )

        const valid = results.filter(Boolean)

        let lastActual = 0, lastExpected = 0, lastCost = 0, lastCogs = 0
        let weekActual = 0, weekExpected = 0, weekCost = 0, weekCogs = 0
        let monthActual = 0, monthExpected = 0, monthCost = 0, monthCogs = 0

        valid.forEach(({ last, week, month }) => {
          lastActual += parseFloat(last?.actualRevenue || last?.totalRevenue) || 0
          lastExpected += parseFloat(last?.expectedRevenue || last?.totalRevenue) || 0
          lastCost += parseFloat(last?.totalCost || last?.totalExpenses) || 0
          lastCogs += parseFloat(last?.cogs || last?.totalCogs) || 0

          weekActual += parseFloat(week?.totalActualRevenue || week?.totalRevenue) || 0
          weekExpected += parseFloat(week?.totalRevenue) || 0
          weekCost += parseFloat(week?.totalCost || week?.totalExpenses) || 0
          weekCogs += parseFloat(week?.totalCogs) || 0

          monthActual += parseFloat(month?.totalActualRevenue || month?.totalRevenue) || 0
          monthExpected += parseFloat(month?.totalRevenue) || 0
          monthCost += parseFloat(month?.totalCost || month?.totalExpenses) || 0
          monthCogs += parseFloat(month?.totalCogs) || 0
        })

        this.stats.last = {
          revenue: lastExpected,
          actualRevenue: lastActual,
          cost: lastCost,
          cogs: lastCogs,
          expenses: lastCost,
          margin: lastActual - lastCost,
        }
        this.stats.week = {
          revenue: weekExpected,
          actualRevenue: weekActual,
          cost: weekCost,
          cogs: weekCogs,
          expenses: weekCost,
          margin: weekActual - weekCost,
        }
        this.stats.month = {
          revenue: monthExpected,
          actualRevenue: monthActual,
          cost: monthCost,
          cogs: monthCogs,
          expenses: monthCost,
          margin: monthActual - monthCost,
        }
      } catch (e) {
        console.error('Consolidated stats error', e)
      }
    },

    async loadConsolidatedRecentEntries() {
      try {
        const allEntries = []
        await Promise.all(
          this.branches.map(async (branch) => {
            try {
              const entries = await this.apiCall('get', `/daily-operations?branch_id=${branch.id}&limit=180`)
              ;(entries || []).forEach((e) => {
                allEntries.push({
                  ...e,
                  branch_id: branch.id,
                  branch_name: branch.name,
                })
              })
            } catch (err) {
              console.warn(`Entries failed for branch ${branch.id}`, err)
            }
          })
        )

        allEntries.sort((a, b) => {
          const dateCmp = moment(b.date).valueOf() - moment(a.date).valueOf()
          if (dateCmp !== 0) return dateCmp
          return (a.branch_name || '').localeCompare(b.branch_name || '')
        })

        this.recentEntries = Object.freeze(allEntries)
        this.todayEntryTime = null
        this.isEditing = false
      } catch (e) {
        console.error('Consolidated entries error', e)
      }
    },

    async loadConsolidatedTodayStats() {
      try {
        const today = moment().format('YYYY-MM-DD')
        let totalExpected = 0
        let totalActual = 0
        let totalCash = 0
        let totalMpesa = 0
        let totalExpenses = 0
        let totalCogs = 0
        let totalWaste = 0

        await Promise.all(
          this.branches.map(async (branch) => {
            try {
              const entry = this.recentEntries.find(
                (e) => e.branch_id === branch.id && e.date === today
              ) || await this.apiCall('get', `/daily-operations/last?branch_id=${branch.id}`).catch(() => null)

              if (!entry || entry.date !== today) return

              const expected = parseFloat(entry.revenue) || 0
              const cash = parseFloat(entry.payment_cash) || 0
              const mpesa = parseFloat(entry.payment_mpesa) || 0
              const actual = parseFloat(entry.actual_revenue) || (cash + mpesa)
              const cogs = parseFloat(entry.cogs) || ((parseFloat(entry.sold_kg) || 0) * (parseFloat(entry.cost_per_kg) || 0))
              const waste = parseFloat(entry.waste_kg) || 0

              totalExpected += expected
              totalActual += actual
              totalCash += cash
              totalMpesa += mpesa
              totalCogs += cogs
              totalWaste += waste

              try {
                const expData = await this.apiCall('get', `/expenses/${today}?branch_id=${branch.id}`)
                totalExpenses += parseFloat(expData?.totalPaid) || 0
              } catch (_) {}
            } catch (err) {
              console.warn(`Today stats failed for branch ${branch.id}`, err)
            }
          })
        )

        const netProfit = totalActual - totalExpenses
        this.total_expenses = totalExpenses
        this.todayStats = {
          revenue: totalExpected,
          actualRevenue: totalActual,
          paymentCash: totalCash,
          paymentMpesa: totalMpesa,
          revenueVariance: totalExpected - totalActual,
          profit: netProfit,
          expectedProfit: totalExpected - totalExpenses,
          marginPct: totalActual ? ((netProfit / totalActual) * 100).toFixed(1) : 0,
          wasteKg: totalWaste,
          mpesa: totalMpesa,
          cash: totalCash,
          totalExpenses: totalExpenses,
          cogs: totalCogs,
        }
      } catch (e) {
        console.error('Consolidated today stats error', e)
      }
    },

    async loadUserProfile() {
      try {
        if (!this.user?.uid) return
        const { data } = await apiClient.get(`/users/${this.user.uid}/profile`)
        this.userProfile = data

        const raw = (data.subscription || data.plan || '').toString().trim().toLowerCase()
        if (raw === 'pro' || raw === 'professional') {
          this.planTier = 'pro'
          this.proStatus = true
        } else if (raw === 'business') {
          this.planTier = 'business'
          this.proStatus = false
        } else if (raw === 'starter') {
          this.planTier = 'starter'
          this.proStatus = false
        } else {
          this.planTier = 'free'
          this.proStatus = false
        }

        if (data.business_name) this.shopName = data.business_name
        if (data.mpesa_receipt) this.mpesaReceipt = data.mpesa_receipt
        if (data.subscription) this.subscription = data.subscription

        // Prefer user's primary branch as initial selection (only if nothing selected yet)
        if (data.branch_id && !this.branchId) {
          this.branchId = Number(data.branch_id)
        }
      } catch (e) {
        console.error('Profile load error:', e)
      }
    },

    async loadBranches() {
      try {
        if (!this.user?.uid) return
        const { data } = await apiClient.get(`/branches/my?firebase_uid=${this.user.uid}`)
        this.branches = data || []

        if (this.isConsolidated) {
          this.selectedBranch = 'All Branches'
          this.branchId = 0
          return
        }

        if (!this.selectedBranch && this.branches.length > 0) {
          // Prefer the user's primary branch if it's in the list
          const primary = this.branchId
            ? this.branches.find(b => Number(b.id) === Number(this.branchId))
            : null
          const chosen = primary || this.branches[0]

          this.selectedBranch = chosen.name
          this.branchId = Number(chosen.id)
          this.isConsolidated = false
        } else if (this.branchId && this.branches.length) {
          const current = this.branches.find(b => Number(b.id) === Number(this.branchId))
          if (current) {
            this.selectedBranch = current.name
            this.isConsolidated = false
          } else {
            // Primary branch was deleted or inaccessible — fall back to first available
            const first = this.branches[0]
            this.selectedBranch = first.name
            this.branchId = Number(first.id)
            this.isConsolidated = false
          }
        }
      } catch (e) {
        console.error('Branches load error:', e)
        this.branches = []
      }
    },

    populateForm(entry) {
      this.form.opening_stock_kg = entry.opening_stock_kg || ''
      this.form.supply_kg = entry.supply_kg || ''
      this.form.waste_kg = entry.waste_kg || ''
      this.form.closing_stock_kg = entry.closing_stock_kg || ''
      this.form.cost_per_kg = entry.cost_per_kg || ''
      this.form.selling_price_per_kg = entry.selling_price_per_kg || ''
      this.form.payment_cash = entry.payment_cash ?? ''
      this.form.payment_mpesa = entry.payment_mpesa ?? ''
      this.isEditing = true
    },

    selectDate(date) {
      this.searchDate2 = date
      this.openCloseDay()
    },

    openCloseDay() {
      if (this.dateAlreadyEntered) {
        this.showSnackbar(
          `Entry for ${this.formatDateShort(this.searchDate2)} has already been recorded.`,
          'warning'
        )
        return
      }

      this.showForm = true
      this.activeTab = 0
      this.confirmDialog = false
      if (!this.form.opening_stock_kg && this.lastClosingStock !== null && !this.isEditing) {
        this.form.opening_stock_kg = this.lastClosingStock
      }
      this.loadExpensesForDate(this.searchDate2)
    },

    closeDialog() {
      this.showForm = false
      this.todayExpenses = []
      if (!this.isEditing) this.resetForm()
    },

    getPreviousNDays(endDate, n = 30) {
      const end = moment(endDate)
      const dates = []

      for (let i = n - 1; i >= 0; i--) {
        dates.push(moment(end).subtract(i, 'days').format('YYYY-MM-DD'))
      }

      return {
        dates,
        count: n,
        startDate: dates[0],
        endDate: dates[n - 1]
      }
    },

    onDialogDateChange() {
      this.dialogDateMenu = false
      this.form.date = this.searchDate2
      const entry = this.recentEntries.find((e) => e.date === this.searchDate2)
      if (entry) {
        this.populateForm(entry)
      } else {
        this.isEditing = false
        this.resetForm()
      }
      this.loadExpensesForDate(this.searchDate2)
    },

    onMobileDateChange() {
      this.mobileDatePicker = false
      this.form.date = this.searchDate2
      const entry = this.recentEntries.find((e) => e.date === this.searchDate2)
      if (entry) {
        this.populateForm(entry)
      } else {
        this.isEditing = false
        this.resetForm()
      }
      this.loadExpensesForDate(this.searchDate2)
    },

    async loadExpensesForDate(date) {
      try {
        const expenseData = await this.apiCall('get', `/expenses/${date}?branch_id=${this.branchId}`)
        this.todayExpenses = expenseData?.expenses || []
        this.total_expenses = this.todayExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
      } catch (e) {
        this.todayExpenses = []
      }
    },

    async loadExpensesForDate7(date) {
      try {
        const expenseData = await this.apiCall('get', `/expenses/${date}?branch_id=${this.branchId}`)
        this.sevenExpenses = expenseData?.expenses || []
        this.total_expenses7 = this.sevenExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
      } catch (e) {
        this.sevenExpenses = []
      }
    },

    async loadExpensesForDate30(date) {
      try {
        const expenseData = await this.apiCall('get', `/expenses/${date}?branch_id=${this.branchId}`)
        this.thirtyExpenses = expenseData?.expenses || []
        this.total_expenses30 = this.thirtyExpenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
      } catch (e) {
        this.thirtyExpenses = []
      }
    },

    calculateSold() {},

    addExpenseInline() {
      if (this.formReadOnly) return
      if (!this.expenseForm.title || !this.expenseForm.amount) return
      this.todayExpenses.push({
        title: this.expenseForm.title,
        amount: parseFloat(this.expenseForm.amount),
      })
      this.expenseForm = { title: '', amount: '' }
    },

    removeExpense(index) {
      if (this.formReadOnly) return
      this.todayExpenses.splice(index, 1)
    },

    saveDailyEntry() {
      if (this.formReadOnly) {
        this.showSnackbar('This entry has already been recorded and cannot be edited.', 'warning')
        return
      }
      if (!this.formValid) {
        this.showSnackbar(this.formValidationMessage || 'Please fill in all required fields', 'warning')
        return
      }
      if (this.volumeSold < 0) {
        this.showSnackbar('Invalid stock figures — closing stock exceeds available stock', 'error')
        return
      }
      this.confirmDialog = true
    },

    async submitConfirmed() {
      this.confirmDialog = false
      this.saving = true

      const branchId = this.branchId || this.userProfile?.branch_id || 0
      const date = this.searchDate2 || moment().format('YYYY-MM-DD')

      if (!branchId) {
        this.showSnackbar('Error: No branch selected', 'error')
        this.saving = false
        return
      }

      const payload = {
        branch_id: branchId,
        date: date,
        opening_stock_kg: parseFloat(this.form.opening_stock_kg) || 0,
        supply_kg: parseFloat(this.form.supply_kg) || 0,
        waste_kg: parseFloat(this.form.waste_kg) || 0,
        closing_stock_kg: parseFloat(this.form.closing_stock_kg) || 0,
        cost_per_kg: parseFloat(this.form.cost_per_kg) || 0,
        selling_price_per_kg: parseFloat(this.form.selling_price_per_kg) || 0,
        payment_cash: parseFloat(this.form.payment_cash) || 0,
        payment_mpesa: parseFloat(this.form.payment_mpesa) || 0,
      }

      try {
        await this.apiCall('post', '/daily-operations', payload)

        if (this.todayExpenses.length > 0) {
          for (const exp of this.todayExpenses) {
            try {
              await this.apiCall('post', '/expenses', {
                branch_id: branchId,
                title: exp.title,
                amount: exp.amount,
                date: date,
              })
            } catch (expErr) {
              const status = expErr.response?.status
              if (status === 409) {
                console.warn(`Expense skipped for ${date} — day already closed on backend`)
                continue
              }
              throw expErr
            }
          }
        }

        this.showSnackbar('Day closed successfully!', 'success')
        this.showForm = false
        this.todayExpenses = []
        this.isEditing = false
        this.resetForm()
        await this.refreshAll()

      } catch (e) {
        const status = e.response?.status
        const code = e.response?.data?.code
        const message = e.response?.data?.message

        if (status === 409 && code === 'ENTRY_LOCKED') {
          this.showSnackbar(
            message || 'This entry has already been recorded and cannot be edited.',
            'warning'
          )
          this.showForm = false
          this.todayExpenses = []
          this.isEditing = false
          this.resetForm()
          await this.refreshAll()
          return
        }

        if (status === 405) {
          this.showSnackbar('Editing daily entries is not allowed.', 'warning')
          return
        }

        console.error('SUBMIT ERROR:', e.message, e.response?.data)
        this.showSnackbar('Error saving: ' + (message || e.message), 'error')
      } finally {
        this.saving = false
      }
    },

    resetForm() {
      this.form = {
        date: moment().format('YYYY-MM-DD'),
        opening_stock_kg: this.lastClosingStock || '',
        supply_kg: '',
        waste_kg: '',
        closing_stock_kg: '',
        cost_per_kg: '',
        selling_price_per_kg: '',
        payment_cash: '',
        payment_mpesa: '',
      }
    },

    showSnackbar(text, color = 'success') {
      this.snackbar = { show: true, text, color }
    },

    editEntry(item) {
      if (this.isConsolidated && item.branch_id) {
        const branch = this.branches.find(b => b.id === item.branch_id)
        if (branch) {
          this.isConsolidated = false
          this.selectedBranch = branch.name
          this.branchId = Number(branch.id)
        }
      }

      this.searchDate2 = item.date
      this.populateForm(item)
      this.showForm = true
      this.activeTab = 0
      this.confirmDialog = false
      this.loadExpensesForDate(this.searchDate2)
    },

    onResize() {
      this.nav_bars = window.innerWidth < 768
    },

    logout() {
      this.$fire.auth.signOut()
      this.$router.push('/login')
    },
  },

  watch: {
    selectedBranch(newVal, oldVal) {
      if (!newVal && oldVal && this.canSwitchBranches) {
        this.loadBranches()
      }
    },
    searchDate2(newDate) {
      this.form.date = newDate
      const entry = this.recentEntries.find((e) => e.date === newDate)
      if (entry) {
        this.populateForm(entry)
      } else {
        this.isEditing = false
        this.resetForm()
      }
    },
  },

  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
    this.authUnsubscribe = this.$fire.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        // Check subscription + role, then load everything once
        Promise.all([
          this.checkSubscription(),
          this.loadRole(),
        ]).then(() => {
          this.refreshAll()   // refreshAll internally calls loadUserProfile + loadBranches
        })
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
.cursor-pointer { cursor: pointer; }
.bg-grey-lighten-4 { background-color: #f5f5f5 !important; }
.rounded-xl { border-radius: 16px !important; }
.h-100 { height: 100%; }
.tracking-wide { letter-spacing: 0.08em; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-soft {
  0%, 100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(211, 47, 47, 0); }
}
@keyframes pulse-close {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.reveal-card { animation: fadeInUp 0.6s ease-out both; }

/* Sidebar */
.sidebar-modern { border-right: 1px solid #f0f0f0 !important; }
.nav-item-modern { transition: all 0.25s ease; margin-bottom: 4px; }
.nav-item-modern:hover { background-color: #fafafa; transform: translateX(4px); }

/* Main & Header */
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
  backface-visibility: hidden;
  transform: translateZ(0);
}
@media (max-width: 599px) {
  .sticky-header {
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
.user-btn-modern { transition: all 0.25s ease; }
.user-btn-modern:hover { background: #fafafa; }

/* KPI Cards */
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

/* Action Card */
.action-card-modern { transition: all 0.3s ease; }

.action-pending {
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  border: 1px solid #ffcdd2;
}
.action-pending .action-avatar { animation: pulse-close 2s infinite; }
.action-complete { background: #fafafa; border: 1px solid #eeeeee; }

.action-btn-modern {
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
}
.action-btn-modern:active { transform: scale(0.98); }

/* Close Button Styles */
.close-nav-btn { position: relative; }
.close-badge {
  position: absolute;
  top: 8px;
  right: 20%;
}

/* Card Headers */
.card-header-modern {
  background: linear-gradient(to bottom, #ffffff, #fafafa);
}

/* Tables */
.performance-table-modern tbody tr { transition: background-color 0.2s ease; }
.performance-table-modern tbody tr:hover { background-color: #fafafa; }
.entries-table-modern tbody tr { transition: background-color 0.2s ease; }
.entries-table-modern tbody tr:hover { background-color: #fafafa; }
.row-modern { transition: background-color 0.2s ease; }

/* Progress Bars */
.progress-modern { border-radius: 10px !important; }
.progress-modern ::v-deep .v-progress-linear__determinate { border-radius: 10px !important; }

/* Search */
.search-field-modern ::v-deep .v-input__slot { transition: all 0.25s ease; }
.search-field-modern ::v-deep .v-input__slot:hover,
.search-field-modern.v-input--is-focused ::v-deep .v-input__slot {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Dialog */
.dialog-toolbar-modern {
  transition: background 0.3s ease;
}
.dialog-content-modern { background-color: #f5f5f5 !important; }
.tabs-modern ::v-deep .v-tab { letter-spacing: 0.02em; }
.tabs-modern ::v-deep .v-tab--active { font-weight: 700 !important; }

/* Confirm Dialog */
.confirm-table-modern tbody tr.confirm-row { border-bottom: 1px solid #f5f5f5; }
.confirm-table-modern tbody tr.confirm-row:hover { background-color: #fafafa; }
.confirm-table-modern tbody tr:last-child { border-bottom: none; }

/* Bottom Nav */
.bottom-nav-modern {
  border-radius: 20px 20px 0 0 !important;
  overflow: hidden;
}
.bottom-nav-modern .v-btn { transition: all 0.3s ease; }
.bottom-nav-modern .v-btn:hover { background: rgba(211, 47, 47, 0.1); }
.bottom-nav-modern .v-btn--active { background: rgba(211, 47, 47, 0.15); }
.bottom-nav-modern .v-btn--active::before { opacity: 0; }

/* Mobile Drawer */
.mobile-drawer-modern { background: white !important; }

/* Hover Utilities */
.hover-red:hover { color: #d32f2f !important; }
.hover-red:hover .v-icon { color: #d32f2f !important; }

/* Snackbar */
.snackbar-modern ::v-deep .v-snackbar__content { padding: 12px 20px; }

/* Branch Selector */
.branch-select-modern ::v-deep .v-input__slot { min-height: 36px !important; }
.branch-select-modern ::v-deep .v-select__selections {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

/* Disabled / read-only mode styling */
.dialog-modern ::v-deep .v-input--is-disabled .v-input__slot {
  background-color: #f5f5f5 !important;
  opacity: 0.9;
}
.dialog-modern ::v-deep .v-input--is-disabled input,
.dialog-modern ::v-deep .v-input--is-disabled textarea {
  pointer-events: none !important;
  user-select: none !important;
  cursor: not-allowed !important;
  color: #424242 !important;
  -webkit-text-fill-color: #424242 !important;
}
.dialog-modern ::v-deep .v-input--is-disabled .v-label {
  color: #757575 !important;
}
.dialog-modern ::v-deep .v-input--is-disabled .v-input__icon {
  color: #bdbdbd !important;
}

@media (max-width: 599px) {
  .sticky-header { padding-left: 12px; padding-right: 12px; }
  .reveal-card { animation-duration: 0.4s; }
  .kpi-card-modern { padding: 16px !important; }
  .action-btn-modern {
    padding-top: 20px !important;
    padding-bottom: 20px !important;
  }
  .action-avatar {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    margin-right: 12px !important;
  }
  .dialog-content-modern { padding: 16px !important; }
}
</style>