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
              {{ shopName || 'Analytics' }}
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
                <v-btn
                  v-else
                  icon
                  small
                  class="mr-3"
                  to="/dashboard"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <div>
                  <h1 class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                    Analytics & Reports
                  </h1>
                  <div class="d-flex align-center mt-1">
                    <v-icon x-small color="grey" class="mr-1">mdi-calendar-range</v-icon>
                    <span class="text-caption grey--text text--darken-1"
                      >Last {{ periodDays }} days</span
                    >
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="4" sm="6" class="d-flex justify-end align-center">
              <v-select
                v-model="periodDays"
                :items="periodOptions"
                item-text="label"
                item-value="value"
                dense
                outlined
                rounded
                hide-details
                class="rounded-lg mr-2 hidden-xs-only period-select-modern"
                style="max-width: 140px"
                @change="refreshAll"
              />
              <v-btn
                icon
                outlined
                small
                color="grey lighten-1"
                @click="refreshAll"
                :loading="loading"
              >
                <v-icon small>mdi-refresh</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container :fluid="nav_bars" class="px-4 px-sm-6 pt-2 pt-sm-4 pb-8">
        <!-- Period Chips -->
        <v-row class="mb-4 mb-sm-6 reveal-card" style="animation-delay: 0ms">
          <v-col cols="12">
            <v-chip-group
              v-model="periodDays"
              mandatory
              @change="refreshAll"
              active-class="red darken-2 white--text"
              class="period-chips-modern"
            >
              <v-chip
                v-for="opt in periodOptions"
                :key="opt.value"
                :value="opt.value"
                filter
                class="font-weight-medium rounded-lg px-4"
                color="red lighten-4"
                text-color="black darken-2"
              >
                {{ opt.label }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <!-- Comparative Cards -->
        <v-row dense class="mb-4 mb-sm-6">
          <v-col
            v-for="(card, i) in comparativeCards"
            :key="i"
            cols="6"
            lg="3"
            class="reveal-card"
            :style="{ 'animation-delay': i * 100 + 'ms' }"
          >
            <v-card
              class="pa-4 pa-sm-5 rounded-xl h-100 kpi-card-modern"
              elevation="1"
            >
              <div class="d-flex align-start justify-space-between mb-3">
                <v-avatar :color="card.bgColor" size="48" class="elevation-1 kpi-avatar">
                  <v-icon :color="card.iconColor" size="24">{{ card.icon }}</v-icon>
                </v-avatar>
                <v-chip
                  x-small
                  :color="card.change >= 0 ? 'green lighten-5' : 'red lighten-5'"
                  :text-color="card.change >= 0 ? 'green darken-2' : 'red darken-2'"
                  label
                  class="font-weight-bold"
                >
                  <v-icon x-small left>{{
                    card.change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'
                  }}</v-icon>
                  {{ Math.abs(card.change) }}%
                </v-chip>
              </div>
              <div
                class="text-caption font-weight-bold text-uppercase grey--text mb-1 tracking-wide"
              >
                {{ card.label }}
              </div>
              <div class="text-h5 text-sm-h4 font-weight-bold grey--text text--darken-3">
                {{ card.value }}
              </div>
              <div class="text-caption grey--text mt-1 font-weight-medium">vs last month</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Profit Trend + Best Days -->
        <v-row class="mb-4 mb-sm-6">
          <v-col cols="12" lg="8" class="reveal-card" style="animation-delay: 200ms">
            <v-card class="rounded-xl h-100" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="red lighten-5" size="36" class="mr-3">
                    <v-icon color="red">mdi-chart-line</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Profit Trend
                    </div>
                    <div class="text-caption grey--text">Daily profit/loss over time</div>
                  </div>
                </div>
                <v-spacer />
                <v-btn x-small text color="grey" class="text-capitalize font-weight-medium"
                  >Daily</v-btn
                >
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <div class="chart-container-modern">
                  <div
                    v-for="(day, i) in profitTrend"
                    :key="i"
                    class="chart-bar-wrapper-modern"
                  >
                    <div class="d-flex flex-column align-center w-100">
                      <div class="chart-bar-container-modern">
                        <div
                          class="chart-bar-modern"
                          :style="{
                            height: `${Math.max(day.pct, 5)}%`,
                            backgroundColor:
                              day.profit >= 0
                                ? 'linear-gradient(to top, #4caf50, #81c784)'
                                : 'linear-gradient(to top, #f44336, #e57373)',
                          }"
                        ></div>
                      </div>
                      <div class="chart-label-modern text-caption grey--text mt-2">
                        {{ formatDayShort(day.date) }}
                      </div>
                      <div
                        class="chart-value-modern text-caption font-weight-medium"
                        :class="day.profit >= 0 ? 'green--text' : 'red--text'"
                      >
                        {{ formatNumberShort(day.profit) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-space-between mt-4 text-caption grey--text">
                  <span
                    ><v-icon x-small color="green" class="mr-1">mdi-circle</v-icon> Profit |
                    <v-icon x-small color="red" class="mr-1">mdi-circle</v-icon> Loss</span
                  >
                  <span class="font-weight-medium">Avg Margin: {{ avgMargin }}%</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" class="reveal-card" style="animation-delay: 300ms">
            <v-card class="rounded-xl h-100" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="orange lighten-5" size="36" class="mr-3">
                    <v-icon color="orange">mdi-calendar-week</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Best Days
                    </div>
                    <div class="text-caption grey--text">Performance by day of week</div>
                  </div>
                </div>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <v-simple-table dense class="best-days-table-modern">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th
                          class="text-left text-caption grey--text font-weight-medium"
                        >
                          Day
                        </th>
                        <th
                          class="text-right text-caption grey--text font-weight-medium"
                        >
                          Avg Revenue
                        </th>
                        <th
                          class="text-right text-caption grey--text font-weight-medium"
                        >
                          Margin
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(day, i) in dayOfWeek" :key="i" class="row-modern">
                        <td class="text-body-2 py-3">
                          <v-icon x-small :color="dayColor(i)" class="mr-2"
                            >mdi-circle</v-icon
                          >
                          {{ day.day_name }}
                        </td>
                        <td class="text-right text-body-2 font-weight-medium py-3">
                          {{ formatNumber(day.avg_revenue) }}
                        </td>
                        <td class="text-right py-3">
                          <v-chip
                            x-small
                            :color="
                              day.avg_profit > 0 ? 'green lighten-5' : 'red lighten-5'
                            "
                            :text-color="day.avg_profit > 0 ? 'green' : 'red'"
                            label
                            class="font-weight-bold"
                          >
                            {{ dayMargin(day) }}%
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Waste & Payment -->
        <v-row class="mb-4 mb-sm-6">
          <!-- Waste Analysis -->
          <v-col cols="12" lg="6" class="reveal-card" style="animation-delay: 400ms">
            <v-card class="rounded-xl h-100" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="red lighten-5" size="36" class="mr-3">
                    <v-icon color="red">mdi-delete-variant</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Waste Analysis
                    </div>
                    <div class="text-caption grey--text">Cost of spoilage & trimmings</div>
                  </div>
                </div>
                <v-spacer />
                <v-chip
                  small
                  :color="wasteData.avgWastePct > 5 ? 'red lighten-5' : 'green lighten-5'"
                  :text-color="wasteData.avgWastePct > 5 ? 'red' : 'green'"
                  label
                  class="font-weight-bold"
                >
                  {{ wasteData.avgWastePct }}% avg
                </v-chip>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <div class="d-flex align-center mb-5">
                  <div class="flex-grow-1 mr-4">
                    <div class="d-flex justify-space-between text-body-2 mb-2">
                      <span class="grey--text text--darken-1 font-weight-medium"
                        >Total Waste Cost</span
                      >
                      <span class="font-weight-bold red--text text--darken-2">{{
                        formatNumber(wasteData.totalWasteCost)
                      }}</span>
                    </div>
                    <v-progress-linear
                      :value="Math.min(wasteData.avgWastePct * 15, 100)"
                      :color="wasteData.avgWastePct > 5 ? 'red' : 'green'"
                      rounded
                      height="10"
                      class="rounded-lg progress-modern"
                      background-color="grey lighten-3"
                    />
                  </div>
                </div>

                <v-simple-table dense class="waste-table-modern">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left text-caption grey--text font-weight-medium">
                          Date
                        </th>
                        <th
                          class="text-right text-caption grey--text font-weight-medium"
                        >
                          Waste (kg)
                        </th>
                        <th
                          class="text-right text-caption grey--text font-weight-medium"
                        >
                          %
                        </th>
                        <th
                          class="text-right text-caption grey--text font-weight-medium"
                        >
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(row, i) in wasteData.data.slice(0, 7)"
                        :key="i"
                        class="row-modern"
                      >
                        <td class="text-body-2 py-3">
                          {{ formatDateShort(row.date) }}
                        </td>
                        <td class="text-right text-body-2 py-3">
                          {{ row.waste_kg }} kg
                        </td>
                        <td class="text-right py-3">
                          <v-chip
                            x-small
                            :color="
                              row.waste_pct > 5 ? 'red lighten-5' : 'grey lighten-4'
                            "
                            :text-color="row.waste_pct > 5 ? 'red' : 'grey'"
                            label
                            class="font-weight-bold"
                          >
                            {{ parseFloat(row.waste_pct).toFixed(1) }}%
                          </v-chip>
                        </td>
                        <td class="text-right text-body-2 grey--text py-3">
                          {{ formatNumber(row.waste_cost) }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Payment Mix -->
          <v-col cols="12" lg="6" class="reveal-card" style="animation-delay: 500ms">
            <v-card class="rounded-xl h-100" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="blue lighten-5" size="36" class="mr-3">
                    <v-icon color="blue">mdi-wallet</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Payment Mix
                    </div>
                    <div class="text-caption grey--text">M-Pesa vs Cash breakdown</div>
                  </div>
                </div>
                <v-spacer />
                <v-chip
                  small
                  color="green lighten-5"
                  text-color="green darken-2"
                  label
                  class="font-weight-bold"
                >
                  {{ paymentData.avgMpesaPct }}% M-Pesa
                </v-chip>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <div class="d-flex align-center justify-center mb-6">
                  <div class="text-center mr-8">
                    <v-progress-circular
                      :value="paymentData.avgMpesaPct"
                      :size="110"
                      :width="12"
                      color="green"
                      class="mb-2"
                    >
                      <div class="text-h5 font-weight-bold green--text text--darken-2">
                        {{ paymentData.avgMpesaPct }}%
                      </div>
                    </v-progress-circular>
                    <div class="text-caption grey--text text--darken-1 font-weight-medium">
                      M-Pesa
                    </div>
                    <div class="text-h6 font-weight-bold green--text text--darken-2 mt-1">
                      {{ formatNumber(paymentData.totalMpesa) }}
                    </div>
                  </div>
                  <div class="text-center">
                    <v-progress-circular
                      :value="100 - paymentData.avgMpesaPct"
                      :size="110"
                      :width="12"
                      color="blue"
                      class="mb-2"
                    >
                      <div class="text-h5 font-weight-bold blue--text text--darken-2">
                        {{ 100 - paymentData.avgMpesaPct }}%
                      </div>
                    </v-progress-circular>
                    <div class="text-caption grey--text text--darken-1 font-weight-medium">
                      Cash
                    </div>
                    <div class="text-h6 font-weight-bold blue--text text--darken-2 mt-1">
                      {{ formatNumber(paymentData.totalCash) }}
                    </div>
                  </div>
                </div>

                <v-simple-table dense class="payment-table-modern">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left text-caption grey--text font-weight-medium">
                          Date
                        </th>
                        <th
                          class="text-right text-caption grey--text font-weight-medium"
                        >
                          M-Pesa
                        </th>
                        <th
                          class="text-right text-caption grey--text font-weight-medium"
                        >
                          Cash
                        </th>
                        <th
                          class="text-right text-caption grey--text font-weight-medium"
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(row, i) in paymentData.data.slice(0, 5)"
                        :key="i"
                        class="row-modern"
                      >
                        <td class="text-body-2 py-3">
                          {{ formatDateShort(row.date) }}
                        </td>
                        <td class="text-right text-body-2 green--text py-3">
                          {{ formatNumber(row.payment_mpesa) }}
                        </td>
                        <td class="text-right text-body-2 blue--text py-3">
                          {{ formatNumber(row.payment_cash) }}
                        </td>
                        <td class="text-right text-body-2 font-weight-medium py-3">
                          {{
                            formatNumber(
                              parseFloat(row.payment_mpesa) + parseFloat(row.payment_cash)
                            )
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Expense Breakdown -->
        <v-row class="mb-4 mb-sm-6 reveal-card" style="animation-delay: 600ms">
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="purple lighten-5" size="36" class="mr-3">
                    <v-icon color="purple">mdi-receipt-text</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Expense Breakdown
                    </div>
                    <div class="text-caption grey--text">Where your money goes</div>
                  </div>
                </div>
                <v-spacer />
                <div class="text-h6 font-weight-bold red--text text--darken-2">
                  {{ formatNumber(expenseData.grandTotal) }}
                </div>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-4 pa-sm-6">
                <v-row>
                  <v-col cols="12" md="6">
                    <div
                      v-for="(exp, i) in expenseData.data"
                      :key="i"
                      class="mb-4 expense-item-modern"
                    >
                      <div class="d-flex justify-space-between align-center mb-2">
                        <div class="d-flex align-center">
                          <v-icon
                            x-small
                            :color="expenseColors[i % expenseColors.length]"
                            class="mr-2"
                            >mdi-circle</v-icon
                          >
                          <span class="text-body-2 font-weight-medium grey--text text--darken-2">{{
                            exp.title
                          }}</span>
                          <v-chip x-small class="ml-2" label color="grey lighten-4">{{
                            exp.count
                          }}x</v-chip>
                        </div>
                        <span class="text-body-2 font-weight-bold grey--text text--darken-2">{{
                          formatNumber(exp.total)
                        }}</span>
                      </div>
                      <v-progress-linear
                        :value="exp.pct"
                        :color="expenseColors[i % expenseColors.length]"
                        rounded
                        height="14"
                        class="rounded-lg progress-modern"
                        background-color="grey lighten-3"
                      >
                        <template v-slot:default>
                          <span
                            class="text-caption white--text font-weight-bold px-1"
                            >{{ exp.pct }}%</span
                          >
                        </template>
                      </v-progress-linear>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-simple-table dense class="expense-table-modern">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th
                              class="text-left text-caption grey--text font-weight-medium py-3"
                            >
                              Category
                            </th>
                            <th
                              class="text-right text-caption grey--text font-weight-medium py-3"
                            >
                              Total
                            </th>
                            <th
                              class="text-right text-caption grey--text font-weight-medium py-3"
                            >
                              %
                            </th>
                            <th
                              class="text-right text-caption grey--text font-weight-medium py-3"
                            >
                              Avg
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(exp, i) in expenseData.data"
                            :key="i"
                            class="row-modern"
                          >
                            <td class="text-body-2 py-3">
                              <v-icon
                                x-small
                                :color="expenseColors[i % expenseColors.length]"
                                class="mr-2"
                                >mdi-circle</v-icon
                              >
                              {{ exp.title }}
                            </td>
                            <td class="text-right text-body-2 font-weight-medium py-3">
                              {{ formatNumber(exp.total) }}
                            </td>
                            <td class="text-right py-3">
                              <v-chip
                                x-small
                                :color="
                                  expenseColors[i % expenseColors.length] + ' lighten-5'
                                "
                                :text-color="expenseColors[i % expenseColors.length]"
                                label
                                class="font-weight-bold"
                              >
                                {{ exp.pct }}%
                              </v-chip>
                            </td>
                            <td class="text-right text-body-2 grey--text py-3">
                              {{ formatNumber(exp.avg_amount) }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Daily Summary Table -->
        <v-row class="reveal-card" style="animation-delay: 700ms">
          <v-col cols="12">
            <v-card class="rounded-xl" elevation="1">
              <v-card-title class="px-4 px-sm-6 py-4 card-header-modern">
                <div class="d-flex align-center">
                  <v-avatar color="teal lighten-5" size="36" class="mr-3">
                    <v-icon color="teal">mdi-table</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-bold grey--text text--darken-2">
                      Daily Summary
                    </div>
                    <div class="text-caption grey--text">
                      Complete daily records ({{ dailySummary.length }} days)
                    </div>
                  </div>
                </div>
                <v-spacer />
                <v-btn
                  small
                  text
                  color="red darken-2"
                  class="text-capitalize font-weight-medium rounded-lg"
                  @click="exportCSV"
                >
                  <v-icon left small>mdi-download</v-icon> Export CSV
                </v-btn>
              </v-card-title>
              <v-divider />
              <v-data-table
                :headers="summaryHeaders"
                :items="dailySummary"
                :items-per-page="10"
                dense
                class="rounded-b-xl summary-table-modern"
                mobile-breakpoint="600"
              >
                <template v-slot:item.date="{ item }">
                  <div class="d-flex align-center py-1">
                    <v-avatar
                      :color="dateColor(item.date)"
                      size="28"
                      class="mr-2 hidden-xs-only"
                    >
                      <span class="white--text text-caption font-weight-bold">{{
                        formatDayShort(item.date)
                      }}</span>
                    </v-avatar>
                    <span class="font-weight-medium text-body-2 grey--text text--darken-2">{{
                      formatDateShort(item.date)
                    }}</span>
                  </div>
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
                <template v-slot:item.margin_pct="{ item }">
                  <span
                    class="font-weight-bold text-body-2"
                    :class="
                      item.margin_pct >= 20
                        ? 'green--text'
                        : item.margin_pct >= 10
                        ? 'orange--text'
                        : 'red--text'
                    "
                  >
                    {{ parseFloat(item.margin_pct || 0).toFixed(1) }}%
                  </span>
                </template>
                <template v-slot:item.waste_pct="{ item }">
                  <v-chip
                    x-small
                    :color="item.waste_pct > 5 ? 'red lighten-5' : 'grey lighten-4'"
                    :text-color="item.waste_pct > 5 ? 'red' : 'grey'"
                    label
                    class="font-weight-bold"
                  >
                    {{ parseFloat(item.waste_pct || 0).toFixed(1) }}%
                  </v-chip>
                </template>
                <template v-slot:item.sold_kg="{ item }">
                  <span class="text-body-2 grey--text text--darken-1"
                    >{{ item.sold_kg }} kg</span
                  >
                </template>
                <template v-slot:no-data>
                  <div class="pa-8 text-center">
                    <v-icon size="48" color="grey lighten-2">mdi-chart-bar</v-icon>
                    <div class="text-h6 grey--text mt-3">No data available</div>
                    <div class="text-body-2 grey--text text--lighten-1 mb-4">
                      Select a different time period or record some entries first
                    </div>
                  </div>
                </template>
              </v-data-table>
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
            <div class="text-caption grey--text">{{ shopName || 'Analytics' }}</div>
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
  name: 'Reports',

  data() {
    return {
      userProfile: null,
      nav_bars: false,
      mobileDrawer: false,
      bottomNav: 1,
      loading: false,
      periodDays: 30,
      periodOptions: [
        {
          label: '7 Days',
          value: 7,
        },
        {
          label: '30 Days',
          value: 30,
        },
        {
          label: '90 Days',
          value: 90,
        },
      ],
      user: null,
      shopName: '',
      branchId: null,

      comparative: {
        thisMonth: {
          revenue: 0,
          profit: 0,
          sold: 0,
          avg_waste: 0,
        },
        lastMonth: {
          revenue: 0,
          profit: 0,
          sold: 0,
          avg_waste: 0,
        },
        changes: {
          revenue: 0,
          profit: 0,
          sold: 0,
          waste: 0,
        },
      },

      profitTrend: [],
      dayOfWeek: [],
      avgMargin: 0,

      wasteData: {
        data: [],
        avgWastePct: 0,
        totalWasteCost: 0,
      },
      paymentData: {
        data: [],
        totalCash: 0,
        totalMpesa: 0,
        totalRevenue: 0,
        avgMpesaPct: 0,
      },
      expenseData: {
        data: [],
        grandTotal: 0,
      },
      dailySummary: [],

      expenseColors: [
        'red',
        'blue',
        'green',
        'orange',
        'purple',
        'teal',
        'pink',
        'indigo',
      ],

      summaryHeaders: [
        {
          text: 'Date',
          value: 'date',
          width: '120',
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
          text: 'Margin',
          value: 'margin_pct',
          align: 'end',
        },
        {
          text: 'Sold',
          value: 'sold_kg',
          align: 'end',
        },
        {
          text: 'Waste %',
          value: 'waste_pct',
          align: 'end',
        },
      ],

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
    comparativeCards() {
      return [
        {
          label: 'Revenue',
          value: this.formatNumber(this.comparative.thisMonth.revenue),
          change: parseFloat(this.comparative.changes.revenue),
          icon: 'mdi-cash-multiple',
          bgColor: 'green lighten-5',
          iconColor: 'green',
        },
        {
          label: 'Net Profit',
          value: this.formatNumber(this.comparative.thisMonth.profit),
          change: parseFloat(this.comparative.changes.profit),
          icon: 'mdi-trending-up',
          bgColor:
            this.comparative.thisMonth.profit >= 0
              ? 'green lighten-5'
              : 'red lighten-5',
          iconColor:
            this.comparative.thisMonth.profit >= 0 ? 'green' : 'red',
        },
        {
          label: 'Volume Sold',
          value: `${this.comparative.thisMonth.sold || 0} kg`,
          change: parseFloat(this.comparative.changes.sold),
          icon: 'mdi-weight-kilogram',
          bgColor: 'blue lighten-5',
          iconColor: 'blue',
        },
        {
          label: 'Waste Rate',
          value: `${parseFloat(
            this.comparative.thisMonth.avg_waste || 0
          ).toFixed(1)} kg/day`,
          change: parseFloat(this.comparative.changes.waste),
          icon: 'mdi-delete-variant',
          bgColor: 'red lighten-5',
          iconColor: 'red',
        },
      ]
    },
  },

  methods: {
    formatNumber(val) {
      return numeral(val || 0).format('0,0')
    },
    formatNumberShort(val) {
      return numeral(val || 0)
        .format('0.0a')
        .toUpperCase()
    },
    formatDateShort(date) {
      return moment(date).format('MMM D')
    },
    formatDayShort(date) {
      return moment(date).format('D')
    },
    dayColor(index) {
      const colors = [
        'red',
        'blue',
        'green',
        'orange',
        'purple',
        'teal',
        'pink',
      ]
      return colors[index % colors.length]
    },
    dayMargin(day) {
      return day.avg_revenue
        ? ((day.avg_profit / day.avg_revenue) * 100).toFixed(1)
        : 0
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
        this.showSnackbar(msg, 'error')
        throw error
      }
    },

    async refreshAll() {
      this.loading = true
      await Promise.all([
        this.loadComparative(),
        this.loadProfitability(),
        this.loadWaste(),
        this.loadPayment(),
        this.loadExpenses(),
        this.loadSummary(),
      ])
      this.loading = false
    },

    async loadComparative() {
      try {
        this.comparative = await this.apiCall(
          'get',
          `/reports/comparative?branch_id=${this.branchId}`
        )
      } catch (e) {
        console.error('Comparative error', e)
      }
    },

    async loadProfitability() {
      try {
        const data = await this.apiCall(
          'get',
          `/reports/profitability?branch_id=${this.branchId}&days=${this.periodDays}`
        )
        this.dayOfWeek = data.dayOfWeek || []
        if (this.dayOfWeek == null) {
          this.refreshAll()
        }
        const maxProfit = Math.max(
          ...data.daily.map((d) => Math.abs(parseFloat(d.profit) || 0)),
          1
        )
        this.profitTrend = data.daily.map((d) => ({
          date: d.date,
          profit: parseFloat(d.profit) || 0,
          revenue: parseFloat(d.revenue) || 0,
          pct: ((Math.abs(parseFloat(d.profit) || 0) / maxProfit) * 80 + 5),
        }))

        const totalMargin = data.daily.reduce(
          (s, d) => s + (parseFloat(d.margin_pct) || 0),
          0
        )
        this.avgMargin = data.daily.length
          ? (totalMargin / data.daily.length).toFixed(1)
          : 0
      } catch (e) {
        console.error('Profitability error', e)
      }
    },

    async loadWaste() {
      try {
        this.wasteData = await this.apiCall(
          'get',
          `/reports/waste-analysis?branch_id=${this.branchId}&days=${this.periodDays}`
        )
      } catch (e) {
        console.error('Waste error', e)
      }
    },

    async loadPayment() {
      try {
        this.paymentData = await this.apiCall(
          'get',
          `/reports/payment-mix?branch_id=${this.branchId}&days=${this.periodDays}`
        )
      } catch (e) {
        console.error('Payment error', e)
      }
    },

    async loadExpenses() {
      try {
        this.expenseData = await this.apiCall(
          'get',
          `/reports/expense-breakdown?branch_id=${this.branchId}&days=${this.periodDays}`
        )
      } catch (e) {
        console.error('Expense error', e)
      }
    },

    async loadSummary() {
      try {
        const data = await this.apiCall(
          'get',
          `/reports/profitability?branch_id=${this.branchId}&days=${this.periodDays}`
        )
        this.dailySummary = data.daily.reverse().map((d) => ({
          ...d,
          waste_pct: d.revenue
            ? (parseFloat(d.waste_kg || 0) / parseFloat(d.sold_kg || 1)) * 100
            : 0,
        }))
      } catch (e) {
        console.error('Summary error', e)
      }
    },

    exportCSV() {
      const headers = ['Date', 'Revenue', 'Profit', 'Margin %', 'Sold kg', 'Waste %']
      const rows = this.dailySummary.map((d) => [
        d.date,
        d.revenue,
        d.profit,
        d.margin_pct,
        d.sold_kg,
        d.waste_pct,
      ])
      const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
      const blob = new Blob([csv], {
        type: 'text/csv',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meatpro-report-${moment().format('YYYY-MM-DD')}.csv`
      a.click()
      URL.revokeObjectURL(url)
      this.showSnackbar('CSV exported', 'success')
    },

    showSnackbar(text, color = 'success') {
      this.snackbar = {
        show: true,
        text,
        color,
      }
    },

    onResize() {
      this.nav_bars = window.innerWidth < 768
    },

    logout() {
      this.$fire.auth.signOut()
      this.$router.push('/login')
    },
    async loadUserProfile() {
      try {
        if (!this.user.uid) return
        const { data } = await apiClient.get(`/users/${this.user.uid}/profile`)
        this.userProfile = data
        console.log(data)
        if (data.firebase_uid != null) {
          this.refreshAll()
        }

        if (data.id) this.branchId = data.id
      } catch (e) {
        console.error('Profile load error:', e)
      }
    },
  },

  mounted() {
    this.onResize()
    window.addEventListener('resize', this.onResize)

    this.$fire.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user
        this.loadUserProfile()
        this.refreshAll()
      } else {
        this.$router.push('/login')
      }
    })
  },

  created() {
    this.refreshAll()
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

/* Period Chips */
.period-chips-modern ::v-deep .v-slide-group__content {
  gap: 8px;
}

.period-chips-modern ::v-deep .v-chip {
  transition: all 0.25s ease;
}

.period-chips-modern ::v-deep .v-chip:hover {
  transform: translateY(-1px);
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

/* Card Headers */
.card-header-modern {
  background: linear-gradient(to bottom, #ffffff, #fafafa);
}

/* Chart */
.chart-container-modern {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  padding: 0 8px;
  gap: 6px;
  overflow-x: auto;
}

.chart-bar-wrapper-modern {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 32px;
}

.chart-bar-container-modern {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
}

.chart-bar-modern {
  width: 70%;
  border-radius: 6px 6px 0 0;
  transition: height 0.4s ease;
  min-height: 4px;
}

.chart-label-modern {
  font-size: 10px;
  white-space: nowrap;
}

.chart-value-modern {
  font-size: 10px;
  white-space: nowrap;
  margin-top: 2px;
}

/* Tables */
.best-days-table-modern tbody tr,
.waste-table-modern tbody tr,
.payment-table-modern tbody tr,
.summary-table-modern tbody tr,
.expense-table-modern tbody tr {
  transition: background-color 0.2s ease;
}

.best-days-table-modern tbody tr:hover,
.waste-table-modern tbody tr:hover,
.payment-table-modern tbody tr:hover,
.summary-table-modern tbody tr:hover,
.expense-table-modern tbody tr:hover {
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

/* Expense Items */
.expense-item-modern {
  transition: all 0.2s ease;
  padding: 4px;
  border-radius: 8px;
}

.expense-item-modern:hover {
  background-color: #fafafa;
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

  .kpi-card-modern {
    padding: 16px !important;
  }

  .chart-container-modern {
    height: 160px;
    gap: 4px;
  }

  .chart-bar-container-modern {
    height: 120px;
  }
}
</style>