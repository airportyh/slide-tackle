import React from "react";
import { SlideViewModel, StandAloneSlideViewModel } from "./slide-view-model-types";
import { Dimensions } from "./Dimensions";
import { codeVisualStyles } from "./codeVisualStyles";
import { CodeVisual, ImageVisual } from "./slide-types";
import { Dictionary } from "./Dictionary";
import { getHighlightedCode } from "./getHighlightedCode";
import { AppOptions } from "./App";

const visualPadding = 20;

export function narrativeStyles(viewportDimensions: Dimensions, options: AppOptions): Dictionary<string> {
  // eslint-disable-next-line
  const [_, narrativeWidthPercent] = getWidthPercentages(options);
  const narrativeWidth = viewportDimensions.width * narrativeWidthPercent;
  return {
    fontFamily: "Georgia",
    width: narrativeWidth + 'px',
    fontSize: "1.6em",
    lineHeight: "1.8em",
    padding: "1em"
  };
}

export function getWidthPercentages(options: AppOptions) {
  const ratio = options.widthRatio;
  const sum = ratio[0] + ratio[1];
  return [
    ratio[1] / sum,
    ratio[0] / sum
  ];
}

export function getCurrentSlideIdx(scrollTop: number, slides: SlideViewModel[]): number {
    let heightOffset = 0;

    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (scrollTop <= heightOffset + slide.slideHeight) {
            return i;
        }
        heightOffset += slide.slideHeight;
    }
    return -1;
}

export function renderNarration(
    slide: StandAloneSlideViewModel,
    viewportDimensions: Dimensions,
    options: AppOptions
) {
    return (
        <div
        className="narration"
        style={{
            ...narrativeStyles(viewportDimensions, options),
            height: slide.slideHeight + 'px'
        }}
        dangerouslySetInnerHTML={{ __html: slide.html }}>
        </div>
    );
}

export function renderCurrentVisualSlideUp(
    slide: StandAloneSlideViewModel,
    internalScrollTop: number,
    viewportDimensions: Dimensions,
    options: AppOptions
) {
    const [visualWidthPercentage, narrationWidthPercentage] = getWidthPercentages(options);
    const containerWidth = viewportDimensions.width * visualWidthPercentage;
    const containerHeight = viewportDimensions.height;
    const narrativeWidth = viewportDimensions.width * narrationWidthPercentage;
    const scalingFactor = getScalingFactor(
        slide.visualDimensions.width,
        slide.visualDimensions.height,
        containerWidth,
        containerHeight,
        visualPadding,
        visualPadding
    );
    const visualHeight = slide.visualDimensions.height * scalingFactor;
    const visualWidth = slide.visualDimensions.width * scalingFactor;
    const topVisualGap = (viewportDimensions.height - visualHeight) / 2;
    const visualOverflow = internalScrollTop + visualHeight + topVisualGap - slide.slideHeight + 2;

    let content;
    if (slide.slide.visual.type === "image") {
        content = renderImage(slide.slide.visual);
    } else if (slide.slide.visual.type === "code") {
        content = renderHighlightedCode(
            visualWidth, visualHeight,
            slide.visualDimensions, slide.slide.visual,
            scalingFactor);
    } else {
        return null;
    }

    return (
        <div
            className="visual"
            style={{
                width: visualWidth + 'px',
                position: 'fixed',
                left: (narrativeWidth + (containerWidth - visualWidth) / 2) + 'px',
                top: Math.min(-visualOverflow, topVisualGap),
                display: "inherit",
                height: visualHeight
            }}>
            {content}
        </div>
    );
}

export function renderNextVisualSlideUp(
    slide: StandAloneSlideViewModel,
    internalScrollTop: number,
    viewportDimensions: Dimensions,
    options: AppOptions
) {
    const [visualWidthPercentage, narrationWidthPercentage] = getWidthPercentages(options);
    const containerWidth = viewportDimensions.width * visualWidthPercentage;
    const containerHeight = viewportDimensions.height;
    const narrativeWidth = viewportDimensions.width * narrationWidthPercentage;
    const scalingFactor = getScalingFactor(
        slide.visualDimensions.width,
        slide.visualDimensions.height,
        containerWidth,
        containerHeight,
        visualPadding,
        visualPadding
    );
    const visualHeight = slide.visualDimensions.height * scalingFactor;
    const visualWidth = slide.visualDimensions.width * scalingFactor;
    const topVisualGap = (viewportDimensions.height - visualHeight) / 2;
    const revealAmount = internalScrollTop + viewportDimensions.height - topVisualGap - 1;

    let content;
    if (slide.slide.visual.type === "image") {
        content = renderImage(slide.slide.visual);
    } else if (slide.slide.visual.type === "code") {
        content = renderHighlightedCode(
            visualWidth, visualHeight,
            slide.visualDimensions, slide.slide.visual,
            scalingFactor);
    } else {
        return null;
    }
    return (
        <div
            className="visual"
            style={{
                width: visualWidth + 'px',
                position: 'fixed',
                left: (narrativeWidth + (containerWidth - visualWidth) / 2) + 'px',
                top: -internalScrollTop + topVisualGap,
                display: revealAmount > 0 ? "inherit": "none",
                height: visualHeight
            }}>
            {content}
        </div>
    );
}

