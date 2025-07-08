import { createClient } from '@blinkdotnew/sdk';

export const blink = createClient({
  projectId: 'lunastram-streaming-website-bbz7b204',
  authRequired: false // We'll handle admin auth separately
});