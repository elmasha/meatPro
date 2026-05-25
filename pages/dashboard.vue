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
                <div>
                  <div class="d-flex align-center">
                    <h1 class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                      {{ formattedToday }}
                    </h1>
                    <v-chip
                      x-small
                      color="red lighten-5 red--text"
                      class="ml-2 font-weight-bold hidden-xs-only"
                      label
                      >Branch {{ branchId }}</v-chip
                    >
                  </div>
                  <div class="d-flex align-center mt-1">
                    <v-icon x-small color="grey" class="mr-1">mdi-map-marker</v-icon>
                    <span class="text-caption grey--text text--darken-1">{{ shopName }}</span>
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
        <!-- Missed Entry Alert -->
        <v-slide-y-transition>
          <v-alert
            v-if="showMissedEntryAlert"
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
              :class="card.bgClass"
              elevation="1"
              :style="card.gradient ? `background: ${card.gradient}` : ''"
            >
              <div class="d-flex align-start justify-space-between mb-3">
                <v-avatar :color="card.iconBg" size="44" class="elevation-1 kpi-avatar">
                  <v-icon :color="card.iconColor" size="22">{{ card.icon }}</v-icon>
                </v-avatar>
                <v-chip
                  v-if="card.trend !== undefined"
                  x-small
                  :color="card.trend >= 0 ? 'green lighten-5' : 'red lighten-5'"
                  :text-color="card.trend >= 0 ? 'green darken-2' : 'red darken-2'"
                  class="font-weight-bold"
                  label
                >
                  <v-icon x-small left>{{
                    card.trend >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'
                  }}</v-icon>
                  {{ Math.abs(card.trend) }}%
                </v-chip>
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

        <!-- Main Action -->
        <v-row class="mb-4 mb-sm-6 reveal-card" style="animation-delay: 200ms">
          <v-col cols="12">
            <v-hover v-slot="{ hover }">
              <v-card
                class="rounded-xl overflow-hidden action-card-modern"
                elevation="3"
                :class="{
                  'action-complete': todayEntryExists,
                  'action-pending': !todayEntryExists,
                  'elevation-8': hover && !todayEntryExists,
                }"
              >
                <v-card-text class="pa-0">
                  <v-btn
                    block
                    x-large
                    :color="todayEntryExists ? 'grey lighten-3' : 'red darken-2'"
                    :dark="!todayEntryExists"
                    elevation="0"
                    class="rounded-0 py-6 py-sm-7 action-btn-modern"
                    @click="openCloseDay"
                    :disabled="todayEntryExists && !isEditing"
                  >
                    <div class="d-flex align-center justify-center w-100 px-4">
                      <v-avatar
                        :color="todayEntryExists ? 'grey' : 'white'"
                        size="52"
                        class="mr-4 action-avatar"
                      >
                        <v-icon
                          :color="todayEntryExists ? 'white' : 'red darken-2'"
                          size="28"
                        >
                          {{ todayEntryExists ? 'mdi-check-circle' : 'mdi-store-check' }}
                        </v-icon>
                      </v-avatar>
                      <div class="text-left flex-grow-1">
                        <div class="text-h6 text-sm-h5 font-weight-bold">
                          {{
                            todayEntryExists ? "Today's Entry Complete" : 'Close Business Day'
                          }}
                        </div>
                        <div
                          class="text-caption mt-1"
                          :class="
                            todayEntryExists ? 'grey--text' : 'red--text text--lighten-4'
                          "
                        >
                          {{
                            todayEntryExists
                              ? `Recorded at ${todayEntryTime}`
                              : 'Record stock, sales & expenses to lock in your daily numbers'
                          }}
                        </div>
                      </div>
                      <v-icon v-if="!todayEntryExists" large class="ml-2"
                        >mdi-arrow-right</v-icon
                      >
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
                      <th
                        class="text-left text-subtitle-2 font-weight-medium grey--text text--darken-1"
                      >
                        Period
                      </th>
                      <th
                        class="text-right text-subtitle-2 font-weight-medium grey--text text--darken-1"
                      >
                        Revenue
                      </th>
                      <th
                        class="text-right text-subtitle-2 font-weight-medium grey--text text--darken-1"
                      >
                        Cost
                      </th>
                      <th
                        class="text-right text-subtitle-2 font-weight-medium grey--text text--darken-1"
                      >
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
                    <v-icon
                      x-small
                      :color="wasteAlert ? 'red' : 'green'"
                      class="mr-1"
                      >{{
                        wasteAlert ? 'mdi-alert-circle' : 'mdi-check-circle'
                      }}</v-icon
                    >
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
                      Recent Entries
                    </div>
                    <div class="text-caption grey--text">Last 30 days of business records</div>
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
                :headers="headers"
                :items="filteredEntries"
                :items-per-page="5"
                dense
                hide-default-footer
                class="rounded-b-xl entries-table-modern"
                mobile-breakpoint="600"
              >
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
                <template v-slot:item.revenue="{ item }">
                  <span class="font-weight-medium text-body-2 grey--text text--darken-2">{{
                    formatNumber(item.revenue)
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
                    color="grey lighten-1"
                    class="hover-red"
                    @click="editEntry(item)"
                  >
                    <v-icon x-small>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <template v-slot:no-data>
                  <div class="pa-8 text-center">
                    <v-icon size="48" color="grey lighten-2">mdi-calendar-blank</v-icon>
                    <div class="text-h6 grey--text mt-3">No entries yet</div>
                    <div class="text-body-2 grey--text text--lighten-1 mb-4">
                      Start by closing today's business day
                    </div>
                    <v-btn
                      color="red darken-2"
                      dark
                      class="rounded-lg text-capitalize"
                      @click="openCloseDay"
                    >
                      <v-icon left>mdi-plus</v-icon> Add First Entry
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
      <v-btn @click="openCloseDay">
        <span>Close</span>
        <v-icon>mdi-plus-circle</v-icon>
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
          color="red darken-2"
          dark
          flat
          height="70"
          class="dialog-toolbar-modern"
        >
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="text-h6 font-weight-bold">
            {{ isEditing ? 'Edit Entry' : 'Close Business Day' }}
          </v-toolbar-title>
          <v-spacer />
          <v-chip dark outlined class="mr-3 hidden-xs-only" color="white">
            <v-icon left small>mdi-calendar</v-icon>
            {{ formattedSelectedDate }}
          </v-chip>
          <v-btn
            text
            dark
            class="text-capitalize font-weight-bold rounded-lg"
            @click="saveDailyEntry"
            :loading="saving"
          >
            Save
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-4 pa-sm-6 bg-grey-lighten-4 dialog-content-modern">
          <!-- Date Alert -->
          <v-slide-y-transition>
            <v-alert
              v-if="!isToday"
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
                    />
                  </v-col>
                  <v-col cols="6" md="3">
                    <v-text-field
                      v-model="form.selling_price_per_kg"
                      label="Selling Price"
                      prefix="KES"
                      type="number"
                      outlined
                      rounded
                      dense
                      hide-details
                      class="rounded-lg"
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
                    />
                  </v-col>
                </v-row>
                <v-card class="mt-4 pa-5 rounded-xl green lighten-5" elevation="0">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div
                        class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1"
                      >
                        Expected Revenue
                      </div>
                      <div class="text-h4 font-weight-bold green--text text--darken-2">
                        {{ formatNumber(expectedRevenue) }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-caption grey--text">
                        {{ volumeSold }} kg × KES {{ form.selling_price_per_kg }}
                      </div>
                    </div>
                  </div>
                </v-card>
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
                          <th
                            class="text-left text-body-2 font-weight-medium grey--text text--darken-1 py-3"
                          >
                            Item
                          </th>
                          <th
                            class="text-right text-body-2 font-weight-medium grey--text text--darken-1 py-3"
                          >
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
              <v-col cols="4">
                <div
                  class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1"
                >
                  Revenue
                </div>
                <div class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                  {{ formatNumber(expectedRevenue) }}
                </div>
              </v-col>
              <v-col cols="4">
                <div
                  class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1"
                >
                  COGS
                </div>
                <div class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                  {{ formatNumber(expectedCost) }}
                </div>
              </v-col>
              <v-col cols="4">
                <div
                  class="text-caption grey--text text--darken-1 text-uppercase font-weight-bold tracking-wide mb-1"
                >
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

        <v-card-actions class="pa-4 pa-sm-6 pt-0 bg-grey-lighten-4">
          <v-btn
            block
            x-large
            color="red darken-2"
            dark
            elevation="2"
            class="rounded-xl text-capitalize font-weight-bold"
            @click="saveDailyEntry"
            :loading="saving"
            :disabled="volumeSold < 0"
            height="56"
          >
            <v-icon left>mdi-content-save</v-icon>
            {{ isEditing ? 'Update Record' : 'Close Day & Save' }}
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
                  <td class="text-body-2 grey--text py-3">{{ row.label }}</td>
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
import axios from 'axios'
import apiClient from '../services/api'

export default {
  name: 'Dashboard',

  data() {
    return {
      nav_bars: false,
      mobileDrawer: false,
      bottomNav: 0,
      loading: false,
      saving: false,
      user: null,
      shopName: 'Prime Cuts - CBD',
      branchId: 0,
      searchDate2: moment().format('YYYY-MM-DD'),
      searchQuery: '',
      showForm: false,
      activeTab: 0,
      confirmDialog: false,
      isEditing: false,
      lastClosingStock: null,
      todayEntryTime: null,

      stats: {
        last: {
          revenue: 0,
          cost: 0,
          margin: 0,
        },
        week: {
          revenue: 0,
          cost: 0,
          margin: 0,
        },
        month: {
          revenue: 0,
          cost: 0,
          margin: 0,
        },
      },
      todayStats: {
        revenue: 0,
        profit: 0,
        marginPct: 0,
        wasteKg: 0,
        mpesa: 0,
        cash: 0,
      },
      weekTrend: {
        revenue: 0,
      },

      form: {
        date: moment().format('YYYY-MM-DD'),
        opening_stock_kg: '',
        supply_kg: '',
        waste_kg: '',
        closing_stock_kg: '',
        cost_per_kg: 420,
        selling_price_per_kg: 650,
        payment_cash: 0,
        payment_mpesa: 0,
      },

      expenseForm: {
        title: '',
        amount: '',
      },
      todayExpenses: [],
      expenseTypes: ['rent', 'shopping', 'gas', 'labour', 'charcoal', 'electricity', 'other'],

      headers: [
        {
          text: 'Date',
          value: 'date',
          width: '120',
        },
        {
          text: 'Sold',
          value: 'sold_kg',
          align: 'end',
        },
        {
          text: 'Revenue',
          value: 'revenue',
          align: 'end',
        },
        {
          text: 'Profit',
          value: 'profit',
          align: 'end',
        },
        {
          text: 'Closing',
          value: 'closing_stock_kg',
          align: 'end',
        },
        {
          text: '',
          value: 'actions',
          align: 'end',
          sortable: false,
          width: '40',
        },
      ],
      recentEntries: [],

      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },

      menuItems: [
        {
          title: 'Dashboard',
          icon: 'mdi-view-dashboard',
          to: '/dashboard',
        },
        {
          title: 'Reports',
          icon: 'mdi-chart-line',
          to: '/reports',
        },
        {
          title: 'Profile',
          icon: 'mdi-account',
          to: '/profile',
        },
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
      return this.expectedRevenue - this.expectedCost - this.todayExpenseTotal
    },
    todayExpenseTotal() {
      return this.todayExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    },
    wastePct() {
      const total =
        (parseFloat(this.form.opening_stock_kg) || 0) + (parseFloat(this.form.supply_kg) || 0)
      if (!total) return 0
      return (((parseFloat(this.form.waste_kg) || 0) / total) * 100).toFixed(1)
    },
    wasteAlert() {
      return parseFloat(this.wastePct) > 5
    },
    showMissedEntryAlert() {
      const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')
      return !this.recentEntries.find((e) => e.date === yesterday) && this.isToday
    },
    lastClosingHint() {
      return this.lastClosingStock !== null ? `Yesterday: ${this.lastClosingStock}kg` : ''
    },
    todayEntryExists() {
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
      const total = this.recentEntries.reduce(
        (sum, e) => sum + (parseFloat(e.revenue) || 0),
        0
      )
      return total / this.recentEntries.length
    },
    filteredEntries() {
      if (!this.searchQuery) return this.recentEntries
      return this.recentEntries.filter((e) => e.date.includes(this.searchQuery))
    },
    kpiCards() {
      return [
        {
          label: "Today's Revenue",
          value: this.formatNumber(this.todayStats.revenue),
          subtitle: this.weekTrend.revenue >= 0 ? 'Above weekly avg' : 'Below weekly avg',
          icon: 'mdi-cash-multiple',
          iconBg: 'green lighten-5',
          iconColor: 'green',
          trend: this.weekTrend.revenue >= 0 ? 12 : -8,
          bgClass: 'white',
          labelColor: 'grey--text',
          valueColor: 'grey--text text--darken-3',
        },
        {
          label: 'Net Profit',
          value: this.formatNumber(this.todayStats.profit),
          subtitle: `${this.todayStats.marginPct}% margin`,
          icon: 'mdi-trending-up',
          iconBg: this.todayStats.profit >= 0 ? 'green lighten-5' : 'red lighten-5',
          iconColor: this.todayStats.profit >= 0 ? 'green' : 'red',
          bgClass: 'white',
          labelColor: 'grey--text',
          valueColor: this.todayStats.profit >= 0 ? 'green--text' : 'red--text',
        },
        {
          label: 'Waste',
          value: `${this.todayStats.wasteKg}kg`,
          subtitle: this.wasteAlert ? 'Check refrigeration' : 'Within normal',
          icon: 'mdi-delete-variant',
          iconBg: this.wasteAlert ? 'red lighten-5' : 'blue lighten-5',
          iconColor: this.wasteAlert ? 'red' : 'blue',
          bgClass: 'white',
          labelColor: 'grey--text',
          valueColor: this.wasteAlert ? 'red--text' : 'grey--text text--darken-3',
        },
        {
          label: 'M-Pesa / Cash',
          value: this.formatNumber(this.todayStats.mpesa),
          subtitle: `/ ${this.formatNumber(this.todayStats.cash)} cash`,
          icon: 'mdi-wallet',
          iconBg: 'purple lighten-5',
          iconColor: 'purple',
          bgClass: 'white',
          labelColor: 'grey--text',
          valueColor: 'grey--text text--darken-3',
        },
      ]
    },
    performanceRows() {
      return [
        {
          label: 'Yesterday',
          icon: 'mdi-calendar-today',
          iconColor: 'grey',
          revenue: this.stats.last.revenue,
          cost: this.stats.last.cost,
          margin: this.stats.last.margin,
        },
        {
          label: 'Last 7 Days',
          icon: 'mdi-calendar-week',
          iconColor: 'blue',
          revenue: this.stats.week.revenue,
          cost: this.stats.week.cost,
          margin: this.stats.week.margin,
        },
        {
          label: 'This Month',
          icon: 'mdi-calendar-month',
          iconColor: 'red',
          revenue: this.stats.month.revenue,
          cost: this.stats.month.cost,
          margin: this.stats.month.margin,
        },
      ]
    },
    confirmRows() {
      return [
        {
          label: 'Volume Sold',
          value: `${this.volumeSold} kg`,
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Revenue',
          value: this.formatNumber(this.expectedRevenue),
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Cost of Goods',
          value: this.formatNumber(this.expectedCost),
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Expenses',
          value: this.formatNumber(this.todayExpenseTotal),
          class: 'grey--text text--darken-2',
        },
        {
          label: 'Net Profit',
          value: this.formatNumber(this.expectedProfit),
          class:
            this.expectedProfit >= 0
              ? 'green--text font-weight-bold'
              : 'red--text font-weight-bold',
        },
      ]
    },
  },

  methods: {
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
        const response = await apiClient.request({
          method,
          url: endpoint,
          data,
        })
        return response.data
      } catch (error) {
        const msg = error.response.data.message || error.message
        //this.showSnackbar(msg, 'error')
        throw error
      }
    },

    async refreshAll() {
      this.loading = true
      await Promise.all([
        this.loadUserProfile(),
        this.loadStats(),
        this.loadRecentEntries(),
        this.loadLastEntry(),
      ])
      this.loading = false
    },

    async loadStats() {
      try {
        const [last, week, month] = await Promise.all([
          this.apiCall('get', `/reports/last-entry?branch_id=${this.branchId}`),
          this.apiCall('get', `/reports/last-7-days?branch_id=${this.branchId}`),
          this.apiCall('get', `/reports/month-to-date?branch_id=${this.branchId}`),
        ])
        this.stats.last = {
          revenue: parseFloat(last.totalRevenue) || 0,
          cost: parseFloat(last.totalCost) || 0,
          margin: parseFloat(last.netMargin) || 0,
        }
        this.stats.week = {
          revenue: week.totalRevenue || 0,
          cost: week.totalCost || 0,
          margin: week.totalProfit || 0,
        }
        this.stats.month = {
          revenue: month.totalRevenue || 0,
          cost: month.totalCost || 0,
          margin: month.totalProfit || 0,
        }
        this.weekTrend.revenue = this.stats.last.revenue - this.stats.week.revenue / 7
      } catch (e) {
        console.error('Stats error', e)
      }
    },

    async loadRecentEntries() {
      try {
        const entries = await this.apiCall(
          'get',
          `/daily-operations?branch_id=${this.branchId}`
        )
        this.recentEntries = entries || []
        console.log('Recent entries', this.recentEntries)
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
        const entry = await this.apiCall(
          'get',
          `/daily-operations/last?branch_id=${this.branchId}`
        )
        console.log('Last entry', entry)
        if (entry == null) {
          this.refreshAll()
        }
        if (entry) {
          this.lastClosingStock = entry.closing_stock_kg
          if (!this.form.opening_stock_kg && this.isToday && !this.isEditing) {
            this.form.opening_stock_kg = entry.closing_stock_kg
          }

          this.todayStats = {
            revenue: parseFloat(entry.revenue) || 0,
            profit: parseFloat(entry.profit) || 0,
            marginPct: entry.revenue ? ((entry.profit / entry.revenue) * 100).toFixed(1) : 0,
            wasteKg: parseFloat(entry.waste_kg) || 0,
            mpesa: parseFloat(entry.payment_mpesa) || 0,
            cash: parseFloat(entry.payment_cash) || 0,
          }
        }
      } catch (e) {
        console.error('Last entry error', e)
      }
    },
    async loadUserProfile() {
      try {
        if (!this.user?.uid) return
        const { data } = await apiClient.get(`/users/${this.user.uid}/profile`)
        this.userProfile = data
        console.log(data)
        // Auto-set shop name and branch from profile if available
        if (data.business_name) this.shopName = data.business_name
        if (data.id) this.branchId = data.id
      } catch (e) {
        console.error('Profile load error:', e)
      }
    },
    populateForm(entry) {
      this.form.opening_stock_kg = entry.opening_stock_kg || ''
      this.form.supply_kg = entry.supply_kg || ''
      this.form.waste_kg = entry.waste_kg || ''
      this.form.closing_stock_kg = entry.closing_stock_kg || ''
      this.form.cost_per_kg = entry.cost_per_kg || 420
      this.form.selling_price_per_kg = entry.selling_price_per_kg || 650
      this.form.payment_cash = entry.payment_cash || 0
      this.form.payment_mpesa = entry.payment_mpesa || 0
      this.isEditing = true
    },

    selectDate(date) {
      this.searchDate2 = date
      this.openCloseDay()
    },

    openCloseDay() {
      this.showForm = true
      this.activeTab = 0
      this.confirmDialog = false
      if (!this.form.opening_stock_kg && this.lastClosingStock !== null && !this.isEditing) {
        this.form.opening_stock_kg = this.lastClosingStock
      }
    },

    closeDialog() {
      this.showForm = false
      this.todayExpenses = []
      if (!this.isEditing) this.resetForm()
    },

    calculateSold() {},
    addExpenseInline() {
      if (!this.expenseForm.title || !this.expenseForm.amount) return
      this.todayExpenses.push({
        title: this.expenseForm.title,
        amount: parseFloat(this.expenseForm.amount),
      })
      this.expenseForm = {
        title: '',
        amount: '',
      }
    },
    removeExpense(index) {
      this.todayExpenses.splice(index, 1)
    },
    saveDailyEntry() {
      if (this.volumeSold < 0) {
        this.showSnackbar('Invalid stock figures', 'error')
        return
      }
      this.confirmDialog = true
    },
    async submitConfirmed() {
      this.confirmDialog = false
      this.saving = true
      const payload = {
        branch_id: this.branchId,
        date: this.searchDate2,
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
          await Promise.all(
            this.todayExpenses.map((exp) =>
              this.apiCall('post', '/expenses', {
                branch_id: this.branchId,
                title: exp.title,
                amount: exp.amount,
                date: this.searchDate2,
              })
            )
          )
        }
        this.showSnackbar(
          this.isEditing ? 'Day updated!' : 'Day closed successfully!',
          'success'
        )
        this.showForm = false
        this.todayExpenses = []
        this.isEditing = false
        this.resetForm()
        await this.refreshAll()
      } catch (e) {
        console.error(e)
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
        cost_per_kg: 420,
        selling_price_per_kg: 650,
        payment_cash: 0,
        payment_mpesa: 0,
      }
    },
    showSnackbar(text, color = 'success') {
      this.snackbar = {
        show: true,
        text,
        color,
      }
    },
    editEntry(item) {
      this.searchDate2 = item.date
      this.populateForm(item)
      this.openCloseDay()
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
    this.$fire.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        this.refreshAll()
        this.loadUserProfile() // <-- ADD THIS LINE
      } else {
        this.$router.push('/login')
      }
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
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

@keyframes pulse-soft {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(211, 47, 47, 0);
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
  background: rgba(245, 245, 245, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: all 0.3s ease;
}

.sticky-header.scrolled {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.user-btn-modern {
  transition: all 0.25s ease;
}

.user-btn-modern:hover {
  background: #fafafa;
}

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

.kpi-avatar {
  transition: all 0.3s ease;
}

.kpi-card-modern:hover .kpi-avatar {
  transform: scale(1.05);
}

/* Action Card */
.action-card-modern {
  transition: all 0.3s ease;
}

.action-pending {
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  border: 1px solid #ffcdd2;
}

.action-pending .action-avatar {
  animation: pulse-soft 2s infinite;
}

.action-complete {
  background: #fafafa;
  border: 1px solid #eeeeee;
}

.action-btn-modern {
  letter-spacing: 0.02em;
}

/* Card Headers */
.card-header-modern {
  background: linear-gradient(to bottom, #ffffff, #fafafa);
}

/* Tables */
.performance-table-modern tbody tr {
  transition: background-color 0.2s ease;
}

.performance-table-modern tbody tr:hover {
  background-color: #fafafa;
}

.entries-table-modern tbody tr {
  transition: background-color 0.2s ease;
}

.entries-table-modern tbody tr:hover {
  background-color: #fafafa;
}

.row-modern {
  transition: background-color 0.2s ease;
}

/* Progress Bars */
.progress-modern {
  border-radius: 10px !important;
}

.progress-modern ::v-deep .v-progress-linear__determinate {
  border-radius: 10px !important;
}

/* Search */
.search-field-modern ::v-deep .v-input__slot {
  transition: all 0.25s ease;
}

.search-field-modern ::v-deep .v-input__slot:hover,
.search-field-modern.v-input--is-focused ::v-deep .v-input__slot {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Dialog */
.dialog-toolbar-modern {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%) !important;
}

.dialog-content-modern {
  background-color: #f5f5f5 !important;
}

.tabs-modern ::v-deep .v-tab {
  letter-spacing: 0.02em;
}

.tabs-modern ::v-deep .v-tab--active {
  font-weight: 700 !important;
}

/* Confirm Dialog */
.confirm-table-modern tbody tr.confirm-row {
  border-bottom: 1px solid #f5f5f5;
}

.confirm-table-modern tbody tr.confirm-row:hover {
  background-color: #fafafa;
}

.confirm-table-modern tbody tr:last-child {
  border-bottom: none;
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

/* Hover Utilities */
.hover-red:hover {
  color: #d32f2f !important;
}

.hover-red:hover .v-icon {
  color: #d32f2f !important;
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

  .kpi-card-modern {
    padding: 16px !important;
  }

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

  .dialog-content-modern {
    padding: 16px !important;
  }
}
</style>