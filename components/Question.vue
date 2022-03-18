<template>
  <div>
    <v-card
      color="transparent"
      height="250"
      class="pt-5 pl-2 pr-2"
    >
      <v-row
        class="fill-height"
        align="center"
        justify="center"
      >
        <v-card-text class="text-center text-h6">
          {{ qus.id }} . {{ qus.qus_content }}
        </v-card-text>
        <v-radio-group
          v-for="(ans, i) in qus.ansText"
          :key="ans"
          v-model="radioBtnValue"
          row
        >
          <v-radio
            :label="ans"
            :value="qus.ansPoint[i]"
          />
        </v-radio-group>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'QuestionPage',
  props: {
    qus: {
      type: Object, default: null
    }
  },
  data () {
    return {
      radioBtnValue: '',
      qusId: this.qus.id
    }
  },
  updated () {
    this.$emit('radioBtnValue', { radioBtnValue: this.radioBtnValue, qusId: this.qusId })
    this.setAnswer()
  },
  mounted () {
    this.getAnswer()
  },
  methods: {
    setAnswer () {
      this.$store.dispatch('answer/setAnswer', {
        ansValue: this.radioBtnValue,
        qusId: this.qusId
      })
    },
    getAnswer () {
      const answers = this.$store.getters['answer/Answers']
      const index = answers.findIndex(ans => ans.qusId === this.qusId)
      if (index !== -1) {
        this.radioBtnValue = answers[index].ansValue
      }
    }
  }
}
</script>

<style>
  .fill-height {
    height: 50%;
  }
</style>
