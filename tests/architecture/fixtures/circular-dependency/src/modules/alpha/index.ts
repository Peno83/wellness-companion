import { beta } from "../beta";

export function alpha(): string {
  return `alpha-${beta()}`;
}
