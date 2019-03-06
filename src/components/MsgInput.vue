<template>
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
</template>

<script>
export default {
    name: "msg-input",
    data: () => {
        return { newMsg: "" };
    },
    methods: {
        send() {
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
