<template>
  <div>
    <v-card
      color="transparent"
      height="200"
    >
      <v-row
        class="fill-height pt-5"
        align="center"
        justify="center"
      >
        <v-card-text class="text-center text-h6">
          {{ qus.qus_content }}
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
      radioBtnValue: ''
    }
  },
  updated () {
    this.$emit('radioBtnValue', this.radioBtnValue)
  }
}
</script>

<style>
  .fill-height {
    height: 50%;
  }
</style>
