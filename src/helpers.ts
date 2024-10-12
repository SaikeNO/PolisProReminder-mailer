export const toCamelCaseKeys = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key of Object.keys(obj)) {
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);
    result[newKey] = obj[key];
  }

  return result;
};
