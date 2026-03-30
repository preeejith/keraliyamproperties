<template>
  <div id="app">
    <!-- ====== NAVBAR ====== -->
    <nav class="navbar" :class="{ scrolled: isScrolled }">
      <div class="nav-container">
        <div class="logo" @click="scrollTo('home')">
          <span class="logo-leaf">🌿</span>
          <div class="logo-text">
            <span class="logo-main">Keraliyam</span>
            <span class="logo-sub">Properties</span>
          </div>
        </div>
        <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ active: menuOpen }">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" :class="{ open: menuOpen }">
          <li><a href="#home" @click="scrollTo('home')">Home</a></li>
          <li><a href="#listings" @click="setFilter('land')">Buy Land</a></li>
          <li><a href="#listings" @click="setFilter('buy')">Buy House</a></li>
          <li><a href="#listings" @click="setFilter('rent')">Rent House</a></li>
          <li><a href="#contact" @click="scrollTo('contact')">Contact</a></li>
        </ul>
      </div>
    </nav>

    <!-- ====== HERO ====== -->
    <section id="home" class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="hero-tagline">Kerala's Trusted Property Partner</p>
        <h1 class="hero-heading">Find Your Dream<br><span>Property in Kerala</span></h1>
        <p class="hero-sub">Explore verified land, homes, and rentals across God's Own Country — curated for families, investors, and dreamers.</p>
        <div class="search-bar">
          <div class="search-field">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <input type="text" v-model="searchLocation" placeholder="City, district or area..." />
          </div>
          <div class="search-field">
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <select v-model="searchType">
              <option value="">All Property Types</option>
              <option value="land">Land for Sale</option>
              <option value="buy">House for Sale</option>
              <option value="rent">House for Rent</option>
            </select>
          </div>
          <button class="search-btn" @click="applySearch">Search Properties</button>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat" v-for="s in stats" :key="s.label">
          <strong>{{ s.value }}</strong>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ====== CATEGORIES ====== -->
    <section class="categories">
      <div class="section-header">
        <p class="section-eyebrow">Browse By</p>
        <h2>What Are You Looking For?</h2>
      </div>
      <div class="cat-grid">
        <div class="cat-card" v-for="cat in categories" :key="cat.type" @click="setFilter(cat.type)">
          <img :src="cat.image" class="cat-bg" alt="" />
          <div class="cat-overlay"></div>
          <div class="cat-content">
            <h3>{{ cat.title }}</h3>
            <p>{{ cat.desc }}</p>
            <div class="cat-footer">
              <span class="cat-count">{{ getCount(cat.type) }} listings</span>
              <span class="cat-arrow">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== PROPERTY LISTINGS ====== -->
    <section id="listings" class="listings">
      <div class="section-header">
        <p class="section-eyebrow">Available Now</p>
        <h2>Property Listings</h2>
      </div>
      <div class="filter-tabs">
        <button v-for="f in filters" :key="f.value"
          :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value">
          {{ f.label }}
        </button>
      </div>
      <div class="listings-grid">
        <div class="property-card" v-for="p in filteredProperties" :key="p.id">
          <div class="card-image">
            <img :src="p.image" :alt="p.title" loading="lazy" />
            <span class="card-badge" :class="p.type">{{ badgeLabel(p.type) }}</span>
            <div class="card-overlay">
              <button class="view-btn" @click="openModal(p)">View Details</button>
            </div>
          </div>
          <div class="card-body">
            <div class="card-location">
              <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              {{ p.location }}
            </div>
            <h3 class="card-title">{{ p.title }}</h3>
            <div class="card-meta">
              <span v-if="p.area">📐 {{ p.area }}</span>
              <span v-if="p.beds">🛏 {{ p.beds }} Beds</span>
              <span v-if="p.baths">🚿 {{ p.baths }} Baths</span>
            </div>
            <div class="card-footer">
              <span class="card-price">{{ p.price }}</span>
              <button class="card-btn" @click="openModal(p)">View Details</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredProperties.length === 0" class="no-results">
        <p>🔍 No properties found. Try a different filter.</p>
      </div>
    </section>

    <!-- ====== FEATURED ====== -->
    <section class="featured">
      <div class="featured-bg"></div>
      <div class="section-header">
        <p class="section-eyebrow">Hand-Picked</p>
        <h2>Featured Properties</h2>
        <p class="section-desc">Premium listings selected for their location, value, and quality.</p>
      </div>
      <div class="featured-grid">
        <div class="featured-card" v-for="p in featuredProperties" :key="'f'+p.id">
          <div class="featured-img">
            <img :src="p.image" :alt="p.title" />
            <div class="featured-ribbon">⭐ Featured</div>
          </div>
          <div class="featured-info">
            <span class="featured-type">{{ badgeLabel(p.type) }}</span>
            <h3>{{ p.title }}</h3>
            <p class="featured-loc">📍 {{ p.location }}</p>
            <p class="featured-price">{{ p.price }}</p>
            <button class="featured-btn" @click="openModal(p)">Enquire Now</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== WHY CHOOSE US ====== -->
    <section class="why">
      <div class="section-header">
        <p class="section-eyebrow">Our Promise</p>
        <h2>Why Choose Keraliyam?</h2>
      </div>
      <div class="why-grid">
        <div class="why-card" v-for="w in whyUs" :key="w.title">
          <div class="why-icon">{{ w.icon }}</div>
          <h3>{{ w.title }}</h3>
          <p>{{ w.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ====== CONTACT ====== -->
    <section id="contact" class="contact">
      <div class="contact-inner">
        <div class="contact-info">
          <p class="section-eyebrow contact-eyebrow">Get In Touch</p>
          <h2 class="contact-heading">Talk to Our Property Experts</h2>
          <p class="contact-desc">Whether you're buying, selling, or renting — our team is here to guide you every step of the way.</p>
          <div class="contact-details">
            <div class="contact-item">
              <div class="contact-icon">📞</div>
              <div class="contact-text">
                <span class="contact-label">Call Us</span>
                <strong>+91 96339 22011</strong>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📧</div>
              <div class="contact-text">
                <span class="contact-label">Email Us</span>
                <strong>keraliyamproperties@gmail.com</strong>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📍</div>
              <div class="contact-text">
                <span class="contact-label">Visit Us</span>
                <strong>Kochi, Kerala, India</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="contact-form-wrapper">
          <form class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label>Your Name</label>
              <input type="text" v-model="form.name" placeholder="Rajan Menon" required />
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" v-model="form.email" placeholder="rajan@example.com" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" v-model="form.phone" placeholder="+91..." required />
            </div>
            <div class="form-group">
              <label>Interested In</label>
              <select v-model="form.interest">
                <option value="">Select property type</option>
                <option>Land for Sale</option>
                <option>House for Sale</option>
                <option>House for Rent</option>
              </select>
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea v-model="form.message" placeholder="Tell us what you're looking for..." rows="4"></textarea>
            </div>
            <button type="submit" class="form-btn">Send Enquiry</button>
            <p v-if="formSuccess" class="form-success">✅ Thank you! We'll contact you shortly.</p>
          </form>
        </div>
      </div>
    </section>

    <!-- ====== FOOTER ====== -->
    <footer class="footer">
      <div class="footer-cta-container">
        <div class="footer-cta">
          <div class="cta-content">
            <h2>Ready to Find Your Dream Property?</h2>
            <p>Join over 1200+ happy families who found their perfect home in Kerala with us.</p>
          </div>
          <button class="cta-btn" @click="scrollTo('contact')">Get in Touch Now</button>
        </div>
      </div>
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="logo">
            <img src="/logo.png" alt="Keraliyam Properties" class="logo-img logo-img--footer" />
          </div>
          <p>Your trusted real estate partner in God's Own Country. Verified listings, expert guidance, and heartfelt service.</p>
          <div class="social-icons">
            <a href="#" title="Facebook">
              <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="#" title="Instagram">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" title="WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            </a>
            <a href="#" title="YouTube">
              <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#listings">Buy Land</a></li>
            <li><a href="#listings">Buy House</a></li>
            <li><a href="#listings">Rent House</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Locations</h4>
          <ul>
            <li><a href="#">Kochi</a></li>
            <li><a href="#">Thiruvananthapuram</a></li>
            <li><a href="#">Kozhikode</a></li>
            <li><a href="#">Thrissur</a></li>
            <li><a href="#">Palakkad</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 Keraliyam Properties. All rights reserved. Made with ♥ in Kerala.</p>
      </div>
    </footer>

    <!-- ====== MODAL ====== -->
    <transition name="fade">
      <div class="modal-overlay" v-if="selectedProperty" @click.self="selectedProperty = null">
        <div class="modal">
          <button class="modal-close" @click="selectedProperty = null">✕</button>
          <img :src="selectedProperty.image" :alt="selectedProperty.title" class="modal-img" />
          <div class="modal-body">
            <span class="card-badge" :class="selectedProperty.type">{{ badgeLabel(selectedProperty.type) }}</span>
            <h2>{{ selectedProperty.title }}</h2>
            <p class="modal-loc">📍 {{ selectedProperty.location }}</p>
            <div class="modal-meta">
              <div v-if="selectedProperty.area"><strong>Area</strong><span>{{ selectedProperty.area }}</span></div>
              <div v-if="selectedProperty.beds"><strong>Bedrooms</strong><span>{{ selectedProperty.beds }}</span></div>
              <div v-if="selectedProperty.baths"><strong>Bathrooms</strong><span>{{ selectedProperty.baths }}</span></div>
              <div><strong>Price</strong><span class="modal-price">{{ selectedProperty.price }}</span></div>
            </div>
            <p class="modal-desc">{{ selectedProperty.description }}</p>
            <button class="form-btn" @click="prepEnquiry(selectedProperty)">Enquire About This Property</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { supabase } from './supabase'
import emailjs from '@emailjs/browser'

export default {
  name: 'KeraliyamProperties',
  data() {
    return {
      isScrolled: false,
      menuOpen: false,
      activeFilter: 'all',
      searchLocation: '',
      searchType: '',
      selectedProperty: null,
      formSuccess: false,
      loadingProperties: true,
      form: { name: '', email: '', phone: '', interest: '', message: '' },

      stats: [
        { value: '850+', label: 'Properties Listed' },
        { value: '12+', label: 'Districts Covered' },
        { value: '1200+', label: 'Happy Families' },
        { value: '8 Yrs', label: 'Of Trusted Service' },
      ],

      filters: [
        { label: 'All Properties', value: 'all' },
        { label: 'Buy Land', value: 'land' },
        { label: 'Buy House', value: 'buy' },
        { label: 'Rent House', value: 'rent' },
      ],

      categories: [
        { type: 'land', title: 'Land for Sale', desc: 'Agricultural, residential, and commercial plots across Kerala.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800' },
        { type: 'buy', title: 'House for Sale', desc: 'Traditional Nalukettu homes, modern villas, and cozy cottages.', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800' },
        { type: 'rent', title: 'House for Rent', desc: 'Furnished and unfurnished homes for every budget and lifestyle.', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800' },
      ],

      whyUs: [
        { icon: '🛡️', title: 'Verified Listings', desc: 'Every property is manually verified by our team for legal clarity and accuracy.' },
        { icon: '💰', title: 'Affordable Deals', desc: 'We negotiate the best prices so you always get maximum value for your money.' },
        { icon: '🤝', title: 'Trusted by Thousands', desc: 'Over 1200 families have found their dream homes through Keraliyam Properties.' },
        { icon: '📞', title: '24/7 Support', desc: 'Our dedicated support team is always available to answer your queries.' },
      ],

      properties: [],
    };
  },

  computed: {
    visibleProperties() {
      return this.properties.filter(p => !p.is_hidden);
    },
    filteredProperties() {
      return this.visibleProperties.filter(p => {
        const matchFilter = this.activeFilter === 'all' || p.type === this.activeFilter;
        const matchLocation = !this.searchLocation || p.location.toLowerCase().includes(this.searchLocation.toLowerCase());
        const matchType = !this.searchType || p.type === this.searchType;
        return matchFilter && matchLocation && matchType;
      });
    },
    featuredProperties() {
      return this.visibleProperties.filter(p => p.featured);
    },
  },

  methods: {
    async fetchProperties() {
      try {
        this.loadingProperties = true;
        const { data, error } = await supabase
          .from('properties')
          .select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          this.properties = data;
        }
      } catch (err) {
        console.error('Error fetching properties from Supabase:', err.message);
      } finally {
        this.loadingProperties = false;
      }
    },
    setFilter(type) {
      this.activeFilter = type;
      this.scrollTo('listings');
      this.menuOpen = false;
    },
    applySearch() {
      if (this.searchType) this.activeFilter = this.searchType;
      this.scrollTo('listings');
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      this.menuOpen = false;
    },
    badgeLabel(type) {
      return { land: 'Land for Sale', buy: 'For Sale', rent: 'For Rent' }[type] || type;
    },
    getCount(type) {
      return this.visibleProperties.filter(p => p.type === type).length;
    },
    openModal(p) {
      this.selectedProperty = p;
    },
    prepEnquiry(property) {
      if (property) {
        this.form.interest = this.badgeLabel(property.type);
        this.form.message = `Hi, I am interested in the property: "${property.title}" (ID: ${property.id}). Please send me more details.`;
      }
      this.selectedProperty = null;
      this.scrollTo('contact');
    },
    async submitForm() {
      try {
        const templateParams = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          interest: this.form.interest,
          message: this.form.message,
        };
        // 1. Sends the email via EmailJS parameters
        await emailjs.send(
          'service_vyivztb', 
          'template_9mqfwyn', 
          templateParams, 
          'xK6okF69CoaBGnoAi'
        );

        // 2. Saves directly into your Supabase Database
        const { error: dbError } = await supabase
          .from('enquiries')
          .insert([{
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            interest: this.form.interest,
            message: this.form.message
          }]);
          
        if (dbError) {
          console.error('Supabase save error:', dbError.message);
        }
        
        this.formSuccess = true;
        this.form = { name: '', email: '', phone: '', interest: '', message: '' };
        setTimeout(() => this.formSuccess = false, 5000);
      } catch (error) {
        console.error('FAILED...', error);
        alert(`EmailJS Error: ${error?.text || error?.message || 'Check EmailJS Dashboard Settings'}`);
      }
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 60;
    },
  },

  async mounted() {
    window.addEventListener('scroll', this.handleScroll);
    await this.fetchProperties();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green: #3a7d44;
  --green-light: #5aa05f;
  --green-pale: #e8f5e9;
  --earth: #8b6914;
  --earth-light: #c9a227;
  --cream: #faf8f3;
  --white: #ffffff;
  --dark: #1a2310;
  --mid: #4a5240;
  --light: #8a9080;
  --border: #dde8d5;
  --shadow: 0 4px 24px rgba(58,125,68,0.10);
  --shadow-lg: 0 16px 48px rgba(26,35,16,0.15);
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'DM Sans', sans-serif;
  --radius: 14px;
  --trans: 0.3s cubic-bezier(0.4,0,0.2,1);
}

#app {
  font-family: var(--font-body);
  color: var(--dark);
  background: var(--cream);
  scroll-behavior: smooth;
}

/* ===== NAVBAR ===== */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 18px 0;
  background: transparent;
  transition: var(--trans);
}
.navbar.scrolled {
  background: rgba(255,255,255,0.96);
  box-shadow: 0 2px 20px rgba(58,125,68,0.12);
  padding: 12px 0;
  backdrop-filter: blur(12px);
}
.nav-container {
  max-width: 1200px; margin: 0 auto; padding: 0 32px;
  display: flex; align-items: center; justify-content: space-between;
}
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; }
.logo-leaf { font-size: 28px; }
.logo-text { display: flex; flex-direction: column; line-height: 1.1; }
.logo-main {
  font-family: var(--font-display); font-size: 22px; font-weight: 700;
  color: #ffffff !important; letter-spacing: 0.01em;
  text-shadow: 0 1px 6px rgba(0,0,0,0.5);
}
.navbar.scrolled .logo-main { color: var(--dark) !important; text-shadow: none; }
.logo-sub {
  font-size: 10px; font-weight: 500; letter-spacing: 0.15em;
  text-transform: uppercase; color: rgba(255,255,255,0.7);
}
.navbar.scrolled .logo-sub { color: var(--light); }

