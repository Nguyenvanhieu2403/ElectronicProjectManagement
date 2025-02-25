import { EnvironmentSchema, mergeJSON } from './environment-schema';

// Specify your environment here
const appEnv = 'application';
const appXhr = new XMLHttpRequest();
appXhr.open('GET', `/assets/environments/${appEnv}.json`, false);
appXhr.send(null);

const env = 'dev';
const xhr = new XMLHttpRequest();
xhr.open('GET', `/assets/environments/${env}.json`, false);
xhr.send(null);

export const environment: EnvironmentSchema = mergeJSON(
    JSON.parse(appXhr.responseText),
    JSON.parse(xhr.responseText)
);
