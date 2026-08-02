<template>
<div class="d-flex bg-grey-lighten-4 dashboard-root" style="min-height: 100vh;">
    <!-- Desktop Sidebar -->
    <v-navigation-drawer v-if="!nav_bars" permanent width="280" class="elevation-2 sidebar-modern" color="white">
        <div class="pa-6 pb-4">
            <div class="d-flex align-center cursor-pointer" @click="$router.push('/')">
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
            <v-list-item v-for="(item, idx) in menuItems" :key="item.title" :to="item.to" link class="mb-1 rounded-xl nav-item-modern" active-class="red lighten-5 red--text text--darken-2" :style="{ 'animation-delay': idx * 50 + 'ms' }">
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
                <!-- Setup Branches button for Pro users -->
                <v-slide-y-transition>
                    <v-btn
                        v-if="subData?.subscription?.tier === 'pro'"
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
                <v-btn block outlined color="grey darken-1" class="rounded-xl text-capitalize mt-3" @click="logout">
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
                            <v-btn v-else icon small class="mr-3" to="/dashboard">
                                <v-icon>mdi-arrow-left</v-icon>
                            </v-btn>
                            <div>
                                <h1 class="text-h6 text-sm-h5 font-weight-bold grey--text text--darken-3">
                                    Analytics & Reports
                                </h1>
                                <div class="d-flex align-center mt-1">
                                    <v-icon x-small color="grey" class="mr-1">mdi-calendar-range</v-icon>
                                    <span class="text-caption grey--text text--darken-1">Last {{ periodDays }} days</span>
                                </div>
                            </div>


                        </div>
                        <div v-if="proStatus === true" class="mt-2">
                      <v-select
                        v-model="selectedBranch"
                        :items="branches.map(branch => branch.name)"
                        @change="SelectionChange(selectedBranch)"
                        dense
                        outlined
                        hide-details
                        rounded
                        placeholder="Select Branch"
                        class="rounded-lg branch-select-modern"
                        style="max-width: 260px;"
                      ></v-select>
                  </div>
                    </v-col>
                    <v-col cols="4" sm="6" class="d-flex justify-end align-center">
                        <v-select v-model="periodDays" :items="periodOptions" item-text="label" item-value="value" dense outlined rounded hide-details class="rounded-lg mr-2 hidden-xs-only period-select-modern" style="max-width: 140px" @change="refreshAll" />
                        <v-btn icon outlined small color="grey lighten-1" @click="refreshAll" :loading="loading">
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
                    <v-chip-group v-model="periodDays" mandatory @change="refreshAll" active-class="red darken-2 white--text" class="period-chips-modern">
                        <v-chip v-for="opt in periodOptions" :key="opt.value" :value="opt.value" filter class="font-weight-medium rounded-lg px-4" color="red lighten-4" text-color="black darken-2">
                            {{ opt.label }}
                        </v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>

            <!-- Revenue Variance Alert (shows when expected != actual) -->
            <v-row v-if="revenueVariance !== 0" class="mb-4 mb-sm-6 reveal-card" style="animation-delay: 50ms">
                <v-col cols="12">
                    <v-alert
                        :type="revenueVariance > 0 ? 'warning' : 'info'"
                        rounded="xl"
                        class="mb-0"
                        border="left"
                        colored-border
                        elevation="1"
                    >
                        <div class="d-flex align-center">
                            <v-icon left :color="revenueVariance > 0 ? 'orange' : 'blue'">{{ revenueVariance > 0 ? 'mdi-alert-circle' : 'mdi-information' }}</v-icon>
                            <div>
                                <div class="font-weight-bold text-body-1">
                                    {{ revenueVariance > 0 ? 'Revenue Shortfall Detected' : 'Revenue Surplus Detected' }}
                                </div>
                                <div class="text-body-2 mt-1">
                                    Expected: <strong>{{ formatNumber(comparative.thisMonth.expectedRevenue) }}</strong> | 
                                    Actual Received: <strong>{{ formatNumber(comparative.thisMonth.actualRevenue) }}</strong> | 
                                    Variance: <strong :class="revenueVariance > 0 ? 'red--text' : 'green--text'">{{ formatNumber(Math.abs(revenueVariance)) }}</strong>
                                    <span class="grey--text text--darken-1">({{ revenueVariance > 0 ? 'Missing money - check for theft/unrecorded sales' : 'Possible overpayment/data error' }})</span>
                                </div>
                            </div>
                        </div>
                    </v-alert>
                </v-col>
            </v-row>

            <!-- Comparative Cards -->
            <v-row dense class="mb-4 mb-sm-6">
                <v-col v-for="(card, i) in comparativeCards" :key="i" cols="6" lg="3" class="reveal-card" :style="{ 'animation-delay': i * 100 + 'ms' }">
                    <v-card class="pa-4 pa-sm-5 rounded-xl h-100 kpi-card-modern" elevation="1">
                        <div class="d-flex align-start justify-space-between mb-3">
                            <v-avatar :color="card.bgColor" size="48" class="elevation-1 kpi-avatar">
                                <v-icon :color="card.iconColor" size="24">{{ card.icon }}</v-icon>
                            </v-avatar>
                            <v-chip x-small :color="card.change >= 0 ? 'green lighten-5' : 'red lighten-5'" :text-color="card.change >= 0 ? 'green darken-2' : 'red darken-2'" label class="font-weight-bold">
                                <v-icon x-small left>{{
                    card.change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'
                  }}</v-icon>
                                {{ Math.abs(card.change) }}%
                            </v-chip>
                        </div>
                        <div class="text-caption font-weight-bold text-uppercase grey--text mb-1 tracking-wide">
                            {{ card.label }}
                        </div>
                        <div class="text-h5 text-sm-h4 font-weight-bold grey--text text--darken-3">
                            {{ card.value }}
                        </div>
                        <!-- Show expected vs actual for revenue card -->
                        <div v-if="card.showBreakdown && card.expectedValue" class="text-caption grey--text mt-1">
                            Expected: {{ card.expectedValue }}
                        </div>
                        <div v-else class="text-caption grey--text mt-1 font-weight-medium">vs last month</div>
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
                                    <div class="text-caption grey--text">Daily actual profit/loss (payments received)</div>
                                </div>
                            </div>
                            <v-spacer />
                            <v-btn x-small text color="grey" class="text-capitalize font-weight-medium">Daily</v-btn>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <div class="chart-container-modern">
                                <div v-for="(day, i) in profitTrend" :key="i" class="chart-bar-wrapper-modern">
                                    <div class="d-flex flex-column align-center w-100">
                                        <div class="chart-bar-container-modern">
                                            <div class="chart-bar-modern" :style="{
                            height: `${Math.max(day.pct, 5)}%`,
                            backgroundImage:
                              day.profit >= 0
                                ? 'linear-gradient(to top, #4caf50, #81c784)'
                                : 'linear-gradient(to top, #f44336, #e57373)',
                            backgroundColor: day.profit >= 0 ? '#4caf50' : '#f44336'
                          }"></div>
                                        </div>
                                        <div class="chart-label-modern text-caption grey--text mt-2">
                                            {{ formatDayShort(day.date) }}
                                        </div>
                                        <div class="chart-value-modern text-caption font-weight-medium" :class="day.profit >= 0 ? 'green--text' : 'red--text'">
                                            {{ formatNumberShort(day.profit) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-space-between mt-4 text-caption grey--text">
                                <span>
                                    <v-icon x-small color="green" class="mr-1">mdi-circle</v-icon> Profit |
                                    <v-icon x-small color="red" class="mr-1">mdi-circle</v-icon> Loss
                                </span>
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
                                    <div class="text-caption grey--text">Performance by day of week (actual payments)</div>
                                </div>
                            </div>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <v-simple-table dense class="best-days-table-modern">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left text-caption grey--text font-weight-medium">
                                                Day
                                            </th>
                                            <th class="text-right text-caption grey--text font-weight-medium">
                                                Avg Revenue
                                            </th>
                                            <th class="text-right text-caption grey--text font-weight-medium">
                                                Margin
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(day, i) in dayOfWeek" :key="i" class="row-modern">
                                            <td class="text-body-2 py-3">
                                                <v-icon x-small :color="dayColor(i)" class="mr-2">mdi-circle</v-icon>
                                                {{ day.day_name }}
                                            </td>
                                            <td class="text-right text-body-2 font-weight-medium py-3">
                                                {{ formatNumber(day.avg_actual_revenue || day.avg_revenue) }}
                                            </td>
                                            <td class="text-right py-3">
                                                <v-chip x-small :color="
                              day.avg_actual_profit > 0 || day.avg_profit > 0 ? 'green lighten-5' : 'red lighten-5'
                            " :text-color="day.avg_actual_profit > 0 || day.avg_profit > 0 ? 'green' : 'red'" label class="font-weight-bold">
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
                            <v-chip small :color="wasteData.avgWastePct > 5 ? 'red lighten-5' : 'green lighten-5'" :text-color="wasteData.avgWastePct > 5 ? 'red' : 'green'" label class="font-weight-bold">
                                {{ wasteData.avgWastePct }}% avg
                            </v-chip>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <div class="d-flex align-center mb-5">
                                <div class="flex-grow-1 mr-4">
                                    <div class="d-flex justify-space-between text-body-2 mb-2">
                                        <span class="grey--text text--darken-1 font-weight-medium">Total Waste Cost</span>
                                        <span class="font-weight-bold red--text text--darken-2">{{
                        formatNumber(wasteData.totalWasteCost)
                      }}</span>
                                    </div>
                                    <v-progress-linear :value="Math.min(wasteData.avgWastePct * 15, 100)" :color="wasteData.avgWastePct > 5 ? 'red' : 'green'" rounded height="10" class="rounded-lg progress-modern" background-color="grey lighten-3" />
                                </div>
                            </div>

                            <v-simple-table dense class="waste-table-modern">
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left text-caption grey--text font-weight-medium">
                                                Date
                                            </th>
                                            <th class="text-right text-caption grey--text font-weight-medium">
                                                Waste (kg)
                                            </th>
                                            <th class="text-right text-caption grey--text font-weight-medium">
                                                %
                                            </th>
                                            <th class="text-right text-caption grey--text font-weight-medium">
                                                Cost
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, i) in wasteData.data.slice(0, 7)" :key="i" class="row-modern">
                                            <td class="text-body-2 py-3">
                                                {{ formatDateShort(row.date) }}
                                            </td>
                                            <td class="text-right text-body-2 py-3">
                                                {{ row.waste_kg }} kg
                                            </td>
                                            <td class="text-right py-3">
                                                <v-chip x-small :color="
                              row.waste_pct > 5 ? 'red lighten-5' : 'grey lighten-4'
                            " :text-color="row.waste_pct > 5 ? 'red' : 'grey'" label class="font-weight-bold">
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
                            <v-chip small color="green lighten-5" text-color="green darken-2" label class="font-weight-bold">
                                {{ Math.abs(paymentData.avgMpesaPct) }}% M-Pesa
                            </v-chip>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <div class="d-flex align-center justify-center mb-6">
                                <div class="text-center mr-8">
                                    <v-progress-circular :value="Math.abs(paymentData.avgMpesaPct)" :size="110" :width="12" color="green" class="mb-2">
                                        <div class="text-h5 font-weight-bold green--text text--darken-2">
                                            {{ Math.round(Math.abs(paymentData.avgMpesaPct)) }}%
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
                                    <v-progress-circular :value="Math.abs(100 - paymentData.avgMpesaPct)" :size="110" :width="12" color="blue" class="mb-2">
                                        <div class="text-h5 font-weight-bold blue--text text--darken-2">
                                            {{ Math.round(Math.abs(100 - paymentData.avgMpesaPct)) }}%
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
                                            <th class="text-right text-caption grey--text font-weight-medium">
                                                M-Pesa
                                            </th>
                                            <th class="text-right text-caption grey--text font-weight-medium">
                                                Cash
                                            </th>
                                            <th class="text-right text-caption grey--text font-weight-medium">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, i) in paymentData.data.slice(0, 5)" :key="i" class="row-modern">
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
                              parseFloat(row.payment_mpesa || 0) + parseFloat(row.payment_cash || 0)
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
                                    <div v-for="(exp, i) in expenseData.data" :key="i" class="mb-4 expense-item-modern">
                                        <div class="d-flex justify-space-between align-center mb-2">
                                            <div class="d-flex align-center">
                                                <v-icon x-small :color="expenseColors[i % expenseColors.length]" class="mr-2">mdi-circle</v-icon>
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
                                        <v-progress-linear :value="exp.pct" :color="expenseColors[i % expenseColors.length]" rounded height="14" class="rounded-lg progress-modern" background-color="grey lighten-3">
                                            <template v-slot:default>
                                                <span class="text-caption white--text font-weight-bold px-1">{{ exp.pct }}%</span>
                                            </template>
                                        </v-progress-linear>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-simple-table dense class="expense-table-modern">
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th class="text-left text-caption grey--text font-weight-medium py-3">
                                                        Category
                                                    </th>
                                                    <th class="text-right text-caption grey--text font-weight-medium py-3">
                                                        Total
                                                    </th>
                                                    <th class="text-right text-caption grey--text font-weight-medium py-3">
                                                        %
                                                    </th>
                                                    <th class="text-right text-caption grey--text font-weight-medium py-3">
                                                        Avg
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(exp, i) in expenseData.data" :key="i" class="row-modern">
                                                    <td class="text-body-2 py-3">
                                                        <v-icon x-small :color="expenseColors[i % expenseColors.length]" class="mr-2">mdi-circle</v-icon>
                                                        {{ exp.title }}
                                                    </td>
                                                    <td class="text-right text-body-2 font-weight-medium py-3">
                                                        {{ formatNumber(exp.total) }}
                                                    </td>
                                                    <td class="text-right py-3">
                                                        <v-chip x-small :color="
                                  expenseColors[i % expenseColors.length] + ' lighten-5'
                                " :text-color="expenseColors[i % expenseColors.length]" label class="font-weight-bold">
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
                            <v-btn small text color="red darken-2" class="text-capitalize font-weight-medium rounded-lg" @click="exportCSV">
                                <v-icon left small>mdi-download</v-icon> Export CSV
                            </v-btn>
                        </v-card-title>
                        <v-divider />
                        <v-data-table :headers="summaryHeaders" :items="dailySummary" :items-per-page="10" dense class="rounded-b-xl summary-table-modern" mobile-breakpoint="600">
                            <template v-slot:item.date="{ item }">
                                <div class="d-flex align-center py-1">
                                    <v-avatar :color="dateColor(item.date)" size="28" class="mr-2 hidden-xs-only">
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
                                <div class="d-flex flex-column align-end">
                                    <span class="font-weight-medium text-body-2 grey--text text--darken-2">{{
                    formatNumber(item.actualRevenue || item.revenue)
                  }}</span>
                                    <span v-if="item.expectedRevenue && item.expectedRevenue !== (item.actualRevenue || item.revenue)" class="text-caption grey--text">
                                        Exp: {{ formatNumber(item.expectedRevenue) }}
                                    </span>
                                </div>
                            </template>
                            <template v-slot:item.profit="{ item }">
                                <v-chip x-small :color="(item.actualProfit || item.profit) >= 0 ? 'green lighten-5' : 'red lighten-5'" :text-color="(item.actualProfit || item.profit) >= 0 ? 'green darken-2' : 'red darken-2'" label class="font-weight-bold">
                                    {{ formatNumber(item.actualProfit || item.profit) }}
                                </v-chip>
                            </template>
                            <template v-slot:item.margin_pct="{ item }">
                                <span class="font-weight-bold text-body-2" :class="
                      (item.actualMarginPct || item.margin_pct) >= 20
                        ? 'green--text'
                        : (item.actualMarginPct || item.margin_pct) >= 10
                        ? 'orange--text'
                        : 'red--text'
                    ">
                                    {{ parseFloat(item.actualMarginPct || item.margin_pct || 0).toFixed(1) }}%
                                </span>
                            </template>
                            <template v-slot:item.waste_pct="{ item }">
                                <v-chip x-small :color="item.waste_pct > 5 ? 'red lighten-5' : 'grey lighten-4'" :text-color="item.waste_pct > 5 ? 'red' : 'grey'" label class="font-weight-bold">
                                    {{ parseFloat(item.waste_pct || 0).toFixed(1) }}%
                                </v-chip>
                            </template>
                            <template v-slot:item.sold_kg="{ item }">
                                <span class="text-body-2 grey--text text--darken-1">{{ item.sold_kg }} kg</span>
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
    <v-bottom-navigation v-if="nav_bars" v-model="bottomNav" color="red darken-2" grow fixed class="elevation-8 bottom-nav-modern" style="z-index: 100">
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
    <v-navigation-drawer v-model="mobileDrawer" temporary right width="280" class="mobile-drawer-modern">
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
                <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to" class="rounded-xl mb-1" active-class="red lighten-5 red--text">
                    <v-list-item-icon class="mr-3">
                        <v-icon color="grey darken-1">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="text-body-2 font-weight-medium">{{
              item.title
            }}</v-list-item-title>
                </v-list-item>
            </v-list>
            <v-divider class="my-4" />

            <!-- Setup Branches for Pro users -->
            <v-slide-y-transition>
                <v-btn
                    v-if="subData?.subscription?.tier === 'pro'"
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

            <v-btn block outlined color="grey darken-1" class="rounded-xl text-capitalize" @click="logout">
                <v-icon left size="18">mdi-logout</v-icon> Sign Out
            </v-btn>
        </div>
    </v-navigation-drawer>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" bottom rounded="pill" class="mb-6 snackbar-modern" elevation="6">
        <div class="d-flex align-center">
            <v-avatar :color="snackbar.color === 'success' ? 'green darken-2' : 'red darken-2'" size="28" class="mr-3">
                <v-icon color="white" small>{{
            snackbar.color === 'success' ? 'mdi-check' : 'mdi-alert'
          }}</v-icon>
            </v-avatar>
            <span class="font-weight-medium">{{ snackbar.text }}</span>
        </div>
        <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.show = false" class="text-capitalize font-weight-bold white--text">Close</v-btn>
        </template>
    </v-snackbar>
