import React from 'react'

export default function Heading({title, desc, viewport}) {
  <>
    <title>{title? title : "JV Labs"}</title>
    <meta name="description" content={desc ? desc : "JV Labs | innovation"}/>
    <meta name="viewport" content={viewport ? viewport : 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'}/>
    <link rel="icon" type="image/png" href="/favicon.ico"/>
  </>
}