<template>
    <div class="chat">Welcome,
        <i>{{ this.$store.getters['user/user'].nick }}</i>.
        <br>You could chat now or
        <router-link class="btn-link" to="/login">Logout</router-link>
    </div>
</template>

<script>
export default {
    name: "chat",
    computed: {}
};
</script>
