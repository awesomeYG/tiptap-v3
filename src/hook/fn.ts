import { JSONContent } from "@tiptap/core"
import { generateHTML, generateJSON } from "@tiptap/html"
import { generateHTML as generateHTMLServer, generateJSON as generateJSONServer } from "@tiptap/html/server"
import { renderToHTMLString, renderToMarkdown, renderToReactElement } from "@tiptap/static-renderer"
import { getExtensions } from "../extension"

export interface UseFnProps {
  exclude?: string[]
}

export const useFn = ({
  exclude,
}: UseFnProps) => {

  const extensions = getExtensions({
    exclude,
    editable: false,
  })

  return {
    getJSONByHTML: (html: string) => generateJSON(html, extensions),
    getHTMLByJSON: (json: JSONContent) => generateHTML(json, extensions),
    getHTMLServerByJSON: (json: JSONContent) => generateHTMLServer(json, extensions),
    getJSONServerByHTML: (html: string) => generateJSONServer(html, extensions),
    getStaticRenderToHTMLStringByJSON: (json: JSONContent) => renderToHTMLString({ content: json, extensions }),
    getStaticRenderToMarkdownByJSON: (json: JSONContent) => renderToMarkdown({ content: json, extensions }),
    getStaticRenderToReactElementByJSON: (json: JSONContent) => renderToReactElement({ content: json, extensions }),
  }
}