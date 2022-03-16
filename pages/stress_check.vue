<template>
  <v-container class="pt-15">
    <p v-if="carouselIndex < 3" class="pt-5">
      A.あなたの仕事についてうかがいます。最もあてはまるものに○を付けてください。
    </p>
    <p v-if="carouselIndex > 2" class="pt-5">
      B.最近1 か月間のあなたの状態についてうかがいます。最もあてはまるものに○を付けてください。
    </p>
    <div class="text-right">
      {{ carouselIndex + 1 }} / {{ questions.length }}
    </div>
    <v-carousel v-model="carouselIndex">
      <v-carousel-item
        v-for="(qus, i) in questions"
        :key="i"
      >
        <v-sheet
          height="100%"
          tile
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <div class="text-h5">
              {{ qus.qus_content }}
              <v-radio-group
                v-for="(ans, index) in qus.ansText"
                :key="index"
                v-model="radioButton"
                row
              >
                <v-radio
                  :label="ans"
                  :value="index + 1"
                />
              </v-radio-group>
            </div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../plugins/firebase'
const questionsCollectionRef = collection(db, 'Questions')
export default {
  name: 'StressCheckPage',
  data () {
    return {
      questions: '',
      carouselIndex: '',
      radioButton: ''
    }
  },
  mounted () {
    this.onSnapShotBlogs()
  },
  methods: {
    onSnapShotBlogs () {
      onSnapshot(questionsCollectionRef, (querySnapshot) => {
        this.questions = querySnapshot.docs.map(doc =>
          ({ ...doc.data(), id: doc.id })
        )
        console.log(this.questions)
      })
    }
  }
}
</script>

<style lang>
</style>
