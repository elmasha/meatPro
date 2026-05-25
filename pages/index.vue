<<template>
  <v-app>
    <!-- Auth-Aware Navbar -->
    <v-app-bar
      app
      flat
      :color="scrolled ? 'white' : 'transparent'"
      :class="{ 'nav-scrolled': scrolled }"
      class="px-3 px-sm-6 px-md-10 modern-nav"
      height="70"
      elevate-on-scroll
    >
      <div class="d-flex align-center">
        <div class="logo-pulse mr-3">
          <v-avatar color="red darken-2" size="38">
            <v-icon color="white" size="20">mdi-food-steak</v-icon>
          </v-avatar>
        </div>
        <span class="text-h6 font-weight-bold red--text text--darken-2">MeatPro</span>
      </div>

      <v-spacer />

      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex align-center">
        <v-btn
          v-for="link in navLinks"
          :key="link.label"
          text
          class="mx-1 text-capitalize font-weight-medium nav-link"
          :class="{ 'red--text': activeSection === link.section }"
          @click="link.action ? link.action() : navigateTo(link.to)"
        >
          {{ link.label }}
        </v-btn>
      </div>

      <!-- Auth State: Logged In -->
      <div v-if="isAuthenticated" class="d-flex align-center ml-4">
        <v-menu offset-y transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="text-capitalize font-weight-medium" v-bind="attrs" v-on="on">
              <v-avatar color="red lighten-4" size="32" class="mr-2">
                <span class="red--text text--darken-2 font-weight-bold text-caption">{{ userInitials }}</span>
              </v-avatar>
              <span class="hidden-sm-and-down">{{ userName }}</span>
              <v-icon right small>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list dense class="py-2" min-width="200">
            <v-list-item @click="navigateTo('/dashboard')">
              <v-list-item-icon class="mr-3">
                <v-icon small>mdi-view-dashboard</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-body-2">Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item @click="navigateTo('/settings')">
              <v-list-item-icon class="mr-3">
                <v-icon small>mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-body-2">Settings</v-list-item-title>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item @click="logout">
              <v-list-item-icon class="mr-3">
                <v-icon small color="red">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="text-body-2 red--text">Sign Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Auth State: Guest -->
      <div v-else class="d-flex align-center ml-2 ml-sm-4">
        <v-btn
          text
          class="text-capitalize font-weight-medium hidden-sm-and-down mr-2"
          @click="navigateTo('/login')"
        >
          Log In
        </v-btn>
        <v-btn
          color="red darken-2"
          dark
          depressed
          class="rounded-lg px-4 px-sm-6 font-weight-bold text-capitalize hover-lift"
          :small="$vuetify.breakpoint.xs"
          @click="navigateTo('/login')"
        >
          <span class="hidden-xs-only">Get Started</span>
          <v-icon class="d-flex d-sm-none">mdi-rocket-launch</v-icon>
        </v-btn>
      </div>

      <!-- Mobile Menu Toggle -->
      <v-btn icon class="d-flex d-md-none ml-2" @click="mobileMenu = !mobileMenu">
        <v-icon>{{ mobileMenu ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="mobileMenu"
      app
      temporary
      right
      width="280"
      class="mobile-drawer"
    >
      <div class="pa-6">
        <div class="d-flex align-center mb-8">
          <v-avatar color="red darken-2" size="32" class="mr-3">
            <v-icon color="white" size="16">mdi-food-steak</v-icon>
          </v-avatar>
          <span class="text-h6 font-weight-bold">MeatPro</span>
        </div>

        <v-list dense class="pa-0">
          <v-list-item
            v-for="link in navLinks"
            :key="link.label"
            class="px-0 py-2"
            @click="link.action ? link.action() : navigateTo(link.to); mobileMenu = false"
          >
            <v-list-item-title class="text-body-1 font-weight-medium">{{ link.label }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />

        <div v-if="isAuthenticated" class="text-center">
          <v-avatar color="red lighten-4" size="48" class="mb-2">
            <span class="red--text text--darken-2 font-weight-bold">{{ userInitials }}</span>
          </v-avatar>
          <div class="font-weight-bold mb-1">{{ userName }}</div>
          <div class="text-caption grey--text mb-4">{{ userEmail }}</div>
          <v-btn block color="red darken-2" dark class="rounded-lg mb-2" @click="navigateTo('/dashboard')">
            Dashboard
          </v-btn>
          <v-btn block text color="grey darken-1" class="text-capitalize" @click="logout">
            Sign Out
          </v-btn>
        </div>

        <div v-else class="d-flex flex-column gap-2">
          <v-btn block color="red darken-2" dark class="rounded-lg font-weight-bold" @click="navigateTo('/login')">
            Get Started Free
          </v-btn>
          <v-btn block text class="text-capitalize" @click="navigateTo('/login')">
            Already have an account? Log In
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <v-main class="pa-0">
      <!-- Hero Section -->
      <section class="hero-modern" ref="hero">
        <div class="hero-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>

        <v-container class="hero-content py-10 py-sm-14 py-md-0">
          <v-row align="center" class="min-h-screen">
            <!-- Text Content -->
            <v-col
              cols="12"
              md="6"
              class="pr-md-8 pr-lg-12 text-center text-md-left order-2 order-md-1 pt-6 pt-md-0"
            >
              <div class="hero-text-wrapper">
                <v-scroll-y-transition appear>
                  <v-chip
                    color="red lighten-5"
                    text-color="red darken-2"
                    small
                    label
                    class="mb-4 mb-sm-6 font-weight-bold px-4 py-1"
                  >
                    <v-icon left small color="red">mdi-star-circle</v-icon>
                    <span class="hidden-xs-only">Trusted by 200+ Butcheries in Kenya</span>
                    <span class="d-flex d-sm-none">200+ Butcheries</span>
                  </v-chip>
                </v-scroll-y-transition>

                <h1
                  class="text-h4 text-sm-h3 text-md-h2 text-lg-h1 font-weight-black mb-4 mb-sm-6 hero-title"
                >
                  Run Your Butchery
                  <span class="gradient-text d-block mt-1 mt-sm-2">Like a Pro</span>
                </h1>

                <p
                  class="text-body-2 text-sm-body-1 text-lg-h6 grey--text text--darken-1 mb-6 mb-sm-8 mx-auto mx-md-0 hero-subtitle"
                  style="max-width: 540px; line-height: 1.7"
                >
                  Track stock, cut waste, and boost profits with the only management tool built
                  specifically for Kenyan meat shops.
                </p>

                <div
                  class="d-flex flex-column flex-sm-row align-center justify-center justify-md-start gap-3 gap-sm-4 mb-8 mb-sm-12"
                >
                  <v-btn
                    :large="!$vuetify.breakpoint.xs"
                    :x-large="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
                    color="red darken-2"
                    dark
                    depressed
                    class="rounded-xl px-6 px-sm-8 font-weight-bold text-capitalize elevation-4 hover-lift w-100 w-sm-auto"
                    @click="navigateTo(isAuthenticated ? '/dashboard' : '/login')"
                  >
                    <v-icon left>mdi-rocket-launch</v-icon>
                    {{ isAuthenticated ? 'Go to Dashboard' : 'Start Free' }}
                  </v-btn>

                  <v-btn
                    :large="!$vuetify.breakpoint.xs"
                    :x-large="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
                    text
                    color="grey darken-2"
                    class="rounded-xl px-4 px-sm-6 font-weight-medium text-capitalize w-100 w-sm-auto mt-2 mt-sm-0"
                    @click="scrollToSection('features')"
                  >
                    <v-icon left color="red">mdi-play-circle</v-icon>
                    Watch Demo
                  </v-btn>
                </div>

                <div class="trust-badges d-flex align-center justify-center justify-md-start flex-wrap">
                  <div class="d-flex mr-4 mr-sm-6">
                    <v-avatar
                      v-for="(avatar, i) in avatars"
                      :key="i"
                      :color="avatar.color"
                      :size="$vuetify.breakpoint.xs ? 32 : 40"
                      class="mr-n2 mr-sm-n3 elevation-2 avatar-ring"
                    >
                      <span class="white--text text-caption font-weight-bold">{{
                        avatar.initials
                      }}</span>
                    </v-avatar>
                  </div>
                  <div>
                    <div class="d-flex align-center justify-center justify-md-start mb-1">
                      <v-rating :value="5" dense x-small color="amber" readonly class="mr-2" />
                      <span class="text-caption grey--text font-weight-medium">4.9/5</span>
                    </div>
                    <div class="text-caption grey--text">From 200+ verified shops</div>
                  </div>
                </div>
              </div>
            </v-col>

            <!-- Phone Mockup -->
            <v-col cols="12" md="6" class="hero-visual-col order-1 order-md-2 pb-6 pb-md-0">
              <v-fade-transition appear>
                <div
                  class="phone-mockup-wrapper"
                  :class="{ 'scale-mobile': $vuetify.breakpoint.xs }"
                >
                  <!-- Glass Card Behind -->
                  <v-card
                    class="glass-card pa-4 pa-sm-6 rounded-xl hidden-xs-only"
                    :max-width="$vuetify.breakpoint.sm ? 300 : 360"
                    style="position: absolute; top: -20px; right: 10px; z-index: 1"
                  >
                    <div class="d-flex align-center mb-2 mb-sm-3">
                      <v-icon color="green" class="mr-2" :small="$vuetify.breakpoint.sm"
                        >mdi-trending-up</v-icon
                      >
                      <span class="text-caption grey--text font-weight-medium">Today's Profit</span>
                    </div>
                    <div class="text-h5 text-sm-h4 font-weight-bold green--text mb-1">KES 12,450</div>
                    <div class="text-caption green--text text--lighten-1">+18% vs yesterday</div>
                  </v-card>

                  <!-- Main Phone -->
                  <v-card
                    class="phone-frame rounded-2xl overflow-hidden elevation-12"
                    :max-width="$vuetify.breakpoint.xs ? 260 : $vuetify.breakpoint.sm ? 300 : 340"
                    :style="
                      $vuetify.breakpoint.xs
                        ? 'border-width: 6px; border-radius: 28px !important;'
                        : ''
                    "
                  >
                    <div
                      class="phone-notch"
                      :style="$vuetify.breakpoint.xs ? 'width: 80px; height: 18px;' : ''"
                    ></div>
                    <div
                      class="pa-3 pa-sm-4 white"
                      :style="{
                        height: $vuetify.breakpoint.xs ? '400px' : '540px',
                        overflowY: 'auto',
                      }"
                    >
                      <!-- App Header -->
                      <div class="d-flex align-center justify-space-between mb-4 mb-sm-6">
                        <div>
                          <div class="text-caption grey--text">Prime Cuts - CBD</div>
                          <div class="text-subtitle-2 text-sm-subtitle-1 font-weight-bold">
                            Dashboard
                          </div>
                        </div>
                        <v-avatar color="red lighten-4" :size="$vuetify.breakpoint.xs ? 28 : 36">
                          <v-icon color="red" :size="$vuetify.breakpoint.xs ? 14 : 18"
                            >mdi-food-steak</v-icon
                          >
                        </v-avatar>
                      </div>

                      <!-- Stats Row -->
                      <v-row dense class="mb-3 mb-sm-4">
                        <v-col cols="6">
                          <v-card class="rounded-lg pa-2 pa-sm-3 red lighten-5" flat>
                            <v-icon color="red" :size="$vuetify.breakpoint.xs ? 14 : 18"
                              >mdi-cash</v-icon
                            >
                            <div class="text-caption grey--text mt-1">Revenue</div>
                            <div class="text-body-2 text-sm-subtitle-2 font-weight-bold">KES 45K</div>
                          </v-card>
                        </v-col>
                        <v-col cols="6">
                          <v-card class="rounded-lg pa-2 pa-sm-3 green lighten-5" flat>
                            <v-icon color="green" :size="$vuetify.breakpoint.xs ? 14 : 18"
                              >mdi-chart-pie</v-icon
                            >
                            <div class="text-caption grey--text mt-1">Margin</div>
                            <div class="text-body-2 text-sm-subtitle-2 font-weight-bold green--text">
                              24%
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>

                      <!-- Chart -->
                      <div class="chart-placeholder rounded-lg pa-3 pa-sm-4 mb-3 mb-sm-4">
                        <div class="text-caption grey--text mb-2 mb-sm-3">Profit Trend</div>
                        <div
                          class="d-flex align-end justify-space-between"
                          :style="{ height: $vuetify.breakpoint.xs ? '50px' : '70px' }"
                        >
                          <div
                            v-for="(h, i) in [40, 65, 45, 80, 55, 70, 60]"
                            :key="i"
                            class="trend-bar rounded-t"
                            :style="{
                              height: h + '%',
                              opacity: 0.3 + i * 0.1,
                              width: $vuetify.breakpoint.xs ? '8px' : '12px',
                            }"
                          ></div>
                        </div>
                      </div>

                      <!-- Recent Activity -->
                      <div class="mb-3 mb-sm-4">
                        <div class="text-caption grey--text mb-2">Recent Sales</div>
                        <div
                          v-for="(sale, i) in [
                            { item: 'Beef Rump', qty: '12 kg', amt: 'KES 8,400' },
                            { item: 'Goat Ribs', qty: '5 kg', amt: 'KES 3,250' },
                          ]"
                          :key="i"
                          class="d-flex align-center justify-space-between py-2"
                          :class="i === 0 ? '' : 'border-top'"
                        >
                          <div class="d-flex align-center">
                            <v-icon x-small color="grey" class="mr-2">mdi-circle-small</v-icon>
                            <span class="text-caption">{{ sale.item }}</span>
                          </div>
                          <span class="text-caption font-weight-medium">{{ sale.amt }}</span>
                        </div>
                      </div>

                      <!-- Button -->
                      <v-btn
                        block
                        color="red darken-2"
                        dark
                        class="rounded-lg py-4 py-sm-5 font-weight-bold"
                        :small="$vuetify.breakpoint.xs"
                      >
                        <v-icon left :size="$vuetify.breakpoint.xs ? 16 : 20"
                          >mdi-store-check</v-icon
                        >
                        Close Day
                      </v-btn>
                    </div>
                  </v-card>

                  <!-- Floating Badge -->
                  <v-card
                    class="floating-badge pa-2 pa-sm-3 rounded-lg d-flex align-center"
                    style="position: absolute; bottom: 30px; left: -10px; z-index: 3"
                    :style="
                      $vuetify.breakpoint.xs
                        ? 'bottom: 20px; left: -5px;'
                        : ''
                    "
                  >
                    <v-avatar color="green" :size="$vuetify.breakpoint.xs ? 24 : 32" class="mr-2">
                      <v-icon color="white" :size="$vuetify.breakpoint.xs ? 12 : 16"
                        >mdi-check</v-icon
                      >
                    </v-avatar>
                    <div>
                      <div class="text-caption grey--text hidden-xs-only">Waste Alert</div>
                      <div class="text-caption text-sm-body-2 font-weight-bold green--text">
                        Under 3%
                      </div>
                    </div>
                  </v-card>
                </div>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Stats Strip -->
      <section class="stats-strip py-8 py-sm-10" ref="stats">
        <v-container>
          <v-row align="center" justify="center" class="text-center">
            <v-col
              v-for="(stat, i) in stats"
              :key="i"
              cols="6"
              md="3"
              class="stat-item py-3 py-sm-0"
            >
              <div
                class="text-h4 text-sm-h3 text-md-h2 font-weight-black mb-1 mb-sm-2"
                :class="stat.color"
              >
                <span v-if="stat.animated">{{ animatedStats[i] }}{{ stat.suffix }}</span>
                <span v-else>{{ stat.value }}{{ stat.suffix }}</span>
              </div>
              <div class="text-caption text-uppercase font-weight-bold grey--text tracking-wide">
                {{ stat.label }}
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Features -->
      <section id="features" class="features-section py-14 py-sm-18 py-md-24" ref="features">
        <v-container>
          <div class="text-center mb-10 mb-sm-14 mb-md-18 reveal-on-scroll">
            <v-chip
              color="red lighten-5"
              text-color="red darken-2"
              label
              class="mb-3 mb-sm-4 px-4 font-weight-bold"
            >
              Why MeatPro?
            </v-chip>
            <h2
              class="text-h4 text-sm-h3 text-md-h2 font-weight-black grey--text text--darken-3 mb-3 mb-sm-4 max-w-700 mx-auto px-3 px-sm-0"
            >
              Everything Your Shop Needs to <span class="red--text">Thrive</span>
            </h2>
            <p
              class="text-body-2 text-sm-body-1 grey--text text--darken-1 max-w-600 mx-auto px-4 px-sm-0"
              style="max-width: 600px"
            >
              No spreadsheets. No guesswork. Just clear numbers that help you make better decisions
              every day.
            </p>
          </div>

          <v-row>
            <v-col
              v-for="(feature, i) in features"
              :key="i"
              cols="12"
              sm="6"
              lg="4"
              class="reveal-on-scroll"
              :style="{ transitionDelay: i * 100 + 'ms' }"
            >
              <v-hover v-slot="{ hover }">
                <v-card
                  class="feature-card rounded-xl pa-6 pa-sm-8 h-100 transition-swing"
                  :class="{ 'elevation-8': hover, 'elevation-1': !hover }"
                  :style="hover ? 'transform: translateY(-8px)' : ''"
                >
                  <div
                    class="feature-icon-wrapper mb-4 mb-sm-6"
                    :class="feature.bgClass"
                  >
                    <v-icon :color="feature.color" :size="$vuetify.breakpoint.xs ? 26 : 32">{{
                      feature.icon
                    }}</v-icon>
                  </div>
                  <h3
                    class="text-subtitle-1 text-sm-h6 font-weight-bold grey--text text--darken-3 mb-2 mb-sm-3"
                  >
                    {{ feature.title }}
                  </h3>
                  <p class="text-body-2 grey--text text--darken-1" style="line-height: 1.7">
                    {{ feature.desc }}
                  </p>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- How It Works -->
      <section class="how-it-works py-14 py-sm-18 py-md-24 grey lighten-4" ref="howitworks">
        <v-container>
          <v-row align="center">
            <v-col
              cols="12"
              md="5"
              class="pr-md-8 pr-lg-12 mb-8 mb-sm-10 mb-md-0 text-center text-md-left reveal-on-scroll"
            >
              <v-chip
                color="red lighten-5"
                text-color="red darken-2"
                label
                class="mb-3 mb-sm-4 px-4 font-weight-bold"
              >
                Simple Workflow
              </v-chip>
              <h2
                class="text-h4 text-sm-h3 text-md-h2 font-weight-black grey--text text--darken-3 mb-4 mb-sm-6"
              >
                Close Your Day in <span class="red--text">3 Minutes</span>
              </h2>
              <p
                class="text-body-2 text-sm-body-1 grey--text text--darken-1 mb-6 mb-sm-8"
                style="line-height: 1.7"
              >
                No complicated setup. Just record your numbers and let MeatPro calculate everything
                else automatically.
              </p>

              <v-btn
                color="red darken-2"
                dark
                depressed
                :large="!$vuetify.breakpoint.xs"
                :x-large="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
                class="rounded-xl px-6 px-sm-8 font-weight-bold text-capitalize hover-lift"
                @click="navigateTo('/register')"
              >
                Try It Free
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="12" md="7" class="reveal-on-scroll">
              <v-card class="rounded-2xl pa-4 pa-sm-6 pa-md-10 white" elevation="4">
                <v-stepper v-model="demoStep" vertical flat class="elevation-0 transparent">
                  <template v-for="(step, i) in steps">
                    <v-stepper-step
                      :key="`step-${i}`"
                      :step="i + 1"
                      :complete="demoStep > i + 1"
                      color="red darken-2"
                      class="pb-2 pb-sm-4"
                      editable
                    >
                      <div
                        class="text-body-1 text-sm-subtitle-1 font-weight-bold grey--text text--darken-2"
                      >
                        {{ step.title }}
                      </div>
                      <small class="grey--text mt-1 d-block" style="max-width: 400px">{{
                        step.desc
                      }}</small>
                    </v-stepper-step>
                    <v-stepper-content :key="`content-${i}`" :step="i + 1" class="ml-0">
                      <v-card
                        flat
                        class="rounded-lg pa-4 grey lighten-4 mb-4"
                        style="border-left: 3px solid #d32f2f"
                      >
                        <div class="d-flex align-start">
                          <v-icon color="red" class="mr-3 mt-1">mdi-lightbulb</v-icon>
                          <div>
                            <div class="text-body-2 font-weight-bold grey--text text--darken-2 mb-1">
                              Pro Tip
                            </div>
                            <div class="text-body-2 grey--text text--darken-1">
                              {{ step.tip }}
                            </div>
                          </div>
                        </div>
                      </v-card>
                    </v-stepper-content>
                  </template>
                </v-stepper>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Testimonials -->
      <section class="testimonials py-14 py-sm-18 py-md-24" ref="testimonials">
        <v-container>
          <div class="text-center mb-10 mb-sm-14 reveal-on-scroll">
            <h2 class="text-h4 text-sm-h3 font-weight-black grey--text text--darken-3 mb-3 mb-sm-4">
              Loved by Butchers
            </h2>
            <p class="text-body-2 text-sm-body-1 grey--text">
              See what shop owners say about MeatPro
            </p>
          </div>

          <v-row>
            <v-col
              v-for="(testimonial, i) in testimonials"
              :key="i"
              cols="12"
              md="4"
              class="mb-4 mb-md-0 reveal-on-scroll"
              :style="{ transitionDelay: i * 150 + 'ms' }"
            >
              <v-card class="testimonial-card rounded-xl pa-5 pa-sm-6 h-100" elevation="1">
                <div class="d-flex align-center mb-3 mb-sm-4">
                  <v-avatar
                    :color="testimonial.color"
                    :size="$vuetify.breakpoint.xs ? 40 : 48"
                    class="mr-3"
                  >
                    <span class="white--text font-weight-bold text-body-2 text-sm-body-1">{{
                      testimonial.initials
                    }}</span>
                  </v-avatar>
                  <div>
                    <div
                      class="font-weight-bold grey--text text--darken-2 text-body-2 text-sm-body-1"
                    >
                      {{ testimonial.name }}
                    </div>
                    <div class="text-caption grey--text">{{ testimonial.shop }}</div>
                  </div>
                </div>
                <v-rating :value="5" dense small color="amber" readonly class="mb-2 mb-sm-3" />
                <p
                  class="text-body-2 grey--text text--darken-1 font-italic"
                  style="line-height: 1.7"
                >
                  "{{ testimonial.quote }}"
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Pricing -->
      <section
        id="pricing"
        class="pricing py-14 py-sm-18 py-md-24 grey lighten-4"
        ref="pricing"
      >
        <v-container>
          <div class="text-center mb-10 mb-sm-14 reveal-on-scroll">
            <v-chip
              color="red lighten-5"
              text-color="red darken-2"
              label
              class="mb-3 mb-sm-4 px-4 font-weight-bold"
            >
              Pricing
            </v-chip>
            <h2
              class="text-h4 text-sm-h3 font-weight-black grey--text text--darken-3 mb-3 mb-sm-4"
            >
              Simple, Honest Pricing
            </h2>
            <p class="text-body-2 text-sm-body-1 grey--text">No hidden fees. Cancel anytime.</p>
          </div>

          <v-row justify="center" align="stretch">
            <v-col cols="12" md="5" lg="4" class="mb-4 mb-md-0 reveal-on-scroll">
              <v-card class="pricing-card rounded-2xl pa-6 pa-sm-8 h-100" elevation="1">
                <div class="text-overline grey--text mb-3 mb-sm-4 tracking-wide">STARTER</div>
                <div class="d-flex align-baseline mb-4 mb-sm-6">
                  <span class="text-h3 text-sm-h2 font-weight-black grey--text text--darken-3"
                    >Free</span
                  >
                </div>
                <v-divider class="mb-4 mb-sm-6" />
                <v-list dense class="mb-6 mb-sm-8 transparent pa-0">
                  <v-list-item
                    v-for="item in starterFeatures"
                    :key="item"
                    class="px-0 mb-1 mb-sm-2"
                  >
                    <v-icon color="green" small class="mr-3">mdi-check-circle</v-icon>
                    <span class="text-body-2 grey--text text--darken-1">{{ item }}</span>
                  </v-list-item>
                </v-list>
                <v-btn
                  block
                  outlined
                  color="red darken-2"
                  depressed
                  :large="!$vuetify.breakpoint.xs"
                  :x-large="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
                  class="rounded-xl font-weight-bold text-capitalize"
                  @click="navigateTo('/register')"
                >
                  Get Started
                </v-btn>
              </v-card>
            </v-col>

            <v-col cols="12" md="5" lg="4" class="reveal-on-scroll" style="transition-delay: 150ms">
              <v-card class="pricing-card-pro rounded-2xl pa-6 pa-sm-8 h-100" dark elevation="8">
                <div class="d-flex align-center justify-space-between mb-3 mb-sm-4">
                  <span class="text-overline red--text text--lighten-3 tracking-wide"
                    >PROFESSIONAL</span
                  >
                  <v-chip color="white" x-small label class="red--text font-weight-bold"
                    >Best Value</v-chip
                  >
                </div>
                <div class="d-flex align-baseline mb-4 mb-sm-6">
                  <span class="text-h3 text-sm-h2 font-weight-black">KES 1,500</span>
                  <span class="text-body-2 text-sm-subtitle-1 red--text text--lighten-3 ml-2"
                    >/mo</span
                  >
                </div>
                <v-divider class="mb-4 mb-sm-6 red darken-2" />
                <v-list dense dark class="mb-6 mb-sm-8 transparent pa-0">
                  <v-list-item v-for="item in proFeatures" :key="item" class="px-0 mb-1 mb-sm-2">
                    <v-icon color="green lighten-2" small class="mr-3">mdi-check-circle</v-icon>
                    <span class="text-body-2 red--text text--lighten-4">{{ item }}</span>
                  </v-list-item>
                </v-list>
                <v-btn
                  block
                  color="white"
                  depressed
                  :large="!$vuetify.breakpoint.xs"
                  :x-large="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
                  class="red--text rounded-xl font-weight-bold text-capitalize hover-lift"
                  @click="navigateTo('/register?plan=pro')"
                >
                  Start 14-Day Trial
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- CTA -->
      <section class="cta-final py-14 py-sm-18 py-md-28" ref="cta">
        <div class="cta-bg"></div>
        <v-container class="position-relative">
          <v-row justify="center">
            <v-col cols="12" md="8" class="text-center px-4 px-sm-0 reveal-on-scroll">
              <h2
                class="text-h4 text-sm-h3 text-md-h2 font-weight-black white--text mb-4 mb-sm-6"
              >
                Ready to Take Control of Your Business?
              </h2>
              <p
                class="text-body-1 text-sm-h6 white--text text--lighten-3 mb-6 mb-sm-8 mb-md-10"
                style="opacity: 0.9"
              >
                Join the growing community of Kenyan butchers who run smarter shops with MeatPro.
              </p>
              <v-btn
                :large="!$vuetify.breakpoint.xs"
                :x-large="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
                color="white"
                depressed
                class="red--text rounded-xl px-6 px-sm-10 font-weight-bold text-capitalize elevation-4 hover-lift"
                @click="navigateTo(isAuthenticated ? '/dashboard' : '/register')"
              >
                {{ isAuthenticated ? 'Open Dashboard' : 'Create Free Account' }}
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Footer -->
      <v-footer color="grey darken-4" dark class="py-8 py-sm-12">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="mb-6 mb-sm-8 mb-md-0 text-center text-md-left">
              <div class="d-flex align-center justify-center justify-md-start mb-3 mb-sm-4">
                <v-avatar color="red darken-2" size="28" class="mr-2">
                  <v-icon color="white" size="14">mdi-food-steak</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold">MeatPro</span>
              </div>
              <p
                class="text-body-2 grey--text text--lighten-1 mb-3 mb-sm-4 mx-auto mx-md-0"
                style="max-width: 300px; line-height: 1.7"
              >
                The modern management platform built specifically for Kenyan butcheries and meat
                shops.
              </p>
              <div class="d-flex justify-center justify-md-start">
                <v-btn icon small color="grey lighten-1" class="mr-2" href="#" aria-label="Twitter">
                  <v-icon small>mdi-twitter</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  color="grey lighten-1"
                  class="mr-2"
                  href="#"
                  aria-label="Instagram"
                >
                  <v-icon small>mdi-instagram</v-icon>
                </v-btn>
                <v-btn icon small color="grey lighten-1" href="#" aria-label="WhatsApp">
                  <v-icon small>mdi-whatsapp</v-icon>
                </v-btn>
              </div>
            </v-col>

            <v-col
              cols="6"
              md="2"
              v-for="(col, i) in footerLinks"
              :key="i"
              class="text-center text-md-left mb-4 mb-md-0"
            >
              <div
                class="text-caption font-weight-bold text-uppercase grey--text mb-3 mb-sm-4 tracking-wide"
              >
                {{ col.title }}
              </div>
              <v-list dense dark class="pa-0 transparent">
                <v-list-item
                  v-for="link in col.links"
                  :key="link"
                  class="px-0 mb-1 mb-sm-2 justify-center justify-md-start"
                >
                  <span
                    class="text-body-2 grey--text text--lighten-1 hover-white cursor-pointer"
                    @click="handleFooterLink(link)"
                    >{{ link }}</span
                  >
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <v-divider class="my-6 my-sm-8 grey darken-3" />

          <div
            class="d-flex flex-column flex-sm-row justify-space-between align-center text-center text-sm-left"
          >
            <span class="text-caption grey--text mb-2 mb-sm-0"
              >© {{ new Date().getFullYear() }} MeatPro. All rights reserved.</span
            >
            <div class="d-flex">
              <span class="text-caption grey--text mr-4 cursor-pointer hover-white" @click="navigateTo('/privacy')"
                >Privacy</span
              >
              <span class="text-caption grey--text cursor-pointer hover-white" @click="navigateTo('/terms')"
                >Terms</span
              >
            </div>
          </div>
        </v-container>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'ModernHome',
  layout: 'public',

  data() {
    return {
      scrolled: false,
      demoStep: 1,
      mobileMenu: false,
      activeSection: '',
      isAuthenticated: false,
      userName: '',
      userEmail: '',
      animatedStats: [0, 0, 0, 0],
      statsAnimated: false,

      navLinks: [
        { label: 'Features', to: null, section: 'features', action: () => this.scrollToSection('features') },
        { label: 'How It Works', to: null, section: 'howitworks', action: () => this.scrollToSection('howitworks') },
        { label: 'Pricing', to: null, section: 'pricing', action: () => this.scrollToSection('pricing') },
      ],

      avatars: [
        { initials: 'JK', color: 'red darken-2' },
        { initials: 'MN', color: 'blue darken-2' },
        { initials: 'AO', color: 'green darken-2' },
        { initials: 'PW', color: 'orange darken-2' },
      ],

      stats: [
        { value: 200, suffix: '+', label: 'Active Shops', color: 'red--text', animated: true },
        { value: 50, suffix: 'K+', label: 'Entries Logged', color: 'green--text', animated: true },
        { value: 30, suffix: '%', label: 'Waste Reduced', color: 'blue--text', animated: true },
        { value: 2, suffix: 'M+', label: 'Revenue Tracked', color: 'orange--text', animated: true },
      ],

      features: [
        {
          title: 'Daily Operations',
          desc: 'Record opening stock, supply, waste, and closing stock in under 60 seconds. Auto-calculates everything.',
          icon: 'mdi-store-check',
          color: 'red',
          bgClass: 'red lighten-5',
        },
        {
          title: 'Live Profit Analytics',
          desc: 'See real-time margins, revenue trends, and profitability insights as you close each day.',
          icon: 'mdi-chart-areaspline',
          color: 'green',
          bgClass: 'green lighten-5',
        },
        {
          title: 'Waste Intelligence',
          desc: 'Get automatic alerts when waste exceeds your target. Protect your margins with data-driven decisions.',
          icon: 'mdi-bell-alert',
          color: 'orange',
          bgClass: 'orange lighten-5',
        },
        {
          title: 'Payment Tracking',
          desc: 'Separate M-Pesa and cash records with automatic reconciliation summaries every evening.',
          icon: 'mdi-wallet',
          color: 'blue',
          bgClass: 'blue lighten-5',
        },
        {
          title: 'Expense Control',
          desc: 'Log salaries, transport, rent, and supplies. Know exactly where every shilling goes.',
          icon: 'mdi-receipt-text',
          color: 'purple',
          bgClass: 'purple lighten-5',
        },
        {
          title: 'Works Everywhere',
          desc: 'Use on your phone, tablet, or laptop. Perfect for shop owners who are always on the move.',
          icon: 'mdi-cellphone-link',
          color: 'teal',
          bgClass: 'teal lighten-5',
        },
      ],

      steps: [
        {
          title: 'Record Morning Stock',
          desc: 'Enter opening stock and any fresh supply received from the abattoir.',
          tip: 'Set up recurring supply templates to save time on repeat orders.',
        },
        {
          title: 'Log Sales & Waste',
          desc: 'Input closing stock and waste. MeatPro instantly calculates kg sold and revenue.',
          tip: 'Use the quick-add buttons for common waste reasons like spoilage or trimming.',
        },
        {
          title: 'Review & Optimize',
          desc: 'Check profit, margins, and trends. Export clean reports for your accountant.',
          tip: 'Enable daily WhatsApp summaries to get your numbers delivered every evening.',
        },
      ],

      testimonials: [
        {
          name: 'James Kamau',
          shop: 'Prime Cuts - Nairobi CBD',
          initials: 'JK',
          color: 'red darken-2',
          quote:
            'I used to guess my profits. Now I know exactly how much I made before I leave the shop. Game changer.',
        },
        {
          name: 'Mary Njeri',
          shop: 'Mama Njeri Meats - Kiambu',
          initials: 'MN',
          color: 'green darken-2',
          quote:
            'The waste alerts helped me cut spoilage by half in just two weeks. My margins have never been better.',
        },
        {
          name: 'Peter Ochieng',
          shop: 'Lakeview Butchery - Kisumu',
          initials: 'PO',
          color: 'blue darken-2',
          quote:
            'Finally, a tool that understands how Kenyan butcheries work. Simple, fast, and reliable on my old phone.',
        },
      ],

      starterFeatures: [
        '1 shop / branch',
        'Daily closing entries',
        'Basic profit summary',
        '7-day history',
        'Email support',
      ],

      proFeatures: [
        'Unlimited branches',
        'Advanced analytics & reports',
        'Waste trend forecasting',
        'Unlimited history + CSV export',
        'Priority WhatsApp support',
        'Multi-user team access',
        'Custom price alerts',
      ],

      footerLinks: [
        {
          title: 'Product',
          links: ['Features', 'Pricing', 'Reports', 'Mobile App'],
        },
        {
          title: 'Company',
          links: ['About', 'Blog', 'Careers', 'Contact'],
        },
        {
          title: 'Support',
          links: ['Help Center', 'WhatsApp', 'Email Us', 'Status'],
        },
      ],
    }
  },

  computed: {
    userInitials() {
      if (!this.userName) return ''
      return this.userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.initIntersectionObserver()
    this.checkAuth()
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.observer) this.observer.disconnect()
  },

  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50
    },

    scrollToSection(id) {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        this.activeSection = id
      }
    },

    navigateTo(path) {
      if (path) {
        this.$router ? this.$router.push(path) : (window.location.href = path)
      }
    },

    logout() {
      // Clear auth state
      this.isAuthenticated = false
      this.userName = ''
      this.userEmail = ''
      localStorage.removeItem('meatpro_token')
      localStorage.removeItem('meatpro_user')
      this.$router ? this.$router.push('/') : (window.location.href = '/')
    },

    checkAuth() {
      // Check for stored auth token
      const token = localStorage.getItem('meatpro_token')
      const user = localStorage.getItem('meatpro_user')
      if (token && user) {
        try {
          const userData = JSON.parse(user)
          this.isAuthenticated = true
          this.userName = userData.name || 'User'
          this.userEmail = userData.email || ''
        } catch (e) {
          this.isAuthenticated = false
        }
      }
    },

    handleFooterLink(link) {
      const map = {
        Features: () => this.scrollToSection('features'),
        Pricing: () => this.scrollToSection('pricing'),
        'Mobile App': () => this.navigateTo('/mobile'),
        About: () => this.navigateTo('/about'),
        Blog: () => this.navigateTo('/blog'),
        Careers: () => this.navigateTo('/careers'),
        Contact: () => this.navigateTo('/contact'),
        'Help Center': () => this.navigateTo('/help'),
        WhatsApp: () => window.open('https://wa.me/254700000000', '_blank'),
        'Email Us': () => (window.location.href = 'mailto:support@meatpro.co.ke'),
        Status: () => window.open('https://status.meatpro.co.ke', '_blank'),
      }
      if (map[link]) {
        map[link]()
      } else {
        this.navigateTo(`/${link.toLowerCase().replace(/\s+/g, '-')}`)
      }
    },

    initIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')

            // Animate stats when visible
            if (entry.target.closest('.stats-strip') && !this.statsAnimated) {
              this.animateStats()
              this.statsAnimated = true
            }
          }
        })
      }, options)

      // Observe all reveal elements
      this.$nextTick(() => {
        const reveals = document.querySelectorAll('.reveal-on-scroll')
        reveals.forEach((el) => this.observer.observe(el))
      })
    },

    animateStats() {
      const duration = 2000
      const steps = 60
      const interval = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        const easeOut = 1 - Math.pow(1 - progress, 3) // ease-out cubic

        this.animatedStats = this.stats.map((stat) => {
          return Math.floor(stat.value * easeOut)
        })

        if (step >= steps) {
          clearInterval(timer)
          this.animatedStats = this.stats.map((s) => s.value)
        }
      }, interval)
    },
  },
}
</script>

