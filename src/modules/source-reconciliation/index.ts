import type { SourceCandidate } from "@modules/source-selection";

export function identifyTransportedDuplicates(
  candidates: readonly SourceCandidate[],
): readonly SourceCandidate[] {
  return candidates.filter(
    (candidate) => candidate.duplicateOfSourceIdentifier !== null,
  );
}
