import { createStore } from 'vuex';
import Worker from 'worker-loader!@/js/img-worker';
import { FILE_STATUS } from '@/js/constants';

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
            let file = state.files.find(file => file.id === id);
            file.output = output;
        },
        setStatus(state, { id, status }) {
            let file = state.files.find(file => file.id === id);
            file.status = status;
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
                let processMore = false;
                if (status === 'loaded') {
                    console.log('loaded');
                } else if (status === 'processed') {
                    context.commit('setStatus', { id: e.data.id, status: FILE_STATUS.processed });
                    context.commit('setOutput', { id: e.data.id, output: e.data.output });
                    processMore = true;
                } else if (status === 'failed') {
                    context.commit('setStatus', { id: e.data.id, status: FILE_STATUS.failed });
                    processMore = true;
                }

                if (processMore) {
                    context.dispatch('processAllWaiting');
                }
            };
        },
        addFile(context, file) {
            let fileObject = {
                id: context.state.nextIndex,
                ogFile: file,
                name: file.name,
                status: FILE_STATUS.initialized,
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
                context.commit('setStatus', { id: file.id, status: FILE_STATUS.waiting });
            });
            context.dispatch('processAllWaiting');
        },
        processAllWaiting(context) {
            // run as many threads as possible
            for (let i = 0; i < navigator.hardwareConcurrency; i++) {
                let waitingFile = context.state.files.find(file => file.status === FILE_STATUS.waiting);
                if (waitingFile === undefined) break;

                context.dispatch('processFile', waitingFile.id);
            }
        },
        processFile(context, id) {

            let file = context.state.files.find(file => file.id === id);

            context.state.worker.postMessage({
                action: 'process',
                file: file.ogFile,
                id: file.id,
            });
            context.commit('setStatus', { id: id, status: FILE_STATUS.processing });
        }
    },
    modules: {
    }
})