.nav-links {
  list-style: none; display: flex; gap: 8px; align-items: center;
}
.nav-links a {
  font-size: 14px; font-weight: 500; text-decoration: none;
  color: rgba(255,255,255,0.9); padding: 8px 14px; border-radius: 8px;
  transition: var(--trans); cursor: pointer;
}
.navbar.scrolled .nav-links a { color: var(--mid); }
.nav-links a:hover {
  background: rgba(255,255,255,0.15); color: var(--white);
}
.navbar.scrolled .nav-links a:hover {
  background: var(--green-pale); color: var(--green);
}

.hamburger {
  display: none; flex-direction: column; gap: 5px; background: none;
  border: none; cursor: pointer; padding: 4px;
}
.hamburger span {
  display: block; width: 24px; height: 2px; background: white;
  border-radius: 2px; transition: var(--trans);
}
.navbar.scrolled .hamburger span { background: var(--dark); }

/* ===== HERO ===== */
.hero {
  min-height: 100vh;
  background: url('/kerala_hero.png') center/cover no-repeat;
  position: relative; display: flex; flex-direction: column;
  justify-content: center; align-items: center; text-align: center;
  padding: 120px 24px 80px;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, rgba(26,35,16,0.75) 0%, rgba(40,80,30,0.55) 60%, rgba(0,0,0,0.4) 100%);
}
.hero-content { position: relative; max-width: 800px; }
.hero-tagline {
  display: inline-block; padding: 6px 16px; border-radius: 50px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.9); font-size: 13px; letter-spacing: 0.12em;
  text-transform: uppercase; margin-bottom: 20px;
  backdrop-filter: blur(8px);
}
.hero-heading {
  font-family: var(--font-display); font-size: clamp(38px, 6vw, 72px);
  font-weight: 700; color: #ffffff !important; line-height: 1.1;
  margin-bottom: 18px; letter-spacing: -0.01em;
  text-shadow: 0 2px 12px rgba(0,0,0,0.6);
}
.hero-heading span { color: #a8d5a2; }
.hero-sub { font-size: 17px; color: rgba(255,255,255,0.8); max-width: 540px; margin: 0 auto 36px; line-height: 1.7; }

.search-bar {
  display: flex; gap: 0; background: white; border-radius: 12px;
  overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  max-width: 700px; margin: 0 auto;
}
.search-field {
  display: flex; align-items: center; gap: 10px;
  padding: 0 18px; flex: 1; border-right: 1px solid var(--border);
}
.search-field svg {
  width: 18px; height: 18px; fill: var(--green); flex-shrink: 0;
}
.search-field input, .search-field select {
  border: none; outline: none; font-family: var(--font-body);
  font-size: 14px; color: var(--dark); background: transparent;
  width: 100%; padding: 16px 0; cursor: pointer;
}
.search-btn {
  background: var(--green); color: black; border: none;
  padding: 16px 28px; font-size: 14px; font-weight: 600;
  font-family: var(--font-body); cursor: pointer; letter-spacing: 0.03em;
  transition: var(--trans); white-space: nowrap;
}
.search-btn:hover { background: var(--green-light); }

.hero-stats {
  position: relative; display: flex; gap: 0;
  background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 12px;
  margin-top: 60px; overflow: hidden;
}
.stat {
  flex: 1; padding: 20px 24px; text-align: center;
  border-right: 1px solid rgba(255,255,255,0.15);
}
.stat:last-child { border-right: none; }
.stat strong {
  display: block; font-family: var(--font-display); font-size: 28px;
  color: white; font-weight: 700;
}
.stat span { font-size: 12px; color: rgba(255,255,255,0.7); letter-spacing: 0.05em; }

/* ===== SECTIONS ===== */
.section-header { text-align: center; margin-bottom: 48px; }
.section-eyebrow {
  font-size: 12px; font-weight: 600; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--green); margin-bottom: 8px;
}
.section-header h2 {
  font-family: var(--font-display); font-size: clamp(28px, 4vw, 46px);
  font-weight: 700; color: var(--dark); letter-spacing: -0.01em;
}
.section-desc { color: var(--light); font-size: 16px; margin-top: 12px; }
.section-header.light .section-eyebrow { color: #a8d5a2; }
.section-header.light h2 { color: white; }
.section-header.light .section-desc { color: rgba(255,255,255,0.65); }

/* ===== CATEGORIES ===== */
.categories { padding: 80px 32px; max-width: 1200px; margin: 0 auto; }
.cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.cat-card {
  position: relative; border-radius: 16px; overflow: hidden;
  height: 380px; cursor: pointer; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.08); display: flex; align-items: flex-end;
}
.cat-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
.cat-bg {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.cat-card:hover .cat-bg { transform: scale(1.08); }
.cat-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(26,35,16,0.95) 0%, rgba(26,35,16,0.3) 60%, rgba(0,0,0,0) 100%);
  transition: background 0.4s;
}
.cat-card:hover .cat-overlay { background: linear-gradient(to top, rgba(26,35,16,0.98) 0%, rgba(26,35,16,0.5) 65%, rgba(0,0,0,0.1) 100%); }
.cat-content {
  position: relative; z-index: 2; padding: 32px 28px; width: 100%; color: white;
}
.cat-content h3 {
  font-family: var(--font-display); font-size: 28px; font-weight: 700;
  margin-bottom: 8px; color: white; line-height: 1.2;
}
.cat-content p {
  font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.5; margin-bottom: 24px;
}
.cat-footer {
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px;
}
.cat-count {
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 50px; backdrop-filter: blur(4px);
}
.cat-arrow { font-size: 20px; transition: transform 0.3s; }
.cat-card:hover .cat-arrow { transform: translateX(5px); }

