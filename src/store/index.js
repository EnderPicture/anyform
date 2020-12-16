import { createStore } from 'vuex'
import Worker from 'worker-loader!@/workers/img-worker';

export default createStore({
    state: {
        files: [],
        nextIndex: 0,
        worker: null,
    },
    mutations: {
        addFile(state, fileObject) {
            state.files.push(fileObject);
        },
        setOutput(state, id, output) {
            let file = state.files.find(file => file.id == id);
            file.output = output;
        },
        setProcessing(state, id, isProcessing) {
            let file = state.files.find(file => file.id == id);
            file.processing = isProcessing;
        },
        setProcessed(state, id, isProcessed) {
            let file = state.files.find(file => file.id == id);
            file.processed = isProcessed;
        },
        setFailed(state, id, isFailed) {
            let file = state.files.find(file => file.id == id);
            file.failed = isFailed;
        },
        incrementId(state) {
            state.nextIndex++;
        },
        addWorker(state, worker) {
            state.worker = worker;
        }
    },
    actions: {
        async loadWorker(context) {
            let imgWorker = new Worker();
            this.state.worker = imgWorker;

            imgWorker.postMessage({
                action: 'load',
            });
            imgWorker.onmessage = (e) => {
                let status = e.data.status;
                if (status === 'loaded') {
                    console.log('loaded');
                } else if (status === 'processed') {
                    context.commit('setProcessed', e.data.id, true);
                    context.commit('setOutput', e.data.id, e.data.output);
                } else if (status === 'failed') {
                    context.commit('setFailed', e.data.id, true);
                }
            };
        },
        addFile(context, file) {
            let fileObject = {
                id: context.state.nextIndex,
                ogFile: file,
                name: file.name,
                processed: false,
                processing: false,
                failed: false,
                output: null,
                process: [],
            }
            context.commit('incrementId');
            context.commit('addFile', fileObject);
        },
        addFiles(context, files) {
            files.forEach((file) => {
                context.dispatch('addFile', file);
            });
        },
        processAllFiles(context) {
            let notProcessed = context.state.files.filter(file => !file.processed);
            notProcessed.forEach(file => {
                context.dispatch('processFile', file.id)
            });
        },
        processFile(context, id) {

            let file = context.state.files.find(file => file.id == id);

            context.state.worker.postMessage({
                action: 'process',
                file: file.ogFile,
                id: file.id,
            });
            context.commit('setProcessing', id, true);
        }
    },
    modules: {
    }
})
