<style scoped lang="scss">
@import "src/styles/_utilities";
div {
    @include mid-width;
    display: grid;
    grid-template-columns: auto auto auto auto;
    > p {
        padding: .5rem;
        margin: 0;
    }
}
</style>
<template>
    <div class="hello">
        <p>{{file.id}}</p>
        <p>{{file.name}}</p>
        <p>processing: {{file.processing}}</p>
        <p>done: {{file.processed}}</p>
    </div>
</template>

<script>
export default {
    name: "fileCell",
    props: {
        file: Object,
    },
};
</script>