import { createStore } from 'vuex'
import Worker from 'worker-loader!@/js/img-worker';

const FILE_STATUS = {
    initialized: 0,
    waiting: 1,
    processing: 2,
    failed: -1,
    processed: 3,
};

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
        setOutput(state, { id, output }) {
            let file = state.files.find(file => file.id == id);
            file.output = output;
        },
        setProcessing(state, { id, isProcessing }) {
            let file = state.files.find(file => file.id == id);
            file.processing = isProcessing;
        },
        setProcessed(state, { id, hasProcessed }) {
            let file = state.files.find(file => file.id == id);
            file.processed = hasProcessed;
        },
        setFailed(state, { id, hasFailed }) {
            let file = state.files.find(file => file.id == id);
            file.failed = hasFailed;
        },
        incrementId(state) {
            state.nextIndex++;
        },
        addWorker(state, worker) {
            state.worker = worker;
        }
    },
    actions: {
        loadWorker(context) {
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
                    context.commit('setProcessed', { id: e.data.id, hasProcessed: true });
                    context.commit('setOutput', { id: e.data.id, output: e.data.output });
                } else if (status === 'failed') {
                    context.commit('setFailed', { id: e.data.id, hasFailed: true });
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
            context.commit('setProcessing', { id: id, isProcessing: true });
        }
    },
    modules: {
    }
})
