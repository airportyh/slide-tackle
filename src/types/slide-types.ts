export type Visual = ImageVisual | MarkdownVisual | CodeVisual;

export type ImageVisual = {
    type: "image",
    src: string,
    alt: string
};

export type MarkdownVisual = {
    type: "markdown",
    markdown: string
};

export type CodeVisual = {
    type: "code",
    language: string,
    code: string,
    highlight?: RegExp
};

export type StandAloneSlide = {
    type: "stand-alone"
    visual: Visual,
    narration: string
};

export type SequenceSlide = {
    type: "sequence",
    sequence: StandAloneSlide[]
};

export type Slide = StandAloneSlide | SequenceSlide;
