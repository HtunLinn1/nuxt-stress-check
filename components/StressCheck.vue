<template>
  <v-container class="text-center">
    <div>
      <v-card
        v-if="onboarding + 1 <= questions.length - 1"
        class="mx-auto pt-2"
        min-height="110px"
        outlined
        color="#DFF2F3"
      >
        <p v-if="onboarding < 17" class="">
          A.あなたの仕事についてうかがいます。最もあてはまるものに○を付けてください。
        </p>
        <p v-if="onboarding > 16 && onboarding < 46" class="">
          B.最近1 か月間のあなたの状態についてうかがいます。最もあてはまるものに○を付けてください。
        </p>
        <p v-if="onboarding > 45 && onboarding < 55" class="">
          C.あなたの周りの方々についてうかがいます。最もあてはまるものに○を付けてください。<br>
          次の人たちはどのくらい気軽に話ができますか?
        </p>
        <p v-if="onboarding > 54" class="">
          D.満足度について
        </p>
      </v-card>
      <div v-if="onboarding + 1 <= questions.length - 1" class="text-right">
        {{ onboarding + 1 }} / {{ questions.length - 1 }}
      </div>
      <v-window v-model="onboarding" class="slide-window">
        <v-window-item
          v-for="(qus, index) in questions"
          :key="`card-${index}`"
        >
          <Question v-if="onboarding + 1 <= questions.length - 1" :qus="qus" :onboarding="onboarding" @radioBtnValue="getRadioBtnValue($event)" />
          <CompleteForm v-else />
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
          送信
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
      onboarding: 0,
      selectedQus: [],
      saveBtn: false,
      totalB: 0,
      totalAC: 0,
      qusObj: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    answers () {
      return this.$store.getters['answer/Answers']
    }
  },
  created () {
    this.$nuxt.$on('SET_ONBOARDING', (data) => {
      this.onboarding = data
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('SET_ONBOARDING')
  },
  updated () {
    this.changeBtn()
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
        let AArray = []
        let BArray = []
        let CArray = []
        let DArray = []
        this.questions.forEach((qus) => {
          if (qus.id.startsWith('A')) {
            AArray.push(qus)
          } else if (qus.id.startsWith('B')) {
            BArray.push(qus)
          } else if (qus.id.startsWith('C')) {
            CArray.push(qus)
          } else if (qus.id.startsWith('D')) {
            DArray.push(qus)
          }
        })
        AArray = AArray.sort((a, b) => Number(a.id.split('').splice(1, 3).join('')) > Number(b.id.split('').splice(1, 3).join('')) ? 1 : -1)
        BArray = BArray.sort((a, b) => Number(a.id.split('').splice(1, 3).join('')) > Number(b.id.split('').splice(1, 3).join('')) ? 1 : -1)
        CArray = CArray.sort((a, b) => Number(a.id.split('').splice(1, 3).join('')) > Number(b.id.split('').splice(1, 3).join('')) ? 1 : -1)
        DArray = DArray.sort((a, b) => Number(a.id.split('').splice(1, 3).join('')) > Number(b.id.split('').splice(1, 3).join('')) ? 1 : -1)
        this.questions = []
        this.questions = AArray.concat(BArray, CArray, DArray)
        this.questions.push({ ansPoint: [], ansText: [], qus_content: '' })
      })
    },
    getRadioBtnValue (qusObj) {
      // this.saveArray(qusObj)
      this.qusObj = qusObj
    },
    next () {
      const selectedQus = this.$store.getters['answer/Answers']
      if (this.qusObj === '' || this.qusObj.radioBtnValue === '') {
        const index = selectedQus.findIndex(qus => qus.onboarding === this.onboarding && qus.ansValue !== '')
        if (index === -1) {
          alert('答えを選んでください')
        } else {
          this.onboarding = this.onboarding + 1 === this.questions.length
            ? 0
            : this.onboarding + 1
          this.changeBtn()
          this.qusObj = ''
        }
      } else {
        this.onboarding = this.onboarding + 1 === this.questions.length
          ? 0
          : this.onboarding + 1
        this.changeBtn()
        this.qusObj = ''
      }
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
      this.selectedQus = this.$store.getters['answer/Answers']
      console.log(this.selectedQus)
      for (const qus in this.selectedQus) {
        if (this.selectedQus[qus].qusId.startsWith('B')) {
          this.totalB += Number(this.selectedQus[qus].ansValue)
        } else if (this.selectedQus[qus].qusId.startsWith('A') || this.selectedQus[qus].qusId.startsWith('C')) {
          this.totalAC += Number(this.selectedQus[qus].ansValue)
        }
      }
      const sum = this.selectedQus.reduce((a, b) => a + Number(b.ansValue), 0)
      // save result
      addDoc(resultsCollectionRef, {
        user: this.user.displayName,
        email: this.user.email,
        result: sum,
        totalB: this.totalB,
        totalAC: this.totalAC,
        created_at: new Date()
      }).then(() => {
        this.$router.push({ name: 'index', params: { success: '完了しました' } })
        this.selectedQus = []
        this.$store.dispatch('answer/setAnswer', {
          ansValue: null,
          qusId: null
        })
      })
    },
    saveArray (qusObj) {
      const question = {
        qusId: qusObj.qusId,
        ansValue: qusObj.radioBtnValue === '' ? 0 : qusObj.radioBtnValue
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
