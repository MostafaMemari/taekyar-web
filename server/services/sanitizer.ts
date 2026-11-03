import sanitizeHtml from "sanitize-html";

const TEXT_ALIGN_PATTERN = /^\s*(left|center|right|justify)\s*$/i;

const sanitizerOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "hr",
    "h1",
    "h2",
    "h3",
    "h4",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "code",
    "pre",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "figure",
    "figcaption",
    "aside",
    "span",
    "div",
    "mark",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    figure: ["data-type"],
    aside: ["data-type", "class"],
    span: ["class"],
    p: ["style"],
    h1: ["style"],
    h2: ["style"],
    h3: ["style"],
    h4: ["style"],
    div: ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [TEXT_ALIGN_PATTERN],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    a: ["http", "https", "mailto"],
    img: ["http", "https"],
  },
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow" }, true),
  },
  disallowedTagsMode: "discard",
};

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, sanitizerOptions);
}
