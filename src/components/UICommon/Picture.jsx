import React from "react";
import Config from '../../config';
export default function Picture({desktop, mobile, tablet, className}) {
  return (
    <picture>
      <source
        media="(min-width:1051px)"
        srcSet={Config.CAMPAIGNROOT + "images/" + desktop}
      />
      {tablet ? (
        <source
          media="(min-width:751px) and (max-width:1050px)"
          srcSet={Config.CAMPAIGNROOT + "images/" + tablet}
        />
      ) : (
        <source
          media="(min-width:751px) and (max-width:1050px)"
          srcSet={Config.CAMPAIGNROOT + "images/" + desktop}
        />
      )}
      {mobile ? (
        <source
          media="(max-width:750px)"
          srcSet={Config.CAMPAIGNROOT + "images/" + mobile}
        />
      ) : (
        <source
          media="(max-width:750px)"
          srcSet={Config.CAMPAIGNROOT + "images/" + desktop}
        />
      )}
      <img
        alt="responsive"
        className={className}
        src={Config.CAMPAIGNROOT + "images/" + desktop}
      />
    </picture>
  );
}