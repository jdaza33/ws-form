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
              Testimonies
            </h1>
          </div>
          <!-- Buscador -->
          <div class="buscador">
            <b-field horizontal grouped position="is-center">
              <b-input
                @keyup.native="find"
                v-model="findTestimony"
                placeholder="Search testimonies"
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
          </div>
          <!-- Lista de articulos -->
          <b-tabs type="is-boxed" position="is-centered" v-model="tabs">
            <b-tab-item label="List" icon-pack="fas" icon="align-left">
              <div class="card contenedor sombra">
                <b-table
                  :data="testimoniesPaginate"
                  :paginated="isPaginated"
                  :per-page="perPageTestimonies"
                  :current-page.sync="currentPage"
                  :pagination-simple="isPaginationSimple"
                  :default-sort-direction="defaultSortDirection"
                  default-sort="created"
                  aria-next-label="Next page"
                  aria-previous-label="Previous page"
                  aria-page-label="Page"
                  aria-current-label="Current page"
                  class="table is-striped"
                  :opened-detailed="defaultOpenedDetails"
                  detailed
                  detail-key="_id"
                  :show-detail-icon="showDetailIcon"
                  ref="table"
                  @details-open="
                    (row, index) => $buefy.toast.open(`Expanded ${row.name}`)
                  "
                >
                  <template slot-scope="props">
                    <b-table-column sortable field="name" label="Name" width="400">{{
                      props.row.name
                    }}</b-table-column>

                    <b-table-column sortable field="course" label="Course" width="400">{{
                      props.row.educationId
                        ? props.row.educationId.title
                        : 'n/a'
                    }}</b-table-column>

                    <b-table-column field="active" label="Visible" centered>
                      <b-icon
                        pack="fas"
                        :type="props.row.active ? 'is-success' : 'is-danger'"
                        :icon="props.row.active ? 'eye' : 'eye-slash'"
                        size="is-small"
                      >
                      </b-icon>
                    </b-table-column>

                    <b-table-column field="events" label="Events" centered>
                      <a
                        class="btn-events"
                        @click="beforeDeleteTestimony(props.row._id)"
                        ><b-icon
                          pack="fas"
                          type="is-danger"
                          icon="trash-alt"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <a
                        class="btn-events"
                        @click="editTestimony(props.row._id)"
                        ><b-icon
                          pack="fas"
                          type="is-info"
                          icon="edit"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <a
                        class="btn-events"
                        @click="
                          beforeApproveTestimony(
                            props.row._id,
                            props.row.active
                          )
                        "
                        ><b-icon
                          pack="fas"
                          :type="props.row.active ? 'is-warning' : 'is-tplanet'"
                          :icon="
                            props.row.active ? 'times-circle' : 'check-circle'
                          "
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                    </b-table-column>
                  </template>
                  <template slot="detail" slot-scope="props">
                    <article class="media">
                      <figure class="media-left">
                        <p class="image is-64x64">
                          <img src="img/user.svg" />
                        </p>
                      </figure>
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong>{{ props.row.email }}</strong> |
                            <small>Telf. {{ props.row.phone }}</small>
                            <br />
                            {{ `${props.row.content.substring(0, 200)} ...` }}
                          </p>
                        </div>
                      </div>
                    </article>
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
            <b-tab-item>
              <template slot="header">
                <b-icon icon="align-left" pack="fas"></b-icon>
                <span>
                  List Pending
                  <b-tag
                    rounded
                    type="is-tplanet"
                    v-if="testimoniesPendingPaginate.length > 0"
                  >
                    {{ testimoniesPendingPaginate.length }}
                  </b-tag>
                </span>
              </template>
              <div class="card contenedor sombra">
                <b-table
                  :data="testimoniesPendingPaginate"
                  :paginated="isPaginated"
                  :per-page="perPageTestimoniesPending"
                  :current-page.sync="currentPagePending"
                  :pagination-simple="isPaginationSimple"
                  :default-sort-direction="defaultSortDirection"
                  default-sort="created"
                  aria-next-label="Next page"
                  aria-previous-label="Previous page"
                  aria-page-label="Page"
                  aria-current-label="Current page"
                  class="table is-striped"
                  :opened-detailed="defaultOpenedDetailsPending"
                  detailed
                  detail-key="_id"
                  :show-detail-icon="showDetailIcon"
                  ref="table"
                  @details-open="
                    (row, index) => $buefy.toast.open(`Expanded ${row.name}`)
                  "
                >
                  <template slot-scope="props">
                    <b-table-column sortable field="name" label="Name">{{
                      props.row.name
                    }}</b-table-column>

                    <b-table-column sortable field="course" label="Course">{{
                      props.row.educationId
                        ? props.row.educationId.title
                        : 'n/a'
                    }}</b-table-column>

                    <b-table-column field="active" label="Visible" centered>
                      <b-icon
                        pack="fas"
                        :type="props.row.active ? 'is-success' : 'is-danger'"
                        :icon="props.row.active ? 'eye' : 'eye-slash'"
                        size="is-small"
                      >
                      </b-icon>
                    </b-table-column>

                    <b-table-column field="events" label="Events" centered>
                      <a
                        class="btn-events"
                        @click="beforeDeleteTestimony(props.row._id)"
                        ><b-icon
                          pack="fas"
                          type="is-danger"
                          icon="trash-alt"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <a
                        class="btn-events"
                        @click="editTestimony(props.row._id)"
                        ><b-icon
                          pack="fas"
                          type="is-info"
                          icon="edit"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <a
                        class="btn-events"
                        @click="beforeApproveTestimony(props.row._id, false)"
                        ><b-icon
                          pack="fas"
                          type="is-tplanet"
                          icon="check-circle"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <a
                        class="btn-events"
                        @click="beforeApproveTestimony(props.row._id, true)"
                        ><b-icon
                          pack="fas"
                          type="is-warning"
                          icon="times-circle"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                    </b-table-column>
                  </template>
                  <template slot="detail" slot-scope="props">
                    <article class="media">
                      <figure class="media-left">
                        <p class="image is-64x64">
                          <img src="img/user.svg" />
                        </p>
                      </figure>
                      <div class="media-content">
                        <div class="content">
                          <p>
                            <strong>{{ props.row.email }}</strong> |
                            <small>Telf. {{ props.row.phone }}</small>
                            <br />
                            {{ `${props.row.content.substring(0, 200)} ...` }}
                          </p>
                        </div>
                      </div>
                    </article>
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
              :label="isEdit ? 'Edit' : 'Create'"
              icon-pack="fas"
              :icon="isEdit ? 'edit' : 'pen-alt'"
            >
              <div class="card container-create sombra">
                <div class="card-content">
                  <div class="columns">
                    <div class="column is-6">
                      <b-field label="Name:" :label-position="labelPosition">
                        <b-input
                          v-model="newTestimony.name"
                          placeholder="Maria José"
                        ></b-input>
                      </b-field>
                      <b-field label="Email:" :label-position="labelPosition">
                        <b-input
                          v-model="newTestimony.email"
                          placeholder="mariajose@mail.com"
                        ></b-input>
                      </b-field>
                      <b-field label="Phone:" :label-position="labelPosition">
                        <b-input
                          v-model="newTestimony.phone"
                          placeholder="+1 (786) 616-4905"
                        ></b-input>
                      </b-field>
                      <b-field label="Course:" :label-position="labelPosition">
                        <b-select
                          placeholder="Select a course"
                          v-model="newTestimony.educationId"
                          expanded
                        >
                          <option
                            v-for="(course, index) in courses"
                            :value="course.id"
                            :key="index"
                          >
                            {{ course.title }}
                          </option>
                        </b-select>
                      </b-field>
                      <b-field label="Active:">
                        <b-switch
                          v-model="newTestimony.active"
                          :rounded="true"
                          :outlined="true"
                          :size="'is-medium'"
                          :type="'is-tplanet'"
                          >{{ newTestimony.active ? 'YES' : 'NO' }}</b-switch
                        >
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <b-field
                        label="Description"
                        :label-position="labelPosition"
                      >
                        <b-input
                          maxlength="300"
                          rows="8"
                          type="textarea"
                          v-model="newTestimony.content"
                          placeholder="Excelente curso, el mejor que he hecho en mi vida."
                        ></b-input>
                      </b-field>
                    </div>
                  </div>
                  <hr />
                  <div class="encabezado">
                    <b-button
                      @click="isEdit ? updateTestimony() : createTestimony()"
                      rounded
                      type="is-success"
                      class="has-text-weight-bold"
                      icon-pack="fas"
                      icon-left="check"
                      >Finish</b-button
                    >
                  </div>
                  <!-- <div class="encabezado">
                    <b-button
                      @click="clearTestimony(false)"
                      type="is-info"
                      class="is-size-7 has-text-weight-bold"
                      >Clear All</b-button
                    >
                  </div> -->
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

      testimonies: [],
      testimoniesPending: [],
      courses: [],

      idToEdit: null,
      isEdit: false,
      tabs: 0,
      steps: 0,
      image: null,
      previewImage: null,

      newTestimony: {
        email: '',
        active: false,
        name: '',
        content: '',
        phone: '',
        educationId: '',
      },
      testimoniesPaginate: [],
      testimoniesPendingPaginate: [],
      findTestimony: '',

      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'desc',
      currentPage: 1,
      currentPagePending: 1,
      perPageTestimonies: 5,
      perPageTestimoniesPending: 5,

      defaultOpenedDetails: [1],
      defaultOpenedDetailsPending: [1],
      showDetailIcon: true,

      imgDefault: 'img/default-img.png',
      urlprod: process.env.VUE_APP_API_URL,
    }
  },
  methods: {
    preview(file) {
      this.previewImage = URL.createObjectURL(file)
    },

    toggle(row) {
      this.$refs.table.toggleDetails(row)
    },

    async createTestimony() {
      try {
        this.isLoading = true
        this.newTestimony.viewed = true
        this.newTestimony.edited = true
        let testimony = await axios.post(
          '/testimonies/create',
          this.newTestimony
        )
        this.$buefy.toast.open({
          message: `Successfully created testimony!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearTestimony(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error creating testimony, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async uploadFile(courseId) {
      try {
        if (this.image) {
          let data = new FormData()
          data.append('file', this.image)
          await axios.post(`/educations/upload/img/${courseId}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async listTestimonies() {
      try {
        this.isLoading = true
        let testimonies = await axios.post('/testimonies/list', {
          viewed: true,
        })
        this.testimonies = testimonies.data.data.testimony
        this.testimoniesPaginate = testimonies.data.data.testimony
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Searching items failed, try again, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },
    async listTestimoniesPending() {
      try {
        this.isLoading = true
        let testimonies = await axios.post('/testimonies/list', {
          viewed: false,
        })
        this.testimoniesPending = testimonies.data.data.testimony
        this.testimoniesPendingPaginate = testimonies.data.data.testimony
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Searching items failed, try again, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async listCourses() {
      try {
        this.isLoading = true
        let courses = await axios.post('/educations/list', {})
        this.courses = courses.data.data.education.map((c) => {
          let tmp = { ...c }
          tmp.id = tmp._id.toString()
          return tmp
        })
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Searching items failed, try again, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async beforeDeleteTestimony(testimonyId) {
      this.$buefy.dialog.confirm({
        title: 'Deleting testimony',
        message: 'Are you sure to <b>delete</b> this testimony?',
        confirmText: 'Delete testimony',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteTestimony(testimonyId),
      })
    },

    async deleteTestimony(testimonyId) {
      try {
        this.isLoading = true
        await axios.delete(`/testimonies/${testimonyId}`)
        await this.clearTestimony(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Searching items failed, try again, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async beforeApproveTestimony(testimonyId, active) {
      this.$buefy.dialog.confirm({
        title: active ? 'Disapproving testimony' : 'Approving testimony',
        message: active
          ? 'Are you sure to <b>disapprove</b> this testimony?'
          : 'Are you sure to <b>approving</b> this testimony?',
        confirmText: active ? 'Disapprove testimony' : 'Approve testimony',
        type: active ? 'is-warning' : 'is-success',
        hasIcon: true,
        onConfirm: () => this.approveTestimony(testimonyId, active),
      })
    },

    async approveTestimony(testimonyId, active) {
      try {
        this.isLoading = true
        await axios.put(`/testimonies/${testimonyId}`, { active: !active })
        await this.clearTestimony(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Searching items failed, try again, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    editTestimony(testimonyId) {
      let testimony = this.testimonies.find(
        (p) => p._id.toString() == testimonyId
      )
      this.newTestimony.name = testimony.name
      this.newTestimony.email = testimony.email
      this.newTestimony.phone = testimony.phone
      this.newTestimony.educationId = testimony.educationId
        ? testimony.educationId._id.toString()
        : ''
      this.newTestimony.active = testimony.active
      this.newTestimony.content = testimony.content

      this.tabs = 2
      this.isEdit = true
      this.idToEdit = testimonyId
    },

    async updateTestimony() {
      try {
        this.isLoading = true
        let testimony = await axios.put(
          `/testimonies/${this.idToEdit}`,
          this.newTestimony
        )
        this.$buefy.toast.open({
          message: `Successfully editing testimony!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearTestimony(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error editing testimony, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async clearTestimony(changeTab) {
      this.newTestimony.name = ''
      this.newTestimony.content = ''
      this.newTestimony.email = ''
      this.newTestimony.active = false
      this.newTestimony.educationId = ''
      this.newTestimony.phone = ''

      this.previewImage = null
      this.image = null
      this.idToEdit = null

      if (changeTab) this.tabs = 0
      this.steps = 0

      this.isEdit = false
      await this.listTestimonies()
      await this.listTestimoniesPending()
    },

    find() {
      if (!this.findTestimony || this.findTestimony == '')
        this.testimoniesPaginate = this.testimonies

      this.testimoniesPaginate = []

      let filter = new RegExp(this.findTestimony.toLowerCase())
      let tempTestimonyFind = this.testimonies.filter((testimony) => {
        return filter.test(testimony.name.toLowerCase())
      })

      this.testimoniesPaginate = tempTestimonyFind
    },
    replaceByDefault(e) {
      e.target.src = this.imgDefault
    },
  },
  created() {
    this.listTestimonies()
    this.listCourses()
    this.listTestimoniesPending()
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

.button{
  min-width: 120px;
}

.btn {
  padding: 9px 35px 26px 35px;
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
</style>
