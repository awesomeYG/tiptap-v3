import { generateHTML } from "@tiptap/html"
import { renderToHTMLString, renderToMarkdown, renderToReactElement } from "@tiptap/static-renderer"
import { getExtensions } from "../extension"

interface FnProps {
  exclude: string[]
  json: any
}

export const fn = ({
  exclude,
  json,
}: FnProps) => {

  const extensions = getExtensions({
    exclude,
    editable: false,
  })

  return {
    getHTMLByJSON: () => generateHTML(json, extensions),
    getStaticRenderToHTMLStringByJSON: () => renderToHTMLString({ content: json, extensions }),
    getStaticRenderToMarkdownByJSON: () => renderToMarkdown({ content: json, extensions }),
    getStaticRenderToReactElementByJSON: () => renderToReactElement({ content: json, extensions }),
  }
}