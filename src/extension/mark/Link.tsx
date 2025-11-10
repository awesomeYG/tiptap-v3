import { Link } from "@tiptap/extension-link";
import { ReactMarkViewRenderer } from "@tiptap/react";
import LinkViewWrapper from "../component/Link/Markdown";

const CustomLink = Link.extend({
  addMarkView() {
    return ReactMarkViewRenderer(LinkViewWrapper, {
      as: 'a',
    })
  }
})

export default CustomLink
