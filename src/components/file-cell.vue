<template>
    <div class="hello">
        {{index}}{{file.name}}
    </div>
</template>

<script>
export default {
    name: "fileCell",
    props: {
        file: Object,
        index: Number,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
