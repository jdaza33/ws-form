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
              Subscribers
            </h1>
          </div>

          <!-- Buscador -->
          <div class="buscador">
            <b-field horizontal grouped position="is-centered">
              <b-input
                placeholder="Search"
                icon-pack="fas"
                icon="search"
                v-model="findSubscriber"
                @keyup.native="find"
              ></b-input>
              <p class="control">
                <b-button rounded type="is-info" class="has-text-weight-bold"
                  >Search</b-button
                >
              </p>
            </b-field>
          </div>
          <!-- Contenido -->
          <b-tabs type="is-boxed" position="is-centered" v-model="activeTab">
            <!-- Lista de Suscriptores -->
            <b-tab-item label="List" icon-pack="fas" icon="align-left">
              <div class="card contenedor sombra">
                <div class="columns is-multiline is-centered">
                  <!-- <a v-for="(member, index) in this.members" :key="index"> -->
                  <b-table
                    :data="membersPaginate"
                    :paginated="isPaginated"
                    :per-page="perPageMembers"
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
                      <b-table-column sortable field="name" label="Name"
                        >{{ props.row.name.split(' ', 1).toString() }}
                        {{
                          props.row.lastname
                            .split(' ', 2)
                            .toString()
                            .replace(',', ' ')
                        }}</b-table-column
                      >

                      <b-table-column sortable field="email" label="Email"
                        >{{ props.row.email }}
                      </b-table-column>

                      <b-table-column sortable field="expire" label="Expire">
                        <b-taglist attached>
                          <b-tag
                            type="is-success"
                            v-if="
                              props.row.expSub && props.row.expSub > Date.now()
                            "
                            >{{ msToDate(props.row.expSub) }}</b-tag
                          >
                          <b-tag type="is-danger" v-else>Expired</b-tag>
                        </b-taglist>
                      </b-table-column>

                      <b-table-column sortable field="status" label="Status">
                        <b-taglist attached>
                          <b-tag
                            :type="
                              props.row.statusSub == 'active'
                                ? 'is-success'
                                : props.row.statusSub == 'active|canceled'
                                ? 'is-dark'
                                : 'is-danger'
                            "
                            >{{ props.row.statusSub }}</b-tag
                          >
                        </b-taglist>
                      </b-table-column>

                      <b-table-column
                        sortable
                        field="DiscordUser"
                        label="Username"
                      >
                        <strong>{{
                          props.row.discordUsername
                            ? props.row.discordUsername
                            : 'n/a'
                        }}</strong>
                      </b-table-column>

                      <b-table-column
                        sortable
                        field="createdAt"
                        label="Created"
                      >
                        <b-taglist attached>
                          <b-tag type="is-info">{{
                            msToDate(props.row.createdSub)
                          }}</b-tag>
                        </b-taglist>
                      </b-table-column>

                      <b-table-column
                        sortable
                        field="typeSub"
                        label="Plan|Price"
                        width="140"
                      >
                        <b-taglist attached>
                          <b-tag type="is-dark">{{ props.row.typeSub }}</b-tag>
                          <b-tag type="is-info">{{ props.row.amoutPay }}</b-tag>
                        </b-taglist>
                      </b-table-column>

                      <b-table-column
                        field="events"
                        label="Events"
                        centered
                        width="150"
                      >
                        <a
                          @click="
                            beforeAction(
                              'Enviar invitación',
                              '¿Desea reenviar la invitación de discord?',
                              'is-success',
                              1,
                              props.row._id.toString()
                            )
                          "
                          class="btn-events"
                        >
                          <b-tooltip
                            label="Enviar invitación"
                            position="is-bottom"
                          >
                            <b-icon
                              pack="fas"
                              type="is-success"
                              icon="paper-plane"
                              size="is-small"
                            >
                            </b-icon>
                          </b-tooltip>
                        </a>
                        <a
                          @click="
                            beforeAction(
                              'Expulsar de Discord',
                              '¿Desea expulsar de discord a este usuario?',
                              'is-dark',
                              2,
                              props.row._id.toString()
                            )
                          "
                          class="btn-events"
                          v-show="props.row.discordId"
                        >
                          <b-tooltip
                            label="Expulsar de Discord"
                            position="is-bottom"
                          >
                            <b-icon
                              pack="fas"
                              type="is-dark"
                              icon="sign-out-alt"
                              size="is-small"
                            >
                            </b-icon>
                          </b-tooltip>
                        </a>
                        <a
                          @click="
                            beforeAction(
                              'Cancelar suscripción',
                              '¿Desea cancelar la suscripción de este usuario?',
                              'is-danger',
                              3,
                              props.row._id.toString()
                            )
                          "
                          class="btn-events"
                          v-show="
                            props.row.statusSub !== 'canceled' &&
                              props.row.statusSub !== 'finalized' &&
                              props.row.statusSub !== 'active|canceled'
                          "
                        >
                          <b-tooltip
                            label="Cancelar suscripción"
                            position="is-bottom"
                          >
                            <b-icon
                              pack="fas"
                              type="is-danger"
                              icon="user-times"
                              size="is-small"
                            >
                            </b-icon>
                          </b-tooltip>
                        </a>
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
                              <b-taglist attached>
                                <b-tag type="is-dark">Discord username</b-tag>
                                <b-tag type="is-info">{{
                                  props.row.discordUsername
                                    ? props.row.discordUsername
                                    : 'n/a'
                                }}</b-tag>
                              </b-taglist>

                              <b-taglist attached>
                                <b-tag type="is-dark">CreatedAt</b-tag>
                                <b-tag type="is-info">{{
                                  msToDate(props.row.createdSub)
                                }}</b-tag>
                              </b-taglist>
                              <!-- <small>Telf. {{ props.row.phone }}</small> -->
                              <!-- <br /> -->
                              <!-- {{ `${props.row.content.substring(0, 200)} ...` }} -->
                            </p>
                          </div>
                        </div>
                      </article>
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
                          <p>Empty list</p>
                        </div>
                      </section>
                    </template>
                  </b-table>
                </div>
              </div>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </section>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import axios from '../config/axios.js'
