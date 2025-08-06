// Substituído por URLSearchParams nativo
export const parseQueryString = (query: string) => {
  return Object.fromEntries(new URLSearchParams(query));
};

export const stringifyQuery = (params: Record<string, any>) => {
  return new URLSearchParams(params).toString();
};