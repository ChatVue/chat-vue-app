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
        <MsgInput/>
    </div>
</template>

<script>
// @ is an alias to /src
import MsgList from "@/components/MsgList.vue";
import TypingInfo from "@/components/TypingInfo.vue";
import MsgInput from "@/components/MsgInput.vue";

export default {
    name: "chat",
    components: {
        MsgList,
        TypingInfo,
        MsgInput
    }
};
</script>

<style>
.msg-container {
    position: relative;
    font-size: 11.5px;
}
</style>
