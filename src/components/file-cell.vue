<style scoped lang="scss">
@import "src/styles/_utilities";

* {
    text-align: start;
}

.file {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, auto);
    position: relative;
    background-color: lighten($alBlack, 10);
    border-radius: 0.5rem;
    overflow: hidden;

    height: 5rem;
    &_has-image {
        height: 15rem;
    }

    .overlay {
        @include abs-overlay;
        z-index: 10;
        bottom: 0;
        top: initial;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: rgba($alBlack, 0.5);
        padding: 0.5rem 1rem;
        display: flex;
        // backdrop-filter: blur(10px);
        > p {
            margin: 0;
            width: 100%;
        }
        .download {
            color: $alWhite;
            text-decoration: none;
            padding-top: 0.5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        }
    }
    .image {
        @include abs-overlay;
        z-index: 0;
        > img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: 50% 0%;
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
        background-color: $negative;
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
    <div :class="{ file: true, 'file_has-image': doneProcessing }">
        <transition name="fade">
            <div v-if="file.status === FILE_STATUS.failed" class="failed">
                !
            </div>
        </transition>
        <transition name="fade">
            <div
                v-if="file.status === FILE_STATUS.processing"
                class="processing"
            ></div>
        </transition>
        <transition name="fade">
            <div v-if="blobURL !== null" class="image">
                <img v-if="blobURL !== null" :src="blobURL" alt="" />
            </div>
        </transition>
        <transition name="fade"> </transition>

        <div class="overlay">
            <p>{{ file.name }}</p>
            <a
                class="download"
                v-if="newFileName !== null"
                :href="blobURL"
                :download="newFileName"
                >download: {{ newFileName }}</a
            >
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
            let url = null;
            if (
                this.file.output.blob !== null &&
                this.file.output.blob !== undefined
            ) {
                url = URL.createObjectURL(this.file.output.blob);
            }
            this.$store.commit("setUrl", { id: this.file.id, url: url });
            return url;
        },
        newFileName() {
            let name = null;
            if (this.file.status === FILE_STATUS.processed) {
                name =
                    this.file.name
                        .split(".")
                        .slice(0, -1)
                        .join(".") +
                    "." +
                    this.file.output.config.format.extension;
            }
            this.$store.commit("setName", { id: this.file.id, name: name });
            return name;
        },
        doneProcessing() {
            return (
                this.file.status === FILE_STATUS.processed ||
                this.file.status === FILE_STATUS.failed
            );
        },
    },
};
</script>
