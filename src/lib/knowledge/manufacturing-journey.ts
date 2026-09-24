/**
 * The conceptual chip-manufacturing journey — a reusable learning map that shows
 * where a topic (photolithography, etching, doping, packaging, …) sits in the
 * flow. It is deliberately a teaching aid, not a literal one-pass sequence:
 * modern fabrication REPEATS and INTERLEAVES most of these steps many times
 * (see JOURNEY_NOTE).
 */

export interface JourneyStep {
  id: string;
  label: string;
}

export const MANUFACTURING_JOURNEY: JourneyStep[] = [
  { id: "wafer", label: "Silicon wafer" },
  { id: "deposition", label: "Film formation / deposition" },
  { id: "photoresist", label: "Photoresist" },
  { id: "lithography", label: "Photolithography" },
  { id: "etching", label: "Etching" },
  { id: "doping", label: "Doping" },
  { id: "cleaning", label: "Cleaning / processing" },
  { id: "repeat", label: "Repeated layer formation" },
  { id: "interconnect", label: "Interconnect formation" },
  { id: "wafer-test", label: "Wafer test" },
  { id: "dicing", label: "Dicing" },
  { id: "packaging", label: "Packaging" },
  { id: "final-test", label: "Final test" },
  { id: "device", label: "Finished device" },
];

export const JOURNEY_NOTE =
  "A conceptual learning map, not a literal one-pass sequence — real fabrication repeats and interleaves many of these steps many times to build a chip layer by layer.";

const BY_ID = new Map(MANUFACTURING_JOURNEY.map((s) => [s.id, s]));

export function getJourneyStep(id: string): JourneyStep | undefined {
  return BY_ID.get(id);
}