/* ===== LISTINGS ===== */
.listings { padding: 80px 32px; max-width: 1200px; margin: 0 auto; }
.filter-tabs {
  display: flex; gap: 8px; margin-bottom: 40px; flex-wrap: wrap;
}
.filter-tabs button {
  padding: 9px 20px; border-radius: 50px; border: 1.5px solid var(--border);
  background: white; color: var(--mid); font-family: var(--font-body);
  font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.filter-tabs button:hover {
  border-color: black; color: black;
}
.filter-tabs button.active {
  background: black; color: white; border-color: black;
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

.listings-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
}
.property-card {
  background: white; border-radius: var(--radius); overflow: hidden;
  border: 1.5px solid var(--border); transition: var(--trans);
}
.property-card:hover {
  transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: transparent;
}
.card-image { position: relative; overflow: hidden; height: 210px; }
.card-image img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s ease; }
.property-card:hover .card-image img { transform: scale(1.06); }
.card-badge {
  position: absolute; top: 12px; left: 12px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 50px; color: white;
}
.card-badge.land { background: var(--green); }
.card-badge.buy { background: #2e7d6e; }
.card-badge.rent { background: var(--earth); }
.card-overlay {
  position: absolute; inset: 0;
  background: rgba(26,35,16,0.5);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: var(--trans);
}
.property-card:hover .card-overlay { opacity: 1; }
.view-btn {
  background: white; color: var(--dark); border: none; padding: 10px 22px;
  border-radius: 8px; font-family: var(--font-body); font-weight: 600; font-size: 13px;
  cursor: pointer; transform: translateY(8px); transition: var(--trans);
}
.property-card:hover .view-btn { transform: translateY(0); }

.card-body { padding: 18px 20px; }
.card-location {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: var(--light); margin-bottom: 6px;
}
.card-location svg { width: 13px; height: 13px; fill: var(--green); }
.card-title {
  font-family: var(--font-display); font-size: 18px; font-weight: 700;
  color: var(--dark); margin-bottom: 10px; line-height: 1.3;
}
.card-meta {
  display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px;
}
.card-meta span { font-size: 12px; color: var(--mid); background: var(--cream); padding: 3px 8px; border-radius: 6px; }
.card-footer { display: flex; justify-content: space-between; align-items: center; }
.card-price {
  font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--green);
}
.card-btn {
  background: var(--green-pale); color: var(--green); border: none;
  padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600;
  font-family: var(--font-body); cursor: pointer; transition: var(--trans);
}
.card-btn:hover { background: var(--green); color: white; }
.no-results { text-align: center; padding: 60px; color: var(--light); font-size: 16px; }

