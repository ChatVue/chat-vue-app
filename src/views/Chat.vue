<template>
    <div class="chat">
        Welcome,
        <i>{{ this.$store.getters['user/user'].nick }}</i>.
        <br>You could chat now or
        <router-link class="btn-link" to="/login">Logout</router-link>
        <div ref="messages" class="messages">
            <Message
                v-for="(item, index) in messages"
                :key="`msg-${index}`"
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
        return { newMsg: "", scroolDown: false };
    },
    computed: {
        messages() {
            return this.$store.getters["message/all"];
        },
        userId() {
            return this.$store.getters["user/user"].id;
        },
        SOCKET_ADD_processing() {
            return this.$store.state.message.SOCKET_ADD_processing;
        }
    },
    methods: {
        send() {
            this.scroolDown = true;
            this.$store.dispatch("message/add", this.newMsg);
            this.newMsg = "";
        }
    },
    watch: {
        SOCKET_ADD_processing(newVal, oldVal) {
            if (newVal) {
                const messages = this.$refs.messages;
                if (
                    messages.scrollTop + messages.clientHeight ===
                    messages.scrollHeight
                ) {
                    this.scroolDown = true;
                }
                this.$store.dispatch("message/SOCKET_ADD_processing_finish");
            }
        }
    },
    created() {
        this.$store.dispatch("message/load");
        this.scroolDown = true;
    },
    updated() {
        if (this.scroolDown) {
            const messages = this.$refs.messages;
            if (messages) messages.scrollTop = messages.scrollHeight;
        }
        this.scroolDown = false;
    }
};
</script>

<style>
.messages {
    min-height: 260px;
    height: 420px;
    width: 95%;
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
    width: 95%;
    margin-left: auto;
    margin-right: auto;
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
