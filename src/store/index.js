//import Vue from 'vue'
import Vuex from 'vuex'
import options from '@/store/modules/options'
import userData from '@/store/modules/userData'
import exams from '@/store/modules/exams'
import subjects from '@/store/modules/data'
import saves from '@/store/modules/saves'

//Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    options,
    userData,
    exams,
    subjects,
    saves
  }
})