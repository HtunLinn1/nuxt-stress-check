<template>
  <v-container>
    <p>確認してください</p>
    <v-card
      class="overflow-y-auto mx-auto pl-2 pr-2"
      max-height="300"
      max-width="400"
    >
      <div v-for="(ans, index) in answers" :key="ans.qusId">
        <nuxt-link to="" @click.native="clickQusId(index)">
          {{ ans.qusId }} .&nbsp;
        </nuxt-link>
        {{ ans.ansValue === ''? 0 : ans.ansValue }} 点 <span v-if="ans.checked" class="star">*</span>
      </div>
    </v-card>
    <div class="pt-2">
      Total AC: {{ totalA + totalC }}点
    </div>
    <div> Total B: {{ totalB }}点</div>
    <div> Total D: {{ totalD }}点</div>
    <p class="pt-3">
      合計 => {{ totalResult }}点
    </p>
  </v-container>
</template>

<script>
export default {
  name: 'CompleteFormPage',
  data () {
    return {
      answers: '',
      questions: '',
      totalResult: '',
      totalB: '',
      totalA: '',
      totalC: '',
      totalD: ''
    }
  },
  mounted () {
    // this.onSnapShotQuestions()
    this.getAnswers()
  },
  methods: {
    getAnswers () {
      this.answers = this.$store.getters['answer/Answers']
      const AArray = this.answers.filter(ans => ans.qusId.startsWith('A'))
      const CArray = this.answers.filter(ans => ans.qusId.startsWith('C'))
      const BArray = this.answers.filter(ans => ans.qusId.startsWith('B'))
      const DArray = this.answers.filter(ans => ans.qusId.startsWith('D'))
      this.totalA = AArray.reduce((a, b) => a + Number(b.ansValue), 0)
      this.totalC = CArray.reduce((a, b) => a + Number(b.ansValue), 0)
      this.totalB = BArray.reduce((a, b) => a + Number(b.ansValue), 0)
      this.totalD = DArray.reduce((a, b) => a + Number(b.ansValue), 0)

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
