<template>
    <div id="app">
        <img class="logo" alt="Vue logo" src="./assets/logo.png">
        <router-view/>
    </div>
</template>

<script>
export default {
    computed: {
        token() {
            return this.$store.getters["user/user"].token;
        }
    },
    watch: {
        token(newVal, oldVal) {
            if (!newVal) {
                this.$router.push({ path: "/login" });
            }
        }
    }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2dc4a9;
    max-width: 350px;
    margin-left: auto;
    margin-right: auto;
    background-color: white;
    padding: 4px !important;
}
form input {
    max-width: 250px;
    margin-left: auto;
    margin-right: auto;
}
.error {
    color: red;
}
.btn-primary {
    background-color: #2dc4a9 !important;
    border-color: #2dc4a9 !important;
}
.btn-link {
    color: #2dc4a9 !important;
    text-decoration: underline !important;
}
</style>
