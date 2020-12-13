<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Worker from "worker-loader!../workers/img-worker"

export default {
    name: "Home",
    components: {
        HelloWorld,
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
