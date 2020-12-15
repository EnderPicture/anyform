import { createStore } from 'vuex'

export default createStore({
    state: {
        files: [],
    },
    mutations: {
        addFile(state, fileObject) {
            state.files.push(fileObject);
        }
    },
    actions: {
        addFile(context, file) {
            let fileObject = {
                file: file,
                name: file.name,
                processed: false,
                processing: false,
                process: [],
            }
            context.commit('addFile', fileObject);
        },
        processFile() {
            // let file = files[0];

            // let imgWorker = new Worker();
            // imgWorker.postMessage({
            //     action: "process",
            //     file: file,
            // });
            // imgWorker.onmessage = (e) => {
            //     let status = e.data.status;
            //     if (status === "processed") {
            //         this.blobURL = URL.createObjectURL(e.data.output);
            //         this.newFileName = `${file.name}.${e.data.extension}`;
            //     }
            // };
        }
    },
    modules: {
    }
})