/* ===== FEATURED ===== */
.featured { position: relative; padding: 100px 32px; overflow: hidden; border-top: 1px solid rgba(0,0,0,0.06); border-bottom: 1px solid rgba(0,0,0,0.06); }
.featured-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #f5f0e6 0%, #e8e3d5 100%);
}
.featured .section-header { position: relative; z-index: 2; }
.featured-grid {
  position: relative; max-width: 1200px; margin: 0 auto; z-index: 2;
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px;
}
.featured-card {
  background: white; border: 1px solid rgba(0,0,0,0.05);
  border-radius: var(--radius); overflow: hidden; display: flex;
  box-shadow: 0 15px 35px rgba(0,0,0,0.04); transition: var(--trans);
}
.featured-card:first-child { grid-column: 1 / -1; flex-direction: row; }
.featured-card:hover { transform: translateY(-6px); box-shadow: 0 25px 50px rgba(0,0,0,0.08); border-color: var(--border); }
.featured-img { position: relative; overflow: hidden; flex-shrink: 0; width: 280px; }
.featured-card:first-child .featured-img { width: 45%; }
.featured-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.7s cubic-bezier(0.4,0,0.2,1); }
.featured-card:hover .featured-img img { transform: scale(1.05); }
.featured-ribbon {
  position: absolute; top: 16px; left: 16px;
  background: var(--earth-light); color: white; font-size: 11px;
  font-weight: 700; padding: 6px 14px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.05em;
  box-shadow: 0 4px 10px rgba(201,162,39,0.3);
}
.featured-info { padding: 32px; flex: 1; display: flex; flex-direction: column; gap: 10px; background: white; }
.featured-type {
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--green); margin-bottom: 2px;
}
.featured-info h3 {
  font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--dark);
  line-height: 1.3; margin: 0;
}
.featured-loc { font-size: 14px; color: var(--mid); margin-bottom: 8px; }
.featured-price {
  font-family: var(--font-display); font-size: 26px; font-weight: 700;
  color: var(--green); margin-top: auto; padding-top: 16px;
}
.featured-btn {
  background: white; color: var(--dark); border: 1.5px solid var(--border);
  padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 700;
  font-family: var(--font-body); cursor: pointer; transition: all 0.3s ease; width: fit-content;
  margin-top: 16px;
}
.featured-btn:hover { background: var(--green); border-color: var(--green); color: white; transform: translateY(-2px); box-shadow: 0 8px 16px rgba(58,125,68,0.2); }

