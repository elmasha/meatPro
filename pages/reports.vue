<<template>
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

            <!-- Header -->
            <v-row align="center" class="mb-4 mb-sm-6">
                <v-col cols="12" sm="8">
                    <div class="d-flex align-center">
                        <v-btn icon class="mr-2" to="/">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <div>
                            <h1 class="text-h5 text-sm-h4 font-weight-bold grey--text text--darken-3">Analytics & Reports</h1>
                            <div class="d-flex align-center mt-1">
                                <v-icon x-small color="grey" class="mr-1">mdi-calendar-range</v-icon>
                                <span class="text-caption grey--text">Last {{ periodDays }} days</span>
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col cols="12" sm="4" class="d-flex justify-end align-center mt-2 mt-sm-0">
                    <v-select v-model="periodDays" :items="periodOptions" item-text="label" item-value="value" dense outlined rounded hide-details class="rounded-lg mr-2" style="max-width: 140px;" @change="refreshAll" />
                    <v-btn icon outlined small color="grey" @click="refreshAll" :loading="loading">
                        <v-icon small>mdi-refresh</v-icon>
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Period Chips -->
            <v-row class="mb-4">
                <v-col cols="12">
                    <v-chip-group v-model="periodDays" mandatory @change="refreshAll">
                        <v-chip v-for="opt in periodOptions" :key="opt.value" :value="opt.value" filter class="font-weight-medium" color="red" text-color="white" active-class="red darken-2">
                            {{ opt.label }}
                        </v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>

            <!-- Comparative Cards -->
            <v-row class="mb-4 mb-sm-6">
                <v-col v-for="(card, i) in comparativeCards" :key="i" cols="6" lg="3">
                    <v-card class="pa-4 pa-sm-5 rounded-xl h-100" elevation="1">
                        <div class="d-flex align-start justify-space-between mb-3">
                            <v-avatar :color="card.bgColor" size="44" class="elevation-1">
                                <v-icon :color="card.iconColor" size="22">{{ card.icon }}</v-icon>
                            </v-avatar>
                            <v-chip x-small :color="card.change >= 0 ? 'green' : 'red'" text-color="white" label class="font-weight-bold">
                                <v-icon x-small left>{{ card.change >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
                                {{ Math.abs(card.change) }}%
                            </v-chip>
                        </div>
                        <div class="text-caption font-weight-medium text-uppercase grey--text mb-1">
                            {{ card.label }}
                        </div>
                        <div class="text-h5 font-weight-bold grey--text text--darken-3">
                            {{ card.value }}
                        </div>
                        <div class="text-caption grey--text mt-1">vs last month</div>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Profit Trend Chart -->
            <v-row class="mb-4 mb-sm-6">
                <v-col cols="12" lg="8">
                    <v-card class="rounded-xl" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <v-icon color="red" class="mr-2">mdi-chart-line</v-icon>
                            <span class="text-h6 font-weight-bold grey--text text--darken-2">Profit Trend</span>
                            <v-spacer />
                            <v-btn x-small text color="grey" class="text-capitalize">Daily</v-btn>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <div class="chart-container">
                                <div v-for="(day, i) in profitTrend" :key="i" class="chart-bar-wrapper">
                                    <div class="d-flex flex-column align-center">
                                        <div class="chart-bar-container">
                                            <div class="chart-bar" :style="{
                            height: `${Math.max(day.pct, 5)}%`,
                            backgroundColor: day.profit >= 0 ? '#4caf50' : '#f44336'
                          }" />
                                        </div>
                                        <div class="chart-label text-caption grey--text mt-2">{{ formatDayShort(day.date) }}</div>
                                        <div class="chart-value text-caption font-weight-medium">{{ formatNumberShort(day.profit) }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-space-between mt-4 text-caption grey--text">
                                <span>Green = Profit | Red = Loss</span>
                                <span>Avg Margin: {{ avgMargin }}%</span>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <!-- Best Days -->
                <v-col cols="12" lg="4">
                    <v-card class="rounded-xl h-100" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <v-icon color="red" class="mr-2">mdi-calendar-week</v-icon>
                            <span class="text-h6 font-weight-bold grey--text text--darken-2">Best Days</span>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <v-simple-table dense>
                                <template>
                                    <thead>
                                        <tr>
                                            <th class="text-left text-caption grey--text font-weight-medium">Day</th>
                                            <th class="text-right text-caption grey--text font-weight-medium">Avg Revenue</th>
                                            <th class="text-right text-caption grey--text font-weight-medium">Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(day, i) in dayOfWeek" :key="i">
                                            <td class="text-body-2">
                                                <v-icon x-small :color="dayColor(i)" class="mr-1">mdi-circle</v-icon>
                                                {{ day.day_name }}
                                            </td>
                                            <td class="text-right text-body-2 font-weight-medium">{{ formatNumber(day.avg_revenue) }}</td>
                                            <td class="text-right">
                                                <v-chip x-small :color="day.avg_profit > 0 ? 'green lighten-5' : 'red lighten-5'" :text-color="day.avg_profit > 0 ? 'green' : 'red'" label class="font-weight-bold">
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
                <v-col cols="12" lg="6">
                    <v-card class="rounded-xl" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <v-icon color="red" class="mr-2">mdi-delete-variant</v-icon>
                            <span class="text-h6 font-weight-bold grey--text text--darken-2">Waste Analysis</span>
                            <v-spacer />
                            <v-chip small :color="wasteData.avgWastePct > 5 ? 'red lighten-5' : 'green lighten-5'" :text-color="wasteData.avgWastePct > 5 ? 'red' : 'green'" label class="font-weight-bold">
                                {{ wasteData.avgWastePct }}% avg
                            </v-chip>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <div class="d-flex align-center mb-4">
                                <div class="flex-grow-1 mr-4">
                                    <div class="d-flex justify-space-between text-body-2 mb-2">
                                        <span class="grey--text">Total Waste Cost</span>
                                        <span class="font-weight-bold red--text">{{ formatNumber(wasteData.totalWasteCost) }}</span>
                                    </div>
                                    <v-progress-linear :value="Math.min(wasteData.avgWastePct * 15, 100)" :color="wasteData.avgWastePct > 5 ? 'red' : 'green'" rounded height="10" class="rounded-lg" />
                                </div>
                            </div>

                            <v-simple-table dense>
                                <template>
                                    <thead>
                                        <tr>
                                            <th class="text-left text-caption grey--text">Date</th>
                                            <th class="text-right text-caption grey--text">Waste (kg)</th>
                                            <th class="text-right text-caption grey--text">%</th>
                                            <th class="text-right text-caption grey--text">Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, i) in wasteData.data.slice(0, 7)" :key="i">
                                            <td class="text-body-2">{{ formatDateShort(row.date) }}</td>
                                            <td class="text-right text-body-2">{{ row.waste_kg }} kg</td>
                                            <td class="text-right">
                                                <v-chip x-small :color="row.waste_pct > 5 ? 'red lighten-5' : 'grey lighten-4'" :text-color="row.waste_pct > 5 ? 'red' : 'grey'" label>
                                                    {{ parseFloat(row.waste_pct).toFixed(1) }}%
                                                </v-chip>
                                            </td>
                                            <td class="text-right text-body-2 grey--text">{{ formatNumber(row.waste_cost) }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-col>

                <!-- Payment Mix -->
                <v-col cols="12" lg="6">
                    <v-card class="rounded-xl" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <v-icon color="red" class="mr-2">mdi-wallet</v-icon>
                            <span class="text-h6 font-weight-bold grey--text text--darken-2">Payment Mix</span>
                            <v-spacer />
                            <v-chip small color="green lighten-5 green--text" label class="font-weight-bold">
                                {{ paymentData.avgMpesaPct }}% M-Pesa
                            </v-chip>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <div class="d-flex align-center justify-center mb-4">
                                <div class="text-center mr-8">
                                    <v-progress-circular :value="paymentData.avgMpesaPct" :size="100" :width="10" color="green" class="mb-2">
                                        <div class="text-h6 font-weight-bold">{{ paymentData.avgMpesaPct }}%</div>
                                    </v-progress-circular>
                                    <div class="text-caption grey--text">M-Pesa</div>
                                    <div class="text-h6 font-weight-bold green--text">{{ formatNumber(paymentData.totalMpesa) }}</div>
                                </div>
                                <div class="text-center">
                                    <v-progress-circular :value="100 - paymentData.avgMpesaPct" :size="100" :width="10" color="blue" class="mb-2">
                                        <div class="text-h6 font-weight-bold">{{ 100 - paymentData.avgMpesaPct }}%</div>
                                    </v-progress-circular>
                                    <div class="text-caption grey--text">Cash</div>
                                    <div class="text-h6 font-weight-bold blue--text">{{ formatNumber(paymentData.totalCash) }}</div>
                                </div>
                            </div>

                            <v-simple-table dense>
                                <template>
                                    <thead>
                                        <tr>
                                            <th class="text-left text-caption grey--text">Date</th>
                                            <th class="text-right text-caption grey--text">M-Pesa</th>
                                            <th class="text-right text-caption grey--text">Cash</th>
                                            <th class="text-right text-caption grey--text">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(row, i) in paymentData.data.slice(0, 5)" :key="i">
                                            <td class="text-body-2">{{ formatDateShort(row.date) }}</td>
                                            <td class="text-right text-body-2 green--text">{{ formatNumber(row.payment_mpesa) }}</td>
                                            <td class="text-right text-body-2 blue--text">{{ formatNumber(row.payment_cash) }}</td>
                                            <td class="text-right text-body-2 font-weight-medium">{{ formatNumber(parseFloat(row.payment_mpesa) + parseFloat(row.payment_cash)) }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Expense Breakdown -->
            <v-row class="mb-4 mb-sm-6">
                <v-col cols="12">
                    <v-card class="rounded-xl" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <v-icon color="red" class="mr-2">mdi-receipt-text</v-icon>
                            <span class="text-h6 font-weight-bold grey--text text--darken-2">Expense Breakdown</span>
                            <v-spacer />
                            <div class="text-h6 font-weight-bold red--text">{{ formatNumber(expenseData.grandTotal) }}</div>
                        </v-card-title>
                        <v-divider />
                        <v-card-text class="pa-4 pa-sm-6">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <div v-for="(exp, i) in expenseData.data" :key="i" class="mb-3">
                                        <div class="d-flex justify-space-between align-center mb-1">
                                            <div class="d-flex align-center">
                                                <v-icon x-small :color="expenseColors[i % expenseColors.length]" class="mr-2">mdi-circle</v-icon>
                                                <span class="text-body-2 font-weight-medium">{{ exp.title }}</span>
                                                <v-chip x-small class="ml-2" label>{{ exp.count }}x</v-chip>
                                            </div>
                                            <span class="text-body-2 font-weight-bold">{{ formatNumber(exp.total) }}</span>
                                        </div>
                                        <v-progress-linear :value="exp.pct" :color="expenseColors[i % expenseColors.length]" rounded height="12" class="rounded-lg">
                                            <template v-slot:default>
                                                <span class="text-caption white--text font-weight-bold">{{ exp.pct }}%</span>
                                            </template>
                                        </v-progress-linear>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-simple-table dense>
                                        <template>
                                            <thead>
                                                <tr>
                                                    <th class="text-left text-caption grey--text">Category</th>
                                                    <th class="text-right text-caption grey--text">Total</th>
                                                    <th class="text-right text-caption grey--text">%</th>
                                                    <th class="text-right text-caption grey--text">Avg</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(exp, i) in expenseData.data" :key="i">
                                                    <td class="text-body-2">
                                                        <v-icon x-small :color="expenseColors[i % expenseColors.length]" class="mr-1">mdi-circle</v-icon>
                                                        {{ exp.title }}
                                                    </td>
                                                    <td class="text-right text-body-2 font-weight-medium">{{ formatNumber(exp.total) }}</td>
                                                    <td class="text-right">
                                                        <v-chip x-small :color="expenseColors[i % expenseColors.length] + ' lighten-5'" :text-color="expenseColors[i % expenseColors.length]" label class="font-weight-bold">
                                                            {{ exp.pct }}%
                                                        </v-chip>
                                                    </td>
                                                    <td class="text-right text-body-2 grey--text">{{ formatNumber(exp.avg_amount) }}</td>
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
            <v-row>
                <v-col cols="12">
                    <v-card class="rounded-xl" elevation="1">
                        <v-card-title class="px-4 px-sm-6 py-4">
                            <v-icon color="red" class="mr-2">mdi-table</v-icon>
                            <span class="text-h6 font-weight-bold grey--text text--darken-2">Daily Summary</span>
                            <v-spacer />
                            <v-btn small text color="red" class="text-capitalize" @click="exportCSV">
                                <v-icon left small>mdi-download</v-icon> Export CSV
                            </v-btn>
                        </v-card-title>
                        <v-divider />
                        <v-data-table :headers="summaryHeaders" :items="dailySummary" :items-per-page="10" dense class="rounded-b-xl">
                            <template v-slot:item.date="{ item }">
                                {{ formatDateShort(item.date) }}
                            </template>
                            <template v-slot:item.revenue="{ item }">
                                <span class="font-weight-medium">{{ formatNumber(item.revenue) }}</span>
                            </template>
                            <template v-slot:item.profit="{ item }">
                                <v-chip x-small :color="item.profit >= 0 ? 'green lighten-5' : 'red lighten-5'" :text-color="item.profit >= 0 ? 'green' : 'red'" label class="font-weight-bold">
                                    {{ formatNumber(item.profit) }}
                                </v-chip>
                            </template>
                            <template v-slot:item.margin_pct="{ item }">
                                <span :class="item.margin_pct >= 20 ? 'green--text' : item.margin_pct >= 10 ? 'orange--text' : 'red--text'">
                                    {{ parseFloat(item.margin_pct || 0).toFixed(1) }}%
                                </span>
                            </template>
                            <template v-slot:item.waste_pct="{ item }">
                                <v-chip x-small :color="item.waste_pct > 5 ? 'red lighten-5' : 'grey lighten-4'" :text-color="item.waste_pct > 5 ? 'red' : 'grey'" label>
                                    {{ parseFloat(item.waste_pct || 0).toFixed(1) }}%
                                </v-chip>
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
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000" bottom rounded="lg" class="mb-4">
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
    name: 'Reports',

    data() {
        return {
            userProfile: null,
            nav_bars: false,
            bottomNav: 1,
            loading: false,
            periodDays: 30,
            periodOptions: [{
                    label: '7 Days',
                    value: 7
                },
                {
                    label: '30 Days',
                    value: 30
                },
                {
                    label: '90 Days',
                    value: 90
                }
            ],
            user: null,
            shopName: '',
            branchId: null,

            comparative: {
                thisMonth: {
                    revenue: 0,
                    profit: 0,
                    sold: 0,
                    avg_waste: 0
                },
                lastMonth: {
                    revenue: 0,
                    profit: 0,
                    sold: 0,
                    avg_waste: 0
                },
                changes: {
                    revenue: 0,
                    profit: 0,
                    sold: 0,
                    waste: 0
                }
            },

            profitTrend: [],
            dayOfWeek: [],
            avgMargin: 0,

            wasteData: {
                data: [],
                avgWastePct: 0,
                totalWasteCost: 0
            },
            paymentData: {
                data: [],
                totalCash: 0,
                totalMpesa: 0,
                totalRevenue: 0,
                avgMpesaPct: 0
            },
            expenseData: {
                data: [],
                grandTotal: 0
            },
            dailySummary: [],

            expenseColors: ['red', 'blue', 'green', 'orange', 'purple', 'teal', 'pink', 'indigo'],

            summaryHeaders: [{
                    text: 'Date',
                    value: 'date',
                    width: '120'
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
                    text: 'Margin',
                    value: 'margin_pct',
                    align: 'end'
                },
                {
                    text: 'Sold',
                    value: 'sold_kg',
                    align: 'end'
                },
                {
                    text: 'Waste %',
                    value: 'waste_pct',
                    align: 'end'
                }
            ],

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
        comparativeCards() {
            return [{
                    label: 'Revenue',
                    value: this.formatNumber(this.comparative.thisMonth.revenue),
                    change: parseFloat(this.comparative.changes.revenue),
                    icon: 'mdi-cash-multiple',
                    bgColor: 'green lighten-5',
                    iconColor: 'green'
                },
                {
                    label: 'Net Profit',
                    value: this.formatNumber(this.comparative.thisMonth.profit),
                    change: parseFloat(this.comparative.changes.profit),
                    icon: 'mdi-trending-up',
                    bgColor: this.comparative.thisMonth.profit >= 0 ? 'green lighten-5' : 'red lighten-5',
                    iconColor: this.comparative.thisMonth.profit >= 0 ? 'green' : 'red'
                },
                {
                    label: 'Volume Sold',
                    value: `${this.comparative.thisMonth.sold || 0} kg`,
                    change: parseFloat(this.comparative.changes.sold),
                    icon: 'mdi-weight-kilogram',
                    bgColor: 'blue lighten-5',
                    iconColor: 'blue'
                },
                {
                    label: 'Waste Rate',
                    value: `${parseFloat(this.comparative.thisMonth.avg_waste || 0).toFixed(1)} kg/day`,
                    change: parseFloat(this.comparative.changes.waste),
                    icon: 'mdi-delete-variant',
                    bgColor: 'red lighten-5',
                    iconColor: 'red'
                }
            ]
        }
    },

    methods: {
        formatNumber(val) {
            return numeral(val || 0).format('0,0')
        },
        formatNumberShort(val) {
            return numeral(val || 0).format('0.0a').toUpperCase()
        },
        formatDateShort(date) {
            return moment(date).format('MMM D')
        },
        formatDayShort(date) {
            return moment(date).format('D')
        },
        dayColor(index) {
            const colors = ['red', 'blue', 'green', 'orange', 'purple', 'teal', 'pink']
            return colors[index % colors.length]
        },
        dayMargin(day) {
            return day.avg_revenue ? ((day.avg_profit / day.avg_revenue) * 100).toFixed(1) : 0
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
                this.loadSummary()
            ])
            this.loading = false
        },

        async loadComparative() {
            try {
                this.comparative = await this.apiCall('get', `/reports/comparative?branch_id=${this.branchId}`)
            } catch (e) {
                console.error('Comparative error', e)
            }
        },

        async loadProfitability() {
            try {
                const data = await this.apiCall('get', `/reports/profitability?branch_id=${this.branchId}&days=${this.periodDays}`)
                this.dayOfWeek = data.dayOfWeek || []
                if(this.dayOfWeek == null){
                    this.refreshAll()
                }
                const maxProfit = Math.max(...data.daily.map(d => Math.abs(parseFloat(d.profit) || 0)), 1)
                this.profitTrend = data.daily.map(d => ({
                    date: d.date,
                    profit: parseFloat(d.profit) || 0,
                    revenue: parseFloat(d.revenue) || 0,
                    pct: (Math.abs(parseFloat(d.profit) || 0) / maxProfit) * 80 + 5
                }))

                const totalMargin = data.daily.reduce((s, d) => s + (parseFloat(d.margin_pct) || 0), 0)
                this.avgMargin = data.daily.length ? (totalMargin / data.daily.length).toFixed(1) : 0
            } catch (e) {
                console.error('Profitability error', e)
            }
        },

        async loadWaste() {
            try {
                this.wasteData = await this.apiCall('get', `/reports/waste-analysis?branch_id=${this.branchId}&days=${this.periodDays}`)
            } catch (e) {
                console.error('Waste error', e)
            }
        },

        async loadPayment() {
            try {
                this.paymentData = await this.apiCall('get', `/reports/payment-mix?branch_id=${this.branchId}&days=${this.periodDays}`)
            } catch (e) {
                console.error('Payment error', e)
            }
        },

        async loadExpenses() {
            try {
                this.expenseData = await this.apiCall('get', `/reports/expense-breakdown?branch_id=${this.branchId}&days=${this.periodDays}`)
            } catch (e) {
                console.error('Expense error', e)
            }
        },

        async loadSummary() {
            try {
                const data = await this.apiCall('get', `/reports/profitability?branch_id=${this.branchId}&days=${this.periodDays}`)
                this.dailySummary = data.daily.reverse().map(d => ({
                    ...d,
                    waste_pct: d.revenue ? ((parseFloat(d.waste_kg || 0) / parseFloat(d.sold_kg || 1)) * 100) : 0
                }))
            } catch (e) {
                console.error('Summary error', e)
            }
        },

        exportCSV() {
            const headers = ['Date', 'Revenue', 'Profit', 'Margin %', 'Sold kg', 'Waste %']
            const rows = this.dailySummary.map(d => [
                d.date,
                d.revenue,
                d.profit,
                d.margin_pct,
                d.sold_kg,
                d.waste_pct
            ])
            const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
            const blob = new Blob([csv], {
                type: 'text/csv'
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
                color
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
                const {
                    data
                } = await apiClient.get(`/users/${this.user.uid}/profile`)
                this.userProfile = data
                console.log(data)
                if (data.firebase_uid != null) {
                    this.refreshAll();
                }

                // Auto-set shop name and branch from profile if available
                // if (data.business_name) this.shopName = data.business_name
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
                this.user = user;
                this.loadUserProfile();
                this.refreshAll();
            } else {
                this.$router.push('/login')
            }
        })
    },

    created() {
        this.refreshAll();
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

.chart-container {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 200px;
    padding: 0 8px;
    gap: 4px;
    overflow-x: auto;
}

.chart-bar-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 28px;
}

.chart-bar-container {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
}

.chart-bar {
    width: 80%;
    border-radius: 4px 4px 0 0;
    transition: height 0.3s ease;
    min-height: 4px;
}

.chart-label {
    font-size: 10px;
    white-space: nowrap;
}

.chart-value {
    font-size: 10px;
    white-space: nowrap;
    margin-top: 2px;
}

.h-100 {
    height: 100%;
}
</style>
