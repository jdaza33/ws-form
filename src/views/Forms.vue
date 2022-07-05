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
              Configuración del Formulario
            </h1>
          </div>
          <!-- Lista de articulos -->
          <div class="card contenedor sombra">
            <h1
              class="is-size-6 has-text-weight-bold has-text-centered is-uppercase has-text-primary"
            >
              Selecciona los campos a mostrar
            </h1>
            <br />

            <div class="columns">
              <div class="column is-6">
                <section>
                  <b-field
                    v-for="field in config.fields.slice(0, 6)"
                    :key="field.field"
                  >
                    <b-checkbox
                      v-model="field.show"
                      :native-value="field.show"
                      >{{ field.display }}</b-checkbox
                    >
                  </b-field>
                </section>
              </div>
              <div class="column is-6">
                <section>
                  <b-field
                    v-for="field in config.fields.slice(6, 12)"
                    :key="field.field"
                  >
                    <b-checkbox
                      v-model="field.show"
                      :native-value="field.show"
                      >{{ field.display }}</b-checkbox
                    >
                  </b-field>
                </section>
              </div>
            </div>

            <hr />
            <h1
              class="is-size-6 has-text-weight-bold has-text-centered is-uppercase has-text-primary"
            >
              Edita los nombres de los campos
            </h1>
            <br />

            <div class="columns">
              <div class="column is-6">
                <section>
                  <b-field label="Ejemplo: Distrito">
                    <b-input
                      v-model="
                        config.fields.find((c) => c.field === 'district')
                          .display
                      "
                      size="is-default"
                      type="text"
                    ></b-input>
                  </b-field>
                </section>
              </div>
              <div class="column is-6">
                <section>
                  <b-field label="Ejemplo: Ciudad">
                    <b-input
                      v-model="
                        config.fields.find((c) => c.field === 'town').display
                      "
                      size="is-default"
                      type="text"
                    ></b-input>
                  </b-field>
                </section>
              </div>
            </div>

            <hr />
            <h1
              class="is-size-6 has-text-weight-bold has-text-centered is-uppercase has-text-primary"
            >
              Datos del formulario
            </h1>

            <br />
            <div class="columns">
              <div class="column is-6">
                <section>
                  <b-field
                    :label="
                      config.fields.find((f) => f.field === 'district')
                        ? config.fields.find((f) => f.field === 'district')
                            .display
                        : 'n/a'
                    "
                  >
                    <b-taginput
                      v-model="config.district"
                      ellipsis
                      icon="label"
                      placeholder="Agrega un distrito"
                      aria-close-label="Delete this tag"
                    >
                    </b-taginput>
                  </b-field>
                </section>
              </div>
              <div class="column is-6">
                <section>
                  <b-field
                    :label="
                      config.fields.find((f) => f.field === 'town')
                        ? config.fields.find((f) => f.field === 'town').display
                        : 'n/a'
                    "
                  >
                    <b-taginput
                      v-model="config.town"
                      ellipsis
                      icon="label"
                      placeholder="Agrega una ciudad"
                      aria-close-label="Delete this tag"
                    >
                    </b-taginput>
                  </b-field>
                </section>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <section>
                  <b-field label="Preocupaciones">
                    <b-taginput
                      v-model="config.worry"
                      ellipsis
                      icon="label"
                      placeholder="Agrega una preocupación"
                      aria-close-label="Delete this tag"
                    >
                    </b-taginput>
                  </b-field>
                </section>
              </div>
              <div class="column is-6">
                <section>
                  <b-field label="¿Como ayudar?">
                    <b-taginput
                      v-model="config.howToHelp"
                      ellipsis
                      icon="label"
                      placeholder="Agrega una opcion"
                      aria-close-label="Delete this tag"
                    >
                    </b-taginput>
                  </b-field>
                </section>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <section>
                  <b-field label="Sobre tí">
                    <b-taginput
                      v-model="config.aboutMe"
                      ellipsis
                      icon="label"
                      placeholder="Agrega una opción"
                      aria-close-label="Delete this tag"
                    >
                    </b-taginput>
                  </b-field>
                </section>
              </div>
              <div class="column is-6">
                <section>
                  <b-field
                    :label="
                      config.fields.find((f) => f.field === 'country')
                        ? config.fields.find((f) => f.field === 'country')
                            .display
                        : 'n/a'
                    "
                  >
                    <b-taginput
                      v-model="config.country"
                      ellipsis
                      icon="label"
                      placeholder="Agrega una opción"
                      aria-close-label="Delete this tag"
                    >
                    </b-taginput>
                  </b-field>
                </section>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <b-field label="Video o imagen de bienvenida">
                  <b-field class="file is-primary">
                    <b-upload v-model="file" class="file-label">
                      <span class="file-cta">
                        <b-icon class="file-icon" icon="upload"></b-icon>
                        <span class="file-label">Video o imagen</span>
                      </span>
                      <span class="file-name">
                        {{ file.name || config.video }}
                      </span>
                    </b-upload>
                  </b-field>
                </b-field>
                <b-progress
                  v-show="loadingUpload > 0"
                  :value="loadingUpload"
                  show-value
                  format="percent"
                ></b-progress>
              </div>
              <div class="column is-6">
                <b-field label="Logo del formulario">
                  <b-field class="file is-primary">
                    <b-upload v-model="logo" class="file-label">
                      <span class="file-cta">
                        <b-icon class="file-icon" icon="upload"></b-icon>
                        <span class="file-label">Logo</span>
                      </span>
                      <span class="file-name">
                        {{ logo.name || config.logo }}
                      </span>
                    </b-upload>
                  </b-field>
                </b-field>
                <b-progress
                  v-show="loadingUploadLogo > 0"
                  :value="loadingUploadLogo"
                  show-value
                  format="percent"
                ></b-progress>
              </div>
            </div>
            <div class="columns">
              <div class="column is-12">
                <section>
                  <b-field label="Frase">
                    <b-input
                      v-model="config.phrase"
                      placeholder="Escribe una frase"
                      size="is-default"
                      type="text"
                    ></b-input>
                  </b-field>
                </section>
              </div>
            </div>
            <div class="boton">
              <b-button
                @click="updateConfig()"
                id="btn"
                size="is-large"
                class="is-tplanet is-uppercase is-size-6 has-text-weight-bold button-style"
                >GUARDAR</b-button
              >
            </div>
          </div>

          <!-- FIN -->
        </div>
      </div>
    </section>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import axios from '../config/axios.js'
