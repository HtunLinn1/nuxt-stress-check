<template>
  <v-container class="pt-15 text-center">
    <div class="pt-10">
      <v-alert
        v-if="successMsg"
        border="top"
        type="success"
        dark
      >
        {{ successMsg }}
      </v-alert>
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
      <v-row v-if="results.length !== 0">
        <v-col>
          <v-card
            class="overflow-y-auto mx-auto"
            max-height="200"
            max-width="400"
          >
            <v-banner
              class="justify-center text-h5 font-weight-light white--text"
              sticky
              color="black"
            >
              受けた結果
            </v-banner>

            <v-list-item v-for="result in results" :key="result.id">
              {{ result.totalB >= 77 || (result.totalB >= 63 && result.totalAC >= 76) ? '高ストレス' : '異常なし' }} <v-spacer /> {{ result.created_at.toDate() | datetime }}
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { auth, db } from '../plugins/firebase'
const resultsCollectionRef = collection(db, 'Results')
const resultQuery = query(resultsCollectionRef, orderBy('created_at', 'desc'))

export default {
  name: 'IndexPage',
  middleware: 'authenticated',
  data () {
    return {
      results: '',
      successMsg: this.$route.params.success
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  created () {
    setTimeout(() => {
      this.successMsg = false
    }, 2000)
  },
  mounted () {
    this.onAuthStateChanged()
    this.getResults()
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
    },
    getResults () {
      setTimeout(() => {
        const q = query(resultQuery, where('email', '==', this.user.email))
        onSnapshot(q, (querySnapshot) => {
          this.results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        })
      }, 1000)
    }
  }
}
</script>
