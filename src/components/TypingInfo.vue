<template>
    <div class="typing_container" v-if="nicks.length > 0">
        <i>{{nicks.slice(0, 2).join(', ')}}</i>
        <span v-if="nicks.length > 2">&nbsp;and
            <i>{{nicks.length - 2}} more</i>
        </span>
        
        <span v-if="nicks.length == 1">&nbsp;is typing</span>
        <span v-if="nicks.length > 1">&nbsp;are typing</span>
    </div>
</template>

<script>
export default {
    name: "typing-info",
    computed: {
        nicks() {
            return this.$store.getters["message/typingNicks"];
        }
    }
};
</script>

<style>
.typing_container {
    position: absolute;
    z-index: 200;
    bottom: 2px;
    margin-left: 10px;
    margin-right: 45px;
    border-radius: 7px;
    padding: 2px;
    background-color: #f0f0f0;
    opacity: 0.8;
    text-align: left;
    font-size: small;
    color: #6dd0c2;
}
</style>
