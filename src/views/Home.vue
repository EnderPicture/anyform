<style scoped lang="scss">
@import "src/styles/_utilities";

h1 {
    @include mid-width;
    font-size: 5rem;
    text-shadow: 0 2px 2px rgba($alWhite, 0.25), 0 4px 4px rgba($alWhite, 0.25),
        0 8px 8px rgba($alWhite, 0.25), 0 16px 16px rgba($alWhite, 0.25),
        0 32px 32px rgba($alWhite, 0.25);

    @media screen and (max-width: $mobile-break) {
        font-size: 3rem;
    }
}
.file-input {
    @include mid-width;
    display: block;
    height: 5rem;
    background-color: $alWhite;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    overflow: hidden;
    padding: 1rem;
    > input {
        display: none;
    }
    > p {
        color: $alBlack;
        font-size: 1rem;
        font-weight: 900;
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
        <p>Add Images Here</p>
    </label>
    <div>
        <label v-for="format in formats" :key="format.name">
            {{ format.name }}
            <input name="format" :value="format" v-model="selectedFormat" type="radio" />
        </label>
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
    <transition name="fade" tag="div">
        <div class="process">
            <div class="process__mid">
                <button v-if="nonProcessed.length > 0" @click="process">
                    process
                </button>
            </div>
        </div>
    </transition>
</template>

<script>
import FileCell from "@/components/file-cell.vue";
import { FILE_STATUS } from "@/js/constants";

export default {
    name: "App",
    data() {
        return {
            selectedFormat: null,
        }
    },
    computed: {
        files() {
            return this.$store.state.files;
        },
        formats() {
            return this.$store.state.formats;
        },
        nonProcessed() {
            return this.files.filter(
                (file) => file.status === FILE_STATUS.initialized
            );
        },
    },
    methods: {
        input(e) {
            let target = e.target;
            this.$store.dispatch("addFiles", target.files);
        },
        process() {
            this.$store.dispatch("processAllFiles");
        },
    },
    components: {
        FileCell,
    },
    created() {
        this.$store.dispatch("loadWorker");
        this.selectedFormat = this.formats[0];
    },
};
</script>
