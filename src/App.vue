<template>
    <!-- <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
</template>

<style lang="scss">
@import "src/styles/_normalize";
@import "src/styles/_utilities";
* {
    box-sizing: border-box;
    transition: 0.6s ease, color 0s, background-color 0s, padding 0s, margin 0s;
    position: relative;
}
*:focus {
    transition: 0.1s ease;
    outline: none;
    box-shadow: 0 0 0 2px $blue;
}
body {
    font-family: Ubuntu, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $alWhite;
    background-color: $alBlack;
    margin: 0;
    padding: 10rem 0;
    min-height: 100vh;
    overflow-y: scroll;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
