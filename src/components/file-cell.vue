<style scoped lang="scss">
@import "src/styles/_utilities";
div {
    @include mid-width;
    display: grid;
    grid-template-columns: 5rem auto 5rem;
    > p {
        padding: .5rem;
        margin: 0;
    }
}
</style>
<template>
    <div class="hello">
        <p>{{index}}</p>
        <p>{{file.name}}</p>
        <p>{{file.processed}}</p>
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