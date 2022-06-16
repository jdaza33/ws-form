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
              Usuarios
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

                    <b-table-column
                      sortable
                      field="lastname1"
                      label="A. Paterno"
                      >{{ props.row.lastname1 }}</b-table-column
                    >

                    <!-- <b-table-column
                      sortable
                      field="lastname2"
                      label="A. Materno"
                      >{{ props.row.lastname2 }}</b-table-column
                    > -->

                    <!-- <b-table-column field="birthdate" label="Cumpleaño">
                      <b-tag type="is-info">{{
                        props.row.birthdate
                          ? msToDate(props.row.birthdate)
                          : 'N/A'
                      }}</b-tag>
                    </b-table-column> -->

                    <b-table-column
                      sortable
                      field="district"
                      label="Distrito"
                      >{{ props.row.district }}</b-table-column
                    >

                    <b-table-column sortable field="town" label="Ciudad">{{
                      props.row.town
                    }}</b-table-column>

                    <b-table-column field="shared" label="¿Compartió?" centered>
                      <b-tag
                        :type="
                          props.row.sharedLink ? 'is-success' : 'is-danger'
                        "
                        >{{ props.row.sharedLink ? 'SI' : 'NO' }}</b-tag
                      >
                    </b-table-column>

                    <!-- <b-table-column sortable field="phone" label="A. Materno">{{
                      `[${props.row.country}]-${props.row.phone}`
                    }}</b-table-column> -->

                    <!-- <b-table-column
                      sortable
                      field="worry"
                      label="Preocupación"
                      >{{ props.row.worry }}</b-table-column
                    > -->

                    <!-- <b-table-column
                      sortable
                      field="proposal"
                      label="Propuesta"
                      >{{ props.row.proposal }}</b-table-column
                    > -->

                    <b-table-column field="createdAt" label="Creación">
                      <b-tag type="is-info">{{
                        props.row.createdAt
                          ? msToDate(props.row.createdAt)
                          : 'N/A'
                      }}</b-tag>
                    </b-table-column>

                    <b-table-column field="events" label="Acciones" centered>
                      <a class="btn-events" @click="moreInfo(props.row)"
                        ><b-icon
                          pack="fas"
                          type="is-info"
                          icon="eye"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <!-- <a
                        class="btn-events"
                        @click="beforeDeleteUser(props.row._id, props.row.name)"
                        ><b-icon
                          pack="fas"
                          type="is-danger"
                          icon="trash-alt"
                          size="is-small"
                        >
                        </b-icon
                      ></a> -->
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

    async listUsers() {
      try {
        this.isLoading = true
        const { data } = await axios.post('/persons/list', {})
        this.users = data.person
        this.dataPaginate = data.person
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error al obtener lista de Usuarios`,
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

    parseText(text) {
      if (text === 'name') return 'Nombre'
      if (text === 'lastname1') return 'Apellido Paterno'
      if (text === 'lastname2') return 'Apellido Materno'
      if (text === 'birthdate') return 'Cumpleaños'
      if (text === 'district') return 'Distrito'
      if (text === 'town') return 'Ciudad'
      if (text === 'country') return 'País'
      if (text === 'phone') return 'Telefono'
      if (text === 'worry') return 'Preocupación'
      if (text === 'proposal') return 'Propuesta'
      if (text === 'howToHelp') return 'Como ayudar'
      if (text === 'aboutMe') return 'Sobre mí'
      if (text === 'sharedLink') return '¿Compartio enlace?'
      if (text === 'comeFrom') return 'Referencia'
      if (text === 'createdAt') return 'Fecha de creación'
      else return 'n/a'
    },

    moreInfo(_user) {
      const user = { ..._user }
      delete user._id
      delete user.__v

      user.createdAt = this.msToDate(user.createdAt)
      // user.birthdate = this.msToDate(user.birthdate)

      if (user.comeFrom)
        user.comeFrom = `<strong><i style="color: #1363DF;">${user.comeFrom.name} ${user.comeFrom.lastname1}</i></strong>`

      user.sharedLink = user.sharedLink
        ? '<strong><i style="color: #53BF9D;">SI</i></strong>'
        : '<strong><i style="color: #D61C4E;">NO</i></strong>'

      let text = ''
      for (let i in user)
        text += `<strong>${this.parseText(i)}:</strong> ${user[i]} <br/>`
      this.$buefy.dialog.alert({
        title: 'Más información',
        message: text,
        confirmText: '¡Bien!',
      })
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