import * as filestack from 'filestack-js'

export default {
  data() {
    return {
      isLoading: false,
      isFullPage: true,
      clientFilestack: null,
      file: {},
      logo: {},
      loadingUpload: 0,
      loadingUploadLogo: 0,
      groupId: null,

      config: {
        istrict: [],
        town: [],
        worry: [],
        howToHelp: [],
        aboutMe: [],
        video: '',
        logo: '',
        phrase: '',
        fields: [],
      },

      imgDefault: 'img/default-img.png',
      urlprod: process.env.VUE_APP_API_URL,
    }
  },
  methods: {
    msToDate(ms) {
      const date = new Date(ms)
      return date.toLocaleString()
    },

    async listConfig() {
      try {
        this.isLoading = true
        const { data } = await axios.post('/forms/list', {
          groupId: this.groupId,
        })
        this.config = data.form
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error al obtener lista de configuraciones`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async updateConfig() {
      try {
        this.isLoading = true
        if (this.file.name) await this.uploadFile()
        if (this.logo.name) await this.uploadLogo()

        await axios.put(`/forms/${this.groupId}`, this.config)
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error al editar lista de configuraciones`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async uploadFile() {
      this.isLoading = true
      this.loadingUpload = 1
      return new Promise((resolve, reject) => {
        this.loadingUpload = 1
        this.clientFilestack
          .upload(
            this.file,
            {
              onProgress: (obj) => (this.loadingUpload = obj.totalPercent),
            },
            {},
            {}
          )
          .then((res) => {
            this.isLoading = false
            this.config.video = res.url
            this.file = {}
            this.loadingUpload = 0
            return resolve(true)
          })
          .catch((err) => {
            this.isLoading = false
            this.loadingUpload = 0
            this.$buefy.toast.open({
              message: `Error al subir video, intente de nuevo`,
              position: 'is-top',
              type: 'is-danger',
            })
            console.log(err)
            return reject(err)
          })
      })
    },
    async uploadLogo() {
      this.isLoading = true
      this.loadingUploadLogo = 1
      return new Promise((resolve, reject) => {
        this.loadingUploadLogo = 1
        this.clientFilestack
          .upload(
            this.logo,
            {
              onProgress: (obj) => (this.loadingUploadLogo = obj.totalPercent),
            },
            {},
            {}
          )
          .then((res) => {
            this.isLoading = false
            this.config.logo = res.url
            this.logo = {}
            this.loadingUploadLogo = 0
            return resolve(true)
          })
          .catch((err) => {
            this.isLoading = false
            this.loadingUploadLogo = 0
            this.$buefy.toast.open({
              message: `Error al subir logo, intente de nuevo`,
              position: 'is-top',
              type: 'is-danger',
            })
            console.log(err)
            return reject(err)
          })
      })
    },
  },
  created() {
    this.groupId = this.$cookie.get('group')
    this.listConfig()
    this.clientFilestack = filestack.init('AEqv8zzjoTnEaIQiO7H9kz')
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

.boton {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
