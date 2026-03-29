<template>
  <div class="admin-dashboard">
    <nav class="admin-nav">
      <div class="nav-brand">Keraliyam Admin</div>
      <div class="nav-links">
        <button :class="{ active: tab === 'enquiries' }" @click="tab = 'enquiries'">📫 Enquiries</button>
        <button :class="{ active: tab === 'properties' }" @click="tab = 'properties'">🏡 Properties</button>
      </div>
      <button class="logout-btn" @click="logout">Logout</button>
    </nav>

    <main class="admin-content">
      <!-- ENQUIRIES TAB -->
      <section v-if="tab === 'enquiries'">
        <div class="header-row">
          <h2>Recent Enquiries</h2>
          <button @click="fetchEnquiries" class="refresh-btn">Refresh</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Interest</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="enq in enquiries" :key="enq.id">
                <td>{{ new Date(enq.created_at).toLocaleDateString() }}</td>
                <td>{{ enq.name }}</td>
                <td>{{ enq.phone }}</td>
                <td>{{ enq.email || '-' }}</td>
                <td>{{ enq.interest || '-' }}</td>
                <td class="msg-col" :title="enq.message">{{ enq.message }}</td>
              </tr>
              <tr v-if="!enquiries.length">
                <td colspan="6" class="text-center">No enquiries yet! Waiting for leads...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- PROPERTIES TAB -->
      <section v-if="tab === 'properties'">
        <div class="header-row">
          <h2>Manage Properties</h2>
          <button @click="openAddModal" class="add-btn">+ Add Property</button>
        </div>
        
        <div class="property-grid">
          <div v-for="p in properties" :key="p.id" class="prop-card">
            <img :src="p.image" class="prop-img" alt="Property Image" />
            <div class="prop-details">
              <h4>{{ p.title }}</h4>
              <p>{{ p.price }} • {{ p.type }}</p>
              <div class="card-actions">
                <button @click="openEditModal(p)" class="edit-btn">Edit</button>
                <button @click="deleteProperty(p.id)" class="del-btn">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- PROPERTY MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ isEditing ? 'Edit Property' : 'Add New Property' }}</h3>
        <form @submit.prevent="saveProperty">
          <div class="form-row">
            <div class="form-group">
              <label>Title</label>
              <input v-model="form.title" required placeholder="Luxury 3BHK Villa" />
            </div>
            <div class="form-group">
              <label>Type</label>
              <select v-model="form.type" required>
                <option value="buy">Buy House</option>
                <option value="rent">Rent House</option>
                <option value="land">Buy Land</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Price String (e.g., ₹45 Lakhs)</label>
              <input v-model="form.price" required />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input v-model="form.location" required placeholder="Edappally, Kochi" />
            </div>
          </div>

          <div class="form-row" v-if="form.type !== 'land'">
            <div class="form-group">
              <label>Bedrooms</label>
              <input type="number" v-model="form.beds" />
            </div>
            <div class="form-group">
              <label>Bathrooms</label>
              <input type="number" v-model="form.baths" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Area (e.g., 1200 sqft or 10 Cents)</label>
              <input v-model="form.area" />
            </div>
            <div class="form-group">
              <label>Featured Property</label>
              <select v-model="form.featured">
                <option :value="true">Yes (Top Ribbon)</option>
                <option :value="false">No</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Property Image (Will auto-compress)</label>
            <input type="file" accept="image/*" @change="handleFileUpload" />
            <p class="img-hint" v-if="form.image && !imageFile">Currently holds an image. Uploading a new one overrides it.</p>
            <p v-if="uploadTask" class="upload-status">⏳ {{ uploadTask }}</p>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn" :disabled="isUploading">Save Property</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { supabase } from './supabase'
import imageCompression from 'browser-image-compression'

