export const state = () => ({
  answers: []
})

export const getters = {
  Answers (state) {
    return state.answers
  }
}

export const mutations = {
  setAnswer (state, answer) {
    if (answer.qusId !== null) {
      const index = state.answers.findIndex(ans => ans.qusId === answer.qusId)
      if (index === -1) {
        state.answers.push(answer)
      } else {
        state.answers[index].ansValue = answer.ansValue
      }
    } else {
      state.answers = []
    }
  }
}

export const actions = {
  setAnswer ({ commit }, answer) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('setAnswer', answer)
        resolve()
      }, 100)
    })
  }
}
