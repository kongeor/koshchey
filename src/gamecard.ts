import { Card } from './card';
import { Ability } from './ability';

export class GameCard implements Card {

  attack: number;
  life: number;
  luck: number;
  abilities: [Ability];

  constructor(card: Card) {
    this.attack = card.attack;
    this.life = card.life;
  }

  isAlive(): boolean {
    return this.life > 0;
  }

}