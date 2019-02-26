<template>
    <div class="message" v-bind:class="{ messageOwn: isOwn }">
        <p class="nick">{{nick}}</p>
        <p>
            <i>{{message}}</i>
        </p>
    </div>
</template>

<script>
export default {
    name: "Message",
    props: {
        nick: String,
        message: String,
        isOwn: Boolean
    }
};
</script>

<style>
.message {
    margin: 6px;
    margin-right: 25px;
    padding: 2px;
    padding-left: 4px;
    color: black;
    background-color: #f5f5f5;
    border-radius: 5px;
}

.messageOwn {
    margin-right: 6px;
    margin-left: 25px;
    background-color: #b7e5eb;
}

.message > p {
    margin-bottom: 3px;
}

.nick {
    color: cornflowerblue;
    font-weight: bold;
}
</style>
