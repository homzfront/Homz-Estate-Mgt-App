export function removeEmptyFields<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== "" && value !== null && value !== undefined) {
      result[key as keyof T] = value;
    }
  }
  
  return result;
}