/* ===== WHY ===== */
.why { padding: 90px 32px; max-width: 1200px; margin: 0 auto; }
.why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.why-card {
  background: white; border-radius: var(--radius); padding: 32px 24px;
  border: 1.5px solid var(--border); text-align: center; transition: var(--trans);
}
.why-card:hover { border-color: var(--green); transform: translateY(-4px); box-shadow: var(--shadow); }
.why-icon { font-size: 38px; margin-bottom: 16px; }
.why-card h3 {
  font-family: var(--font-display); font-size: 18px; font-weight: 700;
  color: var(--dark); margin-bottom: 8px;
}
.why-card p { color: var(--light); font-size: 14px; line-height: 1.6; }

/* ===== CONTACT ===== */
.contact { padding: 120px 32px; background: linear-gradient(135deg, #1b4021 0%, #3a7d44 100%); position: relative; overflow: hidden; }
.contact::before {
  content: ''; position: absolute; top: -50%; right: -20%; width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%); opacity: 1; border-radius: 50%; pointer-events: none;
}
.contact-inner {
  max-width: 1100px; margin: 0 auto; display: grid;
  grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 2;
}
.contact-eyebrow { color: rgba(255,255,255,0.9) !important; letter-spacing: 0.2em; font-size: 13px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
.contact-heading {
  font-family: 'Cormorant Garamond', serif; font-size: 46px; font-weight: 700;
  color: white !important; margin: 0 0 20px; line-height: 1.1;
}
.contact-desc { color: rgba(255,255,255,0.8); font-size: 17px; line-height: 1.7; margin-bottom: 48px; max-width: 480px; }
.contact-details { display: flex; flex-direction: column; gap: 20px; }
.contact-item {
  display: flex; align-items: center; gap: 20px; max-width: 400px;
  padding: 16px 24px; border-radius: 12px; background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08); transition: transform 0.3s, background 0.3s;
}
.contact-item:hover { transform: translateX(8px); background: rgba(255,255,255,0.08); }
.contact-icon {
  width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
.contact-text { display: flex; flex-direction: column; gap: 4px; }
.contact-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); }
.contact-text strong { font-size: 16px; color: white; font-weight: 500; letter-spacing: 0.02em; }

