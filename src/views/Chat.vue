<template>
    <div class="chat">
        Welcome,
        <i>{{ this.$store.getters['user/user'].nick }}</i>.
        <br>You could chat now or
        <router-link class="btn-link" to="/login">Logout</router-link>
        <div class="msg-container">
            <TypingInfo/>
            <MsgList/>
        </div>
        <table class="inputTable">
            <tr>
                <td class="inputTd">
                    <textarea
                        v-model="newMsg"
                        @keydown.enter.exact.prevent="send"
                        @keyup.enter.exact.prevent
                        @keydown.enter.ctrl.exact.prevent="newline"
                        @keydown.enter.shift.exact.prevent="newline"
                        class="input"
                    ></textarea>
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
import MsgList from "@/components/MsgList.vue";
import TypingInfo from "@/components/TypingInfo.vue";

export default {
    name: "chat",
    components: {
        MsgList,
        TypingInfo
    },
    data: () => {
        return { newMsg: "" };
    },
    methods: {
        send() {
            this.scroolDown = true;
            this.$store.dispatch("message/add", this.newMsg);
            this.newMsg = "";
        },
        newline() {
            this.newMsg = this.newMsg + "\n";
        }
    },
    watch: {
        newMsg() {
            const bearer = "Bearer " + localStorage.token;
            this.$socket.emit("TYPING", bearer);
        }
    }
};
</script>

<style>
.msg-container {
    position: relative;
    font-size: 11.5px;
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
