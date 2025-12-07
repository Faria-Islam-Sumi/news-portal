
<template>
  <div>
    <h1>Create News</h1>
    <form @submit.prevent="createNews">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" v-model="title" required />
      </div>
      <div class="mb-3">
        <label for="body" class="form-label">Body</label>
        <textarea class="form-control" id="body" v-model="body" rows="5" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Create</button>
    </form>
  </div>
</template>

<script>
import { apiFetch, getCurrentUser } from '../app.js';

export default {
  data() {
    return {
      title: '',
      body: '',
      user: null
    };
  },
  created() {
    this.user = getCurrentUser();
  },
  methods: {
    async createNews() {
      if (this.body.length < 20) {
        alert('News body must be at least 20 characters.');
        return;
      }

      await apiFetch('/news', {
        method: 'POST',
        body: JSON.stringify({
          title: this.title,
          body: this.body,
          author_id: this.user.id,
          createdAt: new Date().toISOString(),
          comments: []
        })
      });
      this.$router.push('/');
    }
  }
};
</script>