export function renderCurrentVisualSwipeUp(
    slide: StandAloneSlideViewModel,
    internalScrollTop: number,
    viewportDimensions: Dimensions,
    options: AppOptions
) {
    const [visualWidthPercentage, narrationWidthPercentage] = getWidthPercentages(options);
    const containerWidth = viewportDimensions.width * visualWidthPercentage;
    const containerHeight = viewportDimensions.height;
    const scalingFactor = getScalingFactor(
        slide.visualDimensions.width,
        slide.visualDimensions.height,
        containerWidth,
        containerHeight,
        visualPadding,
        visualPadding
    );
    const visualWidth = slide.visualDimensions.width * scalingFactor;
    const visualHeight = slide.visualDimensions.height * scalingFactor;
    const narrativeWidth = viewportDimensions.width * narrationWidthPercentage;
    const topVisualGap = (viewportDimensions.height - visualHeight) / 2;
    const visualOverflow = internalScrollTop + visualHeight + topVisualGap - slide.slideHeight + 2;

    let content;
    if (slide.slide.visual.type === "image") {
        content = renderImage(slide.slide.visual);
    } else if (slide.slide.visual.type === "code") {
        content = renderHighlightedCode(
            visualWidth, visualHeight,
            slide.visualDimensions, slide.slide.visual,
            scalingFactor);
    } else {
        return null;
    }

    return (
        <div
            className="visual"
            style={{
                width: visualWidth + 'px',
                position: 'fixed',
                left: (narrativeWidth + (containerWidth - visualWidth) / 2) + 'px',
                top: (topVisualGap) + 'px',
                display: visualHeight - visualOverflow > 0 ? "inherit" : "none",
                overflow: 'hidden',
                height: Math.min(visualHeight - 2, visualHeight - visualOverflow)
            }}>
            {content}
        </div>
    );
}

export function renderNextVisualSwipeUp(
    slide: StandAloneSlideViewModel,
    internalScrollTop: number,
    viewportDimensions: Dimensions,
    options: AppOptions
) {
    const [visualWidthPercentage, narrationWidthPercentage] = getWidthPercentages(options);
    const containerWidth = viewportDimensions.width * visualWidthPercentage;
    const containerHeight = viewportDimensions.height;
    const narrativeWidth = viewportDimensions.width * narrationWidthPercentage;
    const scalingFactor = getScalingFactor(
        slide.visualDimensions.width,
        slide.visualDimensions.height,
        containerWidth,
        containerHeight,
        visualPadding,
        visualPadding
    );
    const visualWidth = slide.visualDimensions.width * scalingFactor;
    const visualHeight = slide.visualDimensions.height * scalingFactor;
    const topVisualGap = (viewportDimensions.height - visualHeight) / 2;
    const revealAmount = Math.min(visualHeight, internalScrollTop + viewportDimensions.height - topVisualGap);

    let content;
    if (slide.slide.visual.type === "image") {
        content = renderImage(slide.slide.visual, {
            position: 'absolute',
            bottom: '0px'
        });
    } else if (slide.slide.visual.type === "code") {
        content = renderHighlightedCode(
            visualWidth, visualHeight,
            slide.visualDimensions, slide.slide.visual,
            scalingFactor,
            {
                position: 'absolute',
                top: (-visualHeight + revealAmount) + 'px'
            }
        );
    } else {
        return null;
    }

    return (
        <div
            className="visual"
            style={{
                width: visualWidth + 'px',
                position: 'fixed',
                left: (narrativeWidth + (containerWidth - visualWidth) / 2) + 'px',
                top: topVisualGap + visualHeight - revealAmount,
                display: revealAmount > 0 ? "inherit" : "none",
                height: revealAmount,
                overflow: "hidden"}
            }>
            {content}
        </div>
    );
}

function renderImage(visual: ImageVisual, extraStyle?: Dictionary<string>): JSX.Element {
    return (
        <img
            alt={visual.alt}
            style={{
                width: '100%',
                ...extraStyle
            }}
            src={visual.src}
        />
    );
}

function renderHighlightedCode(
    targetWidth: number, targetHeight: number,
    visualDimensions: Dimensions, visual: CodeVisual,
    scalingFactor: number, extraStyles?: Dictionary<string>
): JSX.Element {
    const html = getHighlightedCode(visual);
    const transform = getCodeCSSTransform(targetWidth, targetHeight, visualDimensions, scalingFactor);

    return <div
        style={{
            ...codeVisualStyles(),
            transform: transform,
            ...extraStyles
        }}>
        <pre dangerouslySetInnerHTML={{__html: html}}/>
    </div>;
}

function getScalingFactor(
    width: number, 
    height: number, 
    targetWidth: number, 
    targetHeight: number,
    horizontalPadding: number,
    verticalPadding: number): number {
    const scalingFactorW = (targetWidth - 2 * horizontalPadding) / width;
    const scalingFactorH = (targetHeight - 2 * verticalPadding) / height;
    if (scalingFactorW > scalingFactorH) {
        return scalingFactorH;
    } else {
        return scalingFactorW;
    }
}

function getCodeCSSTransform(visualWidth: number, visualHeight: number, visualDimensions: Dimensions, scalingFactor: number): string {
    const translate =
        `translate(${(visualWidth - visualDimensions.width) / 2}px, ` +
        `${(visualHeight - visualDimensions.height) / 2}px)`;
    const scale = `scale(${scalingFactor}, ${scalingFactor})`;
    const transform = translate + " " + scale;
    return transform;
}
