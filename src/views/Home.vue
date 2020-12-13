<template>
    <h1>Image Utility</h1>
    <input @change="input" type="file" name="thing" id="" multiple />
    <file-cell v-for="file in files" :key="file.name" :file="file"></file-cell>
</template>

<script>
// @ is an alias to /src
import FileCell from "@/components/file-cell.vue";
import Worker from "worker-loader!@/workers/img-worker";

export default {
    name: "App",
    data() {
        return {
            files: [],
        };
    },
    methods: {
        input(e) {
            console.log(e);
            let target = e.target;
            let files = target.files;

            e.target.files.forEach((file) => {
                this.files.push({
                    name: file.name,
                    file: file,
                });
            });

            let file = files[0];

            let imgWorker = new Worker();
            imgWorker.postMessage({
                action: "process",
                file: file,
            });
            imgWorker.onmessage = (e) => {
                let status = e.data.status;
                if (status === "processed") {
                    this.blobURL = URL.createObjectURL(e.data.output);
                    this.newFileName = `${file.name}.${e.data.extension}`;
                }
            };

            // target.value = "";
        },
    },
    components: {
        FileCell,
    },
    created() {
        // load worker
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
