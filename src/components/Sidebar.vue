<template>
  <div class="main-content">
    <div class="columns">
      <div class="column is-2" style="padding:0px;">
        <aside class="menu">
          <div class="profile-info">
            <!-- Información del Perfil de Usuario -->
            <div class="profile">
              <figure class="profile-circle">
                <img
                  :src="profile"
                  @error="replaceByDefault"
                  class="profile-pic"
                />
              </figure>
            </div>
            <!-- texto -->
            <div class="has-text-centered">
              <h1 class="has-text-weight-bold">{{ name }}</h1>
              <!-- <h2 class="has-text-info is-capitalized">{{ rol }}</h2> -->
            </div>
          </div>
          <!-- Opciones del menú -->
          <ul class="menu-list">
            <li>
              <!-- @click="goMenu('Form')" -->
              <a
                
                :class="$route.name == 'Post' ? 'active' : ''"
                style="padding: 0.75em;"
              >
                <b-icon
                  pack="fas"
                  icon="align-left"
                  class="iconos"
                  size="is-small"
                >
                </b-icon>
                Formulario
              </a>
            </li>
            <li>
              <a
                @click="goMenu('Persons')"
                :class="$route.name == 'Persons' ? 'active' : ''"
                style="padding: 0.75em;"
              >
                <b-icon
                  pack="fas"
                  icon="chalkboard-teacher"
                  class="iconos"
                  size="is-small"
                >
                </b-icon>
                Usuarios
              </a>
            </li>

            <li>
              <a
                @click="goMenu('Admins')"
                :class="$route.name == 'Admins' ? 'active' : ''"
                style="padding: 0.75em;"
              >
                <b-icon pack="fas" icon="users" class="iconos" size="is-small">
                </b-icon>
                Administradores
              </a>
            </li>

            <li>
              <a @click="logout()" style="padding: 0.75em;">
                <b-icon
                  pack="fas"
                  icon="sign-out-alt"
                  class="iconos"
                  size="is-small"
                >
                </b-icon>
                Cerrar sesión
              </a>
            </li>
          </ul>
          <!-- Imagen parte inferior -->
          <div class="columns is-centered">
            <div class="imagen-footer">
              <figure>
                <img src="img/logo.png" class="logo" />
              </figure>
            </div>
          </div>
        </aside>
      </div>
      <div
        class="column is-10"
        :style="
          `height: ${window.height}px; background-color: #f5f5f5; padding:0px;`
        "
      >
        <router-view />
      </div>
    </div>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      window: {
        width: 0,
        height: 0,
      },
      name: '',
      rol: '',
      menuActive: '',
      isRole: false,
      profile: '',
      isLoading: false,
      isFullPage: true,
      imgDefault: 'img/user.svg',
      urlprod: process.env.VUE_APP_API_URL,
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.initData()
  },
  mounted() {
    // this.menuActive = this.$cookie.get('menuActive')
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    vistaUsuarios() {
      this.$router.push({ name: 'users' })
    },
    logout() {
      this.isLoading = true
      this.$cookie.delete('name')
      this.$cookie.delete('token')
      this.$cookie.delete('rol')
      // this.$cookie.delete('email')
      this.$cookie.delete('userId')
      // this.$cookie.delete('lastname')
      setTimeout(() => {
        this.isLoading = false
        this.$router.push({ path: '/login' })
      }, 1000)
    },
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    },
    initData() {
      this.name = this.$cookie.get('name')
      this.rol = this.$cookie.get('rol')
    },
    goMenu(name) {
      this.$router.push({ name })
      // this.menuActive = name
      // this.$cookie.set('menuActive', name)
    },
    replaceByDefault(e) {
      e.target.src = this.imgDefault
    },
  },
}
</script>

<style scoped>
.main-content {
  font-family: 'Poppins', sans-serif;
}

.profile-info {
  margin-top: 2em;
  margin-bottom: 3em;
}

.profile {
  padding-top: 40px;
  display: flex;
  justify-content: center;
}

.profile-circle {
  height: 6em;
  width: 6em;
  overflow: hidden;
  border-style: solid;
  border-color: #eeeeee;
  border-radius: 50%;
  border-width: 3px;
}

.profile-pic {
  width: 100%;
}

.iconos {
  padding-left: 15px;
  padding-right: 15px;
}

.imagen-footer {
  bottom: 0.5em;
  justify-content: center;
  position: fixed;
  flex-direction: column;
  display: flex;
}

.logo {
  width: 8em;
}

a {
  height: 3em;
  margin-left: 10px;
}

.active {
  border-radius: 0.7em;
  background-color: #687fe5;
  color: white;
}

@media (max-width: 500px) and (max-height: 900px) {
  .imagen-footer {
    visibility: hidden;
  }
}
</style>
