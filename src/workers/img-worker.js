import { initializeImageMagick, ImageMagick } from "@imagemagick/magick-wasm/image-magick";
import { MagickFormat } from "@imagemagick/magick-wasm/magick-format";


onmessage = e => {
    let data = e.data;
    let message = data.action;

    if (message === "load") {
        postMessage({
            status: "loaded"
        });
    } else if (message === "process") {

        let file = data.file;
        let extension = "png";

        file.arrayBuffer().then((d) => {

            initializeImageMagick().then(async () => {

                ImageMagick.read(new Uint8Array(d), (image) => {
                    console.log(image);
                    // image.resize(100, 100);
                    // image.blur(1, 5);

                    console.log(image.toString());
                    console.log(image);

                    image.write(data => {
                        let blob = new Blob([data], { type: `image/${extension}` });
                        postMessage({
                            status: "processed",
                            output: blob,
                            extension: extension,
                        });

                    }, MagickFormat.Png);

                });
            }).catch(err => {
                console.error(err);
            });
        });

    }

};