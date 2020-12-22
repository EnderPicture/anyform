<style scoped lang="scss">
@import "src/styles/_utilities";

h1 {
    @include mid-width;
    font-size: 5rem;
    text-shadow: 0 2px 2px rgba($alWhite, 0.25), 0 4px 4px rgba($alWhite, 0.25),
        0 8px 8px rgba($alWhite, 0.25), 0 16px 16px rgba($alWhite, 0.25),
        0 32px 32px rgba($alWhite, 0.25);

    margin-top: 0;

    text-align: center;

    @media screen and (max-width: $mobile-break) {
        font-size: 3rem;
    }
}
.file-input {
    @include mid-width;
    display: block;
    height: 5rem;
    background-color: rgba($alWhite, 0.5);
    margin-bottom: 1rem;
    position: relative;
    color: $alBlack;
    font-size: 1rem;
    font-weight: 900;
    box-shadow: 0 0px 0 0 rgba($alWhite, 0.5);
    border-radius: $default-radius;
    cursor: pointer;
    > .file {
        transition: 0.6s ease;
        border-radius: $default-radius;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $alWhite;
    }
    &:hover > .file {
        transform: translateY(-4px);
        transition: 0.1s ease;
    }
    &:active > .file {
        transform: translateY(0px);
        transition: 0.1s ease;
    }
    > input {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        z-index: -1;
    }
    > input:focus + .file {
        transition: 0.1s ease;
        box-shadow: 0 0 0 2px $blue;
    }
}
.files {
    @include mid-width-flex;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;

    @media screen and (max-width: $tablet-break) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media screen and (max-width: $mobile-break) {
        grid-template-columns: repeat(1, 1fr);
    }
}
.batch-bar {
    @include mid-width;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    position: relative;
    margin-bottom: 1rem;
    > * {
        display: inline-block;
        &:not(:last-child) {
            margin-right: 1rem;
        }
    }
    &__button {
        flex: 1;
        border: none;
        background-color: rgba($alWhite, 0.5);
        border-radius: $default-radius;
        color: $alBlack;
        font-size: 1rem;
        font-weight: 900;
        padding: 0;
        cursor: pointer;
        > div {
            background-color: $alWhite;
            padding: 0.5rem 1rem;
            border-radius: $default-radius;
        }
        &[disabled] {
            cursor: not-allowed;
            opacity: 0.5;
        }
        &:not([disabled]):hover > div {
            transition: 0.1s ease;
            transform: translateY(-4px);
        }
    }
}

.drop-target {
    @include abs-overlay;
    position: fixed;
    z-index: 100;
    margin: 0;
    background-color: rgba($alBlack, 0.75);
    box-shadow: inset 0 0 200px $alWhite;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 7rem;
    font-weight: 900;
    pointer-events: none;
    overflow: hidden;
    text-align: center;
}

.list-item {
    transition: all 0.8s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(-1rem);
}

.list-leave-active {
    position: absolute;
}
</style>

<template>
    <h1>anyform.*</h1>
    <label class="file-input">
        <input @change="input" type="file" name="thing" id="" multiple />
        <div class="file">
            <p>Add Images Here</p>
        </div>
    </label>
    <format-selector></format-selector>
    <resize-config></resize-config>

    <div class="batch-bar">
        <button
            class="batch-bar__button"
            :disabled="nonProcessed.length <= 0"
            @click="process"
        >
            <div>
                process all
            </div>
        </button>
        <button
            class="batch-bar__button"
            :disabled="processed.length <= 0"
            @click="downloadAll"
        >
            <div>
                download all
            </div>
        </button>
    </div>

    <div class="files">
        <transition-group name="list">
            <file-cell
                v-for="file in files"
                class="list-item"
                :key="file.id"
                :file="file"
            ></file-cell>
        </transition-group>
    </div>
    <transition name="fade">
        <p v-if="fileInDropZone > 0" class="drop-target">Drop Here</p>
    </transition>
</template>

<script>
import FileCell from "@/components/file-cell.vue";
import FormatSelector from "@/components/format-selector.vue";
import ResizeConfig from "@/components/resize-config.vue";
import { FILE_STATUS } from "@/js/constants";

export default {
    name: "App",
    data() {
        return {
            fileInDropZone: 0,
        };
    },
    computed: {
        files() {
            return this.$store.state.files;
        },

        nonProcessed() {
            return this.files.filter(
                (file) => file.status === FILE_STATUS.initialized
            );
        },
        processed() {
            return this.files.filter(
                (file) => file.status === FILE_STATUS.processed
            );
        },
    },
    methods: {
        input(e) {
            this.$store.dispatch("addFiles", e.target.files);
            e.target.value = "";
        },
        fileDrop(e) {
            e.preventDefault();
            this.$store.dispatch("addFiles", e.dataTransfer.files);
            this.fileInDropZone = false;
        },
        fileOver(e) {
            e.preventDefault();
        },
        fileEnter(e) {
            e.preventDefault();
            this.fileInDropZone++;
        },
        fileLeave(e) {
            e.preventDefault();
            this.fileInDropZone--;
        },
        stopProp(e) {
            e.stopPropagation();
        },
        process() {
            this.$store.dispatch("processAllFiles", {
                format: this.selectedFormat,
            });
        },
        downloadAll() {
            this.files.forEach((file) => {
                let a = document.createElement("a");
                a.download = file.output.name;
                a.href = file.output.url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        },
    },
    components: {
        FileCell,
        FormatSelector,
        ResizeConfig,
    },
    mounted() {
        this.$store.dispatch("loadWorker");

        document.body.addEventListener("drop", this.fileDrop);
        document.body.addEventListener("dragover", this.fileOver);
        document.body.addEventListener("dragenter", this.fileEnter);
        document.body.addEventListener("dragleave", this.fileLeave);
    },
    unmounted() {
        document.body.removeEventListener("drop", this.fileDrop);
        document.body.removeEventListener("dragover", this.fileOver);
        document.body.removeEventListener("dragenter", this.fileEnter);
        document.body.removeEventListener("dragleave", this.fileLeave);
    },
};
</script>
