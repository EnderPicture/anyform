import { createStore } from 'vuex';
import Worker from 'worker-loader!@/js/img-worker';
import { FILE_STATUS } from '@/js/constants';
import { MagickFormat } from "@imagemagick/magick-wasm/magick-format";

export default createStore({
    state: {
        files: [],
        nextIndex: 0,
        worker: null,

        formats: [
            {
                name: 'jpeg',
                extension: 'jpg',
                magickFormat: MagickFormat.Jpg,
            },
            {
                name: 'png',
                extension: 'png',
                magickFormat: MagickFormat.Png,
            },
            {
                name: 'tiff',
                extension: 'tif',
                magickFormat: MagickFormat.Tif,
            },
            {
                name: 'webp',
                extension: 'webp',
                magickFormat: MagickFormat.Webp,
            },
            {
                name: 'gif',
                extension: 'gif',
                magickFormat: MagickFormat.Gif,
            },
            {
                name: 'bmp',
                extension: 'bmp',
                magickFormat: MagickFormat.Bmp,
            },
        ],

        config: {
            format: null,
        }
    },
    mutations: {

        setFormat(state, format) {
            state.config.format = format;
        },
        // files
        addFile(state, fileObject) {
            state.files.push(fileObject);
        },
        setData(state, { id, data }) {
            let file = state.files.find(file => file.id === id);
            file.output.blob = data.output;
            file.output.config = data.config;
        },
        setUrl(state, { id, url }) {
            let file = state.files.find(file => file.id === id);
            file.output.url = url;
        },
        setName(state, { id, name }) {
            let file = state.files.find(file => file.id === id);
            file.output.name = name;
        },
        setStatus(state, { id, status }) {
            let file = state.files.find(file => file.id === id);
            file.status = status;
        },


        // others
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
                    context.commit('setData', { id: e.data.id, data: e.data });
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
                output: {
                    blob: null,
                    name: null,
                    url: null,
                    config: null,
                },
                process: [],
            }
            context.commit('incrementId');
            context.commit('addFile', fileObject);
        },
        async addFiles(context, files) {
            for (let i = 0; i < files.length; i++) {
                context.dispatch('addFile', files[i]);
                await new Promise(r => setTimeout(r, 16));
            }
        },
        processAllFiles(context) {
            let notProcessed = context.state.files.filter(file => file.status === FILE_STATUS.initialized);
            notProcessed.forEach(file => {
                context.commit('setStatus', { id: file.id, status: FILE_STATUS.waiting });
            });
            context.dispatch('processAllWaiting');
        },
        processAllWaiting(context) {
            let processesRunning = context.state.files.filter(file => file.status === FILE_STATUS.processing).length;
            // run as many threads as possible
            for (let i = 0; i < navigator.hardwareConcurrency - processesRunning; i++) {
                let waitingFile = context.state.files.find(file => file.status === FILE_STATUS.waiting);
                if (waitingFile === undefined) break;

                context.dispatch('processFile', waitingFile.id);
            }
        },
        processFile(context, id) {

            let file = context.state.files.find(file => file.id === id);

            let config = clone(context.state.config);


            context.state.worker.postMessage({
                action: 'process',
                file: file.ogFile,
                id: file.id,
                config: config,
            });
            context.commit('setStatus', { id: id, status: FILE_STATUS.processing });
        }
    },
    modules: {
    }
})

function clone(object) {
    return JSON.parse(JSON.stringify(object));
}
