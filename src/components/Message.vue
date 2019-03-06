<template>
    <div class="messageRow" v-bind:class="{ messageRowOwn: isOwn }">
        <div class="message" v-bind:class="{ messageOwn: isOwn }">
            <p class="nick">{{nick}}</p>
            <p>
                <nl2br tag="i" :text="message"/>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "message",
    props: {
        nick: String,
        message: String,
        isOwn: Boolean
    }
};
</script>

<style>
.messageRow {
    text-align: left;
}
.messageRowOwn {
    text-align: right;
}
.message {
    margin: 6px 25px 6px 6px;
    padding: 3px 4px 6px 4px;
    text-align: left;
    color: black;
    background-color: #f5f5f5;
    border-radius: 10px;
    display: inline-block;
}

.messageOwn {
    margin: 6px 6px 6px 25px;
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
