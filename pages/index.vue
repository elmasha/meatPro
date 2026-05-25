<<template>
  <v-app>
    <!-- Modern Glass Navbar -->
    <v-app-bar 
      app 
      flat 
      color="transparent" 
      class="px-4 px-sm-8 modern-nav"
      :class="{ 'nav-scrolled': scrolled }"
      height="80"
    >
      <div class="d-flex align-center">
        <div class="logo-pulse mr-3">
          <v-avatar color="red" size="40">
            <v-icon color="white" size="22">mdi-food-steak</v-icon>
          </v-avatar>
        </div>
        <span class="text-h5 font-weight-bold red--text text--darken-2">MeatPro</span>
      </div>
      
      <v-spacer />
      
      <div class="hidden-sm-and-down d-flex align-center">
        <v-btn 
          v-for="link in navLinks" 
          :key="link.label"
          text 
          class="mx-2 text-capitalize font-weight-medium nav-link"
          :to="link.to"
          @click="link.click ? link.click() : null"
        >
          {{ link.label }}
        </v-btn>
      </div>
      
      <v-btn 
        color="red darken-2" 
        dark 
        class="rounded-lg ml-4 px-6 font-weight-bold text-capitalize elevation-2 hover-lift"
        to="/login"
      >
        Sign In
      </v-btn>
    </v-app-bar>

    <v-main class="pa-0">
      <!-- Hero Section -->
      <section class="hero-modern">
        <div class="hero-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
        
        <v-container class="hero-content py-16 py-md-0">
          <v-row align="center" style="min-height: 100vh;">
            <v-col cols="12" lg="6" class="pr-lg-12">
              <div class="hero-text-wrapper">
                <v-slide-y-transition appear>
                  <v-chip 
                    color="red lighten-5" 
                    text-color="red darken-2"
                    small 
                    label 
                    class="mb-6 font-weight-bold px-4 py-2"
                  >
                    <v-icon left small color="red">mdi-star-circle</v-icon>
                    Trusted by 200+ Butcheries in Kenya
                  </v-chip>
                </v-slide-y-transition>

                <h1 class="display-1 display-md-2 font-weight-black mb-6 hero-title">
                  Run Your Butchery
                  <span class="gradient-text d-block mt-2">Like a Pro</span>
                </h1>

                <p class="text-body-1 text-lg-h6 grey--text text--darken-1 mb-8 hero-subtitle" style="max-width: 540px; line-height: 1.7;">
                  Track stock, cut waste, and boost profits with the only management tool built specifically for Kenyan meat shops.
                </p>

                <div class="d-flex flex-wrap align-center gap-4 mb-12">
                  <v-btn 
                    x-large 
                    color="red darken-2" 
                    dark 
                    class="rounded-xl px-8 font-weight-bold text-capitalize elevation-4 hover-lift"
                    to="/login"
                  >
                    <v-icon left>mdi-rocket-launch</v-icon>
                    Start Free
                  </v-btn>
                  
                  <v-btn 
                    x-large 
                    text 
                    color="grey darken-2" 
                    class="rounded-xl px-6 font-weight-medium text-capitalize"
                    @click="scrollToDemo"
                  >
                    <v-icon left color="red">mdi-play-circle</v-icon>
                    Watch Demo
                  </v-btn>
                </div>

                <div class="trust-badges d-flex align-center flex-wrap">
                  <div class="d-flex mr-6">
                    <v-avatar 
                      v-for="(avatar, i) in avatars" 
                      :key="i" 
                      :color="avatar.color" 
                      size="40" 
                      class="mr-n3 elevation-2 avatar-ring"
                    >
                      <span class="white--text text-caption font-weight-bold">{{ avatar.initials }}</span>
                    </v-avatar>
                  </div>
                  <div>
                    <div class="d-flex align-center mb-1">
                      <v-rating :value="5" dense x-small color="amber" readonly class="mr-2" />
                      <span class="text-caption grey--text font-weight-medium">4.9/5</span>
                    </div>
                    <div class="text-caption grey--text">From 200+ verified shops</div>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" lg="6" class="hero-visual-col">
              <v-fade-transition appear>
                <div class="phone-mockup-wrapper">
                  <!-- Glass Card Behind -->
                  <v-card class="glass-card pa-6 rounded-3xl" max-width="380" style="position: absolute; top: -20px; right: 20px; z-index: 1;">
                    <div class="d-flex align-center mb-4">
                      <v-icon color="green" class="mr-2">mdi-trending-up</v-icon>
                      <span class="text-caption grey--text font-weight-medium">Today's Profit</span>
                    </div>
                    <div class="text-h4 font-weight-bold green--text mb-1">KES 12,450</div>
                    <div class="text-caption green--text text--lighten-1">+18% vs yesterday</div>
                  </v-card>

                  <!-- Main Phone -->
                  <v-card class="phone-frame rounded-3xl overflow-hidden elevation-12" max-width="320">
                    <div class="phone-notch"></div>
                    <div class="pa-4 bg-white" style="height: 580px; overflow-y: auto;">
                      <!-- App Header -->
                      <div class="d-flex align-center justify-space-between mb-6">
                        <div>
                          <div class="text-caption grey--text">Prime Cuts - CBD</div>
                          <div class="text-subtitle-1 font-weight-bold">Dashboard</div>
                        </div>
                        <v-avatar color="red lighten-4" size="36">
                          <v-icon color="red" small>mdi-food-steak</v-icon>
                        </v-avatar>
                      </div>

                      <!-- Stats Row -->
                      <v-row dense class="mb-4">
                        <v-col cols="6">
                          <v-card class="rounded-xl pa-3 red lighten-5" flat>
                            <v-icon color="red" small>mdi-cash</v-icon>
                            <div class="text-caption grey--text mt-1">Revenue</div>
                            <div class="text-subtitle-2 font-weight-bold">KES 45K</div>
                          </v-card>
                        </v-col>
                        <v-col cols="6">
                          <v-card class="rounded-xl pa-3 green lighten-5" flat>
                            <v-icon color="green" small>mdi-chart-pie</v-icon>
                            <div class="text-caption grey--text mt-1">Margin</div>
                            <div class="text-subtitle-2 font-weight-bold green--text">24%</div>
                          </v-card>
                        </v-col>
                      </v-row>

                      <!-- Chart Placeholder -->
                      <div class="chart-placeholder rounded-xl pa-4 mb-4">
                        <div class="text-caption grey--text mb-3">Profit Trend</div>
                        <div class="d-flex align-end justify-space-between" style="height: 80px;">
                          <div 
                            v-for="(h, i) in [40, 65, 45, 80, 55, 70, 60]" 
                            :key="i"
                            class="trend-bar rounded-t"
                            :style="{ height: h + '%', opacity: 0.3 + (i * 0.1) }"
                          ></div>
                        </div>
                      </div>

                      <!-- Action Button -->
                      <v-btn block color="red darken-2" dark class="rounded-xl py-6 font-weight-bold">
                        <v-icon left>mdi-store-check</v-icon>
                        Close Day
                      </v-btn>
                    </div>
                  </v-card>

                  <!-- Floating Badge -->
                  <v-card class="floating-badge pa-3 rounded-xl d-flex align-center" style="position: absolute; bottom: 40px; left: -20px; z-index: 3;">
                    <v-avatar color="green" size="32" class="mr-2">
                      <v-icon color="white" small>mdi-check</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption grey--text">Waste Alert</div>
                      <div class="text-body-2 font-weight-bold green--text">Under 3%</div>
                    </div>
                  </v-card>
                </div>
              </v-fade-transition>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Animated Stats Strip -->
      <section class="stats-strip py-8">
        <v-container>
          <v-row align="center" justify="center" class="text-center">
            <v-col v-for="(stat, i) in stats" :key="i" cols="6" md="3" class="stat-item">
              <div class="text-h3 text-sm-h2 font-weight-black mb-2" :class="stat.color">
                <count-up :end="stat.value" :suffix="stat.suffix" />
              </div>
              <div class="text-caption text-uppercase font-weight-bold grey--text tracking-wide">{{ stat.label }}</div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Features Grid -->
      <section id="features" class="features-section py-16 py-md-20">
        <v-container>
          <div class="text-center mb-16">
            <v-chip color="red lighten-5" text-color="red darken-2" label class="mb-4 px-4 font-weight-bold">
              Why MeatPro?
            </v-chip>
            <h2 class="text-h3 text-sm-h2 font-weight-black grey--text text--darken-3 mb-4 max-w-700 mx-auto">
              Everything Your Shop Needs to <span class="red--text">Thrive</span>
            </h2>
            <p class="text-body-1 grey--text text--darken-1 max-w-600 mx-auto" style="max-width: 600px;">
              No spreadsheets. No guesswork. Just clear numbers that help you make better decisions every day.
            </p>
          </div>

          <v-row>
            <v-col v-for="(feature, i) in features" :key="i" cols="12" sm="6" lg="4">
              <v-hover v-slot="{ hover }">
                <v-card 
                  class="feature-card rounded-2xl pa-8 h-100 transition-swing" 
                  :class="{ 'elevation-8': hover, 'elevation-1': !hover }"
                  :style="hover ? 'transform: translateY(-8px)' : ''"
                >
                  <div class="feature-icon-wrapper mb-6" :class="feature.bgClass">
                    <v-icon :color="feature.color" size="32">{{ feature.icon }}</v-icon>
                  </div>
                  <h3 class="text-h6 font-weight-bold grey--text text--darken-3 mb-3">
                    {{ feature.title }}
                  </h3>
                  <p class="text-body-2 grey--text text--darken-1" style="line-height: 1.7;">
                    {{ feature.desc }}
                  </p>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Interactive Demo / How It Works -->
      <section class="how-it-works py-16 py-md-20 bg-grey lighten-4">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="5" class="pr-md-12 mb-8 mb-md-0">
              <v-chip color="red lighten-5" text-color="red darken-2" label class="mb-4 px-4 font-weight-bold">
                Simple Workflow
              </v-chip>
              <h2 class="text-h3 text-sm-h2 font-weight-black grey--text text--darken-3 mb-6">
                Close Your Day in <span class="red--text">3 Minutes</span>
              </h2>
              <p class="text-body-1 grey--text text--darken-1 mb-8" style="line-height: 1.7;">
                No complicated setup. Just record your numbers and let MeatPro calculate everything else automatically.
              </p>
              
              <v-btn 
                color="red darken-2" 
                dark 
                x-large 
                class="rounded-xl px-8 font-weight-bold text-capitalize hover-lift"
                to="/login"
              >
                Try It Free
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="12" md="7">
              <v-card class="rounded-3xl pa-6 pa-md-10 bg-white" elevation="4">
                <v-stepper v-model="demoStep" vertical flat class="elevation-0">
                  <v-stepper-step
                    v-for="(step, i) in steps"
                    :key="i"
                    :step="i + 1"
                    :complete="demoStep > i + 1"
                    color="red darken-2"
                    class="pb-4"
                  >
                    <div class="text-subtitle-1 font-weight-bold grey--text text--darken-2">{{ step.title }}</div>
                    <div class="text-body-2 grey--text mt-1" style="max-width: 400px;">{{ step.desc }}</div>
                  </v-stepper-step>
                </v-stepper>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Testimonials -->
      <section class="testimonials py-16 py-md-20">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-black grey--text text--darken-3 mb-4">Loved by Butchers</h2>
            <p class="text-body-1 grey--text">See what shop owners say about MeatPro</p>
          </div>

          <v-row>
            <v-col v-for="(testimonial, i) in testimonials" :key="i" cols="12" md="4">
              <v-card class="testimonial-card rounded-2xl pa-6 h-100" elevation="1">
                <div class="d-flex align-center mb-4">
                  <v-avatar :color="testimonial.color" size="48" class="mr-3">
                    <span class="white--text font-weight-bold">{{ testimonial.initials }}</span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold grey--text text--darken-2">{{ testimonial.name }}</div>
                    <div class="text-caption grey--text">{{ testimonial.shop }}</div>
                  </div>
                </div>
                <v-rating :value="5" dense small color="amber" readonly class="mb-3" />
                <p class="text-body-2 grey--text text--darken-1 font-italic" style="line-height: 1.7;">
                  "{{ testimonial.quote }}"
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Pricing -->
      <section class="pricing py-16 py-md-20 bg-grey lighten-4">
        <v-container>
          <div class="text-center mb-12">
            <v-chip color="red lighten-5" text-color="red darken-2" label class="mb-4 px-4 font-weight-bold">
              Pricing
            </v-chip>
            <h2 class="text-h3 font-weight-black grey--text text--darken-3 mb-4">
              Simple, Honest Pricing
            </h2>
            <p class="text-body-1 grey--text">No hidden fees. Cancel anytime.</p>
          </div>

          <v-row justify="center" align="end">
            <v-col cols="12" md="5" lg="4" class="mb-6 mb-md-0">
              <v-card class="pricing-card rounded-3xl pa-8 h-100" elevation="1">
                <div class="text-overline grey--text mb-4 tracking-wide">STARTER</div>
                <div class="d-flex align-baseline mb-6">
                  <span class="text-h2 font-weight-black grey--text text--darken-3">Free</span>
                </div>
                <v-divider class="mb-6" />
                <v-list dense class="mb-8">
                  <v-list-item v-for="item in starterFeatures" :key="item" class="px-0 mb-2">
                    <v-icon color="green" small class="mr-3">mdi-check-circle</v-icon>
                    <span class="text-body-2 grey--text text--darken-1">{{ item }}</span>
                  </v-list-item>
                </v-list>
                <v-btn block outlined color="red darken-2" x-large class="rounded-xl font-weight-bold text-capitalize" to="/login">
                  Get Started
                </v-btn>
              </v-card>
            </v-col>

            <v-col cols="12" md="5" lg="4">
              <v-card class="pricing-card-pro rounded-3xl pa-8 h-100" dark elevation="8">
                <div class="d-flex align-center justify-space-between mb-4">
                  <span class="text-overline red--text text--lighten-3 tracking-wide">PROFESSIONAL</span>
                  <v-chip color="white" small label class="red--text font-weight-bold">Best Value</v-chip>
                </div>
                <div class="d-flex align-baseline mb-6">
                  <span class="text-h2 font-weight-black">KES 1,500</span>
                  <span class="text-subtitle-1 red--text text--lighten-3 ml-2">/mo</span>
                </div>
                <v-divider class="mb-6 red darken-2" />
                <v-list dense dark class="mb-8">
                  <v-list-item v-for="item in proFeatures" :key="item" class="px-0 mb-2">
                    <v-icon color="green lighten-2" small class="mr-3">mdi-check-circle</v-icon>
                    <span class="text-body-2 red--text text--lighten-4">{{ item }}</span>
                  </v-list-item>
                </v-list>
                <v-btn block color="white" x-large class="red--text rounded-xl font-weight-bold text-capitalize hover-lift" to="/login">
                  Start 14-Day Trial
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Final CTA -->
      <section class="cta-final py-16 py-md-24">
        <div class="cta-bg"></div>
        <v-container class="position-relative">
          <v-row justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h2 class="text-h3 text-sm-h2 font-weight-black white--text mb-6">
                Ready to Take Control of Your Business?
              </h2>
              <p class="text-h6 white--text text--lighten-3 mb-10" style="opacity: 0.9;">
                Join the growing community of Kenyan butchers who run smarter shops with MeatPro.
              </p>
              <v-btn 
                x-large 
                color="white" 
                class="red--text rounded-xl px-10 font-weight-bold text-capitalize elevation-4 hover-lift"
                to="/login"
              >
                Create Free Account
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Modern Footer -->
      <v-footer color="grey darken-4" dark class="py-12">
        <v-container>
          <v-row>
            <v-col cols="12" md="4" class="mb-8 mb-md-0">
              <div class="d-flex align-center mb-4">
                <v-avatar color="red" size="32" class="mr-2">
                  <v-icon color="white" size="16">mdi-food-steak</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold">MeatPro</span>
              </div>
              <p class="text-body-2 grey--text text--lighten-1 mb-4" style="max-width: 300px; line-height: 1.7;">
                The modern management platform built specifically for Kenyan butcheries and meat shops.
              </p>
              <div class="d-flex">
                <v-btn icon small color="grey" class="mr-2">
                  <v-icon small>mdi-twitter</v-icon>
                </v-btn>
                <v-btn icon small color="grey" class="mr-2">
                  <v-icon small>mdi-instagram</v-icon>
                </v-btn>
                <v-btn icon small color="grey">
                  <v-icon small>mdi-whatsapp</v-icon>
                </v-btn>
              </div>
            </v-col>
            
            <v-col cols="6" md="2" v-for="(col, i) in footerLinks" :key="i">
              <div class="text-caption font-weight-bold text-uppercase grey--text mb-4 tracking-wide">{{ col.title }}</div>
              <v-list dense dark class="pa-0">
                <v-list-item v-for="link in col.links" :key="link" class="px-0 mb-2">
                  <span class="text-body-2 grey--text text--lighten-1 hover-white cursor-pointer">{{ link }}</span>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          
          <v-divider class="my-8 grey darken-3" />
          
          <div class="d-flex flex-wrap justify-space-between align-center">
            <span class="text-caption grey--text">© 2026 MeatPro. All rights reserved.</span>
            <div class="d-flex">
              <span class="text-caption grey--text mr-4 cursor-pointer">Privacy</span>
              <span class="text-caption grey--text cursor-pointer">Terms</span>
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
  
  data() {
    return {
      scrolled: false,
      demoStep: 1,
      
      navLinks: [
        { label: 'Features', to: null, click: () => this.scrollTo('features') },
        { label: 'Pricing', to: null, click: () => this.scrollTo('pricing') },
        { label: 'Login', to: '/login' }
      ],
      
      avatars: [
        { initials: 'JK', color: 'red' },
        { initials: 'MN', color: 'blue' },
        { initials: 'AO', color: 'green' },
        { initials: 'PW', color: 'orange' }
      ],
      
      stats: [
        { value: 200, suffix: '+', label: 'Active Shops', color: 'red--text' },
        { value: 50, suffix: 'K+', label: 'Entries Logged', color: 'green--text' },
        { value: 30, suffix: '%', label: 'Waste Reduced', color: 'blue--text' },
        { value: 2, suffix: 'M+', label: 'Revenue Tracked', color: 'orange--text' }
      ],
      
      features: [
        {
          title: 'Daily Operations',
          desc: 'Record opening stock, supply, waste, and closing stock in under 60 seconds. Auto-calculates everything.',
          icon: 'mdi-store-check',
          color: 'red',
          bgClass: 'red lighten-5'
        },
        {
          title: 'Live Profit Analytics',
          desc: 'See real-time margins, revenue trends, and profitability insights as you close each day.',
          icon: 'mdi-chart-areaspline',
          color: 'green',
          bgClass: 'green lighten-5'
        },
        {
          title: 'Waste Intelligence',
          desc: 'Get automatic alerts when waste exceeds your target. Protect your margins with data-driven decisions.',
          icon: 'mdi-bell-alert',
          color: 'orange',
          bgClass: 'orange lighten-5'
        },
        {
          title: 'Payment Tracking',
          desc: 'Separate M-Pesa and cash records with automatic reconciliation summaries every evening.',
          icon: 'mdi-wallet',
          color: 'blue',
          bgClass: 'blue lighten-5'
        },
        {
          title: 'Expense Control',
          desc: 'Log salaries, transport, rent, and supplies. Know exactly where every shilling goes.',
          icon: 'mdi-receipt-text',
          color: 'purple',
          bgClass: 'purple lighten-5'
        },
        {
          title: 'Works Everywhere',
          desc: 'Use on your phone, tablet, or laptop. Perfect for shop owners who are always on the move.',
          icon: 'mdi-cellphone-link',
          color: 'teal',
          bgClass: 'teal lighten-5'
        }
      ],
      
      steps: [
        { title: 'Record Morning Stock', desc: 'Enter opening stock and any fresh supply received from the abattoir.' },
        { title: 'Log Sales & Waste', desc: 'Input closing stock and waste. MeatPro instantly calculates kg sold and revenue.' },
        { title: 'Review & Optimize', desc: 'Check profit, margins, and trends. Export clean reports for your accountant.' }
      ],
      
      testimonials: [
        {
          name: 'James Kamau',
          shop: 'Prime Cuts - Nairobi CBD',
          initials: 'JK',
          color: 'red',
          quote: 'I used to guess my profits. Now I know exactly how much I made before I leave the shop. Game changer.'
        },
        {
          name: 'Mary Njeri',
          shop: 'Mama Njeri Meats - Kiambu',
          initials: 'MN',
          color: 'green',
          quote: 'The waste alerts helped me cut spoilage by half in just two weeks. My margins have never been better.'
        },
        {
          name: 'Peter Ochieng',
          shop: 'Lakeview Butchery - Kisumu',
          initials: 'PO',
          color: 'blue',
          quote: 'Finally, a tool that understands how Kenyan butcheries work. Simple, fast, and reliable on my old phone.'
        }
      ],
      
      starterFeatures: [
        '1 shop / branch',
        'Daily closing entries',
        'Basic profit summary',
        '7-day history',
        'Email support'
      ],
      
      proFeatures: [
        'Unlimited branches',
        'Advanced analytics & reports',
        'Waste trend forecasting',
        'Unlimited history + CSV export',
        'Priority WhatsApp support',
        'Multi-user team access',
        'Custom price alerts'
      ],
      
      footerLinks: [
        {
          title: 'Product',
          links: ['Features', 'Pricing', 'Reports', 'Mobile App']
        },
        {
          title: 'Company',
          links: ['About', 'Blog', 'Careers', 'Contact']
        },
        {
          title: 'Support',
          links: ['Help Center', 'WhatsApp', 'Email Us', 'Status']
        }
      ]
    }
  },
  
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 50
    },
    scrollTo(id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    scrollToDemo() {
      this.scrollTo('features')
    }
  }
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

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 50%, #7f0000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navigation */
.modern-nav {
  transition: all 0.3s ease;
}

