import { Dimensions } from "./Dimensions";
import { Dictionary } from "./Dictionary";

export async function getRenderedHtmlDimensions(html: string, css: Dictionary<string>): Promise<Dimensions> {
    let element = document.createElement("div");
    element.innerHTML = html;
    element.style.visibility = "hidden";
    for (let key in css) {
      (element.style as any)[key] = css[key];
    }
    document.body.appendChild(element);
    const dimensions = {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
    document.body.removeChild(element);
    return dimensions;
}
