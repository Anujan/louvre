import { AttachmentOptions } from '../types';

export type AttachOptions = {
  [name: string]: AttachmentOptions & {
    multiple?: boolean;
  };
};
