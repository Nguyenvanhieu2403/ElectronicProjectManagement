import { EnvironmentSchema } from './environment-schema';

// Specify your environment here
const env = 'prod';
const xhr = new XMLHttpRequest();
xhr.open('GET', `/assets/environments/${env}.json`, false);
xhr.send(null);
export const environment: EnvironmentSchema = JSON.parse(xhr.responseText);
