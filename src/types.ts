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
