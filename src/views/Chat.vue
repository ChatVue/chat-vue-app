<template>
    <div class="chat">
        Welcome,
        <i>{{ this.$store.getters['user/user'].nick }}</i>.
        <br>You could chat now or
        <router-link class="btn-link" to="/login">Logout</router-link>
        <div ref="messages" class="messages">
            <Message
                v-for="item in messages"
                :key="item._id"
                :nick="item.author.nick"
                :message="item.message"
                :isOwn="item.author._id === userId"
            >{{item}}</Message>
        </div>
        <table class="inputTable">
            <tr>
                <td class="inputTd">
                    <textarea v-model="newMsg" class="input"></textarea>
                </td>
                <td class="sendTd">
                    <button v-on:click="send" class="btn btn-primary send">Send</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
// @ is an alias to /src
import Message from "@/components/Message.vue";

export default {
    name: "chat",
    components: {
        Message
    },
    data: () => {
        return { newMsg: "", listUpdated: false };
    },
    computed: {
        messages() {
            return this.$store.state.message.messages;
        },
        userId() {
            return this.$store.getters["user/user"].id;
        }
    },
    methods: {
        send() {
            this.$store.dispatch("message/add", this.newMsg);
            this.newMsg = "";
        }
    },
    created() {
        this.$store.dispatch("message/load");
    },
    watch: {
        messages: function(val, oldVal) {
            this.listUpdated = true;
        }
    },
    updated() {
        if (this.listUpdated) {
            const messages = this.$refs.messages;
            if (messages) messages.scrollTop = messages.scrollHeight;
        }
        this.listUpdated = false;
    }
};
</script>

<style>
.messages {
    min-height: 260px;
    height: 420px;
    width: 100%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    border: #c1c1c1 solid 1px;
    margin-bottom: 2px;
    overflow-y: auto;
    color: #6dd0c2;
    font-size: small;
}

.inputTable {
    width: 90%;
    margin-left: 5%;
}

.inputTd {
    width: 75%;
    padding: 0;
    vertical-align: top !important;
}

.senndTd {
    width: 15%;
    padding: 0;
    vertical-align: top !important;
}

.input {
    width: 100%;
    height: 48px;
    margin-top: 2px;
    color: gray;
    font-size: small;
}

.send {
    width: 100%;
    height: 46px;
    margin-bottom: 3px;
}
</style>
