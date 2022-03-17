<template>
  <v-container class="pt-15 text-center">
    <div class="pt-10">
      <v-row>
        <v-col>
          <h2 v-if="$store.getters.isAuthenticated">
            {{ user.displayName }}さん<br>
          </h2>
          ストレスチェック
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn to="/stress_check" color="primary" large nuxt>
            ストレスチェックを開始
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../plugins/firebase'
export default {
  name: 'IndexPage',
  middleware: 'authenticated',
  data () {
    return {
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.onAuthStateChanged()
  },
  methods: {
    onAuthStateChanged () {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.$store.dispatch('setUser', {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email
          })
        }
      })
    }
  }
}
</script>
