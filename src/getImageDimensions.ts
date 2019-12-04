import { Dimensions } from "./Dimensions";

export function untilImageLoads(image: HTMLImageElement): Promise<void> {
    return new Promise((accept, reject) => {
        let handler = () => {
            image.removeEventListener("load", handler);
            image.removeEventListener("error", errorHandler);
            accept();
        };
        let errorHandler = () => {
            image.removeEventListener("load", handler);
            image.removeEventListener("error", errorHandler);
            reject();
        };
        image.addEventListener("load", handler);
        image.addEventListener("error", errorHandler);
    });
}

export async function getImageDimensions(src: string): Promise<Dimensions> {
    const imageElement = new Image();
    imageElement.src = src;
    await untilImageLoads(imageElement);
    return {
        height: imageElement.height,
        width: imageElement.width
    };
}
