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
              Subscriptions
            </h1>
          </div>
          <!-- Buscador -->
          <div class="buscador">
            <b-field horizontal grouped position="is-centered">
              <b-input
                @keyup.native="find"
                v-model="findCourse"
                placeholder="Search subscriptions"
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
                  :data="subscriptionsPaginate"
                  :paginated="isPaginated"
                  :per-page="perPageSubscriptions"
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
                    <b-table-column sortable field="name" label="Name">{{
                      props.row.name
                    }}</b-table-column>

                    <b-table-column field="price" label="Price">
                      <b-taglist attached>
                        <b-tag type="is-dark">$</b-tag>
                        <b-tag type="is-info">{{ props.row.price }}</b-tag>
                      </b-taglist>
                    </b-table-column>

                    <b-table-column field="type" label="Type">
                      <b-tag type="is-dark">{{ `${props.row.type}` }}</b-tag>
                    </b-table-column>

                    <b-table-column field="stripeId" label="stripeId">{{
                      `${props.row.stripeId}`
                    }}</b-table-column>

                    <!-- <b-table-column
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
                    </b-table-column> -->

                    <b-table-column field="features" label="Features" centered>
                      <!-- <a
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
                      ></a> -->
                      <a
                        class="btn-events"
                        @click="showFeatures(props.row.features)"
                        ><b-icon
                          pack="fas"
                          type="is-info"
                          icon="eye"
                          size="is-small"
                        >
                        </b-icon
                      ></a>
                    </b-table-column>

                    <b-table-column
                      field="readyForSell"
                      label="Ready for sell?"
                      centered
                    >
                      <b-switch
                        type="is-success"
                        passive-type="is-danger"
                        v-model="props.row.readyForSell"
                        size="is-small"
                        @input.native="
                          changeReadyForSell(props.row._id, {
                            readyForSell: !props.row.readyForSell,
                          })
                        "
                        >{{ props.row.readyForSell ? 'SI' : 'NO' }}</b-switch
                      >
                    </b-table-column>

                    <b-table-column field="active" label="Active" centered>
                      <b-switch
                        type="is-success"
                        passive-type="is-danger"
                        v-model="props.row.active"
                        size="is-small"
                        @input.native="
                          changeReadyForSell(props.row._id, {
                            active: !props.row.readyForSell,
                          })
                        "
                        >{{ props.row.active ? 'SI' : 'NO' }}</b-switch
                      >
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
              <div class="card container-create sombra">
                <div class="card-content">
                  <div class="columns">
                    <div class="column is-6">
                      <b-field label="Name:" :label-position="labelPosition">
                        <b-input
                          v-model="newSubscription.name"
                          placeholder="Chatroom"
                        ></b-input>
                      </b-field>

                      <b-field grouped>
                        <b-field label="Price:" :label-position="labelPosition">
                          <p class="control">
                            <span class="button is-static">$</span>
                          </p>
                          <b-input
                            placeholder="600 usd"
                            expanded
                            v-model="newSubscription.price"
                          ></b-input>
                        </b-field>
                      </b-field>

                      <b-field
                        label="Type Payment:"
                        :label-position="labelPosition"
                      >
                        <b-select
                          placeholder="Select"
                          required
                          expanded
                          v-model="newSubscription.typePrice"
                        >
                          <option value="monthly">Mensual</option>
                          <option value="quarterly">Trimestral</option>
                          <option value="yearly">Anual</option>
                          <option value="singlePayment">Un solo pago</option>
                        </b-select>
                      </b-field>

                      <b-field label="Active:">
                        <b-switch
                          v-model="newSubscription.active"
                          :rounded="true"
                          :outlined="true"
                          :size="'is-medium'"
                          :type="'is-tplanet'"
                          >{{ newSubscription.active ? 'YES' : 'NO' }}</b-switch
                        >
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <div>
                        <b-field
                          label="Features:"
                          :label-position="labelPosition"
                        >
                          <b-input
                            v-model="feature"
                            @keyup.enter.native="addFeature"
                            placeholder="Type a feature and press enter to add.."
                          ></b-input>
                        </b-field>

                        <b-field label="Preview features:">
                          <b-table
                            :data="newSubscription.features"
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
                                field="features"
                                label="Features"
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
                                  <p>Empty features</p>
                                </div>
                              </section>
                            </template>
                          </b-table>
                        </b-field>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div class="encabezado">
                    <!-- <b-button
                          @click="clearCourse(false)"
                          rounded
                          type="is-primary"
                          class="has-text-weight-bold"
                          icon-pack="fas"
                          icon-left="trash-alt"
                          >Clear All</b-button
                        > -->
                    <b-button
                      @click="createSubscription()"
                      rounded
                      type="is-success"
                      class="has-text-weight-bold"
                      icon-pack="fas"
                      icon-left="save"
                      >Create</b-button
                    >
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

      subscriptions: [],

      idToEdit: null,
      isEdit: false,
      tabs: 0,
      steps: 0,
      image: null,
      previewImage: null,
      isMoveCourse: false,

      feature: '',
      learning: '',
      newSubscription: {
        name: '',
        features: [],
        active: true,
        price: 0,
        typePrice: 'monthly',
        readyForSell: true,
      },
      subscriptionsPaginate: [],
      findCourse: '',

      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'desc',
      currentPage: 1,
      perPageSubscriptions: 5,
      currentPageRequirements: 1,
      perPageRequirements: 3,
      currentPageLearnings: 1,
      perPageLearnings: 5,

      imgDefault: 'img/default-img.png',
      urlprod: process.env.VUE_APP_API_URL,
    }
  },
  methods: {
    showFeatures(features) {
      let __html = '<ul>'

      for (let feat of features) {
        __html += `<li>- <b>${feat}</b> </li>`
      }

      __html += `</ul>`

      this.$buefy.dialog.confirm({
        title: 'Features',
        message: __html,
        confirmText: 'OK',
        cancelText: 'Salir',
        type: 'is-info',
      })
    },

    moveLearning(type, index) {
      if (this.currentPageLearnings > 1) index = index + this.perPageLearnings

      if (type == 'down')
        if (this.newSubscription.learn.length - 1 != index) {
          this.newSubscription.learn = this.moveElement(
            this.newSubscription.learn,
            index,
            index + 1
          )
        }

      if (type == 'up')
        if (index > 0) {
          this.newSubscription.learn = this.moveElement(
            this.newSubscription.learn,
            index,
            index - 1
          )
        }
    },

    removeLearning(index) {
      this.newSubscription.learn.splice(index, 1)
    },

    moveRequirement(type, index) {
      if (this.currentPageRequirements > 1)
        index = index + this.perPageRequirements

      if (type == 'down')
        if (this.newSubscription.features.length - 1 != index) {
          this.newSubscription.features = this.moveElement(
            this.newSubscription.features,
            index,
            index + 1
          )
        }

      if (type == 'up')
        if (index > 0) {
          this.newSubscription.features = this.moveElement(
            this.newSubscription.features,
            index,
            index - 1
          )
        }
    },

    removeRequirement(index) {
      this.newSubscription.features.splice(index, 1)
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

    addFeature() {
      if (this.feature && this.feature != '') {
        this.newSubscription.features.push(this.feature)
        this.feature = ''
      }
    },

    addLearning() {
      if (this.learning && this.learning != '') {
        this.newSubscription.learn.push(this.learning)
        this.learning = ''
      }
    },

    preview(file) {
      this.previewImage = URL.createObjectURL(file)
    },

    async createSubscription() {
      try {
        this.isLoading = true
        this.newSubscription.createdBy = this.$cookie.get('userId')

        this.newSubscription.payments = [
          {
            price: this.newSubscription.price,
            type: this.newSubscription.typePrice,
          },
        ]

        let subscription = await axios.post(
          '/subscriptions/create',
          this.newSubscription
        )

        this.$buefy.toast.open({
          message: `Successfully created subscription!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearCourse(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error creating subscription, try again`,
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

    async listSubscriptions() {
      try {
        this.isLoading = true
        let subscriptions = await axios.post('/subscriptions/list?limit=50', {
          active: 'all',
        })
        this.subscriptions = subscriptions.data.data.subscription
        this.subscriptionsPaginate = subscriptions.data.data.subscription
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
      let subscription = this.subscriptions.find(
        (p) => p._id.toString() == courseId
      )
      this.newSubscription.title = subscription.title
      this.newSubscription.content = subscription.content
      this.newSubscription.tutor = subscription.tutor
      this.newSubscription.published = subscription.published
      this.newSubscription.price = subscription.price
      this.newSubscription.offprice = subscription.offprice
      this.newSubscription.short_description = subscription.short_description
      this.newSubscription.large_description = subscription.large_description
      this.newSubscription.learn = subscription.learn
      this.previewImage = subscription.img
      this.newSubscription.img = subscription.img
      this.newSubscription.tags = subscription.tags
      this.newSubscription.requirements = subscription.requirements

      this.tabs = 1
      this.isEdit = true
      this.idToEdit = courseId
    },

    async updatePost() {
      try {
        this.isLoading = true
        let subscription = await axios.put(
          `/educations/${this.idToEdit}`,
          this.newSubscription
        )
        if (this.image)
          await this.uploadFile(
            subscription.data.data.subscription._id.toString()
          )
        this.$buefy.toast.open({
          message: `Successfully editing subscription!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearCourse(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error editing subscription, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async beforeDeleteCourse(courseId) {
      this.$buefy.dialog.confirm({
        title: 'Deleting subscription',
        message: 'Are you sure to <b>delete</b> this subscription?',
        confirmText: 'Delete subscription',
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
          message: `Deleting subscription failed, try again, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async clearCourse(changeTab) {
      this.newSubscription.name = ''
      this.newSubscription.features = []
      this.newSubscription.active = true
      this.newSubscription.price = 0
      this.newSubscription.typePrice = 'monthly'

      this.previewImage = null
      this.image = null
      this.idToEdit = null

      if (changeTab) this.tabs = 0
      this.steps = 0

      this.isEdit = false
      await this.listSubscriptions()
    },

    find() {
      if (!this.findCourse || this.findCourse == '')
        this.subscriptionsPaginate = this.subscriptions

      this.subscriptionsPaginate = []

      let filter = new RegExp(this.findCourse.toLowerCase())
      let tempCoursesFind = this.subscriptions.filter((subscription) => {
        return filter.test(subscription.title.toLowerCase())
      })

      this.subscriptionsPaginate = tempCoursesFind
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
            message: `Moving subscription failed, try again, try again`,
            position: 'is-top',
            type: 'is-danger',
          })
        }
      }
    },

    replaceByDefault(e) {
      e.target.src = this.imgDefault
    },

    async changeReadyForSell(id, changes) {
      try {
        console.log(changes)
        this.isLoading = true
        let subscription = await axios.put(`/subscriptions/${id}`, changes)
        this.$buefy.toast.open({
          message: `Successfully editing subscription!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.listSubscriptions()
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error editing subscription, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },
  },
  created() {
    this.listSubscriptions()
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
