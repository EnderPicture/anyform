<style scoped lang="scss">
@import "src/styles/_utilities";
.file {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, auto);
    position: relative;
    background-color: lighten($alBlack, 10);
    border-radius: 0.5rem;
    overflow: hidden;

    .overlay {
        @include abs-overlay;
        z-index: 1;
        bottom: 0;
        top: initial;
        height: auto;
        display: flex;
        background-color: rgba($alBlack, 0.5);
        padding: 0.5rem 1rem;
        backdrop-filter: blur(10px);
        > p {
            margin: 0;
        }
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

    .processing {
        @include abs-overlay;
        width: 200%;
        z-index: 2;
        background: linear-gradient(
            90deg,
            rgba($alBlack, 0) 0%,
            rgba($alBlack, 1) 25%,
            rgba($alBlack, 0) 50%,
            rgba($alBlack, 1) 75%,
            rgba($alBlack, 0) 100%
        );
        animation-name: scroll;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
    .failed {
        @include abs-overlay;
        z-index: 0;
        background-color: $error;
        font-size: 10rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
@keyframes scroll {
    0% {
        transform: translateX(-50%);
    }
    100% {
        transform: translateX(0%);
    }
}
</style>
<template>
    <div class="file">
        <div v-if="file.status === FILE_STATUS.failed" class="failed">!</div>
        <div v-if="file.status === FILE_STATUS.processing" class="processing"></div>
        <div class="overlay">
            <p>{{ file.name }}</p>
        </div>
        <div v-if="blobURL !== null" class="image">
            <img v-if="blobURL !== null" :src="blobURL" alt="" />
        </div>
    </div>
</template>

<script>
import { FILE_STATUS } from "@/js/constants";
export default {
    name: "fileCell",
    props: {
        file: Object,
    },
    computed: {
        FILE_STATUS() {
            return FILE_STATUS;
        },
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
