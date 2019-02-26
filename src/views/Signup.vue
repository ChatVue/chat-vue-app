<template>
    <div>
        <h2>Sign up</h2>
        <form @submit.prevent="submit">
            <div class="form-group">
                <input
                    class="form-control"
                    type="text"
                    v-model="nick"
                    name="nick"
                    placeholder="Nick"
                >
            </div>
            <div class="form-group">
                <input
                    class="form-control"
                    type="text"
                    v-model="email"
                    name="email"
                    placeholder="Email"
                >
            </div>
            <div class="form-group">
                <input
                    class="form-control"
                    type="password"
                    v-model="password"
                    name="password"
                    placeholder="Password"
                >
            </div>
            <div class="form-group error" v-if="message">{{ message }}</div>
            <div class="form-group">
                <button class="btn btn-primary">Sign up</button>
                <router-link to="/login" class="btn btn-link">Login</router-link>
            </div>
        </form>
    </div>
</template>

<script>
// @ is an alias to /src
export default {
    name: "SignUp",
    data() {
        return {
            nick: "",
            email: "",
            password: "",
            message: ""
        };
    },
    created() {
        this.$store.dispatch("user/logout");
    },
    methods: {
        async submit() {
            try {
                const user = {
                    nick: this.nick,
                    email: this.email,
                    password: this.password
                };
                const result = await this.$store.dispatch("user/signup", user);
                if (result === true) {
                    this.message = "";
                    this.$router.push({
                        path: "/login",
                        query: { signedup: "true" }
                    });
                } else {
                    this.message = result; //'SignUp error!';
                }
            } catch (err) {
                this.message = err.message;
            }
        }
    }
};
</script>
