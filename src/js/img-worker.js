import { initializeImageMagick, ImageMagick } from "@imagemagick/magick-wasm/image-magick";
import { MagickFormat } from "@imagemagick/magick-wasm/magick-format";


onmessage = e => {
    let payload = e.data;
    let action = payload.action;

    if (action === "load") {
        postMessage({
            status: "loaded"
        });
    } else if (action === "process") {

        console.log("hello");
        console.log(payload.id);


        let file = payload.file;
        let extension = "jpg";

        file.arrayBuffer().then((d) => {

            initializeImageMagick().then(async () => {

                ImageMagick.read(new Uint8Array(d), (image) => {
                    console.log(image);
                    // image.resize(100, 100);
                    // image.blur(1, 5);

                    console.log(image.toString());

                    image.write(data => {
                        let blob = new Blob([data], { type: `image/${extension}` });
                        postMessage({
                            status: "processed",
                            output: blob,
                            extension: extension,
                            id: payload.id,
                        });

                    }, MagickFormat.Jpg);

                });
            }).catch(err => {
                postMessage({
                    status: "failed",
                    id: payload.id,
                });
            });
        });

    }

};