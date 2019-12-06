import { SlideViewModel, StandAloneSlideViewModel } from "./slide-view-model-types";
import { StandAloneSlide, Slide, Visual } from "./slide-types";
import { useViewportDimenions } from "./useViewportDimensions";
import { useState, useEffect } from "react";
import { Dimensions } from "./Dimensions";
import * as _ from "lodash";
import { getRenderedHtmlDimensions } from "./getRenderedHtmlDimensions";
import MarkdownIt from "markdown-it";
import { narrativeStyles } from "./render-helpers";
import { getImageDimensions } from "./getImageDimensions";
import { codeVisualStyles } from "./codeVisualStyles";
import { getHighlightedCode } from "./getHighlightedCode";
import yaml from "js-yaml";
import { AppOptions } from "./App";
import { sleep } from "simple-sleep";
const markdown = new MarkdownIt();

type UseSlideViewModelsState = {
    viewModels: SlideViewModel[],
    viewportDimensions: Dimensions,
    appOptions: AppOptions
};

function compileSlides(yamlContents: string) {
    const object = yaml.safeLoad(yamlContents);
    const title = object.presentation;
    const slides = object.slides.map((slide: any) => {
        if (slide.sequence) {
            return {
                type: "sequence",
                sequence: slide.sequence.map((slide: any) => ({
                    type: "stand-alone",
                    visual: {
                        type: "image",
                        src: getImageSource(slide.image)
                    },
                    narration: slide.narration
                }))
            }
        } else {
            return {
                type: "stand-alone",
                visual: {
                    type: "image",
                    src: getImageSource(slide.image),
                    alt: getImageAlt(slide.image)
                },
                narration: slide.narration
            };
        }
    });

    return {
        title: title,
        widthRatio: object.width_ratio || [50, 50],
        visualPadding: object.visual_padding || [10, 10],
        slides: slides
    };
}

function getImageSource(image: string): string {
    if (!image) {
        throw new Error("BLARH");
    }
    const m = image.match(/^!\[.*\]\((.+)\)$/);
    if (m) {
        return m[1];
    } else {
        throw new Error("BLARH");
    }
}

function getImageAlt(image: string): string {
    if (!image) {
        throw new Error("BLARH");
    }
    const m = image.match(/^!\[(.*)\]\(.+\)$/);
    if (m) {
        return m[1];
    } else {
        throw new Error("BLARH");
    }
}

export function useSlideViewModels(): UseSlideViewModelsState {
    const [baseSlides, setBaseSlides] = useState<any>(null);
    const viewportDimensions = useViewportDimenions();
    const [state, setState] = useState<UseSlideViewModelsState>({
        viewModels: [],
        appOptions: {
          widthRatio: [50, 50],
          visualPadding: [10, 10]
        },
        viewportDimensions: { width: -1, height: -1 }
    });

    useEffect(() => {
        if (!baseSlides) {
            fetch("slides.yml")
                .then((response) => {
                    return response.text();
                })
                .then((slideYml) => {
                    const presentation = compileSlides(slideYml);
                    document.title = presentation.title;
                    setBaseSlides(presentation);
                });
        }
    });

    useEffect(() => {
        if (baseSlides && !_.isEqual(state.viewportDimensions, viewportDimensions)) {
            const appOptions = {
              widthRatio: baseSlides.widthRatio,
              visualPadding: baseSlides.visualPadding
            };
            calculateSlideViews(baseSlides.slides, viewportDimensions, appOptions)
            .then((viewModels) => {
                setState({
                    viewModels,
                    viewportDimensions,
                    appOptions
                });
            });
        }
    });
    return state;
}


async function calculateSlideViews(
    slides: Slide[],
    viewportDimensions: Dimensions,
    options: AppOptions
): Promise<SlideViewModel[]> {
    const viewModels: SlideViewModel[] = [];
    for (const slide of slides) {
        if (slide.type === "stand-alone") {
            viewModels.push(await getStandAloneSlideViewModel(slide, viewportDimensions, options));
        } else if (slide.type === "sequence") {
            const children = await Promise
            .all(slide.sequence
                .map(slide =>
                    getStandAloneSlideViewModel(slide, viewportDimensions, options)));
                    const slideHeight = children.reduce((height, model) => height + model.slideHeight, 0);
                    viewModels.push({
                        type: "sequence",
                        slide,
                        sequence: children,
                        slideHeight
                    });
        } else {
            throw new Error("Unsupported slide type: " + slide["type"]);
        }
    }
            //console.log("Calculated view models in " + (end - start) + "ms");
            return viewModels;
}

async function getStandAloneSlideViewModel(
    slide: StandAloneSlide,
    viewportDimensions: Dimensions,
    options: AppOptions
): Promise<StandAloneSlideViewModel> {
    const narrationHtml = markdown.render(slide.narration);
    const narrationDimensions = await getRenderedHtmlDimensions(
        narrationHtml, narrativeStyles(viewportDimensions, options));
    // add 2 pixels for the border
    const slideHeight = Math.max(narrationDimensions.height + 2, viewportDimensions.height);
    const visualDimensions = await getVisualDimensions(slide.visual);
    return {
        type: slide.type,
        slide,
        visualDimensions,
        slideHeight,
        html: narrationHtml
    };
}

async function getVisualDimensions(visual: Visual): Promise<Dimensions> {
    if (visual.type === "image") {
        return getImageDimensions(visual.src);
    } else if (visual.type === "markdown") {
        const html = markdown.render(visual.markdown);
        return getRenderedHtmlDimensions(html, {
            fontFamily: "Georgia",
            fontSize: "3em"
        });
    } else if (visual.type === "code"){
        const html = `<pre>${getHighlightedCode(visual)}</pre>`;
        return getRenderedHtmlDimensions(html, codeVisualStyles())
    } else {
        throw new Error("Unknown visual type: " + visual["type"]);
    }
}