.contact-form-wrapper { position: relative; }
.contact-form {
  background: white; border-radius: 24px; padding: 48px 40px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.4); position: relative; z-index: 2;
}
.form-group { margin-bottom: 20px; }
.form-group label {
  display: block; font-size: 13px; font-weight: 600;
  color: var(--mid); margin-bottom: 7px; letter-spacing: 0.03em;
}
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 12px 14px; border: 1.5px solid var(--border);
  border-radius: 8px; font-family: var(--font-body); font-size: 14px;
  color: var(--dark); background: var(--cream); outline: none;
  transition: var(--trans); resize: vertical;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--green); background: white;
}
.form-btn {
  width: 100%; background: white; color: black; border: 2px solid black;
  padding: 14px; border-radius: 10px; font-family: var(--font-body);
  font-size: 15px; font-weight: 800; cursor: pointer; transition: var(--trans);
  letter-spacing: 0.05em; text-transform: uppercase;
}
.form-btn:hover { background: black; color: white; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.form-success { text-align: center; color: var(--green); font-weight: 600; margin-top: 14px; font-size: 14px; }

/* ===== FOOTER ===== */
.footer { background: #1a2310; color: white; margin-top: 100px; position: relative; }
.footer-cta-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; transform: translateY(-50%); position: relative; z-index: 10; }
.footer-cta {
  background: #3a7d44; border-radius: 20px; padding: 48px 56px;
  display: flex; align-items: center; justify-content: space-between; gap: 32px;
  box-shadow: 0 20px 48px rgba(26,35,16,0.3); background-image: radial-gradient(circle at top right, #5aa05f 0%, transparent 60%);
}
.cta-content h2 { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 700; color: white; margin-bottom: 12px; line-height: 1.2; text-shadow: 0 2px 4px rgba(0,0,0,0.15); }
.cta-content p { color: rgba(255,255,255,0.9); font-size: 16px; margin: 0; line-height: 1.6; }
.cta-btn {
  background: white; color: #3a7d44; border: none; padding: 18px 36px;
  border-radius: 12px; font-weight: 700; font-size: 16px; cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s; white-space: nowrap; font-family: 'DM Sans', sans-serif;
}
.cta-btn:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.2); }

