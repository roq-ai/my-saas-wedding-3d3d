const mapping: Record<string, string> = {
  assistants: 'assistant',
  'bride-grooms': 'bride_groom',
  'quote-requests': 'quote_request',
  users: 'user',
  vendors: 'vendor',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
