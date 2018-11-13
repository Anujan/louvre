import * as Sharp from 'sharp';

export type BasicAttachmentOptions = {
  maxFileSize?: number;
};

export type SizeOptions = {
  maxWidth?: number;
  minWidth?: number;
  maxHeight?: number;
  minHeight?: number;
};

export type ImageAttachmentOptions = {
  type: 'image';
  format?: 'jpeg' | 'png' | 'webp' | 'gif' | 'svg';
} & SizeOptions &
  BasicAttachmentOptions;

export type VideoAttachmentOptions = {
  type: 'video';
  aspectRatio?: [number, number];
  minDuration?: number;
  maxDuration?: number;
} & SizeOptions &
  BasicAttachmentOptions;

export type OtherOptions = {
  type?: 'other';
} & BasicAttachmentOptions;

export type AttachmentOptions = ImageAttachmentOptions | VideoAttachmentOptions | OtherOptions;

export type ImageMetadata = {
  width: number;
  height: number;
};

export type VideoMetadata = {
  width: number;
  height: number;
  duration: number;
  angle: number;
  displayAspectRatio: [number, number];
};

export type NullMetadata = {};

export type Metadata = ImageMetadata | VideoMetadata | NullMetadata;

export type ImageTransformOptions = {
  rotate?: {
    angle?: number;
    options?: Sharp.RotateOptions;
  };
  flip?: boolean;
  flop?: boolean;
  sharpen?: {
    sigma?: number;
    flat?: number;
    jagged?: number;
  };
  median?: number;
  blur?: number;
  flatten?: boolean | Sharp.FlattenOptions;
  gamma?: number;
  negate?: boolean;
  normalise?: boolean;
  normalize?: boolean;
  threshold?: {
    threshold: number;
    options: Sharp.ThresholdOptions;
  };
  linear?: {
    a: number;
    b: number;
  };
  resize?: Sharp.ResizeOptions;
};

export type TransformOptions = ImageTransformOptions;
