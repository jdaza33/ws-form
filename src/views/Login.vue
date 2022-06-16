<template>
  <section
    class="hero is-fullheight"
    style="background-image: url('./img/fondo.png');"
  >
    <!-- Hero body -->
    <div class="hero-body">
      <div class="container">
        <div class="columns is-multiline is-centered">
          <div class="column is-narrow">
            <figure class="figure-container">
              <img src="/img/logo.png" class="logo" />
            </figure>
          </div>
        </div>
        <div class="columns is-centered">
          <div class="column is-one-third">
            <div class="sombra">
              <b-input
                v-model="username"
                placeholder=" Email"
                ref="username"
                size="is-large"
                type="email"
                @keyup.enter.native="login"
              ></b-input>
              <b-input
                v-model="password"
                placeholder=" Password"
                size="is-large"
                type="password"
                @keyup.enter.native="login"
                password-reveal
              ></b-input>
            </div>
            <div class="boton">
              <b-button
                @click="login"
                id="btn"
                size="is-large"
                class="is-tplanet is-uppercase is-size-6 has-text-weight-bold button-style"
                >Login</b-button
              >
            </div>
          </div>
        </div>
        <!-- footer -->
        <!-- <div class="foot">
          <div class="content has-text-centered is-size-6">
            <p>
              Did you forget your password?
              <u>
                <a @click="goResetPassword">Click here</a>
              </u>
            </p>
          </div>
        </div> -->
      </div>
    </div>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import axios from '../config/axios.js'

export default {
  data() {
    return {
      username: '',
      password: '',
      isLoading: false,
      isFullPage: true,
    }
  },
  created() {},
  mounted() {
    this.$refs.username.focus()
  },
  methods: {
    login() {
      this.isLoading = true
      axios
        .post('/users/login', {
          username: this.username,
          password: this.password,
        })
        .then(({ data }) => {
          this.isLoading = false
          this.$cookie.set('token', data.token)
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${data.token}`
          this.setCookies(data.user)
          this.$router.push({ path: '/admins' })
        })
        .catch((err) => {
          console.log(err)
          this.isLoading = false
          this.$buefy.toast.open({
            message: `Login failed, try again`,
            position: 'is-top',
            type: 'is-danger',
          })
        })
    },
    goResetPassword() {
      this.$router.push({ path: '/reset-password' })
    },
    setCookies({ name, username, role, _id }) {
      this.$cookie.set('name', name)
      this.$cookie.set('username', username)
      this.$cookie.set('rol', role)
      this.$cookie.set('userId', _id)
    },
  },
}
</script>

<style scoped>
section {
  font-family: 'Poppins', sans-serif;
  background-repeat: no-repeat;
  background-color: #f9f7f4;
  background-position: center;
  background-size: cover;
}

.figure-container {
  margin-bottom: 0px;
}

.logo {
  width: 15em;
}

.sombra {
  -webkit-box-shadow: 0px 0px 26px -8px rgba(102, 106, 115, 1);
  -moz-box-shadow: 0px 0px 26px -8px rgba(102, 106, 115, 1);
  box-shadow: 0px 0px 26px -8px rgba(102, 106, 115, 1);
}

.boton {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.button-style {
  padding: 25px 50px 25px 50px;
}

.foot {
  margin-top: 60px;
  margin-bottom: 0px;
}
</style>
