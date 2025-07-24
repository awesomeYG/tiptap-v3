import Youtube, { YoutubeOptions } from "@tiptap/extension-youtube";

export const YoutubeExtension = (youtube?: Partial<YoutubeOptions>) => Youtube.configure({
  ccLanguage: 'zh-CN',
  nocookie: true,
  ...youtube
})

export default YoutubeExtension;