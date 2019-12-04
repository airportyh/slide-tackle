import React from "react";
import { SlideViewModel, StandAloneSlideViewModel } from "./slide-view-model-types";
import { Dimensions } from "./Dimensions";
import { narrativeStyles } from "./narrativeStyles";
import { codeVisualStyles } from "./codeVisualStyles";
import { CodeVisual, ImageVisual } from "./slide-types";
import { Dictionary } from "./Dictionary";
import { getHighlightedCode } from "./getHighlightedCode";

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
    viewportDimensions: Dimensions) {
    return (
        <div
        className="narration"
        style={{
            ...narrativeStyles(viewportDimensions),
            height: slide.slideHeight + 'px'
        }}
        dangerouslySetInnerHTML={{ __html: slide.html }}>
        </div>
    );
}

export function renderCurrentVisualSlideUp(
    slide: StandAloneSlideViewModel,
    internalScrollTop: number,
    viewportDimensions: Dimensions
) {
    const containerWidth = viewportDimensions.width * 0.6;
    const containerHeight = viewportDimensions.height;
    const narrativeWidth = viewportDimensions.width * 0.4;
    const scalingFactor = getScalingFactor(
        slide.visualDimensions.width,
        slide.visualDimensions.height,
        containerWidth,
        containerHeight
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
                left: narrativeWidth + 'px',
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
    viewportDimensions: Dimensions
) {

    const containerWidth = viewportDimensions.width * 0.6;
    const containerHeight = viewportDimensions.height;
    const narrativeWidth = viewportDimensions.width * 0.4;
    const scalingFactor = getScalingFactor(
        slide.visualDimensions.width,
        slide.visualDimensions.height,
        containerWidth,
        containerHeight
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
                left: narrativeWidth + 'px',
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
    viewportDimensions: Dimensions
) {
    const containerWidth = viewportDimensions.width * 0.6;
    const containerHeight = viewportDimensions.height;
    const scalingFactor = getScalingFactor(
        slide.visualDimensions.width,
        slide.visualDimensions.height,
        containerWidth,
        containerHeight
    );
    const visualWidth = slide.visualDimensions.width * scalingFactor;
    const visualHeight = slide.visualDimensions.height * scalingFactor;
    const narrativeWidth = viewportDimensions.width * 0.4;
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
                left: narrativeWidth + 'px',
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
    viewportDimensions: Dimensions
) {
    const containerWidth = viewportDimensions.width * 0.6;
    const containerHeight = viewportDimensions.height;
    const narrativeWidth = viewportDimensions.width * 0.4;
    const scalingFactor = getScalingFactor(
        slide.visualDimensions.width,
        slide.visualDimensions.height,
        containerWidth,
        containerHeight
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
                left: narrativeWidth + 'px',
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

function getScalingFactor(width: number, height: number, targetWidth: number, targetHeight: number): number {
    const scalingFactorW = targetWidth / width;
    const scalingFactorH = targetHeight / height;
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
