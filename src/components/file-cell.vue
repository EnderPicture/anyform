<style scoped lang="scss">
@import "src/styles/_utilities";
div {
    @include mid-width;
    display: grid;
    grid-template-columns: repeat(5, auto);
    > p {
        padding: .5rem;
        margin: 0;
    }
    > img {
        width: 100%;
    }
}
</style>
<template>
    <div class="hello">
        <p>{{file.id}}</p>
        <p>{{file.name}}</p>
        <p>processing: {{file.processing}}</p>
        <p>done: {{file.processed}}</p>
        <img v-if="blobURL !== null" :src="blobURL" alt="">
    </div>
</template>

<script>
export default {
    name: "fileCell",
    props: {
        file: Object,
    },
    computed: {
        blobURL() {
            if (this.file.output !== null && this.file.output !== undefined) {
                console.log(this.file.output);
                return URL.createObjectURL(this.file.output);
            } else {
                return null;
            }
        }
    }
};
</script>