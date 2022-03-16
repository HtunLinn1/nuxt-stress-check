<template>
  <v-app-bar
    app
    color="#95A5A6"
    flat
  >
    <div class="pl-3">
      <nuxt-link to="/">
        <h3 class="text">
          Stress Check
        </h3>
      </nuxt-link>
    </div>
    <v-spacer />
    <v-responsive max-width="100">
      <v-btn
        v-if="$store.getters.isAuthenticated"
        rounded
        depressed
        @click="logout"
      >
        Logout
      </v-btn>
      <v-btn
        v-if="!$store.getters.isAuthenticated"
        rounded
        depressed
        @click="login"
      >
        Login
      </v-btn>
    </v-responsive>
  </v-app-bar>
</template>

<script>
import { signOut } from 'firebase/auth'
import { auth } from '../plugins/firebase'

export default {
  data () {
    return {
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    logout () {
      signOut(auth).then(() => {
        this.$store.dispatch('setUser', null)
      })
    },
    login () {
      this.$router.push('/login')
    }
  }
}
</script>

<style>
a.nuxt-link-exact-active {
    font-weight: bold;
}

a,
a:visited {
  text-decoration: none;
  color: inherit;
}
.text {
  color: white;
}
</style>
