<template>
  <v-container class="pt-5 text-center">
    <div class="pt-5">
      <p v-if="onboarding < 3" class="pt-5 text-h6">
        A.あなたの仕事についてうかがいます。最もあてはまるものに○を付けてください。
      </p>
      <p v-if="onboarding > 2" class="pt-5 text-h6">
        B.最近1 か月間のあなたの状態についてうかがいます。最もあてはまるものに○を付けてください。
      </p>
      <div class="text-right">
        {{ onboarding + 1 }} / {{ questions.length }}
      </div>
      <v-window v-model="onboarding" class="slide-window">
        <v-window-item
          v-for="(qus, index) in questions"
          :key="`card-${index}`"
        >
          <Question :qus="qus" @radioBtnValue="getRadioBtnValue($event)" />
        </v-window-item>
      </v-window>
      <v-card-actions class="justify-space-between">
        <v-btn
          btn
          @click="prev"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          v-if="!saveBtn"
          btn
          @click="next"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn
          v-if="saveBtn"
          btn
          color="primary"
          @click="save"
        >
          完了
        </v-btn>
      </v-card-actions>
    </div>
  </v-container>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, addDoc } from 'firebase/firestore'
import { db, auth } from '../plugins/firebase'
const questionsCollectionRef = collection(db, 'Questions')
const resultsCollectionRef = collection(db, 'Results')
export default {
  name: 'StressCheckPage',
  data () {
    return {
      questions: '',
      radioButton: '',
      length: 3,
      onboarding: 0,
      radioBtnValue: '',
      selectedQus: [],
      saveBtn: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.onSnapShotQuestions()
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
    },
    onSnapShotQuestions () {
      onSnapshot(questionsCollectionRef, (querySnapshot) => {
        this.questions = querySnapshot.docs.map(doc =>
          ({ ...doc.data(), id: doc.id })
        )
      })
    },
    getRadioBtnValue (value) {
      this.radioBtnValue = value
    },
    next () {
      this.saveArray()
      this.onboarding = this.onboarding + 1 === this.questions.length
        ? 0
        : this.onboarding + 1
      this.changeBtn()
    },
    prev () {
      this.onboarding = this.onboarding - 1 < 0
        ? 0
        : this.onboarding - 1
      this.changeBtn()
    },
    changeBtn () {
      this.onboarding + 1 === this.questions.length
        ? this.saveBtn = true
        : this.saveBtn = false
    },
    save () {
      this.saveArray()
      console.log(this.selectedQus)
      const sum = this.selectedQus.reduce((a, b) => a + b.ansValue, 0)
      // save result
      addDoc(resultsCollectionRef, {
        user: this.user.displayName,
        email: this.user.email,
        result: sum,
        created_at: new Date()
      }).then(() => {
        this.$router.push({ name: 'index', params: { success: '完了しました' } })
        this.selectedQus = []
      })
    },
    saveArray () {
      const question = {
        qusId: this.questions[this.onboarding].id,
        ansValue: this.radioBtnValue === '' ? 0 : this.radioBtnValue
      }
      const sameQus = this.selectedQus.filter(qus => qus.qusId.includes(question.qusId))
      if (sameQus.length === 0) {
        this.selectedQus.push(question)
      } else {
        const index = this.selectedQus.findIndex(qus => qus.qusId === question.qusId)
        this.selectedQus[index].ansValue = question.ansValue
      }
    }
  }
}
</script>

<style>
  .slide-window {
    background-color: #F0F8FF;
  }
</style>
