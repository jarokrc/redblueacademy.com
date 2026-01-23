import type { ImgHTMLAttributes } from "react";

type PictureProps = {
  webpSrc: string;
  fallbackSrc: string;
  alt: string;
  pictureClassName?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;

const Picture = ({ webpSrc, fallbackSrc, alt, pictureClassName, ...imgProps }: PictureProps) => (
  <picture className={pictureClassName}>
    <source srcSet={webpSrc} type="image/webp" />
    <img src={fallbackSrc} alt={alt} {...imgProps} />
  </picture>
);

export default Picture;
