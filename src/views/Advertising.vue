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
              Advertising
            </h1>
          </div>
          <!-- Buscador -->
          <div class="buscador">
            <b-field horizontal grouped position="is-center">
              <b-input
                @keyup.native="find"
                v-model="findAd"
                placeholder="Search ads"
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
          <!-- Lista de publicidades -->
          <b-tabs type="is-boxed" position="is-centered" v-model="tabs">
            <b-tab-item label="List" icon-pack="fas" icon="align-left">
              <div class="card contenedor sombra">
                <div class="columns is-multiline is-centered">
                  <a
                    v-for="(ad, index) in adsPaginate[current - 1]"
                    :key="index"
                  >
                    <div class="column is-narrow">
                      <div class="card caja sub-sombra">
                        <div class="card-content">
                          <div class="profile">
                            <figure class="profile-circle">
                              <img
                                :src="ad.image ? ad.image : 'http://hola.com'"
                                @error="replaceByDefault"
                                class="profile-pic"
                              />
                            </figure>
                          </div>
                          <br />
                          <div class="has-text-centered">
                            <h1 class="has-text-weight-bold has-text-info">
                              {{
                                ad.name.length > 20
                                  ? ad.name.substring(0, 17) + '...'
                                  : ad.name
                              }}
                            </h1>
                          </div>
                        </div>
                        <footer class="card-footer">
                          <a
                            class="card-footer-item"
                            @click="beforeDeleteAd(ad._id)"
                            ><b-icon
                              pack="fas"
                              type="is-danger"
                              icon="trash-alt"
                              size="is-small"
                            >
                            </b-icon
                          ></a>
                          <a @click="editAd(ad._id)" class="card-footer-item"
                            ><b-icon
                              pack="fas"
                              type="is-info"
                              icon="edit"
                              size="is-small"
                            >
                            </b-icon
                          ></a>
                        </footer>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <hr />
              <div>
                <b-pagination
                  :total="totalPages"
                  :current.sync="current"
                  :order="order"
                  :size="size"
                  :simple="isSimple"
                  :rounded="isRounded"
                  :per-page="perPage"
                  aria-next-label="Next page"
                  aria-previous-label="Previous page"
                  aria-page-label="Page"
                  aria-current-label="Current page"
                ></b-pagination>
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
                    <div class="column is-12">
                      <b-field
                        label="Posts:"
                        :label-position="labelPosition"
                        grouped
                      >
                        <b-taginput
                          v-model="newAd.postId"
                          :data="filtersPosts"
                          autocomplete
                          :allow-new="false"
                          :open-on-focus="openOnFocus"
                          field="title"
                          icon="label"
                          placeholder="Add a post"
                          @typing="getFilteredTags"
                          expanded
                        >
                        </b-taginput>
                        <p class="control">
                          <b-button
                            rounded
                            type="is-info"
                            class="has-text-weight-bold"
                            @click="addAllPost"
                          >
                            Add all post
                          </b-button>
                        </p>
                      </b-field>
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-6">
                      <b-field label="Name:" :label-position="labelPosition">
                        <b-input
                          v-model="newAd.name"
                          placeholder="Course or Services"
                        ></b-input>
                      </b-field>

                      <b-field label="URL 1:" :label-position="labelPosition">
                        <b-input
                          v-model="newAd.url"
                          placeholder="https://tradersplanet.us/ ..."
                        ></b-input>
                      </b-field>

                      <b-field label="Image 1:">
                        <div class="card">
                          <div class="card-image">
                            <figure class="image is-1by1">
                              <!-- <img
                                src="img/image_2000.svg"
                                alt="Placeholder image"
                              /> -->
                              <img :src="previewImage" />
                            </figure>
                          </div>
                          <footer class="card-footer">
                            <a class="card-footer-item">
                              <b-upload v-model="image" @input="preview">
                                <a class="button is-primary">
                                  <b-icon icon="upload"></b-icon>
                                  <span>Click to upload</span>
                                </a>
                              </b-upload>
                            </a>
                          </footer>
                        </div>
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <b-field
                        label="Testimony:"
                        :label-position="labelPosition"
                      >
                        <b-autocomplete
                          v-model="tmpTestimony"
                          placeholder="Add a testimony"
                          :keep-first="false"
                          :open-on-focus="openOnFocus"
                          :data="getFilteredTestimonies"
                          field="abrv"
                          @select="(option) => (newAd.testimonyId = option)"
                        >
                        </b-autocomplete>
                      </b-field>
                      <b-field label="URL 2:" :label-position="labelPosition">
                        <b-input
                          v-model="newAd.urlTwo"
                          placeholder="https://tradersplanet.us/ ..."
                        ></b-input>
                      </b-field>

                      <b-field label="Image 2:">
                        <div class="card">
                          <div class="card-image">
                            <figure class="image is-1by1">
                              <img :src="previewImageTwo" />
                            </figure>
                          </div>
                          <footer class="card-footer">
                            <a class="card-footer-item">
                              <b-upload v-model="imageTwo" @input="previewTwo">
                                <a class="button is-primary">
                                  <b-icon icon="upload"></b-icon>
                                  <span>Click to upload</span>
                                </a>
                              </b-upload>
                            </a>
                          </footer>
                        </div>
                      </b-field>
                    </div>
                  </div>
                  <div class="columns">
                    <div class="column is-12"></div>
                  </div>
                  <hr />
                  <div class="encabezado">
                    <b-button
                      @click="clearAd(false)"
                      rounded
                      type="is-info"
                      class="has-text-weight-bold"
                      >Clear All</b-button
                    >
                    <b-button
                      @click="isEdit ? updateAd() : createAd()"
                      rounded
                      type="is-success"
                      class="has-text-weight-bold"
                      >Finish</b-button
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
// import UsersDetails from './UsersDetails.vue'
// import UserClassification from './UsersClassification'
import { VueEditor } from 'vue2-editor'
import axios from '../config/axios.js'

