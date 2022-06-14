<template>
  <section
    class="hero is-fullheight"
    style="background-image: url('./img/fondo.png');"
  >
    <div class="columns is-centered">
      <div class="column is-narrow">
        <div class="card contenedor sombra">
          <div class="card-content">
            <figure class="logo-content">
              <img src="img/logo.png" class="logo" />
            </figure>
            <div class="text">
              <p class="has-text-centered has-text-weight-semibold">
                Please, enter your email to recover
                <br />the password:
              </p>
            </div>
            <!-- Input -->
            <div class="i-email">
              <input
                type="email"
                v-model="email"
                class="input input-style"
                placeholder="Email"
                size="is-large"
              />
            </div>
            <!-- Boton -->
            <div class="boton">
              <b-button
                rounded
                expanded
                size="is-large"
                @click="sendEmail"
                class="is-tplanet is-size-6 has-text-weight-bold"
                >RESTORE PASSWORD</b-button
              >
            </div>
            <div class="foot">
              <div class="has-text-centered is-size-6">
                <a @click="goHome">
                  <b-icon
                    pack="fas"
                    icon="arrow-left"
                    size="is-small"
                    type="is-purple"
                    class="icons"
                  ></b-icon
                  >Go back
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import axios from '../config/axios'
export default {
  data() {
    return {
      email: '',
      isLoading: false,
      isFullPage: true,
    }
  },
  methods: {
    goHome() {
      this.$router.push({ path: '/login' })
    },
    async sendEmail() {
      try {
        this.isLoading = true
        await axios.post('/users/reset', {
          email: this.email,
        })
        this.isLoading = false
        this.email = ''
        this.$buefy.toast.open({
          message: `Password sent, check your email`,
          position: 'is-top',
          type: 'is-success',
        })
      } catch (error) {
        console.log(error)
        this.isLoading = false
        this.$buefy.toast.open({
          message: `Error sending email, try again`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },
  },
}
</script>

<style scoped>
section {
  font-family: 'Poppins', sans-serif;
  background-repeat: no-repeat;
  background-color: #f5f4f9;
  background-position: center;
  background-size: cover;
  /*Nuevo*/
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-content {
  padding-top: 0px;
}

.contenedor {
  padding: 0px 35px 35px 35px;
  border-radius: 0.5em;
}

.sombra {
  -webkit-box-shadow: 0px 0px 26px -8px rgba(102, 106, 115, 1);
  -moz-box-shadow: 0px 0px 26px -8px rgba(102, 106, 115, 1);
  box-shadow: 0px 0px 26px -8px rgba(102, 106, 115, 1);
}

.logo-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 12em;
  margin: 2em;
}

.text {
  margin-top: 20px;
  color: #707070;
}

.i-email {
  margin-top: 20px;
}

.input-style {
  padding: 25px;
  margin-top: 10px;
  border-radius: 0.5em;
}

.boton {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.button {
  padding-top: 22px;
  padding-bottom: 22px;
}

.icons {
  margin-right: 5px;
}
</style>
