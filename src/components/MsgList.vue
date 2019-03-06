<template>
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
</template>

<script>
// @ is an alias to /src
import Message from "@/components/Message.vue";

export default {
    name: "msg-list",
    components: {
        Message
    },
    data: () => {
        return { scroolDown: false };
    },
    computed: {
        messages() {
            return this.$store.getters["message/all"];
        },
        userId() {
            return this.$store.getters["user/user"].id;
        },
        newMessage() {
            return this.$store.state.message.newMessage;
        }
    },
    methods: {
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
        newMessage(newVal) {
            const messagesElem = this.$refs.messages;
            if (
                (newVal &&
                    newVal.author &&
                    newVal.author._id === this.userId) ||
                (messagesElem &&
                    messagesElem.scrollTop + messagesElem.clientHeight ===
                        messagesElem.scrollHeight)
            ) {
                this.scroolDown = true;
            }
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
}
</style>
