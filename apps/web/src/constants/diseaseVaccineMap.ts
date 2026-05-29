import { VaccineKey } from "./vaccineData";

// Using explicit Record type ensuring value maps strictly to a known database ID
export const diseaseVaccineMap: Record<string, VaccineKey> = {
  polio: "polio",
  poliomyelitis: "polio",
  measles: "measles",
  mumps: "measles",
  rubella: "measles",
  hpv: "hpv",
  cervical: "hpv",
  covid: "corona",
  coronavirus: "corona",
  tuberculosis: "bcg",
  tb: "bcg",
  tetanus: "tetanus_maternal"
};