import { Node, mergeAttributes } from "@tiptap/core";

export const COACH_TIP_LABEL = "نکته مربی";
export const IMPORTANT_NOTE_LABEL = "نکته مهم";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    coachTip: {
      setCoachTip: () => ReturnType;
      toggleCoachTip: () => ReturnType;
    };
    importantNote: {
      setImportantNote: () => ReturnType;
      toggleImportantNote: () => ReturnType;
    };
    blogImage: {
      insertBlogImage: (attrs: { src: string; alt: string; caption?: string }) => ReturnType;
    };
  }
}

export const CoachTip = Node.create({
  name: "coachTip",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [
      { tag: 'aside[data-type="coach-tip"]' },
      { tag: "aside.coach-tip" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "aside",
      mergeAttributes(HTMLAttributes, { "data-type": "coach-tip", class: "coach-tip" }),
      ["span", { class: "coach-tip-label" }, COACH_TIP_LABEL],
      ["p", 0],
    ];
  },

  addCommands() {
    return {
      setCoachTip:
        () =>
        ({ commands }) =>
          commands.setNode(this.name),
      toggleCoachTip:
        () =>
        ({ commands }) =>
          commands.toggleNode(this.name, "paragraph"),
    };
  },
});

export const ImportantNote = Node.create({
  name: "importantNote",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [
      { tag: 'aside[data-type="important-note"]' },
      { tag: "aside.important-note" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "aside",
      mergeAttributes(HTMLAttributes, { "data-type": "important-note", class: "important-note" }),
      ["span", { class: "important-note-label" }, IMPORTANT_NOTE_LABEL],
      ["p", 0],
    ];
  },

  addCommands() {
    return {
      setImportantNote:
        () =>
        ({ commands }) =>
          commands.setNode(this.name),
      toggleImportantNote:
        () =>
        ({ commands }) =>
          commands.toggleNode(this.name, "paragraph"),
    };
  },
});

export const BlogImage = Node.create({
  name: "blogImage",
  group: "block",
  content: "inline*",
  defining: true,

  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="blog-image"]',
        getAttrs: (element) => {
          const img = element.querySelector("img");
          return {
            src: img?.getAttribute("src") ?? "",
            alt: img?.getAttribute("alt") ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-type": "blog-image" }),
      [
        "img",
        {
          src: node.attrs.src,
          alt: node.attrs.alt,
          loading: "lazy",
          decoding: "async",
        },
      ],
      ["figcaption", 0],
    ];
  },

  addCommands() {
    return {
      insertBlogImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { src: attrs.src, alt: attrs.alt },
            content: attrs.caption ? [{ type: "text", text: attrs.caption }] : [],
          }),
    };
  },
});