export default {
  //   components: { UsersDetails, UserClassification },
  components: { VueEditor },
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      op: 'panel',
      current: 1,
      perPage: 4,
      totalPages: 0,
      order: 'is-centered',
      size: 'is-small',
      isSimple: false,
      isRounded: false,
      openOnFocus: true,

      labelPosition: 'on-border',

      idToEdit: null,
      isEdit: false,
      tabs: 0,
      steps: 0,
      image: null,
      imageTwo: null,
      previewImage: 'img/image_2000.svg',
      previewImageTwo: 'img/image_2000.svg',
      newAd: {
        name: '',
        image: null,
        imageTwo: null,
        url: '',
        urlTwo: '',
        postId: [],
        testimonyId: '',
      },
      ads: [],
      adsPaginate: [],
      findAd: '',
      posts: [],
      filtersPosts: [],
      testimonies: [],
      tmpTestimony: '',

      typeNew: '',
      selectNew: '',
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'desc',
      currentPage: 1,
      perPageCompany: 5,
      imgDefault: 'img/default-img.png',
      urlprod: process.env.VUE_APP_API_URL,
    }
  },
  computed: {
    getFilteredTestimonies() {
      return this.testimonies.filter((option) => {
        return (
          option.abrv
            .toString()
            .toLowerCase()
            .indexOf(this.tmpTestimony.toLowerCase()) >= 0
        )
      })
    },
  },
  methods: {
    preview(file) {
      this.previewImage = URL.createObjectURL(file)
    },
    previewTwo(file) {
      this.previewImageTwo = URL.createObjectURL(file)
    },

    getFilteredTags(text) {
      this.filtersPosts = this.posts.filter((d) => {
        return (
          d.title
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        )
      })
    },

    addAllPost() {
      this.newAd.postId = [...this.posts]
    },

    async createAd() {
      try {
        this.isLoading = true
        console.log(this.newAd)
        let ad = await axios.post('/advertisings/create', this.newAd)
        await this.uploadFile(ad.data.data.advertising._id.toString(), 1)
        await this.uploadFile(ad.data.data.advertising._id.toString(), 2)
        this.$buefy.toast.open({
          message: `Successfully created advertising!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearAd(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error creating advertising, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async uploadFile(adId, op) {
      try {
        if (this.image || this.imageTwo) {
          let data = new FormData()
          if (op == 1) data.append('file', this.image)
          else data.append('file', this.imageTwo)
          await axios.post(`/advertisings/upload/image/${adId}/${op}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async listAds() {
      try {
        this.isLoading = true
        let ads = await axios.post('/advertisings/list', {})
        this.ads = ads.data.data.advertising
        this.paginate()
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

    async listPosts() {
      try {
        this.isLoading = true
        let post = await axios.post('/posts/list', {})
        this.posts = post.data.data.post
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

    async listTestimonies() {
      try {
        this.isLoading = true
        let testimonies = await axios.post('/testimonies/list', {})
        this.testimonies = testimonies.data.data.testimony
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

    editAd(adId) {
      let ad = this.ads.find((a) => a._id.toString() == adId)
      this.newAd.name = ad.name
      this.newAd.url = ad.url
      this.newAd.urlTwo = ad.urlTwo
      this.newAd.postId = ad.postId
      this.newAd.testimonyId = ad.testimonyId
      this.previewImage = ad.image
      this.previewImageTwo = ad.imageTwo
      this.newAd.image = ad.image
      this.newAd.imageTwo = ad.imageTwo
      this.tmpTestimony = ad.testimonyId.abrv

      this.tabs = 1
      this.isEdit = true
      this.idToEdit = ad._id
    },

    async updateAd() {
      try {
        this.isLoading = true
        let ad = await axios.put(`/advertisings/${this.idToEdit}`, this.newAd)
        
        if (this.image)
          await this.uploadFile(ad.data.data.advertising._id.toString(), 1)

        if (this.imageTwo)
          await this.uploadFile(ad.data.data.advertising._id.toString(), 2)

        this.$buefy.toast.open({
          message: `Successfully editing advertising!`,
          position: 'is-top',
          type: 'is-success',
        })
        await this.clearAd(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error editing advertising, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async clearAd(changeTab) {
      this.newAd.name = ''
      this.newAd.image = null
      this.newAd.imageTwo = null
      this.newAd.url = ''
      this.newAd.urlTwo = ''
      this.newAd.postId = []
      this.newAd.testimonyId = ''
      this.previewImage = 'img/image_2000.svg'
      this.previewImageTwo = 'img/image_2000.svg'
      this.image = null
      this.imageTwo = null
      this.idToEdit = null
      this.tmpTestimony = ''

      if (changeTab) this.tabs = 0
      this.steps = 0

      this.isEdit = false
      await this.listAds()
    },

    async beforeDeleteAd(adId) {
      this.$buefy.dialog.confirm({
        title: 'Deleting advertising',
        message: 'Are you sure to <b>delete</b> this advertising?',
        confirmText: 'Delete advertising',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteAd(adId),
      })
    },

    async deleteAd(adId) {
      try {
        this.isLoading = true
        await axios.delete(`/advertisings/${adId}`)
        await this.clearAd(true)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Deleting advertising failed, try again, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    paginate() {
      this.current = 1
      this.totalPages = this.ads.length
      let limit = this.perPage
      this.adsPaginate = []
      let acum = 0
      let acumAll = 0
      let temp = []
      let lastItem = this.ads.length - 1
      for (let item of this.ads) {
        if (acum < limit) {
          temp.push(item)
          acum += 1
        } else {
          this.adsPaginate.push(temp)
          temp = []
          acum = 1
          temp.push(item)
        }
        if (lastItem == acumAll) {
          this.adsPaginate.push(temp)
        }
        acumAll += 1
      }
    },

    find() {
      if (!this.findAd || this.findAd == '') return this.paginate()

      this.adsPaginate = []
      this.current = 1

      let filter = new RegExp(this.findAd.toLowerCase())
      let tempAdFind = this.ads.filter((ad) => {
        return filter.test(ad.name.toLowerCase())
      })

      this.totalPages = tempAdFind.length

      let limit = this.perPage
      let acum = 0
      let acumAll = 0
      let temp = []
      let lastItem = tempAdFind.length - 1
      for (let item of tempAdFind) {
        if (acum < limit) {
          temp.push(item)
          acum += 1
        } else {
          this.adsPaginate.push(temp)
          temp = []
          acum = 1
          temp.push(item)
        }
        if (lastItem == acumAll) {
          this.adsPaginate.push(temp)
        }
        acumAll += 1
      }
    },
    replaceByDefault(e) {
      e.target.src = this.imgDefault
    },
  },
  created() {
    this.listAds()
    this.listPosts()
    this.listTestimonies()
  },
}
</script>

<style scoped>
.section {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f5f5;
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

/* .button {
  padding: 9px 35px 26px 35px;
  border-radius: 2em;
} */

.contenedor {
  background-color: white;
  padding: 40px;
  border-radius: 0.5em;
  display: flex;
  justify-content: center;
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
