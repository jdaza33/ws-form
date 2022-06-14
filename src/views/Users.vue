<template>
  <div>
    <section class="section">
      <div class="columns is-centered">
        <div class="column is-11">
          <!-- Titulo -->
          <div class="encabezado">
            <h1
              class="is-size-5 has-text-weight-bold has-text-info is-uppercase"
            >
              Administradores
            </h1>
          </div>
          <!-- Buscador -->
          <!-- <div class="buscador">
            <b-field horizontal grouped position="is-centered">
              <b-input
                @keyup.native="find"
                v-model="findCourse"
                placeholder="Search courses"
                icon-pack="fas"
                icon="search"
              ></b-input>
              <b-button
                @click="find"
                rounded
                type="is-info"
                class="has-text-weight-bold"
                >Search</b-button
              >
            </b-field>
          </div> -->
          <!-- Lista de articulos -->
          <b-tabs type="is-boxed" position="is-centered" v-model="tabs">
            <b-tab-item label="Lista" icon-pack="fas" icon="align-left">
              <div class="card contenedor sombra">
                <b-table
                  :data="dataPaginate"
                  :paginated="isPaginated"
                  :per-page="perPageCourses"
                  :current-page.sync="currentPage"
                  :pagination-simple="isPaginationSimple"
                  :default-sort-direction="defaultSortDirection"
                  default-sort="created"
                  aria-next-label="Next page"
                  aria-previous-label="Previous page"
                  aria-page-label="Page"
                  aria-current-label="Current page"
                  class="table is-striped"
                >
                  <template slot-scope="props">
                    <!-- <b-table-column
                      sortable
                      field="order"
                      label="ID"
                      width="20"
                      >{{ props.row.order }}</b-table-column
                    > -->
                    <b-table-column sortable field="name" label="Nombre">{{
                      props.row.name
                    }}</b-table-column>

                    <b-table-column sortable field="username" label="Usuario">{{
                      props.row.username
                    }}</b-table-column>

                    <!-- <b-table-column field="username" label="Usuario">
                      <b-taglist attached>
                        <b-tag type="is-dark">$</b-tag>
                        <b-tag type="is-info">{{ props.row.price }}</b-tag>
                      </b-taglist>
                    </b-table-column> -->

                    <b-table-column field="createdAt" label="Creación">
                      <b-tag type="is-info">{{
                        props.row.createdAt
                          ? msToDate(props.row.createdAt)
                          : 'N/A'
                      }}</b-tag>
                    </b-table-column>

                    <b-table-column field="events" label="Acciones" centered>
                      <a
                        class="btn-events"
                        @click="beforeDeleteUser(props.row._id, props.row.name)"
                        ><b-icon
                          pack="fas"
                          type="is-danger"
                          icon="trash-alt"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                    </b-table-column>
                  </template>
                  <template slot="empty">
                    <section class="section-white">
                      <div class="content has-text-centered">
                        <p>
                          <b-icon icon="emoticon-sad" size="is-large"></b-icon>
                        </p>
                        <p>Empty list</p>
                      </div>
                    </section>
                  </template>
                </b-table>
              </div>
            </b-tab-item>
            <b-tab-item
              :label="isEdit ? 'Edit' : 'Crear'"
              icon-pack="fas"
              :icon="isEdit ? 'edit' : 'pen-alt'"
            >
              <div class="card container-create sombra">
                <div class="card-content">
                  <div class="columns">
                    <div class="column is-6">
                      <b-field label="Nombre:" :label-position="labelPosition">
                        <b-input
                          v-model="newUser.name"
                          placeholder="Jose"
                        ></b-input>
                      </b-field>
                      <b-field label="Password" :label-position="labelPosition">
                        <b-input
                          v-model="newUser.password"
                          type="password"
                          minlength="5"
                          placeholder="123456"
                          password-reveal
                        >
                        </b-input>
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <b-field label="Usuario:" :label-position="labelPosition">
                        <b-input v-model="newUser.username" placeholder="jose1">
                        </b-input>
                      </b-field>
                    </div>
                  </div>
                  <hr />
                  <div class="new-button-section">
                    <div class="columns">
                      <div class="column is-narrow">
                        <b-button
                          rounded
                          type="is-danger"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="arrow-left"
                          v-if="isEdit"
                          @click="goBack()"
                          >Go Back</b-button
                        >
                      </div>
                      <!-- <div class="column is-narrow">
                        <b-button
                          rounded
                          type="is-primary"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="trash-alt"
                          @click="clearFields(false)"
                          >Clear All</b-button
                        >
                      </div> -->
                      <div class="column is-narrow">
                        <b-button
                          expanded
                          rounded
                          type="is-success"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="check"
                          @click="isEdit ? updateUser() : createUser()"
                          >Crear</b-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </b-tab-item>
          </b-tabs>
          <!-- FIN -->
        </div>
      </div>
    </section>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import axios from '../config/axios.js'

