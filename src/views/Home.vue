<style scoped lang="scss">
@import "src/styles/_utilities";

h1 {
    @include mid-width;
    font-size: 5rem;
    text-shadow: 0 2px 2px rgba($alWhite, 0.25), 0 4px 4px rgba($alWhite, 0.25),
        0 8px 8px rgba($alWhite, 0.25), 0 16px 16px rgba($alWhite, 0.25),
        0 32px 32px rgba($alWhite, 0.25);

    margin-top: 0;

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
    border-radius: 0.5rem;
    > .file {
        transition: 0.6s ease;
        border-radius: 0.5rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $alWhite;
    }
    &:hover > .file {
        cursor: pointer;
        transform: translateY(-4px);
        transition: 0.1s ease;
    }
    &:active > .file {
        cursor: pointer;
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
        transform: translateY(-4px);
        transition: 0.1s ease;
    }
}
.files {
    @include mid-width;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;

    @media screen and (max-width: $mobile-break) {
        grid-template-columns: repeat(1, 1fr);
    }
}
.process {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 20;
    &__mid {
        @include mid-width;
        > button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            border: none;
            background-color: $alWhite;
            border-radius: 0.5rem 0.5rem 0 0;
            height: 3rem;
            color: $alBlack;
            font-size: 1rem;
            font-weight: 900;
        }
    }
}

.list-item {
    transition: all 0.8s ease;
    display: inline-block;
    margin-right: 10px;
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
    <transition name="fade" tag="div">
        <div class="process" v-if="nonProcessed.length > 0">
            <div class="process__mid">
                <button @click="process">
                    process
                </button>
            </div>
        </div>
    </transition>
</template>

<script>
import FileCell from "@/components/file-cell.vue";
import FormatSelector from "@/components/format-selector.vue";
import { FILE_STATUS } from "@/js/constants";

export default {
    name: "App",
    computed: {
        files() {
            return this.$store.state.files;
        },

        nonProcessed() {
            return this.files.filter(
                (file) => file.status === FILE_STATUS.initialized
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
        },
        fileOver(e) {
            e.preventDefault();
        },
        fileEnter(e) {
            e.preventDefault();
            console.log("enter");
        },
        fileLeave(e) {
            e.preventDefault();
            console.log("exit");
        },
        process() {
            this.$store.dispatch("processAllFiles", {
                format: this.selectedFormat,
            });
        },
    },
    components: {
        FileCell,
        FormatSelector,
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
