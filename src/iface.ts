import { Deck } from "./deck";
import { Player } from "./game";
import { GameCard } from "./gamecard";
import { Card } from "./card";
import { Ability, CardAbility } from "./ability";

export interface DeckData {
    cards: CardData[];
    activeCardIdx: number;
}

export interface CardData {
  attack: number;
  initialAttack: number;
  life: number;
  initialLife: number;
  luck: number;
  abilities: string[];
}

export interface MoveLog {
    source: CardData;
    target?: CardData;
    ability?: Ability;
    damage?: number;
    resurrected?: boolean;
    healing?: number;
    rotation?: number;
    counter?: boolean;
}

export interface TurnLog {
    p1: DeckData;
    p2: DeckData;

    round: number;
    turn: Player;

    moves: MoveLog[];

}