export default {
  data() {
    return {
      tab: 'enquiries',
      enquiries: [],
      properties: [],
      showModal: false,
      isEditing: false,
      isUploading: false,
      uploadTask: '',
      imageFile: null,
      form: { id: null, title: '', type: 'buy', price: '', location: '', beds: '', baths: '', area: '', description: '', featured: false, image: '' }
    }
  },
  async mounted() {
    await this.fetchEnquiries();
    await this.fetchProperties();
  },
  methods: {
    async logout() {
      await supabase.auth.signOut();
      this.$router.push('/login');
    },
    async fetchEnquiries() {
      const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (data) this.enquiries = data;
    },
    async fetchProperties() {
      const { data } = await supabase.from('properties').select('*').order('id', { ascending: false });
      if (data) this.properties = data;
    },
    openAddModal() {
      this.isEditing = false;
      this.form = { id: null, title: '', type: 'buy', price: '', location: '', beds: '', baths: '', area: '', description: '', featured: false, image: '' };
      this.imageFile = null;
      this.uploadTask = '';
      this.showModal = true;
    },
    openEditModal(p) {
      this.isEditing = true;
      this.form = { ...p };
      this.imageFile = null;
      this.uploadTask = '';
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.imageFile = file;
    },
    async uploadImageToSupabase() {
      if (!this.imageFile) return this.form.image;
      
      this.isUploading = true;
      this.uploadTask = 'Compressing photo for faster loading...';
      
      try {
        const options = { maxSizeMB: 0.15, maxWidthOrHeight: 1280, useWebWorker: true };
        const compressedFile = await imageCompression(this.imageFile, options);
        
        this.uploadTask = 'Uploading to Cloud Bucket...';
        const fileName = `property_${Date.now()}_${compressedFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const { error } = await supabase.storage.from('images').upload(fileName, compressedFile);
        
        if (error) throw error;
        
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
        this.uploadTask = 'Upload Complete!';
        return urlData.publicUrl;
      } catch (err) {
        console.error("Upload error:", err);
        alert("Failed to upload image. Make sure your 'images' bucket is public and exists.");
        this.uploadTask = 'Upload Failed!';
        return this.form.image;
      } finally {
        this.isUploading = false;
      }
    },
    async saveProperty() {
      if (this.imageFile) {
        this.form.image = await this.uploadImageToSupabase();
      }
      
      const payload = { ...this.form };
      if (payload.type === 'land') {
        payload.beds = null;
        payload.baths = null;
      }

      if (this.isEditing) {
        const { error } = await supabase.from('properties').update(payload).eq('id', payload.id);
        if (error) alert(error.message);
      } else {
        delete payload.id;
        const { error } = await supabase.from('properties').insert([payload]);
        if (error) alert(error.message);
      }
      
      await this.fetchProperties();
      this.closeModal();
    },
    async deleteProperty(id) {
      if (confirm('Are you certain you want to permanently delete this property?')) {
        await supabase.from('properties').delete().eq('id', id);
        await this.fetchProperties();
      }
    }
  }
}
</script>

<style scoped>
.admin-dashboard { background: #faf8f3; min-height: 100vh; font-family: 'DM Sans', sans-serif; }
.admin-nav { display: flex; align-items: center; justify-content: space-between; background: #1a2310; padding: 0 40px; height: 70px; color: white; }
.nav-brand { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: #f7a02d; }
.nav-links button { background: none; border: none; color: #a1ae97; font-size: 16px; margin: 0 15px; cursor: pointer; height: 70px; border-bottom: 3px solid transparent; transition: 0.2s; }
.nav-links button:hover { color: white; }
.nav-links button.active { color: white; border-bottom-color: #f7a02d; font-weight: 600; }
.logout-btn { background: #ff4757; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }

.admin-content { padding: 40px; max-width: 1200px; margin: 0 auto; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.header-row h2 { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: #1a2310; margin: 0; }
.refresh-btn, .add-btn { background: #3a7d44; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.3s; }
.add-btn:hover { background: #2a5a31; }

.table-container { background: white; border-radius: 12px; overflow-x: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
table { width: 100%; border-collapse: collapse; text-align: left; }
th, td { padding: 16px 20px; border-bottom: 1px solid #eee; font-size: 15px; color: #333; }
th { background: #f0f4ec; color: #2a5a31; font-weight: 600; }
.msg-col { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
.text-center { text-align: center; color: #888; padding: 30px !important; }

.property-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.prop-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s; }
.prop-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
.prop-img { width: 100%; height: 180px; object-fit: cover; }
.prop-details { padding: 20px; }
.prop-details h4 { margin: 0 0 8px 0; font-size: 18px; color: #1a2310; }
.prop-details p { margin: 0; color: #666; font-size: 14px; margin-bottom: 16px; }
.card-actions { display: flex; gap: 10px; }
.edit-btn { flex: 1; background: white; color: #3a7d44; border: 1px solid #3a7d44; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.del-btn { flex: 1; background: white; color: #d32f2f; border: 1px solid #d32f2f; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.edit-btn:hover { background: #f0f4ec; }
.del-btn:hover { background: #fff0f0; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: white; padding: 32px; border-radius: 12px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
.modal h3 { margin-top: 0; margin-bottom: 24px; color: #1a2310; font-family: 'Cormorant Garamond', serif; font-size: 28px; }
.form-row { display: flex; gap: 16px; margin-bottom: 16px; }
.form-group { flex: 1; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.form-group label { font-weight: bold; font-size: 14px; color: #444; }
input, select, textarea { padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-family: inherit; font-size: 15px; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #3a7d44; box-shadow: 0 0 0 2px rgba(58,125,68,0.2); }
.img-hint { font-size: 12px; color: #888; margin-top: -5px; }
.upload-status { color: #f7a02d; font-weight: 600; margin-top: 8px; font-size: 14px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.cancel-btn { padding: 12px 24px; background: #eee; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
.cancel-btn:hover { background: #ddd; }
.save-btn { padding: 12px 24px; background: #3a7d44; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
.save-btn:hover:not(:disabled) { background: #2a5a31; }
.save-btn:disabled { opacity: 0.5; background: #999; cursor: not-allowed; }
</style>
