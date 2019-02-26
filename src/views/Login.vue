<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="submit">
            <div class="signedup" v-if="signedup">You have signed up successfully.
                <br>Please log in.
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
                <button class="btn btn-primary">Login</button>
                <router-link to="/signup" class="btn btn-link">Sign up</router-link>
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
            signedup: false,
            message: ""
        };
    },
    created() {
        this.$store.dispatch("user/logout");
        if (this.$route.query.signedup) {
            this.signedup = true;
        }
    },
    methods: {
        async submit() {
            try {
                const user = { email: this.email, password: this.password };
                const result = await this.$store.dispatch("user/login", user);
                if (result === true) {
                    this.message = "";
                    this.$router.push({ path: "/" });
                } else {
                    this.message = "Login error!";
                }
            } catch (err) {
                this.message = err.response.data.error;
            }
        }
    }
};
</script>
