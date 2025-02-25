export interface EnvironmentSchema {
  production: boolean;
  hmr: boolean;
  appMetadata: {
    main: any,
    appSwitcher: []

  };
  apiDomain: {
    gateway: string,
    notificationHub: string,
    coreEndpoint: string,
    devEndpoint: string,
    scheduleEndpoint: string,
    logEndpoint: string,
    storageEndpoint: string,
    dotnetEndpoint: string,
    fileEndpoint: string,
    akeneoEndpoint: string
  };
  clientDomain: {
    appDomain: string;
    idSystem: number
  };
  authenticationSettings: {
    clientId: string;
    issuer: string;
  };

  signalrConfig: {
    topic: any,
    action: {
      notificationCreated: string,
      viewUpdated: string
    }
  };
}

export function mergeJSON(target, add) {
  function isObject(obj) {
    if (typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          return true; // search for first object prop
        }
      }
    }
    return false;
  }
  for (const key in add) {
    if (add.hasOwnProperty(key)) {
      if (target[key] && isObject(target[key]) && isObject(add[key])) {
        mergeJSON(target[key], add[key]);
      } else {
        target[key] = add[key];
      }
    }
  }
  return target;
}
