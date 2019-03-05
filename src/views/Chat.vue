<template>
    <div class="chat">
        Welcome,
        <i>{{ this.$store.getters['user/user'].nick }}</i>.
        <br>You could chat now or
        <router-link class="btn-link" to="/login">Logout</router-link>
        <div class="container">
            <TypingInfo/>
            <div ref="messages" class="messages" @scroll="scroll">
                <div v-if="this.$store.state.message.loading" class="text-center m-2">Loading...</div>
                <Message
                    v-for="(item, index) in messages"
                    :key="`msg-${index}`"
                    :nick="item.author.nick"
                    :message="item.message"
                    :isOwn="item.author._id === userId"
                />
            </div>
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
import TypingInfo from "@/components/TypingInfo.vue";

export default {
    name: "chat",
    components: {
        Message,
        TypingInfo
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
        },
        async scroll() {
            const messagesElem = this.$refs.messages;
            if (
                messagesElem &&
                messagesElem.scrollTop < 1 &&
                !this.$store.state.message.loading
            ) {
                const oldScrollH = messagesElem.scrollHeight;
                await this.$store.dispatch("message/load", true);
                messagesElem.scrollTop =
                    messagesElem.scrollHeight - oldScrollH - 25;
            }
        }
    },
    watch: {
        SOCKET_ADD_processing(newVal, oldVal) {
            if (newVal) {
                const messagesElem = this.$refs.messages;
                if (
                    messagesElem &&
                    messagesElem.scrollTop + messagesElem.clientHeight ===
                        messagesElem.scrollHeight
                ) {
                    this.scroolDown = true;
                }
                this.$store.dispatch("message/SOCKET_ADD_processing_finish");
            }
        },
        newMsg() {
            const bearer = "Bearer " + localStorage.token;
            this.$socket.emit("TYPING", bearer);
        }
    },
    created() {
        this.$store.dispatch("message/load");
        this.scroolDown = true;
    },
    updated() {
        if (this.scroolDown) {
            const messagesElem = this.$refs.messages;
            if (messagesElem)
                messagesElem.scrollTop = messagesElem.scrollHeight;
        }
        this.scroolDown = false;
    }
};
</script>

<style>
.container {
    position: relative;
}

.messages {
    min-height: 260px;
    height: 420px;
    width: 95%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    border: #c1c1c1 solid 1px;
    margin-bottom: 2px;
    padding-bottom: 6px;
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
