import { createStore } from 'vuex'

export default createStore({
    state: {
        files: [],
    },
    mutations: {
        addFile(state, fileObject) {
            state.files.push(fileObject);
        },
        setOutput(state, index, output) {
            state.files[index].output = output;
        },
        setProcessing(state, index, isProcessing) {
            state.files[index].processing = isProcessing;
        },
        setProcessed(state, index, isProcessed) {
            state.files[index].processed = isProcessed;
        },
        setFailed(state, index, isFailed) {
            state.files[index].failed = isFailed;
        }
    },
    actions: {
        addFile(context, file) {
            let fileObject = {
                file: file,
                name: file.name,
                processed: false,
                processing: false,
                failed: false,
                output: null,
                process: [],
            }
            context.commit('addFile', fileObject);
        },
        addFiles(context, files) {
            files.forEach((file) => {
                context.dispatch("addFile", file);
            });
        },
        processAllFiles(context) {
            let notProcessed = context.state.files.filter(file => !file.processed);
            context.dispatch('processFile', )
        },
        processFile(context, index) {
            let file = context.state.files[index];

            let imgWorker = new Worker();
            imgWorker.postMessage({
                action: "process",
                file: file,
            });
            context.commit('setProcessing', index, true);
            imgWorker.onmessage = (e) => {
                context.commit('setProcessing', index, false);
                let status = e.data.status;
                if (status === "processed") {
                    context.commit('setProcessed', index, true);
                    context.commit('setOutput', index, e.data.output);
                } else {
                    context.commit('setFailed', index, true);
                }
            };
        }
    },
    modules: {
    }
})
