import * as Sharp from 'sharp';
import { TransformOptions, ImageAttachmentOptions } from '../types';

export function transform(file: Buffer, options: TransformOptions | Function) {
  let sharp = Sharp(file);
  if (typeof options === 'function') {
    return options(sharp).toBuffer();
  }

  if (options.resize) {
    sharp = sharp.resize(null, null, options.resize);
  }
  if (options.rotate) {
    sharp = sharp.rotate(options.rotate.angle, options.rotate.options);
  }
  if (typeof options.flip === 'boolean') {
    sharp = sharp.flip(options.flip);
  }
  if (typeof options.flop === 'boolean') {
    sharp = sharp.flop(options.flop);
  }
  if (options.sharpen) {
    sharp = sharp.sharpen(options.sharpen.sigma, options.sharpen.flat, options.sharpen.jagged);
  }
  if (options.median) {
    sharp = sharp.median(options.median);
  }
  if (options.flatten) {
    sharp = sharp.flatten(options.flatten);
  }
  if (options.blur) {
    sharp = sharp.blur(options.blur);
  }
  if (options.gamma) {
    sharp = sharp.gamma(options.gamma);
  }
  if (typeof options.negate === 'boolean') {
    sharp = sharp.negate(options.negate);
  }
  if (typeof options.normalise === 'boolean') {
    sharp = sharp.normalise(options.normalise);
  }
  if (typeof options.normalize === 'boolean') {
    sharp = sharp.normalize(options.normalize);
  }
  if (options.threshold) {
    sharp = sharp.threshold(options.threshold.threshold, options.threshold.options);
  }
  if (options.linear) {
    sharp = sharp.linear(options.linear.a, options.linear.b);
  }
  return sharp.toBuffer();
}

export function validate(file: Buffer, options: ImageAttachmentOptions) {
  return new Promise((resolve, reject) => {
    try {
      Sharp(file)
        .metadata()
        .then(metadata => {
          if (options.format && options.format !== metadata.format) {
            return reject(
              `Image is expected to be a ${options.format} but recieved ${metadata.format}`
            );
          }
          if (options.maxFileSize && (!metadata.size || metadata.size > options.maxFileSize)) {
            return reject(
              `Image size [${metadata.size}] is greater desired than ${options.maxFileSize}`
            );
          }
          if (options.maxHeight && (!metadata.height || metadata.height > options.maxHeight)) {
            return reject(
              `Image height [${metadata.height}] is greater desired than max height [${
                options.maxHeight
              }]`
            );
          }
          if (options.maxWidth && (!metadata.width || metadata.width > options.maxWidth)) {
            return reject(
              `Image width [${metadata.width}] is greater desired than max width [${
                options.maxWidth
              }]`
            );
          }
          if (options.minHeight && (!metadata.width || metadata.width > options.minHeight)) {
            return reject(
              `Image height [${metadata.height}] is less desired than min height [${
                options.minHeight
              }]`
            );
          }
          if (options.minWidth && (!metadata.width || metadata.width > options.minWidth)) {
            return reject(
              `Image width [${metadata.width}] is less than desired min width [${options.minWidth}]`
            );
          }
          return resolve(file);
        });
    } catch (e) {
      return reject(e);
    }
  });
}
