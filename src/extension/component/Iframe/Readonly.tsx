import React from 'react'

export type IframeAttributes = {
  src: string
  width: number
  height: number
}

const ReadonlyIframe = ({ attrs }: { attrs: IframeAttributes }) => {
  return (
    <iframe
      src={attrs.src}
      width={attrs.width}
      height={attrs.height}
      style={{ display: 'block', border: 0 }}
    />
  )
}

export default ReadonlyIframe


