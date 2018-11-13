import services from './storage';
import { TStorage } from './storage/types';
import debug from 'debug';
import Verifier from './utils/verifier';

const log = debug('louvre');
let defaultConfig: Config | null = null;

const DEFAULT_URL_EXPIRATION = 60 * 60 * 24 * 7; // 1 week

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
  secretKey: string;
  urlExpiration: number;
};

export default class Config {
  private config: TConfig;
  private primaryService: TStorage;
  private verifier: Verifier;

  constructor(options: TConfig, setDefault = true) {
    this.config = options;
    this.primaryService = this.getPrimaryService();
    this.verifier = new Verifier(this.config.secretKey);
    log(`Using ${this.primaryService.constructor.name} as primary service for Louvre`);

    if (setDefault) {
      defaultConfig = this;
    }
  }

  public getUrlExpiration() {
    return this.config.urlExpiration || DEFAULT_URL_EXPIRATION;
  }

  public getPrimaryService() {
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

  public getVerifier() {
    return this.verifier;
  }
}

export function configure(options: TConfig, setDefault = true) {
  return new Config(options, setDefault);
}