</div>
</template>

<script>
import moment from 'moment'
import numeral from 'numeral'
import axios from 'axios'
import apiClient from '../services/api'
import Subscription from './subscription.vue';

export default {
    name: 'Reports',

    data() {
        return {
            // ── Subscription Gate ──
            subLoading: true,
            subActive: false,
            subData: null,
            // ── Existing Data ──
            branches: [],
            selectedBranch: null,
            proStatus: false,
            mpesaReceipt: null,
            subscription: null,
            userProfile: null,
            nav_bars: false,
            mobileDrawer: false,
            bottomNav: 1,
            loading: false,
            periodDays: 30,
            periodOptions: [{
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
                    // New fields for actual vs expected
                    actualRevenue: 0,
                    expectedRevenue: 0,
                    actualProfit: 0,
                    expectedProfit: 0,
                },
                lastMonth: {
                    revenue: 0,
                    profit: 0,
                    sold: 0,
                    avg_waste: 0,
                    actualRevenue: 0,
                    expectedRevenue: 0,
                    actualProfit: 0,
                    expectedProfit: 0,
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

            summaryHeaders: [{
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
            authUnsubscribe: null,

            menuItems: [{
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
            // Use actual revenue/profit when available, fall back to legacy revenue/profit
            const thisMonthActualRevenue = this.comparative.thisMonth.actualRevenue || this.comparative.thisMonth.revenue || 0
            const thisMonthExpectedRevenue = this.comparative.thisMonth.expectedRevenue || this.comparative.thisMonth.revenue || 0
            const thisMonthActualProfit = this.comparative.thisMonth.actualProfit || this.comparative.thisMonth.profit || 0
            const thisMonthExpectedProfit = this.comparative.thisMonth.expectedProfit || this.comparative.thisMonth.profit || 0

            return [{
                    label: 'Revenue',
                    value: this.formatNumber(thisMonthActualRevenue),
                    expectedValue: thisMonthExpectedRevenue !== thisMonthActualRevenue ? this.formatNumber(thisMonthExpectedRevenue) : null,
                    showBreakdown: true,
                    change: parseFloat(this.comparative.changes.revenue),
                    icon: 'mdi-cash-multiple',
                    bgColor: 'green lighten-5',
                    iconColor: 'green',
                },
                {
                    label: 'Net Profit',
                    value: this.formatNumber(thisMonthActualProfit),
                    change: parseFloat(this.comparative.changes.profit),
                    icon: 'mdi-trending-up',
                    bgColor: thisMonthActualProfit >= 0 ?
                        'green lighten-5' :
                        'red lighten-5',
                    iconColor: thisMonthActualProfit >= 0 ? 'green' : 'red',
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

        // Calculate revenue variance for alert
        revenueVariance() {
            const expected = this.comparative.thisMonth.expectedRevenue || this.comparative.thisMonth.revenue || 0
            const actual = this.comparative.thisMonth.actualRevenue || this.comparative.thisMonth.revenue || 0
            return expected - actual
        },
    },

    methods: {
        async loadBranches() {
            try {
                if (!this.user?.uid) return
                const { data } = await apiClient.get(`/branches/my?firebase_uid=${this.user.uid}`)
                this.branches = data || []
                console.log('Branches loaded:', this.branches)

                // Auto-select first branch if selector is currently empty
                if (!this.selectedBranch && this.branches.length > 0) {
                    const first = this.branches[0]
                    this.selectedBranch = first.name
                    this.branchId = first.id
                } else if (this.branchId && this.branches.length) {
                    // Sync the dropdown label to the currently active branchId
                    const current = this.branches.find(b => b.id === this.branchId)
                    if (current) {
                        this.selectedBranch = current.name
                    }
                }
            } catch (e) {
                console.error('Branches load error:', e)
                this.branches = []
            }
        },
        checkPaymentInfo(val) {
            if (val == null) {
                if (this.subscription === 'pro') {

                } else {
                    this.showSnackbar('Please set your M-Pesa receipt number in your profile.', 'error')
                    this.$router.push('/subscription')
                }

            }
        },
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
            const revenue = day.avg_actual_revenue || day.avg_revenue || 0
            const profit = day.avg_actual_profit || day.avg_profit || 0
            return revenue ? ((profit / revenue) * 100).toFixed(1) : 0
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
            if (this.loading) return
            this.loading = true

             await this.loadUserProfile()

        // Load branches for Pro subscribers; auto-select if empty
        if (this.proStatus === true) {
          await this.loadBranches()
        }

            try {
                await Promise.all([
                    this.loadComparative(),
                    this.loadProfitabilityAndSummary(),
                    this.loadWaste(),
                    this.loadPayment(),
                    this.loadExpenses(),
                ])
            } finally {
                this.loading = false
            }
        },

        async loadComparative() {
            try {
                const data = await this.apiCall(
                    'get',
                    `/reports/comparative?branch_id=${this.branchId}`
                )

                // Normalize data: ensure actualRevenue/actualProfit exist for new backend
                // while maintaining backward compatibility with old backend
                const normalizeMonth = (month) => ({
                    ...month,
                    actualRevenue: month.actualRevenue || month.revenue || 0,
                    expectedRevenue: month.expectedRevenue || month.revenue || 0,
                    actualProfit: month.actualProfit || month.profit || 0,
                    expectedProfit: month.expectedProfit || month.profit || 0,
                })

                this.comparative = Object.freeze({
                    ...data,
                    thisMonth: normalizeMonth(data.thisMonth || {}),
                    lastMonth: normalizeMonth(data.lastMonth || {}),
                })
            } catch (e) {
                console.error('Comparative error', e)
            }
        },

        async loadProfitabilityAndSummary() {
            try {
                const data = await this.apiCall(
                    'get',
                    `/reports/profitability?branch_id=${this.branchId}&days=${this.periodDays}`
                )

                // Normalize dayOfWeek data
                this.dayOfWeek = Object.freeze((data.dayOfWeek || []).map(day => ({
                    ...day,
                    avg_actual_revenue: day.avg_actual_revenue || day.avg_revenue || 0,
                    avg_actual_profit: day.avg_actual_profit || day.avg_profit || 0,
                })))

                // Normalize daily data for profit trend and summary
                const normalizedDaily = (data.daily || []).map(d => ({
                    ...d,
                    // Use actual values when available, fall back to legacy fields
                    actualRevenue: d.actualRevenue || (parseFloat(d.payment_cash || 0) + parseFloat(d.payment_mpesa || 0)) || d.revenue || 0,
                    expectedRevenue: d.expectedRevenue || d.revenue || 0,
                    actualProfit: d.actualProfit || d.profit || 0,
                    expectedProfit: d.expectedProfit || d.profit || 0,
                    actualMarginPct: d.actualMarginPct || d.margin_pct || 0,
                }))

                const maxProfit = Math.max(
                    ...normalizedDaily.map((d) => Math.abs(parseFloat(d.actualProfit) || 0)),
                    1
                )
                this.profitTrend = Object.freeze(normalizedDaily.map((d) => ({
                    date: d.date,
                    profit: parseFloat(d.actualProfit) || 0,
                    revenue: parseFloat(d.actualRevenue) || 0,
                    pct: ((Math.abs(parseFloat(d.actualProfit) || 0) / maxProfit) * 80 + 5),
                })))

                const totalMargin = normalizedDaily.reduce(
                    (s, d) => s + (parseFloat(d.actualMarginPct) || 0),
                    0
                )
                this.avgMargin = normalizedDaily.length ?
                    (totalMargin / normalizedDaily.length).toFixed(1) :
                    0

                this.dailySummary = Object.freeze(normalizedDaily.slice().reverse().map((d) => ({
                    ...d,
                    waste_pct: d.revenue ?
                        (parseFloat(d.waste_kg || 0) / parseFloat(d.sold_kg || 1)) * 100 :
                        0,
                })))
            } catch (e) {
                console.error('Profitability error', e)
            }
        },

        async loadWaste() {
            try {
                const data = await this.apiCall(
                    'get',
                    `/reports/waste-analysis?branch_id=${this.branchId}&days=${this.periodDays}`
                )
                this.wasteData = {
                    ...data,
                    data: Object.freeze(data.data)
                }
            } catch (e) {
                console.error('Waste error', e)
            }
        },

        async loadPayment() {
            try {
                const data = await this.apiCall(
                    'get',
                    `/reports/payment-mix?branch_id=${this.branchId}&days=${this.periodDays}`
                )
                this.paymentData = {
                    ...data,
                    data: Object.freeze(data.data)
                }
            } catch (e) {
                console.error('Payment error', e)
            }
        },

        async loadExpenses() {
            try {
                const data = await this.apiCall(
                    'get',
                    `/reports/expense-breakdown?branch_id=${this.branchId}&days=${this.periodDays}`
                )
                this.expenseData = {
                    ...data,
                    data: Object.freeze(data.data)
                }
            } catch (e) {
                console.error('Expense error', e)
            }
        },

        exportCSV() {
            const headers = ['Date', 'Actual Revenue', 'Expected Revenue', 'Actual Profit', 'Expected Profit', 'Margin %', 'Sold kg', 'Waste %', 'Cash', 'M-Pesa']
            const rows = this.dailySummary.map((d) => [
                d.date,
                d.actualRevenue || d.revenue || 0,
                d.expectedRevenue || d.revenue || 0,
                d.actualProfit || d.profit || 0,
                d.expectedProfit || d.profit || 0,
                d.actualMarginPct || d.margin_pct || 0,
                d.sold_kg,
                d.waste_pct,
                d.payment_cash || 0,
                d.payment_mpesa || 0,
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
        async checkSubscription() {
            this.subLoading = true
            try {
                if (!this.user?.uid) {
                    this.subActive = false
                    return
                }
                const { data } = await apiClient.get(`/subscriptions/status?firebase_uid=${this.user.uid}`)
                this.subData = data
                this.subActive = data?.is_active === true
            } catch (e) {
                console.error('Subscription check error:', e)
                this.subActive = false
                this.subData = null
            } finally {
                this.subLoading = false
            }
        },

        SelectionChange(branchName) {
            if (!branchName) return
            const branch = this.branches.find(b => b.name === branchName)
            if (!branch) return
            this.selectedBranch = branchName
            this.branchId = branch.id
            this.refreshAll()
        },

        async loadUserProfile() {
            try {
                if (!this.user?.uid) return
                const { data } = await apiClient.get(`/users/${this.user.uid}/profile`)
                this.userProfile = data
                if (data.subscription === 'pro') {
                    this.proStatus = true
                }else {
                    this.proStatus = false
                }
                if (data.business_name) this.shopName = data.business_name
                if (data.mpesa_receipt) this.mpesaReceipt = data.mpesa_receipt
                if (data.subscription) this.subscription = data.subscription
                // Only set default branchId from profile if user hasn't selected one yet
                if (data.branch_id && !this.branchId) {
                    this.branchId = data.branch_id
                }
            } catch (e) {
                console.error('Profile load error:', e)
            }
        },
    },

    mounted() {
        this.onResize()
        window.addEventListener('resize', this.onResize)

        this.authUnsubscribe = this.$fire.auth.onAuthStateChanged((user) => {
            if (user) {
                this.user = user
                // Check subscription first, then load data
                this.checkSubscription().then(() => {
                    this.loadUserProfile()
                    // Load branches for Pro subscribers; auto-select if empty
                    if (this.subData?.subscription?.tier === 'pro') {
                        this.loadBranches().then(() => {
                            this.refreshAll()
                        })
                    } else {
                        this.refreshAll()
                    }
                })
            } else {
                this.$router.push('/login')
            }
        })
    },

    watch: {
        selectedBranch(newVal, oldVal) {
            // If user clears the selector, reload branches and auto-select first one
            if (!newVal && oldVal && this.subData?.subscription?.tier === 'pro') {
                this.loadBranches()
            }
        },
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
.cursor-pointer {
    cursor: pointer;
}

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

.cursor-pointer {
    cursor: pointer;
}

/* Branch Selector */
.branch-select-modern ::v-deep .v-input__slot {
  min-height: 36px !important;
}
.branch-select-modern ::v-deep .v-select__selections {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}
</style>