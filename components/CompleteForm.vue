<template>
  <v-container>
    <p>確認してください</p>
    <v-card
      class="overflow-y-auto mx-auto pl-2 pr-2"
      max-height="300"
      max-width="400"
    >
      <div v-for="(qus, index) in questions" :key="qus.id">
        <nuxt-link to="" @click.native="clickQusId(index)">
          {{ qus.id }} .&nbsp;
        </nuxt-link>
        <span v-for="ans in answers" :key="ans.qusId">
          <span v-if="qus.id === ans.qusId">
            {{ ans.ansValue === ''? 0 : ans.ansValue }} 点 <span v-if="ans.checked" class="star">*</span>
          </span>
        </span>
      </div>
    </v-card>
    <p class="pt-3">
      合計 => {{ totalResult }}点
    </p>
  </v-container>
</template>

<script>
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../plugins/firebase'
const questionsCollectionRef = collection(db, 'Questions')
export default {
  name: 'CompleteFormPage',
  data () {
    return {
      answers: '',
      questions: '',
      totalResult: ''
    }
  },
  mounted () {
    this.onSnapShotQuestions()
    this.getAnswers()
  },
  methods: {
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
      })
    },
    getAnswers () {
      this.answers = this.$store.getters['answer/Answers']
      this.totalResult = this.answers.reduce((a, b) => a + Number(b.ansValue), 0)
    },
    clickQusId (onboarding) {
      this.$nuxt.$emit('SET_ONBOARDING', onboarding)
    }
  }
}
</script>

<style>
  .star {
    color: red;
  }
</style>