.footer-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 32px 64px; margin-top: -30px;
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.footer-brand .logo-img--footer { height: 44px; filter: brightness(0) invert(1); margin-bottom: 20px; }
.footer-brand > p {
  color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.7;
  margin: 0 0 28px; padding-right: 40px;
}
.social-icons { display: flex; gap: 12px; }
.social-icons a {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;
}
.social-icons a:hover { background: #3a7d44; border-color: #3a7d44; transform: translateY(-4px); }
.social-icons svg {
  width: 18px; height: 18px; fill: none; stroke: white; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.3s;
}
.footer-links h4 {
  font-size: 15px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: white; margin-bottom: 24px;
}
.footer-links ul { list-style: none; display: flex; flex-direction: column; gap: 14px; }
.footer-links a {
  font-size: 15px; color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.3s;
}
.footer-links a:hover { color: white; padding-left: 6px; }
.footer-bottom {
  max-width: 1200px; margin: 0 auto; padding: 24px 32px;
  text-align: left; color: rgba(255,255,255,0.4); font-size: 14px;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(26,35,16,0.7); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal {
  background: white; border-radius: 16px; overflow: hidden;
  max-width: 580px; width: 100%; max-height: 90vh; overflow-y: auto;
  box-shadow: 0 40px 80px rgba(0,0,0,0.4); position: relative;
}
.modal-close {
  position: absolute; top: 14px; right: 14px; z-index: 10;
  background: rgba(0,0,0,0.4); border: none; color: white;
  width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
  font-size: 14px; transition: var(--trans);
}
.modal-close:hover { background: rgba(0,0,0,0.7); }
.modal-img { width: 100%; height: 260px; object-fit: cover; }
.modal-body { padding: 24px; }
.modal-body h2 {
  font-family: var(--font-display); font-size: 26px; font-weight: 700;
  color: var(--dark); margin: 10px 0 6px;
}
.modal-loc { color: var(--light); font-size: 14px; margin-bottom: 18px; }
.modal-meta {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px;
}
.modal-meta div {
  background: var(--cream); border-radius: 8px; padding: 10px 14px;
}
.modal-meta strong { display: block; font-size: 11px; color: var(--light); margin-bottom: 3px; }
.modal-meta span { font-size: 14px; color: var(--dark); font-weight: 500; }
.modal-price { color: var(--green) !important; font-family: var(--font-display); font-size: 20px !important; font-weight: 700 !important; }
.modal-desc { color: var(--mid); font-size: 14px; line-height: 1.7; margin-bottom: 20px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .hamburger { display: flex; }
  .nav-links {
    display: none; position: absolute; top: 100%; left: 0; right: 0;
    background: white; flex-direction: column; padding: 12px;
    box-shadow: var(--shadow-lg); gap: 2px; border-top: 1px solid var(--border);
  }
  .nav-links.open { display: flex; }
  .nav-links a { color: var(--mid) !important; }
  .cat-grid, .why-grid { grid-template-columns: 1fr 1fr; }
  .listings-grid { grid-template-columns: 1fr 1fr; }
  .featured-grid { grid-template-columns: 1fr; }
  .featured-card:first-child { flex-direction: column; }
  .featured-card:first-child .featured-img { width: 100%; height: 200px; }
  .featured-img { width: 100%; height: 180px; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .footer-cta { flex-direction: column; text-align: center; padding: 40px 32px; gap: 24px; }
  .contact-inner { grid-template-columns: 1fr; gap: 48px; }
  .contact-item { max-width: 100%; }
  .contact-form { padding: 32px 24px; }
  .hero-stats { flex-wrap: wrap; }
  .stat { min-width: 50%; }
  .search-bar { flex-direction: column; border-radius: 12px; }
  .search-field { border-right: none; border-bottom: 1px solid var(--border); }
  .search-field:last-of-type { border-bottom: none; }
}

@media (max-width: 600px) {
  .cat-grid, .why-grid, .listings-grid { grid-template-columns: 1fr; }
  .footer-inner { grid-template-columns: 1fr; gap: 28px; }
  .modal-meta { grid-template-columns: 1fr; }
  .nav-container { padding: 0 20px; }
  .categories, .listings, .why { padding: 60px 20px; }
  .featured { padding: 60px 20px; }
  .contact { padding: 60px 20px; }
  .footer { padding: 48px 20px 0; }
}
</style>
