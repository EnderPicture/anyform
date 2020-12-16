<style scoped lang="scss">
@import "src/styles/_utilities";
.file {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, auto);
    position: relative;
    background-color: lighten($alBlack, 10);
    .overlay {
        @include abs-overlay;
        z-index: 1;
        bottom: 0;
        top: initial;
        height: auto;
        display: flex;
    }
    .image {
        @include abs-overlay;
        z-index: 0;
        > img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}
</style>
<template>
    <div class="file">
        <div class="overlay">
            <p>{{ file.name }}</p>
        </div>
        <div class="image">
            <img v-if="blobURL !== null" :src="blobURL" alt="" />
        </div>
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
        },
    },
};
</script>
