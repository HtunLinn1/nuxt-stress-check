<template>
  <v-container class="pt-10 text-center">
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
            max-height="300"
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
              {{ Number(result.totalB) >= 77 || (Number(result.totalB) >= 63 && Number(result.totalAC) >= 76) ? '高ストレス' : '異常なし' }} <v-spacer /> {{ result.created_at.toDate() | datetime }}
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, query, where, orderBy, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../plugins/firebase'
import categories from '@/pages/json/categories.json'
import questions from '@/pages/json/questions.json'
const resultsCollectionRef = collection(db, 'Results')
const resultQuery = query(resultsCollectionRef, orderBy('created_at', 'desc'))
const questionsCollectionRef = collection(db, 'Questions')

export default {
  name: 'IndexPage',
  middleware: 'authenticated',
  data () {
    return {
      results: '',
      successMsg: this.$route.params.success,
      jsonCategories: categories,
      jsonQuestions: questions
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
    this.checkFirebaseQus()
    this.onAuthStateChanged()
    this.getResults()
  },
  methods: {
    checkFirebaseQus () {
      onSnapshot(questionsCollectionRef, (querySnapshot) => {
        const questions = querySnapshot.docs.map(doc =>
          ({ ...doc.data(), id: doc.id })
        )
        if (questions.length === 0) {
          this.setFirebaseDatas()
        }
      })
    },
    setFirebaseDatas () {
      let aCount = 0
      let bCount = 0
      let cCount = 0
      let dCount = 0
      this.jsonQuestions.forEach((qus) => {
        if (qus.id.startsWith('A')) {
          aCount = aCount + 1
          const questionsJsonCollectionRef = doc(db, 'Questions', 'A' + aCount)
          this.addFirebaseCollection({
            ansPoint: qus.answerPoint,
            ansText: this.jsonCategories[0].answerText,
            qus_content: qus.text
          }, questionsJsonCollectionRef)
        } else if (qus.id.startsWith('B')) {
          bCount = bCount + 1
          const questionsJsonCollectionRef = doc(db, 'Questions', 'B' + bCount)
          this.addFirebaseCollection({
            ansPoint: qus.answerPoint,
            ansText: this.jsonCategories[1].answerText,
            qus_content: qus.text
          }, questionsJsonCollectionRef)
        } else if (qus.id.startsWith('C')) {
          cCount = cCount + 1
          const questionsJsonCollectionRef = doc(db, 'Questions', 'C' + cCount)
          this.addFirebaseCollection({
            ansPoint: qus.answerPoint,
            ansText: this.jsonCategories[2].answerText,
            qus_content: qus.text
          }, questionsJsonCollectionRef)
        } else if (qus.id.startsWith('D')) {
          dCount = dCount + 1
          const questionsJsonCollectionRef = doc(db, 'Questions', 'D' + dCount)
          this.addFirebaseCollection({
            ansPoint: qus.answerPoint,
            ansText: this.jsonCategories[3].answerText,
            qus_content: qus.text
          }, questionsJsonCollectionRef)
        }
      })
    },
    addFirebaseCollection (dataObj, questionsJsonCollectionRef) {
      // save json datas
      setDoc(questionsJsonCollectionRef, dataObj)
    },
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
      }, 1500)
    }
  }
}
</script>
