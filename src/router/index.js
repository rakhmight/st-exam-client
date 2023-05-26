//import Vue from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import InitializationView from '@/views/InitializationView'
import AuthView from '@/views/AuthView'
import CoordinatorView from '@/views/CoordinatorView'
import ExaminationView from '@/views/ExaminationView'

const routes = [
  {
    path: '/',
    name: 'init',
    component: InitializationView
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView
  },
  {
    path: '/coordinator',
    name: 'coordinator',
    component: CoordinatorView
  },
  {
    path: '/exam',
    name: 'exam',
    component: ExaminationView
  }
]


const router = createRouter({
    history: createWebHashHistory(),
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes
})

export default router