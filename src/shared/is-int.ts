// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isInt = (value: any): boolean => {
  return !isNaN(value) && 
    parseInt(value) == value && 
    !isNaN(parseInt(value, 10));
}
