export function getClientId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'repopilot_client_id';
  let clientId = localStorage.getItem(KEY);
  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem(KEY, clientId);
  }
  return clientId;
}
