import { isEqual } from "lodash";

export function findObjectChanges(oldObj: any, newObj: any) {
  const changes: { [key: string]: { oldValue: any; newValue: any } } = {};

  for (const key in newObj) {
    if (typeof oldObj[key] === "object" || typeof newObj[key] === "object") {
      continue;
    } else if (!isEqual(oldObj[key], newObj[key])) {
      changes[key] = {
        oldValue: oldObj[key],
        newValue: newObj[key],
      };
    }
  }

  return changes;
}
