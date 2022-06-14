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
              Courses
            </h1>
          </div>
          <!-- Buscador -->
          <div class="buscador">
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
          </div>
          <!-- Lista de articulos -->
          <b-tabs type="is-boxed" position="is-centered" v-model="tabs">
            <b-tab-item label="List" icon-pack="fas" icon="align-left">
              <div class="card contenedor sombra">
                <b-table
                  :data="coursesPaginate"
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
                    <b-table-column
                      sortable
                      field="order"
                      label="ID"
                      width="20"
                      >{{ props.row.order }}</b-table-column
                    >
                    <b-table-column sortable field="title" label="Title">{{
                      props.row.title
                    }}</b-table-column>

                    <b-table-column field="price" label="Price">
                      <b-taglist attached>
                        <b-tag type="is-dark">$</b-tag>
                        <b-tag type="is-info">{{ props.row.price }}</b-tag>
                      </b-taglist>
                    </b-table-column>

                    <b-table-column field="offer" label="Offer">
                      <b-taglist attached>
                        <b-tag type="is-dark">$</b-tag>
                        <b-tag type="is-success">{{
                          `$ ${props.row.offprice ? props.row.offprice : 0}`
                        }}</b-tag>
                      </b-taglist>
                    </b-table-column>

                    <b-table-column field="tutor" label="Tutor">{{
                      `${
                        props.row.tutor && props.row.tutor.name
                          ? props.row.tutor.name
                          : ''
                      } ${
                        props.row.tutor && props.row.tutor.lastname
                          ? props.row.tutor.lastname
                          : ''
                      }`
                    }}</b-table-column>

                    <b-table-column
                      field="published"
                      label="Published"
                      centered
                    >
                      <b-icon
                        pack="fas"
                        :type="props.row.published ? 'is-success' : 'is-danger'"
                        :icon="
                          props.row.published ? 'check-circle' : 'times-circle'
                        "
                        size="is-small"
                      >
                      </b-icon>
                    </b-table-column>

                    <b-table-column field="events" label="Events" centered>
                      <a
                        class="btn-events"
                        @click="beforeDeleteCourse(props.row._id)"
                        ><b-icon
                          pack="fas"
                          type="is-danger"
                          icon="trash-alt"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <a class="btn-events" @click="editCourse(props.row._id)"
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
                        @click="moveCourse('down', props.row._id)"
                        ><b-icon
                          pack="fas"
                          type="is-warning"
                          :custom-class="isMoveCourse ? 'fa-spin' : ''"
                          :icon="isMoveCourse ? 'spinner' : 'arrow-down'"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <a
                        class="btn-events"
                        @click="moveCourse('up', props.row._id)"
                        ><b-icon
                          pack="fas"
                          type="is-success"
                          :custom-class="isMoveCourse ? 'fa-spin' : ''"
                          :icon="isMoveCourse ? 'spinner' : 'arrow-up'"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                      <!-- <a class="btn-events"
                        ><b-icon
                          pack="fas"
                          type="is-success"
                          icon="eye"
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
            <b-tab-item
              :label="isEdit ? 'Edit' : 'Create'"
              icon-pack="fas"
              :icon="isEdit ? 'edit' : 'pen-alt'"
            >
              <b-steps size="is-small" v-model="steps">
                <b-step-item
                  label="Details"
                  icon="bookmark"
                  icon-pack="fas"
                  :clickable="true"
                >
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div class="columns">
                        <div class="column is-6">
                          <b-field
                            label="Title:"
                            :label-position="labelPosition"
                          >
                            <b-input
                              v-model="newCourse.title"
                              placeholder="Opciones financieras:"
                            ></b-input>
                          </b-field>
                          <b-field
                            label="Tags:"
                            :label-position="labelPosition"
                          >
                            <b-taginput
                              v-model="newCourse.tags"
                              ellipsis
                              icon="label"
                              placeholder="Add a tag"
                            >
                            </b-taginput>
                          </b-field>

                          <b-field grouped>
                            <b-field
                              label="Price:"
                              :label-position="labelPosition"
                            >
                              <p class="control">
                                <span class="button is-static">$</span>
                              </p>
                              <b-input
                                placeholder="600 usd"
                                expanded
                                v-model="newCourse.price"
                              ></b-input>
                            </b-field>

                            <b-tooltip
                              label="0 = No offer"
                              position="is-right"
                              type="is-warning"
                            >
                              <b-field
                                label="Offer:"
                                :label-position="labelPosition"
                              >
                                <p class="control">
                                  <span class="button is-static">$</span>
                                </p>
                                <b-input
                                  placeholder="450 usd"
                                  expanded
                                  v-model="newCourse.offprice"
                                ></b-input>
                              </b-field>
                            </b-tooltip>
                          </b-field>

                          <b-field label="Published:">
                            <b-switch
                              v-model="newCourse.published"
                              :rounded="true"
                              :outlined="true"
                              :size="'is-medium'"
                              :type="'is-tplanet'"
                              >{{
                                newCourse.published ? 'YES' : 'NO'
                              }}</b-switch
                            >
                          </b-field>
                        </div>
                        <div class="column is-6">
                          <b-field
                            label="Content:"
                            :label-position="labelPosition"
                          >
                            <b-input
                              maxlength="300"
                              type="textarea"
                              v-model="newCourse.content"
                              placeholder="En este entrenamiento te daremos las habilidades necesarias para empezar a invertir en el mercado bursátil..."
                            ></b-input>
                          </b-field>
                        </div>
                      </div>
                      <hr />
                      <div class="encabezado">
                        <b-button
                          @click="clearCourse(false)"
                          rounded
                          type="is-primary"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="trash-alt"
                          >Clear All</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
                <b-step-item label="Image" icon="image" :clickable="true">
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div class="columns">
                        <div class="column is-6">
                          <b-field label="Image:">
                            <div class="encabezado">
                              <b-upload
                                v-model="image"
                                @input="preview"
                                drag-drop
                              >
                                <section class="section">
                                  <div class="content has-text-centered">
                                    <p>
                                      <b-icon icon="upload" size="is-large">
                                      </b-icon>
                                    </p>
                                    <p>
                                      Drop your files here or click to upload
                                    </p>
                                  </div>
                                </section>
                              </b-upload>
                            </div>
                          </b-field>
                        </div>
                        <div class="column is-6">
                          <b-field label="Preview:">
                            <figure class="image is-2by1">
                              <img v-if="previewImage" :src="previewImage" />
                            </figure>
                          </b-field>
                        </div>
                      </div>
                      <hr />
                      <div class="encabezado">
                        <b-button
                          @click="clearCourse(false)"
                          rounded
                          type="is-primary"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="trash-alt"
                          >Clear All</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
                <b-step-item
                  label="Descriptions"
                  icon="stream"
                  icon-pack="fas"
                  :clickable="true"
                >
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div class="columns">
                        <div class="column is-6">
                          <b-field
                            label="Description Short:"
                            :label-position="labelPosition"
                          >
                            <b-input
                              maxlength="300"
                              type="textarea"
                              rows="4"
                              v-model="newCourse.short_description"
                              placeholder="En esta capacitación aprenderás todas las herramientas necesarias para convertirte en con comerciante de la bolsa de valores..."
                            ></b-input>
                          </b-field>
                        </div>
                        <div class="column is-6">
                          <b-field
                            label="Description Large:"
                            :label-position="labelPosition"
                          >
                            <b-input
                              maxlength="600"
                              type="textarea"
                              rows="7"
                              v-model="newCourse.large_description"
                              placeholder="Hoy es el día , que puedes comenzar tu carrera como inversionista o trader del mercado de valores. Traders Planet te abre las puertas a este emocionante mercado de capitales financieros al ofrecerte técnicas..."
                            ></b-input>
                          </b-field>
                        </div>
                      </div>
                      <hr />
                      <div class="encabezado">
                        <b-button
                          @click="clearCourse(false)"
                          rounded
                          type="is-primary"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="trash-alt"
                          >Clear All</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
                <b-step-item
                  label="Requirements"
                  icon="list"
                  icon-pack="fas"
                  :clickable="true"
                >
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div>
                        <b-field
                          label="Requirements:"
                          :label-position="labelPosition"
                        >
                          <b-input
                            v-model="requirement"
                            @keyup.enter.native="addRequirement"
                            placeholder="Type a requirement and press enter to add.."
                          ></b-input>
                        </b-field>

                        <b-field label="Preview:">
                          <b-table
                            :data="newCourse.requirements"
                            :paginated="isPaginated"
                            :per-page="perPageRequirements"
                            :current-page.sync="currentPageRequirements"
                            :pagination-simple="isPaginationSimple"
                            :default-sort-direction="defaultSortDirection"
                            default-sort="nro"
                            aria-next-label="Next page"
                            aria-previous-label="Previous page"
                            aria-page-label="Page"
                            aria-current-label="Current page"
                            class="table is-striped"
                          >
                            <template slot-scope="props">
                              <b-table-column
                                field="nro"
                                label="Nro."
                                sortable
                                width="20"
                                >{{
                                  currentPageRequirements > 1
                                    ? props.index + 1 + perPageRequirements
                                    : props.index + 1
                                }}</b-table-column
                              >
                              <b-table-column
                                field="requirement"
                                label="Requirement"
                                >{{ props.row }}</b-table-column
                              >
                              <b-table-column
                                field="events"
                                label="Events"
                                centered
                                width="150"
                              >
                                <a
                                  class="btn-events"
                                  @click="moveRequirement('down', props.index)"
                                  ><b-icon
                                    pack="fas"
                                    type="is-warning"
                                    icon="arrow-down"
                                    size="is-small"
                                  >
                                  </b-icon
                                ></a>
                                <a
                                  class="btn-events"
                                  @click="removeRequirement(props.index)"
                                  ><b-icon
                                    pack="fas"
                                    type="is-danger"
                                    icon="times-circle"
                                    size="is-small"
                                  >
                                  </b-icon
                                ></a>
                                <a
                                  class="btn-events"
                                  @click="moveRequirement('up', props.index)"
                                  ><b-icon
                                    pack="fas"
                                    type="is-success"
                                    icon="arrow-up"
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
                                    <b-icon
                                      icon="emoticon-sad"
                                      size="is-large"
                                    ></b-icon>
                                  </p>
                                  <p>Empty requirements</p>
                                </div>
                              </section>
                            </template>
                          </b-table>
                        </b-field>
                      </div>
                      <hr />
                      <div class="encabezado">
                        <b-button
                          @click="clearCourse(false)"
                          rounded
                          type="is-primary"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="trash-alt"
                          >Clear All</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
                <b-step-item
                  label="Learnings"
                  icon="chalkboard"
                  icon-pack="fas"
                  :clickable="true"
                >
                  <div class="card container-create sombra">
                    <div class="card-content">
                      <div>
                        <b-field
                          label="Learnings:"
                          :label-position="labelPosition"
                        >
                          <b-input
                            v-model="learning"
                            @keyup.enter.native="addLearning"
                            placeholder="Type a learning and press enter to add.."
                          ></b-input>
                        </b-field>

                        <b-field label="Preview:">
                          <b-table
                            :data="newCourse.learn"
                            :paginated="isPaginated"
                            :per-page="perPageLearnings"
                            :current-page.sync="currentPageLearnings"
                            :pagination-simple="isPaginationSimple"
                            :default-sort-direction="defaultSortDirection"
                            default-sort="nro"
                            aria-next-label="Next page"
                            aria-previous-label="Previous page"
                            aria-page-label="Page"
                            aria-current-label="Current page"
                            class="table is-striped"
                          >
                            <template slot-scope="props">
                              <b-table-column
                                field="nro"
                                label="Nro."
                                sortable
                                width="20"
                                >{{
                                  currentPageLearnings > 1
                                    ? props.index + 1 + perPageLearnings
                                    : props.index + 1
                                }}</b-table-column
                              >
                              <b-table-column
                                field="requirement"
                                label="Requirement"
                                >{{ props.row }}</b-table-column
                              >
                              <b-table-column
                                field="events"
                                label="Events"
                                centered
                                width="150"
                              >
                                <a
                                  class="btn-events"
                                  @click="moveLearning('down', props.index)"
                                  ><b-icon
                                    pack="fas"
                                    type="is-warning"
                                    icon="arrow-down"
                                    size="is-small"
                                  >
                                  </b-icon
                                ></a>
                                <a
                                  class="btn-events"
                                  @click="removeLearning(props.index)"
                                  ><b-icon
                                    pack="fas"
                                    type="is-danger"
                                    icon="times-circle"
                                    size="is-small"
                                  >
                                  </b-icon
                                ></a>
                                <a
                                  class="btn-events"
                                  @click="moveLearning('up', props.index)"
                                  ><b-icon
                                    pack="fas"
                                    type="is-success"
                                    icon="arrow-up"
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
                                    <b-icon
                                      icon="emoticon-sad"
                                      size="is-large"
                                    ></b-icon>
                                  </p>
                                  <p>Empty learnings</p>
                                </div>
                              </section>
                            </template>
                          </b-table>
                        </b-field>
                      </div>
                      <hr />
                      <div class="encabezado">
                        <b-button
                          @click="isEdit ? updatePost() : createCourse()"
                          rounded
                          type="is-success"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="check"
                          >Finish</b-button
                        >
                      </div>
                    </div>
                  </div>
                </b-step-item>
              </b-steps>
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

      courses: [],

      idToEdit: null,
      isEdit: false,
      tabs: 0,
      steps: 0,
      image: null,
      previewImage: null,
      isMoveCourse: false,

      requirement: '',
      learning: '',
      newCourse: {
        title: '',
        content: '',
        tutor: '',
        published: false,
        price: 0,
        offprice: 0,
        short_description: '',
        large_description: '',
        learn: [],
        img: null,
        tags: [],
        requirements: [],
      },
      coursesPaginate: [],
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
    moveLearning(type, index) {
      if (this.currentPageLearnings > 1) index = index + this.perPageLearnings

      if (type == 'down')
        if (this.newCourse.learn.length - 1 != index) {
          this.newCourse.learn = this.moveElement(
            this.newCourse.learn,
            index,
            index + 1
          )
        }

      if (type == 'up')
        if (index > 0) {
          this.newCourse.learn = this.moveElement(
            this.newCourse.learn,
            index,
            index - 1
          )
        }
    },

    removeLearning(index) {
      this.newCourse.learn.splice(index, 1)
    },

    moveRequirement(type, index) {
      if (this.currentPageRequirements > 1)
        index = index + this.perPageRequirements

      if (type == 'down')
        if (this.newCourse.requirements.length - 1 != index) {
          this.newCourse.requirements = this.moveElement(
            this.newCourse.requirements,
            index,
            index + 1
          )
        }

      if (type == 'up')
        if (index > 0) {
          this.newCourse.requirements = this.moveElement(
            this.newCourse.requirements,
            index,
            index - 1
          )
        }
    },

    removeRequirement(index) {
      this.newCourse.requirements.splice(index, 1)
    },

    moveElement(arr, old_index, new_index) {
      while (old_index < 0) {
        old_index += arr.length
      }
      while (new_index < 0) {
        new_index += arr.length
      }
      if (new_index >= arr.length) {
        var k = new_index - arr.length
        while (k-- + 1) {
          arr.push(undefined)
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
      return arr
    },

    addRequirement() {
      if (this.requirement && this.requirement != '') {
        this.newCourse.requirements.push(this.requirement)
        this.requirement = ''
      }
    },

    addLearning() {
      if (this.learning && this.learning != '') {
        this.newCourse.learn.push(this.learning)
        this.learning = ''
      }
    },

    preview(file) {
      this.previewImage = URL.createObjectURL(file)
    },

    async createCourse() {
      try {
        this.isLoading = true
        this.newCourse.tutor = this.$cookie.get('userId')
        let course = await axios.post('/educations/create', this.newCourse)
        await this.uploadFile(course.data.data.education._id.toString())
        this.$buefy.toast.open({
          message: `Successfully created course!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearCourse(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error creating course, try again`,
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

    async listCourses() {
      try {
        this.isLoading = true
        let courses = await axios.post('/educations/list', {})
        this.courses = courses.data.data.education
        this.coursesPaginate = courses.data.data.education
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

    editCourse(courseId) {
      let course = this.courses.find((p) => p._id.toString() == courseId)
      this.newCourse.title = course.title
      this.newCourse.content = course.content
      this.newCourse.tutor = course.tutor
      this.newCourse.published = course.published
      this.newCourse.price = course.price
      this.newCourse.offprice = course.offprice
      this.newCourse.short_description = course.short_description
      this.newCourse.large_description = course.large_description
      this.newCourse.learn = course.learn
      this.previewImage = course.img
      this.newCourse.img = course.img
      this.newCourse.tags = course.tags
      this.newCourse.requirements = course.requirements

      this.tabs = 1
      this.isEdit = true
      this.idToEdit = courseId
    },

    async updatePost() {
      try {
        this.isLoading = true
        let course = await axios.put(
          `/educations/${this.idToEdit}`,
          this.newCourse
        )
        if (this.image)
          await this.uploadFile(course.data.data.education._id.toString())
        this.$buefy.toast.open({
          message: `Successfully editing course!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearCourse(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error editing course, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async beforeDeleteCourse(courseId) {
      this.$buefy.dialog.confirm({
        title: 'Deleting course',
        message: 'Are you sure to <b>delete</b> this course?',
        confirmText: 'Delete course',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteCourse(courseId),
      })
    },

    async deleteCourse(courseId) {
      try {
        this.isLoading = true
        await axios.delete(`/educations/${courseId}`)
        await this.clearCourse(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Deleting course failed, try again, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async clearCourse(changeTab) {
      this.newCourse.title = ''
      this.newCourse.content = ''
      this.newCourse.tutor = ''
      this.newCourse.published = false
      this.newCourse.price = 0
      this.newCourse.offprice = 0
      this.newCourse.short_description = ''
      this.newCourse.large_description = ''
      this.newCourse.learn = []
      this.newCourse.img = null
      this.newCourse.tags = []
      this.newCourse.requirements = []

      this.previewImage = null
      this.image = null
      this.idToEdit = null

      if (changeTab) this.tabs = 0
      this.steps = 0

      this.isEdit = false
      await this.listCourses()
    },

    find() {
      if (!this.findCourse || this.findCourse == '')
        this.coursesPaginate = this.courses

      this.coursesPaginate = []

      let filter = new RegExp(this.findCourse.toLowerCase())
      let tempCoursesFind = this.courses.filter((course) => {
        return filter.test(course.title.toLowerCase())
      })

      this.coursesPaginate = tempCoursesFind
    },

    async moveCourse(op, courseId) {
      if (!this.isMoveCourse) {
        try {
          this.isMoveCourse = true
          let courseUpdated = await axios.put(`/educations/move/${courseId}`, {
            op,
          })
          let data = courseUpdated.data
          this.$buefy.toast.open({
            message: data.message,
            position: 'is-top',
            type: data.success == 2 ? 'is-warning' : 'is-success',
          })
          await this.clearCourse(true)
          this.isMoveCourse = false
        } catch (error) {
          console.log(error)
          this.isMoveCourse = false
          this.$buefy.toast.open({
            message: `Moving course failed, try again, try again`,
            position: 'is-top',
            type: 'is-danger',
          })
        }
      }
    },

    replaceByDefault(e) {
      e.target.src = this.imgDefault
    },
  },
  created() {
    this.listCourses()
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

.button{
  min-width: 120px;
}
</style>
