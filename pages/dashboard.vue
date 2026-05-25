<template>
<div class="d-flex bg-grey-lighten-4" style="min-height: 100vh;">
    <!-- Desktop Sidebar -->
    <v-navigation-drawer v-if="!nav_bars" permanent width="260" class="elevation-1" color="white">
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
            <v-list-item v-for="item in menuItems" :key="item.title" :to="item.to" link class="mb-1 rounded-lg" active-class="red lighten-5 red--text">
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

            <!-- Modern Header -->
            <v-row align="center" class="mb-4 mb-sm-6">
                <v-col cols="12" sm="8">
                    <div class="d-flex align-center">
                        <div>
                            <h1 class="text-h5 text-sm-h4 font-weight-bold grey--text text--darken-3">{{ formattedToday }}</h1>
                            <div class="d-flex align-center mt-1">
                                <v-icon x-small color="grey" class="mr-1">mdi-map-marker</v-icon>
                                <span class="text-caption grey--text">{{ shopName }}</span>
                                <v-chip x-small color="red lighten-5 red--text" class="ml-2 font-weight-medium" label>
                                    Branch {{ branchId }}
                                </v-chip>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" sm="4" class="d-flex justify-end align-center mt-2 mt-sm-0">
                    <v-btn icon outlined small color="grey" class="mr-2" @click="refreshAll" :loading="loading">
                        <v-icon small>mdi-refresh</v-icon>
                    </v-btn>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn text v-bind="attrs" v-on="on" class="text-capitalize rounded-lg px-2">
                                <v-avatar color="red" size="32" class="mr-2">
                                    <span class="white--text text-caption font-weight-bold">{{ userInitials }}</span>
                                </v-avatar>
                                <span class="hidden-sm-and-down text-body-2 grey--text text--darken-2">{{ userName }}</span>
                                <v-icon small color="grey">mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list dense class="py-1">
                            <v-list-item to="/profile">
                                <v-list-item-icon class="mr-2">
                                    <v-icon small>mdi-account</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title class="text-body-2">Profile</v-list-item-title>
                            </v-list-item>
                            <v-divider class="my-1" />
                            <v-list-item @click="logout">
                                <v-list-item-icon class="mr-2">
                                    <v-icon small color="red">mdi-logout</v-icon>
                                </v-list-item-icon>
                                <v-list-item-title class="text-body-2 red--text">Sign Out</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>

            <!-- Alert Banner -->
            <v-slide-y-transition>
                <v-alert v-if="showMissedEntryAlert" dense type="warning" class="mb-4 mb-sm-6 rounded-lg" text border="left" colored-border elevation="1">
                    <div class="d-flex align-center">
                        <span class="text-body-2"><strong>Missed yesterday's entry?</strong> No record found for {{ formatDateShort(yesterday) }}.</span>
                        <v-spacer />
                        <v-btn small text color="warning" class="text-capitalize font-weight-medium" @click="selectDate(yesterday)">
                            Add Now
                        </v-btn>
                    </div>
                </v-alert>
            </v-slide-y-transition>

            <!-- Modern KPI Cards -->
            <v-row dense class="mb-4 mb-sm-6">
                <v-col cols="6" lg="3" v-for="(card, i) in kpiCards" :key="i">
                    <v-card class="pa-4 pa-sm-5 rounded-xl h-100" :class="card.bgClass" elevation="0" :style="card.gradient ? `background: ${card.gradient}` : ''">
                        <div class="d-flex align-start justify-space-between mb-3">
                            <v-avatar :color="card.iconBg" size="40" class="elevation-2">
                                <v-icon :color="card.iconColor" size="20">{{ card.icon }}</v-icon>
                            </v-avatar>
                            <v-chip v-if="card.trend !== undefined" x-small :color="card.trend >= 0 ? 'green' : 'red'" text-color="white" class="font-weight-bold" label>
                                <v-icon x-small left>{{ card.trend >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
                                {{ Math.abs(card.trend) }}%
                            </v-chip>
                        </div>
                        <div class="text-caption font-weight-medium text-uppercase mb-1" :class="card.labelColor || 'grey--text'">
                            {{ card.label }}
                        </div>
                        <div class="text-h5 text-sm-h4 font-weight-bold" :class="card.valueColor || 'grey--text text--darken-3'">
                            {{ card.value }}
                        </div>
                        <div v-if="card.subtitle" class="text-caption mt-1" :class="card.subtitleColor || 'grey--text'">
                            {{ card.subtitle }}
                        </div>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Main Action Button -->
            <v-row class="mb-4 mb-sm-6">
                <v-col cols="12">
                    <v-card class="rounded-xl overflow-hidden" elevation="2" :class="todayEntryExists ? 'bg-grey-lighten-3' : ''">
                        <v-card-text class="pa-0">
                            <v-btn block x-large :color="todayEntryExists ? 'grey lighten-2' : 'red'" :dark="!todayEntryExists" elevation="0" class="rounded-0 py-6" @click="openCloseDay" :disabled="todayEntryExists && !isEditing">
                                <div class="d-flex align-center justify-center w-100">
                                    <v-avatar :color="todayEntryExists ? 'grey' : 'white'" size="48" class="mr-4">
                                        <v-icon :color="todayEntryExists ? 'white' : 'red'" size="24">
                                            {{ todayEntryExists ? 'mdi-check-circle' : 'mdi-store-check' }}
                                        </v-icon>
                                    </v-avatar>
                                    <div class="text-left">
                                        <div class="text-h6 font-weight-bold">
                                            {{ todayEntryExists ? "Today's Entry Complete" : 'Close Business Day' }}
                                        </div>
                                        <div class="text-caption" :class="todayEntryExists ? 'grey--text' : 'red--text text--lighten-4'">
                                            {{ todayEntryExists ? `Recorded at ${todayEntryTime}` : 'Record stock, sales & expenses' }}
                                        </div>
                                    </div>
                                    <v-spacer />
                                    <v-icon v-if="!todayEntryExists" large>mdi-arrow-right</v-icon>
                                </div>
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Two Column Layout: Performance + Chart -->
            <v-row class="mb-4 mb-sm-6">
                <!-- Performance Table -->
                <v-col cols="12" lg="7">
                    <v-card class="rounded-xl" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <div class="d-flex align-center">
                                <v-icon color="red" class="mr-2">mdi-chart-bar</v-icon>
                                <span class="text-h6 font-weight-bold grey--text text--darken-2">Performance</span>
                            </div>
                            <v-spacer />
                            <v-btn text small color="red" class="text-capitalize rounded-lg" to="/reports">
                                Full Report
                                <v-icon right small>mdi-arrow-right</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-divider />
                        <v-simple-table class="rounded-b-xl">
                            <template>
                                <thead>
                                    <tr>
                                        <th class="text-left text-subtitle-2 font-weight-medium grey--text">Period</th>
                                        <th class="text-right text-subtitle-2 font-weight-medium grey--text">Revenue</th>
                                        <th class="text-right text-subtitle-2 font-weight-medium grey--text">Cost</th>
                                        <th class="text-right text-subtitle-2 font-weight-medium grey--text">Net Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, i) in performanceRows" :key="i" class="text-body-2">
                                        <td class="font-weight-medium">
                                            <v-icon x-small :color="row.iconColor" class="mr-1">{{ row.icon }}</v-icon>
                                            {{ row.label }}
                                        </td>
                                        <td class="text-right font-weight-medium">{{ formatNumber(row.revenue) }}</td>
                                        <td class="text-right grey--text">{{ formatNumber(row.cost) }}</td>
                                        <td class="text-right font-weight-bold" :class="row.margin >= 0 ? 'green--text' : 'red--text'">
                                            {{ formatNumber(row.margin) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-col>

                <!-- Quick Stats / Mini Chart Area -->
                <v-col cols="12" lg="5">
                    <v-card class="rounded-xl h-100" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <v-icon color="red" class="mr-2">mdi-poll</v-icon>
                            <span class="text-h6 font-weight-bold grey--text text--darken-2">Quick Stats</span>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <div class="mb-4">
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <span class="text-body-2 grey--text">Waste Rate</span>
                                    <span class="text-h6 font-weight-bold" :class="wasteAlert ? 'red--text' : 'green--text'">
                                        {{ wastePct }}%
                                    </span>
                                </div>
                                <v-progress-linear :value="Math.min(wastePct * 10, 100)" :color="wasteAlert ? 'red' : 'green'" rounded height="8" class="rounded-lg" />
                                <div class="text-caption grey--text mt-1">
                                    {{ wasteAlert ? 'Above 5% threshold — investigate' : 'Within normal range' }}
                                </div>
                            </div>

                            <v-divider class="my-4" />

                            <div class="mb-4">
                                <div class="d-flex justify-space-between align-center mb-2">
                                    <span class="text-body-2 grey--text">Payment Mix</span>
                                </div>
                                <div class="d-flex align-center">
                                    <div class="flex-grow-1 mr-3">
                                        <div class="d-flex justify-space-between text-caption mb-1">
                                            <span>M-Pesa</span>
                                            <span class="font-weight-medium">{{ mpesaPct }}%</span>
                                        </div>
                                        <v-progress-linear :value="mpesaPct" color="green" rounded height="6" class="rounded-lg mb-2" />
                                        <div class="d-flex justify-space-between text-caption">
                                            <span>Cash</span>
                                            <span class="font-weight-medium">{{ cashPct }}%</span>
                                        </div>
                                        <v-progress-linear :value="cashPct" color="blue" rounded height="6" class="rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            <v-divider class="my-4" />

                            <div class="d-flex justify-space-between align-center">
                                <div class="text-center flex-grow-1">
                                    <div class="text-h5 font-weight-bold grey--text text--darken-2">{{ recentEntries.length }}</div>
                                    <div class="text-caption grey--text">Days Recorded</div>
                                </div>
                                <v-divider vertical class="mx-4" />
                                <div class="text-center flex-grow-1">
                                    <div class="text-h5 font-weight-bold grey--text text--darken-2">{{ formatNumber(avgDailyRevenue) }}</div>
                                    <div class="text-caption grey--text">Avg Revenue/Day</div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Recent Entries -->
            <v-row>
                <v-col cols="12">
                    <v-card class="rounded-xl" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <div class="d-flex align-center">
                                <v-icon color="red" class="mr-2">mdi-history</v-icon>
                                <span class="text-h6 font-weight-bold grey--text text--darken-2">Recent Entries</span>
                            </div>
                            <v-spacer />
                            <v-text-field v-model="searchQuery" placeholder="Search dates..." dense outlined rounded hide-details prepend-inner-icon="mdi-magnify" class="rounded-lg" style="max-width: 200px;" />
                        </v-card-title>
                        <v-divider />
                        <v-data-table :headers="headers" :items="recentEntries" :items-per-page="5" dense hide-default-footer class="rounded-b-xl">
                            <template v-slot:item.date="{ item }">
                                <div class="d-flex align-center">
                                    <v-avatar :color="dateColor(item.date)" size="28" class="mr-2">
                                        <span class="white--text text-caption">{{ formatDay(item.date) }}</span>
                                    </v-avatar>
                                    <span class="font-weight-medium">{{ formatDateShort(item.date) }}</span>
                                </div>
                            </template>
                            <template v-slot:item.sold_kg="{ item }">
                                <v-chip x-small :color="item.sold_kg > 100 ? 'red lighten-5' : 'grey lighten-4'" label>
                                    <strong>{{ item.sold_kg }}</strong> kg
                                </v-chip>
                            </template>
                            <template v-slot:item.revenue="{ item }">
                                <span class="font-weight-medium">{{ formatNumber(item.revenue) }}</span>
                            </template>
                            <template v-slot:item.profit="{ item }">
                                <v-chip x-small :color="item.profit >= 0 ? 'green lighten-5' : 'red lighten-5'" :text-color="item.profit >= 0 ? 'green' : 'red'" label class="font-weight-bold">
                                    {{ formatNumber(item.profit) }}
                                </v-chip>
                            </template>
                            <template v-slot:item.closing_stock_kg="{ item }">
                                <span class="grey--text">{{ item.closing_stock_kg }} kg</span>
                            </template>
                            <template v-slot:item.actions="{ item }">
                                <v-btn icon x-small color="grey" @click="editEntry(item)">
                                    <v-icon x-small>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>

    <!-- Mobile Bottom Nav -->
    <v-bottom-navigation v-if="nav_bars" v-model="bottomNav" color="red" grow fixed class="elevation-8" style="z-index: 100; border-radius: 16px 16px 0 0;">
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

    <!-- Close Day Dialog (Modernized) -->
    <v-dialog v-model="showForm" :fullscreen="nav_bars" :max-width="nav_bars ? undefined : 800" persistent scrollable>
        <v-card class="rounded-xl" :class="nav_bars ? '' : 'overflow-hidden'">
            <v-toolbar color="red" dark flat height="64">
                <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title class="text-h6 font-weight-bold">
                    {{ isEditing ? 'Edit Entry' : 'Close Business Day' }}
                </v-toolbar-title>
                <v-spacer />
                <v-chip dark outlined class="mr-2">
                    <v-icon left small>mdi-calendar</v-icon>
                    {{ formattedSelectedDate }}
                </v-chip>
                <v-btn text dark class="text-capitalize font-weight-medium" @click="saveDailyEntry" :loading="saving">
                    Save
                </v-btn>
            </v-toolbar>

            <v-card-text class="pa-4 pa-sm-6 bg-grey-lighten-4">
                <!-- Date Alert -->
                <v-slide-y-transition>
                    <v-alert v-if="!isToday" dense text type="info" class="mb-4 rounded-lg" border="left">
                        You are recording for <strong>{{ formattedSelectedDate }}</strong>
                    </v-alert>
                </v-slide-y-transition>

                <!-- Modern Tabs -->
                <v-card class="rounded-xl mb-4" elevation="1">
                    <v-tabs v-model="activeTab" color="red" grow height="48" slider-color="red" class="rounded-t-xl">
                        <v-tab class="text-capitalize font-weight-medium">
                            <v-icon left small>mdi-package-variant</v-icon> Stock
                        </v-tab>
                        <v-tab class="text-capitalize font-weight-medium">
                            <v-icon left small>mdi-cash-register</v-icon> Sales
                        </v-tab>
                        <v-tab class="text-capitalize font-weight-medium">
                            <v-icon left small>mdi-receipt-text</v-icon> Expenses
                        </v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="activeTab" class="pa-4 pa-sm-6 rounded-b-xl">
                        <!-- STOCK TAB -->
                        <v-tab-item>
                            <v-row dense>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model="form.opening_stock_kg" label="Opening Stock" suffix="kg" type="number" outlined rounded dense :hint="lastClosingHint" persistent-hint class="rounded-lg" />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model="form.supply_kg" label="Supply Received" suffix="kg" type="number" outlined rounded dense class="rounded-lg" />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model="form.waste_kg" label="Waste" suffix="kg" type="number" outlined rounded dense class="rounded-lg" />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model="form.closing_stock_kg" label="Closing Stock" suffix="kg" type="number" outlined rounded dense class="rounded-lg" @input="calculateSold" />
                                </v-col>
                            </v-row>
                            <v-row dense class="mt-2">
                                <v-col cols="6" md="3">
                                    <v-text-field v-model="form.cost_per_kg" label="Cost per kg" prefix="KES" type="number" outlined rounded dense class="rounded-lg" />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model="form.selling_price_per_kg" label="Selling Price" prefix="KES" type="number" outlined rounded dense class="rounded-lg" />
                                </v-col>
                                <v-col cols="12" md="6" class="d-flex align-center justify-center py-2">
                                    <v-card class="pa-3 px-6 rounded-xl red lighten-5" elevation="0">
                                        <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-medium">Volume Sold</div>
                                        <div class="text-h4 font-weight-bold red--text">{{ volumeSold }} <span class="text-h6">kg</span></div>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-tab-item>

                        <!-- SALES TAB -->
                        <v-tab-item>
                            <v-row dense>
                                <v-col cols="6">
                                    <v-text-field v-model="form.payment_cash" label="Cash Payment" prefix="KES" type="number" outlined rounded dense class="rounded-lg" />
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field v-model="form.payment_mpesa" label="M-Pesa Payment" prefix="KES" type="number" outlined rounded dense class="rounded-lg" />
                                </v-col>
                            </v-row>
                            <v-card class="mt-4 pa-4 rounded-xl green lighten-5" elevation="0">
                                <div class="d-flex justify-space-between align-center">
                                    <div>
                                        <div class="text-caption grey--text text--darken-1 text-uppercase font-weight-medium">Expected Revenue</div>
                                        <div class="text-h5 font-weight-bold green--text text--darken-2">{{ formatNumber(expectedRevenue) }}</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-caption grey--text">{{ volumeSold }} kg × KES {{ form.selling_price_per_kg }}</div>
                                    </div>
                                </div>
                            </v-card>
                        </v-tab-item>

                        <!-- EXPENSES TAB -->
                        <v-tab-item>
                            <v-row dense align="end" class="mb-4">
                                <v-col cols="5">
                                    <v-select v-model="expenseForm.title" :items="expenseTypes" label="Expense Type" outlined rounded dense class="rounded-lg" />
                                </v-col>
                                <v-col cols="5">
                                    <v-text-field v-model="expenseForm.amount" label="Amount" prefix="KES" type="number" outlined rounded dense class="rounded-lg" />
                                </v-col>
                                <v-col cols="2">
                                    <v-btn fab small color="red" dark elevation="2" @click="addExpenseInline">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <v-card v-if="todayExpenses.length > 0" class="rounded-xl overflow-hidden" elevation="1">
                                <v-simple-table dense>
                                    <template>
                                        <thead class="grey lighten-4">
                                            <tr>
                                                <th class="text-left text-body-2 font-weight-medium">Item</th>
                                                <th class="text-right text-body-2 font-weight-medium">Amount</th>
                                                <th class="text-right" style="width: 40px;"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(exp, i) in todayExpenses" :key="i">
                                                <td class="text-body-2">
                                                    <v-icon x-small color="grey" class="mr-1">mdi-circle-small</v-icon>
                                                    {{ exp.title }}
                                                </td>
                                                <td class="text-right text-body-2 font-weight-medium">{{ formatNumber(exp.amount) }}</td>
                                                <td class="text-right">
                                                    <v-btn icon x-small color="grey lighten-1" @click="removeExpense(i)">
                                                        <v-icon x-small>mdi-close</v-icon>
                                                    </v-btn>
                                                </td>
                                            </tr>
                                            <tr class="grey lighten-4">
                                                <td class="text-body-2 font-weight-bold">Total Expenses</td>
                                                <td class="text-right text-body-2 font-weight-bold">{{ formatNumber(todayExpenseTotal) }}</td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </v-card>
                            <v-alert v-else dense text type="info" class="rounded-lg">No expenses added yet</v-alert>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>

                <!-- Summary Card -->
                <v-card class="rounded-xl pa-4" elevation="2" color="white">
                    <div class="d-flex justify-space-between align-center mb-3">
                        <span class="text-subtitle-1 font-weight-bold grey--text text--darken-2">Summary</span>
                        <v-chip small :color="expectedProfit >= 0 ? 'green lighten-5' : 'red lighten-5'" :text-color="expectedProfit >= 0 ? 'green' : 'red'" label class="font-weight-bold">
                            {{ expectedProfit >= 0 ? 'PROFIT' : 'LOSS' }}
                        </v-chip>
                    </div>
                    <v-row dense class="text-center">
                        <v-col cols="4">
                            <div class="text-caption grey--text text-uppercase font-weight-medium mb-1">Revenue</div>
                            <div class="text-h6 font-weight-bold grey--text text--darken-3">{{ formatNumber(expectedRevenue) }}</div>
                        </v-col>
                        <v-col cols="4">
                            <div class="text-caption grey--text text-uppercase font-weight-medium mb-1">COGS</div>
                            <div class="text-h6 font-weight-bold grey--text text--darken-3">{{ formatNumber(expectedCost) }}</div>
                        </v-col>
                        <v-col cols="4">
                            <div class="text-caption grey--text text-uppercase font-weight-medium mb-1">Net Profit</div>
                            <div class="text-h6 font-weight-bold" :class="expectedProfit >= 0 ? 'green--text' : 'red--text'">
                                {{ formatNumber(expectedProfit) }}
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-card-text>

            <v-card-actions class="pa-4 pa-sm-6 pt-0 bg-grey-lighten-4">
                <v-btn block x-large color="red" dark elevation="2" class="rounded-xl text-capitalize font-weight-bold" @click="saveDailyEntry" :loading="saving" :disabled="volumeSold < 0" height="56">
                    <v-icon left>mdi-content-save</v-icon>
                    {{ isEditing ? 'Update Record' : 'Close Day & Save' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Confirm Dialog (Modern) -->
    <v-dialog v-model="confirmDialog" max-width="420">
        <v-card class="rounded-xl pa-2" elevation="4">
            <v-card-title class="text-h6 font-weight-bold px-4 pt-4 pb-2">
                <v-icon color="red" class="mr-2">mdi-check-circle-outline</v-icon>
                Confirm Entry
            </v-card-title>
            <v-card-text class="px-4 py-2">
                <v-simple-table dense class="transparent">
                    <template>
                        <tbody>
                            <tr v-for="(row, i) in confirmRows" :key="i">
                                <td class="text-body-2 grey--text py-2">{{ row.label }}</td>
                                <td class="text-right text-body-2 font-weight-bold py-2" :class="row.class || ''">
                                    {{ row.value }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                <v-alert v-if="wasteAlert" dense text type="warning" class="mt-3 rounded-lg" border="left">
                    <v-icon x-small color="warning" class="mr-1">mdi-alert</v-icon>
                    Waste is <strong>{{ wastePct }}%</strong> — above normal threshold
                </v-alert>
            </v-card-text>
            <v-card-actions class="px-4 pb-4">
                <v-btn text class="text-capitalize rounded-lg" @click="confirmDialog = false">Edit</v-btn>
                <v-spacer />
                <v-btn color="red" dark class="text-capitalize rounded-lg px-6" @click="submitConfirmed" elevation="2">
                    Confirm & Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" bottom rounded="lg" class="mb-4">
        <div class="d-flex align-center">
            <v-icon left small>{{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
            {{ snackbar.text }}
        </div>
        <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.show = false" class="text-capitalize">Close</v-btn>
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
                    margin: 0
                },
                week: {
                    revenue: 0,
                    cost: 0,
                    margin: 0
                },
                month: {
                    revenue: 0,
                    cost: 0,
                    margin: 0
                }
            },
            todayStats: {
                revenue: 0,
                profit: 0,
                marginPct: 0,
                wasteKg: 0,
                mpesa: 0,
                cash: 0
            },
            weekTrend: {
                revenue: 0
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
                payment_mpesa: 0
            },

            expenseForm: {
                title: '',
                amount: ''
            },
            todayExpenses: [],
            expenseTypes: ['rent', 'shopping', 'gas', 'labour', 'charcoal', 'electricity', 'other'],

            headers: [{
                    text: 'Date',
                    value: 'date',
                    width: '120'
                },
                {
                    text: 'Sold',
                    value: 'sold_kg',
                    align: 'end'
                },
                {
                    text: 'Revenue',
                    value: 'revenue',
                    align: 'end'
                },
                {
                    text: 'Profit',
                    value: 'profit',
                    align: 'end'
                },
                {
                    text: 'Closing',
                    value: 'closing_stock_kg',
                    align: 'end'
                },
                {
                    text: '',
                    value: 'actions',
                    align: 'end',
                    sortable: false,
                    width: '40'
                }
            ],
            recentEntries: [],

            snackbar: {
                show: false,
                text: '',
                color: 'success'
            },

            menuItems: [{
                    title: 'Dashboard',
                    icon: 'mdi-view-dashboard',
                    to: '/dashboard'
                },
                {
                    title: 'Reports',
                    icon: 'mdi-chart-line',
                    to: '/reports'
                },
                {
                    title: 'Profile',
                    icon: 'mdi-account',
                    to: '/profile'
                }
            ]
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
            const total = (parseFloat(this.form.opening_stock_kg) || 0) + (parseFloat(this.form.supply_kg) || 0)
            if (!total) return 0
            return (((parseFloat(this.form.waste_kg) || 0) / total) * 100).toFixed(1)
        },
        wasteAlert() {
            return parseFloat(this.wastePct) > 5
        },
        showMissedEntryAlert() {
            const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD')
            return !this.recentEntries.find(e => e.date === yesterday) && this.isToday
        },
        lastClosingHint() {
            return this.lastClosingStock !== null ? `Yesterday: ${this.lastClosingStock}kg` : ''
        },
        todayEntryExists() {
            return this.recentEntries.some(e => e.date === this.searchDate2)
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
            const total = this.recentEntries.reduce((sum, e) => sum + (parseFloat(e.revenue) || 0), 0)
            return total / this.recentEntries.length
        },
        filteredEntries() {
            if (!this.searchQuery) return this.recentEntries
            return this.recentEntries.filter(e => e.date.includes(this.searchQuery))
        },
        kpiCards() {
            return [{
                    label: "Today's Revenue",
                    value: this.formatNumber(this.todayStats.revenue),
                    subtitle: this.weekTrend.revenue >= 0 ? 'Above weekly avg' : 'Below weekly avg',
                    icon: 'mdi-cash-multiple',
                    iconBg: 'green lighten-5',
                    iconColor: 'green',
                    trend: this.weekTrend.revenue >= 0 ? 12 : -8,
                    bgClass: 'white',
                    labelColor: 'grey--text',
                    valueColor: 'grey--text text--darken-3'
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
                    valueColor: this.todayStats.profit >= 0 ? 'green--text' : 'red--text'
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
                    valueColor: this.wasteAlert ? 'red--text' : 'grey--text text--darken-3'
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
                    valueColor: 'grey--text text--darken-3'
                }
            ]
        },
        performanceRows() {
            return [{
                    label: 'Yesterday',
                    icon: 'mdi-calendar-today',
                    iconColor: 'grey',
                    revenue: this.stats.last.revenue,
                    cost: this.stats.last.cost,
                    margin: this.stats.last.margin
                },
                {
                    label: 'Last 7 Days',
                    icon: 'mdi-calendar-week',
                    iconColor: 'blue',
                    revenue: this.stats.week.revenue,
                    cost: this.stats.week.cost,
                    margin: this.stats.week.margin
                },
                {
                    label: 'This Month',
                    icon: 'mdi-calendar-month',
                    iconColor: 'red',
                    revenue: this.stats.month.revenue,
                    cost: this.stats.month.cost,
                    margin: this.stats.month.margin
                }
            ]
        },
        confirmRows() {
            return [{
                    label: 'Volume Sold',
                    value: `${this.volumeSold} kg`,
                    class: 'grey--text text--darken-2'
                },
                {
                    label: 'Revenue',
                    value: this.formatNumber(this.expectedRevenue),
                    class: 'grey--text text--darken-2'
                },
                {
                    label: 'Cost of Goods',
                    value: this.formatNumber(this.expectedCost),
                    class: 'grey--text text--darken-2'
                },
                {
                    label: 'Expenses',
                    value: this.formatNumber(this.todayExpenseTotal),
                    class: 'grey--text text--darken-2'
                },
                {
                    label: 'Net Profit',
                    value: this.formatNumber(this.expectedProfit),
                    class: this.expectedProfit >= 0 ? 'green--text font-weight-bold' : 'red--text font-weight-bold'
                }
            ]
        }
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
        dateColor(date) {
            const day = moment(date).day()
            return day === 0 || day === 6 ? 'red lighten-4' : 'grey lighten-3'
        },

        async apiCall(method, endpoint, data = null) {
            try {
                const response = await apiClient.request({
                    method,
                    url: endpoint,
                    data
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
                this.loadLastEntry()
            ])
            this.loading = false
        },

        async loadStats() {
            try {
                const [last, week, month] = await Promise.all([
                    this.apiCall('get', `/reports/last-entry?branch_id=${this.branchId}`),
                    this.apiCall('get', `/reports/last-7-days?branch_id=${this.branchId}`),
                    this.apiCall('get', `/reports/month-to-date?branch_id=${this.branchId}`)
                ])
                this.stats.last = {
                    revenue: parseFloat(last.totalRevenue) || 0,
                    cost: parseFloat(last.totalCost) || 0,
                    margin: parseFloat(last.netMargin) || 0
                }
                this.stats.week = {
                    revenue: week.totalRevenue || 0,
                    cost: week.totalCost || 0,
                    margin: week.totalProfit || 0
                }
                this.stats.month = {
                    revenue: month.totalRevenue || 0,
                    cost: month.totalCost || 0,
                    margin: month.totalProfit || 0
                }
                this.weekTrend.revenue = this.stats.last.revenue - (this.stats.week.revenue / 7)
            } catch (e) {
                console.error('Stats error', e)
            }
        },

        async loadRecentEntries() {
            try {
                const entries = await this.apiCall('get', `/daily-operations?branch_id=${this.branchId}`)
                this.recentEntries = entries || []
                console.log('Recent entries', this.recentEntries)
                const todayEntry = this.recentEntries.find(e => e.date === this.searchDate2)
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
                console.log('Last entry', entry)
                if(entry == null){
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
                            cash: parseFloat(entry.payment_cash) || 0
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
                amount: parseFloat(this.expenseForm.amount)
            })
            this.expenseForm = {
                title: '',
                amount: ''
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
                payment_mpesa: parseFloat(this.form.payment_mpesa) || 0
            }
            try {
                await this.apiCall('post', '/daily-operations', payload)
                if (this.todayExpenses.length > 0) {
                    await Promise.all(this.todayExpenses.map(exp =>
                        this.apiCall('post', '/expenses', {
                            branch_id: this.branchId,
                            title: exp.title,
                            amount: exp.amount,
                            date: this.searchDate2
                        })
                    ))
                }
                this.showSnackbar(this.isEditing ? 'Day updated!' : 'Day closed successfully!', 'success')
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
                payment_mpesa: 0
            }
        },
        showSnackbar(text, color = 'success') {
            this.snackbar = {
                show: true,
                text,
                color
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
        }
    },

    watch: {
        searchDate2(newDate) {
            this.form.date = newDate
            const entry = this.recentEntries.find(e => e.date === newDate)
            if (entry) {
                this.populateForm(entry)
            } else {
                this.isEditing = false
                this.resetForm()
            }
        }
    },

    mounted() {
        this.onResize()
        window.addEventListener('resize', this.onResize)
        this.$fire.auth.onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                this.refreshAll()
                this.loadUserProfile()  // <-- ADD THIS LINE
               
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
.bg-grey-lighten-4 {
    background-color: #f5f5f5 !important;
}

.rounded-xl {
    border-radius: 16px !important;
}

.h-100 {
    height: 100%;
}
</style>