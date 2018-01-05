import { Ability } from "./ability";

export interface Card {
  attack: number;
  life: number;
  luck: number;
  abilities: [Ability];
}