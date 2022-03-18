<template>
  <v-container>
    <v-card
      class="overflow-y-auto mx-auto pt-5 pl-2 pr-2"
      max-height="300"
      max-width="400"
    >
      確認してください
      <div v-for="(qus, index) in questions" :key="qus.id">
        <nuxt-link to="" @click.native="clickQusId(index)">
          {{ qus.id }} .&nbsp;
        </nuxt-link>
        <span v-for="ans in answers" :key="ans.qusId">
          <span v-if="qus.id === ans.qusId">
            {{ ans.ansValue === ''? 0 : ans.ansValue }} points <span v-if="ans.checked" class="star">*</span>
          </span>
        </span>
      </div>
    </v-card>
    <p class="pt-3">Total Result => {{ totalResult }}</p>
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
