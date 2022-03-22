<template>
  <div>
    <v-card
      color="transparent"
      min-height="100"
      class="pt-1 pl-2 pr-2"
    >
      <v-checkbox
        v-model="checkbox"
      />
      <v-row
        class="fill-height"
        align="center"
        justify="center"
      >
        <v-card-text class="text-center font-weight-medium body-1 question">
          {{ qus.id }} . {{ qus.qus_content }}
        </v-card-text>
        <v-radio-group
          v-model="radioBtnValue"
        >
          <v-row
            v-for="(ans, i) in qus.ansText"
            :key="ans"
          >
            <v-col cols="12">
              <v-radio
                :label="ans"
                :value="qus.ansPoint[i]"
              />
            </v-col>
          </v-row>
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
    },
    onboarding: {
      type: Number, default: null
    }
  },
  data () {
    return {
      radioBtnValue: '',
      qusId: this.qus.id,
      checkbox: false
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
        qusId: this.qusId,
        onboarding: this.onboarding,
        checked: this.checkbox
      })
    },
    getAnswer () {
      const answers = this.$store.getters['answer/Answers']
      const index = answers.findIndex(ans => ans.qusId === this.qusId)
      if (index !== -1) {
        this.radioBtnValue = answers[index].ansValue
        this.checkbox = answers[index].checked
      }
    }
  }
}
</script>

<style>
  .fill-height {
    height: 50%;
  }
  .question {
    min-height: 140px;
  }
</style>