<style scoped>
/* Modern Typography & Spacing */
.tracking-wide {
  letter-spacing: 0.08em;
}

.max-w-600 {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.max-w-700 {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 50%, #7f0000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navigation */
.modern-nav {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-scrolled {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06) !important;
}

.nav-link {
  position: relative;
  letter-spacing: 0.01em;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #d32f2f;
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 2px;
}

.nav-link:hover::after {
  width: 50%;
}

/* Mobile Drawer */
.mobile-drawer {
  background: white;
}

/* Hero Section */
.hero-modern {
  position: relative;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  overflow: hidden;
}

.min-h-screen {
  min-height: calc(100vh - 70px);
}

.hero-bg-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: #ffcdd2;
  top: -150px;
  right: -100px;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: #e8f5e9;
  bottom: -150px;
  left: -100px;
}

.shape-3 {
  width: 400px;
  height: 400px;
  background: #fff3e0;
  top: 40%;
  left: 45%;
  transform: translate(-50%, -50%);
}

.hero-title {
  line-height: 1.12;
  letter-spacing: -0.03em;
}

/* Phone Mockup */
.phone-mockup-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 520px;
}

.scale-mobile {
  transform: scale(0.88);
  min-height: 420px;
}

.phone-frame {
  position: relative;
  z-index: 2;
  border: 10px solid #1a1a1a;
  border-radius: 44px !important;
  background: #1a1a1a;
}