import SubscriberDetailsModal from '@/components/SubscriberDetailsModal'
import moment from 'moment'

export default {
  components: {
    SubscriberDetailsModal,
  },
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      members: [],
      membersPaginate: [],
      imgDefault: 'img/user.svg',
      isEdit: false,
      findSubscriber: '',
      idToEdit: null,
      passwordTemp: '',

      current: 1,
      totalPages: 0,
      perPage: 4,
      order: 'is-centered',
      size: 'is-small',
      isSimple: false,
      isRounded: false,

      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'desc',
      currentPage: 1,
      currentPagePending: 1,
      perPageMembers: 5,
      perPageTestimoniesPending: 5,

      defaultOpenedDetails: [1],
      defaultOpenedDetailsPending: [1],
      showDetailIcon: false,

      labelPosition: 'on-border',
      activeTab: 0,
      steps: 0,
      isEdit: false,

      newSubscriber: {
        name: '',
        lastname: '',
        gender: '',
        phone: '',
        email: '',
        password: '',
        subscription: true,
        active: true,
        role: 'auditor',
      },
    }
  },
  methods: {
    async forwardEmail(id) {
      try {
        this.isLoading = true
        await axios.get(`/subscriptions/forward-email/${id}`)
        this.isLoading = false

        await this.listSubscribers()

        this.$buefy.toast.open({
          message: `Mail sent successfully`,
          position: 'is-top',
          type: 'is-success',
        })
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
    async leaveDiscord(id) {
      try {
        this.isLoading = true
        await axios.delete(`/discord/leave-user/${id}`)
        this.isLoading = false

        await this.listSubscribers()

        this.$buefy.toast.open({
          message: `Usuario expulsado con éxito`,
          position: 'is-top',
          type: 'is-success',
        })
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

    async cancelSubscription(id) {
      try {
        this.isLoading = true
        await axios.delete(`/users/${id}/delete/subscription`)
        this.isLoading = false

        await this.listSubscribers()

        this.$buefy.toast.open({
          message: `Suscripción cancelada con éxito`,
          position: 'is-top',
          type: 'is-success',
        })
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

    msToDate(ms) {
      return moment(parseInt(ms)).format('ll')
    },

    async listSubscribers() {
      try {
        this.isLoading = true
        let { data } = await axios.get('/users/subscriptions/all?limit=1000')
        this.members = data.data.user
        this.membersPaginate = data.data.user
        // this.paginate()
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
    replaceByDefault(e) {
      e.target.src = this.imgDefault
    },
    async clearFields(changeTab) {
      this.newSubscriber.name = ''
      this.newSubscriber.lastname = ''
      this.newSubscriber.gender = ''
      this.newSubscriber.phone = ''
      this.newSubscriber.email = ''
      this.newSubscriber.password = ''

      if (changeTab) this.activeTab = 0
      else {
        this.$buefy.toast.open({
          message: 'The fields have been cleaned!',
          type: 'is-success',
          position: 'is-top',
        })
      }
      this.steps = 0

      this.isEdit = false

      await this.listSubscribers()
    },
    async createSubscriber() {
      try {
        this.isLoading = true
        this.newSubscriber
        let res = await axios.post('/users/create', this.newSubscriber)
        this.$buefy.toast.open({
          message: `Successfully created new subscriber!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearFields(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error creating subscriber, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },
    editSubscriber(id) {
      let subscriber = this.members.find((p) => p._id.toString() == id)

      this.newSubscriber.name = subscriber.name
      this.newSubscriber.lastname = subscriber.lastname
      this.newSubscriber.gender = subscriber.gender
      this.newSubscriber.phone = subscriber.phone
      this.newSubscriber.email = subscriber.email
      this.passwordTemp = subscriber.password
      this.newSubscriber.subscription = subscriber.subscription

      this.activeTab = 1
      this.isEdit = true
      this.idToEdit = id
    },
    async updateSubscriber() {
      try {
        this.isLoading = true

        //Si cambia la suscripción se actualiza active
        if (this.newSubscriber.subscription === false) {
          this.newSubscriber.active = false
        } else {
          this.newSubscriber.active = true
        }

        //Si no cambia el campo contraseña, se debe mantener la misma
        if (
          this.newSubscriber.password == '' ||
          this.newSubscriber.password == null
        ) {
          this.newSubscriber.password = this.passwordTemp
        }

        let up = await axios.put(`/users/${this.idToEdit}`, this.newSubscriber)

        this.$buefy.toast.open({
          message: `Changes have been saved successfully`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearFields(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error updating subscriber, please try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    find() {
      if (!this.findSubscriber || this.findSubscriber == '')
        this.membersPaginate = this.members

      this.membersPaginate = []

      let filter = new RegExp(this.findSubscriber.toLowerCase())
      let temp = this.members.filter((member) => {
        return (
          filter.test(member.name && member.name.toLowerCase()) ||
          filter.test(member.email && member.email.toLowerCase()) ||
          filter.test(
            member.discordUsername && member.discordUsername.toLowerCase()
          )
        )
      })

      this.membersPaginate = temp
    },

    _find() {
      if (!this.findSubscriber || this.findSubscriber == '')
        return this.paginate()

      this.membersPaginate = []
      this.current = 1

      let filter = new RegExp(this.findSubscriber.toLowerCase())
      let tempSubsFind = this.members.filter((member) => {
        return filter.test(member.name.toLowerCase())
      })

      this.totalPages = tempSubsFind.length

      let limit = this.perPage
      let acum = 0
      let acumAll = 0
      let temp = []
      let lastItem = tempSubsFind.length - 1
      for (let item of tempSubsFind) {
        if (acum < limit) {
          temp.push(item)
          acum += 1
        } else {
          this.membersPaginate.push(temp)
          temp = []
          acum = 1
          temp.push(item)
        }
        if (lastItem == acumAll) {
          this.membersPaginate.push(temp)
        }
        acumAll += 1
      }
    },
    paginate() {
      this.current = 1
      this.totalPages = this.members.length
      let limit = this.perPage
      this.membersPaginate = []
      let acum = 0
      let acumAll = 0
      let temp = []
      let lastItem = this.members.length - 1
      for (let item of this.members) {
        if (acum < limit) {
          temp.push(item)
          acum += 1
        } else {
          this.membersPaginate.push(temp)
          temp = []
          acum = 1
          temp.push(item)
        }
        if (lastItem == acumAll) {
          this.membersPaginate.push(temp)
        }
        acumAll += 1
      }
    },
    async goBack() {
      this.activeTab = 0
      this.isEdit = false
      await this.listSubscribers()
    },
    cardModal() {
      this.$buefy.modal.open({
        parent: this,
        component: SubscriberDetailsModal,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      })
    },
    beforeAction(title, message, type, op, id) {
      this.$buefy.dialog.confirm({
        title,
        message,
        confirmText: 'Aceptar',
        cancelText: 'Cancelar',
        type,
        hasIcon: true,
        onConfirm: () =>
          op === 1
            ? this.forwardEmail(id)
            : op === 2
            ? this.leaveDiscord(id)
            : this.cancelSubscription(id),
      })
    },
  },
  created() {
    this.listSubscribers()
  },
}
</script>

<style scoped>
/* este encabezado se puede colocar en la parte generica */
.encabezado {
  display: flex;
  justify-content: center;
  margin-bottom: 2em;
}

.buscador {
  margin-bottom: 1.5em;
}

.contenedor {
  background-color: white;
  padding: 40px;
  border-radius: 0.5em;
  display: flex;
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

/* ----------------- */

.section {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f5f5;
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
  border-width: 3px;
}

.profile-pic {
  width: 100%;
}

.caja {
  background-color: #f3f6fd;
  padding: 0px 20px 0px 20px;
  border-radius: 0.5em;
}

.sub-sombra {
  -webkit-box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
  -moz-box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
  box-shadow: -4px 5px 11px -6px rgba(0, 0, 0, 0.37);
}

.space-bottom {
  margin-bottom: 0.25em;
}

.center-tag {
  display: flex;
  justify-content: center;
}

.container-create {
  background-color: white;
  padding: 20px;
  border-radius: 0.5em;
  justify-content: center;
  align-items: center;
  margin-bottom: 4em;
}

.new-button-section {
  display: flex;
  justify-content: center;
}

.button {
  min-width: 120px;
}

.btn-events {
  margin-right: 10px;
}
</style>
