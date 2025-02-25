import { environment } from '../../environments/environment';
import { SignalRConfiguration } from 'ng2-signalr';

export function signalrConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'vnpostclient';
  c.qs = { key: 'webapp' };
  c.url = `${environment.apiDomain.notificationHub}`;
  c.logging = true;

  c.executeEventsInZone = true;
  c.executeErrorsInZone = false;
  c.executeStatusChangeInZone = true;
  return c;
}
