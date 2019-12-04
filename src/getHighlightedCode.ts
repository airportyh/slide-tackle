import highlightjs from "highlight.js";
import { CodeVisual } from "./slide-types";

export function getHighlightedCode(visual: CodeVisual): string {
    let code = document.createElement('code');
    code.className = visual.language;
    code.textContent = visual.code;
    highlightjs.highlightBlock(code);
    if (visual.highlight) {
        code = highlightHighlight(code, visual.highlight);
    } else {
    }
    return code.outerHTML;
}

function highlightHighlight(element: HTMLElement, regex: RegExp): HTMLElement {
    if (!element.textContent) {
        return element;
    }
    const match = element.textContent.match(regex);
    console.log("match", match, element);
    if (!match || match.index === undefined) {
        return element;
    }

    const startIndex: number = match.index;
    const endIndex: number = startIndex + match[0].length;

    const newChildNodes = highlightHighlightHelper(element, 0, startIndex, endIndex, 0);
    return newChildNodes[0] as HTMLElement;
}

function createHighlightedText(text: string): Node {
    const span = document.createElement('span');
    span.className = 'highlight';
    span.style.backgroundColor = 'yellow';
    span.textContent = text;
    return span;
}

function highlightHighlightHelper(node: Node, currentIndex: number, startIndex: number, endIndex: number, level: number): Node[] {
    const effectiveStartIndex = startIndex - currentIndex;
    const effectiveEndIndex = endIndex - currentIndex;

    const indent = Array(level + 1).join("  ");
    const indent2 = indent + "  ";
    console.log(indent + "highlightHighlightHelper", node, currentIndex, startIndex, endIndex);
    console.log(indent2 + "effectiveStartIndex:", effectiveStartIndex, "effectiveEndIndex:", effectiveEndIndex);
    if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue === null) {
            return [node.cloneNode(false)];
        }

        const a = startIndex;
        const b = endIndex;
        const c = currentIndex;
        const d = currentIndex + node.nodeValue.length;

        if (b < c) { // a b c d
            console.log(indent2 + "a b c d");
            return [node.cloneNode(false)];
        } else if (a <= c && b >= c && b <= d) { // a c b d
            console.log(indent2 + "a c b d");
            const part1 = node.nodeValue.substring(0, b - c);
            const part2 = node.nodeValue.substring(b - c);
            return [
                createHighlightedText(part1),
                document.createTextNode(part2)
            ];
        } else if (c < a && b <= d) { // c a b d
            console.log(indent2 + "c a b d");
            const part1 = node.nodeValue.substring(0, a - c);
            const part2 = node.nodeValue.substring(a - c, b - c);
            const part3 = node.nodeValue.substring(b - c);
            return [
                document.createTextNode(part1),
                createHighlightedText(part2),
                document.createTextNode(part3)
            ];
        } else if (c < a && a < d && d < b) { // c a d b
            console.log(indent2 + "c a d b");
            const part1 = node.nodeValue.substring(0, a - c);
            const part2 = node.nodeValue.substring(a - c);
            return [
                document.createTextNode(part1),
                createHighlightedText(part2)
            ];
        } else if (d <= a) { // c d a b
            console.log(indent2 + "c d a b");
            return [node.cloneNode(false)];
        } else if (a <= c && d <= b) { // a c d b
            console.log(indent2 + "a c d b");
            return [createHighlightedText(node.nodeValue)];
        } else {
            console.log({ a, b, c, d });
            throw new Error("Unexpected scenario encountered");
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        console.log(indent2 + "node.nodeType === Node.ELEMENT_NODE");
        const newMe: Node = node.cloneNode(false);
        let internalCurrentIndex = currentIndex;
        for (let i = 0; i < node.childNodes.length; i++) {
            const childNode = node.childNodes[i];
            console.log(indent2 + "for loop i:", i, "childNode:", childNode);
            const newGrandChildrenNodes = highlightHighlightHelper(
                childNode, internalCurrentIndex, startIndex, endIndex, level + 1);
            internalCurrentIndex += (childNode.textContent || "").length;
            for (let grandChild of newGrandChildrenNodes) {
                newMe.appendChild(grandChild);
            }
        }
        return [newMe];
    } else {
        return [node];
    }
}