.nav-scrolled {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #d32f2f;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 60%;
}

/* Hero Section */
.hero-modern {
  position: relative;
  background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
  overflow: hidden;
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
  filter: blur(80px);
  opacity: 0.4;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: #ffcdd2;
  top: -100px;
  right: -100px;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: #e8f5e9;
  bottom: -100px;
  left: -100px;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: #fff3e0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hero-title {
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.125rem;
}

/* Phone Mockup */
.phone-mockup-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

.phone-frame {
  position: relative;
  z-index: 2;
  border: 8px solid #1a1a1a;
  border-radius: 40px !important;
  background: #1a1a1a;
}

.phone-notch {
  width: 280px;
  height: 24px;
  background: #1a1a1a;
  border-radius: 0 0 16px 16px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
}

.glass-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.floating-badge {
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.chart-placeholder {
  background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
  border: 1px solid #eeeeee;
}

.trend-bar {
  width: 12px;
  background: linear-gradient(to top, #d32f2f, #ef5350);
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
}

/* Stats Strip */
.stats-strip {
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}

.stat-item {
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: #e0e0e0;
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
  width: 64px;
  height: 64px;
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

.pricing-card-pro {
  background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%) !important;
  position: relative;
  overflow: hidden;
}

.pricing-card-pro::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
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
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.position-relative {
  position: relative;
  z-index: 1;
}

/* Testimonials */
.testimonial-card {
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08) !important;
}

/* Utilities */
.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(211, 47, 47, 0.3) !important;
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

.rounded-3xl {
  border-radius: 24px !important;
}

.rounded-2xl {
  border-radius: 20px !important;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-modern {
    padding-top: 80px;
  }
  
  .hero-title {
    font-size: 2.5rem !important;
  }
  
  .stat-item:not(:last-child)::after {
    display: none;
  }
  
  .shape {
    opacity: 0.2;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .phone-mockup-wrapper {
    min-height: 500px;
    transform: scale(0.85);
  }
}
</style>