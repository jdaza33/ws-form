import Vue from 'vue'
import VueRouter from 'vue-router'

//Views
import Login from '../views/Login.vue'
import ResetPassword from '../views/ResetPassword.vue'
import Users from '../views/Users.vue'
import Persons from '../views/Persons.vue'
import Forms from '../views/Forms.vue'

//Components
import Dashboard from '../components/Sidebar.vue'

//Utils
import auth from '../utils/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login',
  },
  // {
  //   path: '/panel',
  //   name: 'Home',
  //   redirect: '/panel/login',
  // },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/reset-password',
    name: 'Reset Password',
    component: ResetPassword,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiredAuth: true,
    },
    children: [
      {
        path: '/admins',
        name: 'Admins',
        component: Users,
        meta: {
          requiredAuth: true,
        },
      },
      {
        path: '/persons',
        name: 'Persons',
        component: Persons,
        meta: {
          requiredAuth: true,
        },
      },
      {
        path: '/forms',
        name: 'Forms',
        component: Forms,
        meta: {
          requiredAuth: true,
        },
      },
    ],
  },
]

let router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiredAuth) {
    if (auth.validateToke()) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
