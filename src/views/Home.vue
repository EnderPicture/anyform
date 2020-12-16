<style scoped lang="scss">
@import "src/styles/_utilities";

h1 {
    @include mid-width;
    font-size: 5rem;
    text-shadow: 0 2px 2px rgba($alWhite, 0.25), 0 4px 4px rgba($alWhite, 0.25),
        0 8px 8px rgba($alWhite, 0.25), 0 16px 16px rgba($alWhite, 0.25),
        0 32px 32px rgba($alWhite, 0.25);
}
.file-input {
    @include mid-width;
    display: block;
    height: 5rem;
    background-color: $alWhite;
    display: flex;
    align-items: center;
    justify-content: center;
    > input {
        display: none;
    }
    > p {
        color: $alBlack;
        font-size: 1rem;
        font-weight: 900;
    }
}
</style>

<template>
    <h1>anyform.*</h1>
    <label class="file-input">
        <input @change="input" type="file" name="thing" id="" multiple />
        <p>Add Images Here</p>
    </label>
    <file-cell
        v-for="file in files"
        :key="file.name"
        :file="file"
    ></file-cell>
    <button @click="process">process</button>
</template>

<script>
import FileCell from "@/components/file-cell.vue";

export default {
    name: "App",
    computed: {
        files() {
            return this.$store.state.files;
        },
    },
    methods: {
        input(e) {
            let target = e.target;
            this.$store.dispatch("addFiles", target.files);
        },
        process() {
            this.$store.dispatch("processAllFiles");
        }
    },
    components: {
        FileCell,
    },
    created() {
        this.$store.dispatch("loadWorker");
    },
};
</script>
