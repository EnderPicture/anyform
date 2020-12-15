<template>
    <h1>Image Utility</h1>
    <input @change="input" type="file" name="thing" id="" multiple />
    <file-cell v-for="(file, index) in files" :index="index" :key="file.name" :file="file"></file-cell>
</template>

<script>
// @ is an alias to /src
import FileCell from "@/components/file-cell.vue";
import Worker from "worker-loader!@/workers/img-worker";

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
            let files = target.files;

            files.forEach((file) => {
                this.$store.dispatch("addFile", file);
            });
        },
    },
    components: {
        FileCell,
    },
    created() {
        // only used to load the worker
        let imgWorker = new Worker();
        imgWorker.postMessage({
            action: "load",
        });
        imgWorker.onmessage = (e) => {
            let status = e.data.status;
            if (status === "loaded") {
                console.log("loaded");
            }
        };
    },
};
</script>
