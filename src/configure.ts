import services from './storage';
import { TStorage } from './storage/types';
import debug from 'debug';

const log = debug('louvre');
let defaultConfig: Config | null = null;

export function getDefaultConfig(): Config {
  if (defaultConfig === null) {
    throw new Error(
      'A default Lourvre instance was not configured. Make sure you called `Louvre.configure`'
    );
  }
  return defaultConfig;
}

type TConfig = {
  primary: 's3';
  services: {
    s3: AWS.S3.ClientConfiguration & {
      bucket?: string;
      acl?: string;
    };
  };
};

export default class Config {
  config: TConfig;
  primaryService: TStorage;
  constructor(options: TConfig, setDefault = true) {
    this.config = options;
    if (setDefault) {
      defaultConfig = this;
    }
    this.primaryService = this.getPrimaryService();
    log(`Using ${this.primaryService.constructor.name} as primary service for Louvre`);
  }

  getPrimaryService() {
    if (!this.primaryService) {
      const serviceName = this.config.primary || Object.keys(this.config.services)[0];
      const Service = services[serviceName];
      if (!Service) {
        throw new Error(
          `Storage service ${serviceName} is not supported. Please use one of the following: ${Object.keys(
            services
          ).join(', ')}`
        );
      }
      return new Service(this.config.services[serviceName]);
    }

    return this.primaryService;
  }
}