export default {
  components: { VueEditor },
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      labelPosition: 'on-border',

      users: [],

      idToEdit: null,
      isEdit: false,
      tabs: 0,

      newUser: {
        name: '',
        username: '',
        password: '',
      },
      dataPaginate: [],
      findCourse: '',

      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'desc',
      currentPage: 1,
      perPageCourses: 5,
      currentPageRequirements: 1,
      perPageRequirements: 5,
      currentPageLearnings: 1,
      perPageLearnings: 5,

      imgDefault: 'img/default-img.png',
      urlprod: process.env.VUE_APP_API_URL,
    }
  },
  methods: {
    msToDate(ms) {
      const date = new Date(ms)
      return date.toLocaleString()
    },

    async createUser() {
      try {
        this.isLoading = true
        await axios.post('/users/create', this.newUser)
        this.$buefy.toast.open({
          message: `Usuario creado con éxito`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearUser(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error al crear usuario`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async listUsers() {
      try {
        this.isLoading = true
        const { data } = await axios.post('/users/list', {})
        this.users = data.user
        this.dataPaginate = data.user
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error al obtener lista de Administradores`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async beforeDeleteUser(userId, name) {
      this.$buefy.dialog.confirm({
        title: 'Eliminar usuario',
        message: `¿Quieres <b>eliminar</b> el usuario: ${name}?`,
        confirmText: 'ELIMINAR',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteUser(userId),
      })
    },

    async deleteUser(userId) {
      try {
        this.isLoading = true
        await axios.delete(`/users/${userId}`)
        await this.clearUser(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error al eliminar usuario`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async clearUser(changeTab) {
      this.newUser.name = ''
      this.newUser.username = ''
      this.newUser.password = ''

      if (changeTab) this.tabs = 0
      // this.isEdit = false
      await this.listUsers()
    },

    find() {
      if (!this.findCourse || this.findCourse == '')
        this.dataPaginate = this.users

      this.dataPaginate = []

      let filter = new RegExp(this.findCourse.toLowerCase())
      let tempCoursesFind = this.users.filter((course) => {
        return filter.test(course.title.toLowerCase())
      })

      this.dataPaginate = tempCoursesFind
    },

    replaceByDefault(e) {
      e.target.src = this.imgDefault
    },
  },
  created() {
    this.listUsers()
  },
}
</script>

<style scoped>
.btn-events {
  margin: 0.4em;
}

.section {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f5f5;
}

.section-white {
  font-family: 'Poppins', sans-serif;
}

.encabezado {
  display: flex;
  justify-content: center;
  margin-bottom: 2em;
}

.center-tag {
  display: flex;
  justify-content: center;
}

.buscador {
  margin-bottom: 1.5em;
}

.btn {
  padding: 16px 35px 19px 35px; /*nuevo padding: 9px 35px 26px 35px; */
  border-radius: 2em;
}

.contenedor {
  background-color: white;
  padding: 40px;
  border-radius: 0.5em;
  /* display: flex;
  justify-content: center; */
  align-items: center;
  margin-bottom: 4em;
}

.container-create {
  background-color: white;
  padding: 20px;
  border-radius: 0.5em;
  justify-content: center;
  align-items: center;
  margin-bottom: 4em;
}

.sombra {
  margin-top: 0px;
  margin-bottom: 0px;
  -webkit-box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
  -moz-box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
  box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
}

.caja {
  background-color: #f3f6fd;
  padding: 0px 20px 0px 20px;
  /* width: 100%; */
  /* display: flex;
  justify-content: center; */
  border-radius: 0.5em;
}

.box-create {
  background-color: #f3f6fd;
  padding: 0px 20px 0px 20px;
  width: 100%;
  /* display: flex; */
  /* justify-content: center; */
  border-radius: 0.5em;
}

.sub-sombra {
  -webkit-box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
  -moz-box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
  box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
}

.profile {
  display: flex;
  justify-content: center;
}

.profile-circle {
  height: 10em;
  width: 10em;
  overflow: hidden;
  border-style: solid;
  border-color: white;
  /* border-radius: 50%; */
  border-width: 3px;
}

.profile-pic {
  width: 100%;
}

.button {
  min-width: 120px;
}
</style>
