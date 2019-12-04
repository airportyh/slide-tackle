import { SlideViewModel, StandAloneSlideViewModel } from "./slide-view-model-types";
import { StandAloneSlide, Slide, Visual } from "./slide-types";
import { useViewportDimenions } from "./useViewportDimensions";
import { useState, useEffect } from "react";
import { Dimensions } from "./Dimensions";
import * as _ from "lodash";
import { getRenderedHtmlDimensions } from "./getRenderedHtmlDimensions";
import MarkdownIt from "markdown-it";
import { narrativeStyles } from "./narrativeStyles";
import { getImageDimensions } from "./getImageDimensions";
import { codeVisualStyles } from "./codeVisualStyles";
import { getHighlightedCode } from "./getHighlightedCode";
import yaml from "js-yaml";
const markdown = new MarkdownIt();

type UseSlideViewModelsState = {
    viewModels: SlideViewModel[],
    viewportDimensions: Dimensions
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

export function useSlideViewModels() {
    const [baseSlides, setBaseSlides] = useState([]);
    const viewportDimensions = useViewportDimenions();
    const [state, setState] = useState<UseSlideViewModelsState>({
        viewModels: [],
        viewportDimensions: { width: -1, height: -1 }
    });

    useEffect(() => {
        if (baseSlides.length === 0) {
            fetch("slides.yml")
                .then((response) => {
                    return response.text();
                })
                .then((slideYml) => {
                    const presentation = compileSlides(slideYml);
                    document.title = presentation.title;
                    setBaseSlides(presentation.slides);
                });
        }
    });

    useEffect(() => {
        if (baseSlides.length > 0 && !_.isEqual(state.viewportDimensions, viewportDimensions)) {
            calculateSlideViews(baseSlides, viewportDimensions)
            .then((viewModels) => {
                setState({
                    viewModels,
                    viewportDimensions
                });
            });
        }
    });
    return state.viewModels;
}


async function calculateSlideViews(
    slides: Slide[],
    viewportDimensions: Dimensions
): Promise<SlideViewModel[]> {
    const viewModels: SlideViewModel[] = [];
    for (const slide of slides) {
        if (slide.type === "stand-alone") {
            viewModels.push(await getStandAloneSlideViewModel(slide, viewportDimensions));
        } else if (slide.type === "sequence") {
            const children = await Promise
            .all(slide.sequence
                .map(slide =>
                    getStandAloneSlideViewModel(slide, viewportDimensions)));
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
            viewportDimensions: Dimensions
        ): Promise<StandAloneSlideViewModel> {
            const narrationHtml = markdown.render(slide.narration);
            const narrationDimensions = await getRenderedHtmlDimensions(
                narrationHtml, narrativeStyles(viewportDimensions));
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
