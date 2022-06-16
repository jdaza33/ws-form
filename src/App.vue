<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from './config/axios.js'
export default {
  created() {
    const token = this.$cookie.get('token')
    if (token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
}
</script>

<style lang="scss">
// Import Bulma's core

@import '~bulma/sass/utilities/_all';

// Set your colors
$primary: #03d88d;
$primary-invert: findColorInvert($primary);
$twitter: #f3f6fd;
$twitter-invert: findColorInvert($twitter);
$info: #687fe5;
$info-invert: findColorInvert($info);
$purple: #5d39db;
$tplanet: #03d88d;
$tplanet-invert: findColorInvert($tplanet);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  'white': (
    $white,
    $black,
  ),
  'black': (
    $black,
    $white,
  ),
  'light': (
    $light,
    $light-invert,
  ),
  'dark': (
    $dark,
    $dark-invert,
  ),
  'primary': (
    $primary,
    $primary-invert,
  ),
  'info': (
    $info,
    $info-invert,
  ),
  'success': (
    $success,
    $success-invert,
  ),
  'warning': (
    $warning,
    $warning-invert,
  ),
  'danger': (
    $danger,
    $danger-invert,
  ),
  'twitter': (
    $twitter,
    $twitter-invert,
  ),
  'purple': (
    $purple,
    $purple-invert,
  ),
  'tplanet': (
    $tplanet,
    $tplanet-invert,
  ),
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

$table-striped-row-even-background-color: #f3f6fd;
$table-striped-row-even-hover-background-color: red;

// Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';
</style>

<style>
/* .contenedor {
  background-color: white;
  padding: 40px;
  border-radius: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4em;
} */

.sombra {
  margin-top: 0px;
  margin-bottom: 0px;
  -webkit-box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
  -moz-box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
  box-shadow: 0px 0px 9px 2px rgba(188, 186, 196, 0.63);
}
</style>