.phone-notch {
  width: 220px;
  height: 28px;
  background: #1a1a1a;
  border-radius: 0 0 20px 20px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
}

.glass-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.floating-badge {
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.chart-placeholder {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border: 1px solid #eeeeee;
}

.trend-bar {
  background: linear-gradient(to top, #d32f2f, #ef5350);
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
}

.border-top {
  border-top: 1px solid #f0f0f0;
}

/* Stats Strip */
.stats-strip {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 15%;
  height: 70%;
  width: 1px;
  background: #e0e0e0;
}

/* Scroll Reveal Animation */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Feature Cards */
.feature-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.feature-card:hover {
  border-color: #eeeeee;
}

.feature-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pricing */
.pricing-card {
  border: 1px solid #eeeeee;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  border-color: #d32f2f;
  transform: translateY(-4px);
}

.pricing-card-pro {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%) !important;
  position: relative;
  overflow: hidden;
}

.pricing-card-pro::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

/* CTA Final */
.cta-final {
  position: relative;
  background: linear-gradient(135deg, #b71c1c 0%, #7f0000 100%);
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.position-relative {
  position: relative;
  z-index: 1;
}

/* Testimonials */
.testimonial-card {
  transition: all 0.35s ease;
}

.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08) !important;
}

/* Utilities */
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(211, 47, 47, 0.25) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.hover-white:hover {
  color: white !important;
  transition: color 0.3s ease;
}

.avatar-ring {
  border: 2px solid white;
}

.rounded-2xl {
  border-radius: 20px !important;
}

.w-100 {
  width: 100%;
}

/* Responsive Breakpoints */
@media (min-width: 600px) {
  .w-sm-auto {
    width: auto !important;
  }

  .phone-mockup-wrapper {
    min-height: 580px;
  }
}

@media (max-width: 959px) {
  .stat-item:nth-child(2)::after {
    display: none;
  }

  .shape {
    opacity: 0.2;
  }
}

@media (max-width: 599px) {
  .hero-title {
    font-size: 1.85rem !important;
  }

  .hero-subtitle {
    font-size: 0.9rem !important;
  }

  .stat-item:not(:last-child)::after {
    display: none;
  }

  .stat-item {
    padding: 12px 0;
  }

  .phone-mockup-wrapper {
    min-height: 400px;
    transform: scale(0.92);
  }

  .glass-card {
    display: none;
  }

  .floating-badge {
    bottom: 15px !important;
    left: 5px !important;
  }

  .feature-icon-wrapper {
    width: 52px;
    height: 52px;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .hero-title {
    font-size: 2.4rem !important;
  }

  .phone-mockup-wrapper {
    transform: scale(0.92);
  }
}
</style>