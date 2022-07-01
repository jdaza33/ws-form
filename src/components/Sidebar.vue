<template>
  <div class="main-content">
    <div class="columns">
      <div class="column is-2" style="padding: 0px">
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
              <!-- <h3 class="">{{ name }}</h3> -->
              <!-- <h2 class="has-text-info is-capitalized">{{ rol }}</h2> -->
            </div>

            <hr />

            <div class="has-text-centered">
              <h1 class="has-text-weight-bold">Grupo:</h1>
            </div>
            <div class="center">
              <b-field grouped>
                <b-select
                  placeholder="Selecciona un grupo"
                  v-model="group"
                  size="is-small"
                  @input="changeGroup"
                >
                  <option
                    v-for="group in groups"
                    :value="group._id"
                    :key="group._id"
                  >
                    {{ group.name }}
                  </option>
                </b-select>
                <p class="control">
                  <b-button
                    @click="createGroup"
                    class="button is-primary"
                    icon-left="plus"
                    icon-pack="fas"
                    type="is-success"
                    size="is-small"
                  ></b-button>
                  <b-button
                    @click="linkForm"
                    class="button is-info"
                    icon-left="link"
                    icon-pack="fas"
                    type="is-info"
                    size="is-small"
                  ></b-button>
                </p>
              </b-field>
              <!-- <b-select placeholder="Selecciona un grupo" v-model="group">
                <option
                  v-for="group in groups"
                  :value="group._id"
                  :key="group._id"
                >
                  {{ group.name }}
                </option>
              </b-select>
              <b-icon pack="fas" icon="home" size="is-small"> </b-icon> -->
            </div>
          </div>
          <!-- Opciones del menú -->
          <ul class="menu-list">
            <li>
              <a
                @click="goMenu('Forms')"
                :class="$route.name == 'Forms' ? 'active' : ''"
                style="padding: 0.75em"
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
                style="padding: 0.75em"
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
                style="padding: 0.75em"
              >
                <b-icon pack="fas" icon="users" class="iconos" size="is-small">
                </b-icon>
                Administradores
              </a>
            </li>

            <li>
              <a @click="logout()" style="padding: 0.75em">
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
        :style="`height: ${window.height}px; background-color: #f5f5f5; padding:0px;`"
      >
        <router-view />
      </div>
    </div>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import axios from '../config/axios.js'
export default {
  data() {
    return {
      group: null,
      groups: [],
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
    this.listGroups()
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
    async listGroups() {
      try {
        this.isLoading = true
        const { data } = await axios.post('/groups/list', {})
        this.groups = data.group
        for (let group of this.groups) {
          if (group.default) this.group = group._id
        }
        if (!this.group && this.groups.length > 0)
          this.group = this.groups[0]._id
        this.$cookie.set('group', this.group)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error al obtener lista de grupos`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },
    async createGroup() {
      this.$buefy.dialog.prompt({
        message: 'Ingresa el nombre del nuevo grupo:',
        inputAttrs: {
          type: 'text',
        },
        confirmText: 'Guardar',
        trapFocus: true,
        closeOnConfirm: false,
        onConfirm: async (value, { close }) => {
          try {
            this.isLoading = true
            await axios.post('/groups/create', { name: value })
            await this.listGroups()
            close()
            this.isLoading = false
          } catch (error) {
            console.log(error)
            close()
            this.isLoading = false
            this.$buefy.toast.open({
              message: `Error al crear grupo`,
              position: 'is-top',
              type: 'is-danger',
            })
          }
        },
      })
    },
    async changeGroup(e) {
      try {
        this.isLoading = true
        await axios.get(`/groups/default/${e}`)
        this.$cookie.set('group', e)
        window.location.reload()
        // this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error al cambiar grupo`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    linkForm() {
      window.open(
        `${process.env.VUE_APP_FORM_URL}?groupId=${this.$cookie.get('group')}`,
        '_blank'
      )
    },
  },
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
}

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
