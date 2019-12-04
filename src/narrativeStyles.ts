import { Dimensions } from "./Dimensions";
import { Dictionary } from "./Dictionary";

export function narrativeStyles(viewportDimensions: Dimensions): Dictionary<string> {
  const narrativeWidth = viewportDimensions.width * 0.4;
  return {
    fontFamily: "Georgia",
    width: narrativeWidth + 'px',
    fontSize: "1.6em",
    lineHeight: "1.8em",
    padding: "1em"
  };
}
