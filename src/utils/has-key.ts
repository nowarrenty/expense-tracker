const hasKey = <T>(obj: T, key: string | number | symbol): key is keyof T => {
  return key in obj;
};
export default hasKey;
