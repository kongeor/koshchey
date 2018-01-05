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

  isDead(): boolean {
    return !this.isAlive();
  }

  attackCard(other: GameCard): number {
    const damage = Math.min(this.attack, other.life);
    other.reduceLife(damage);
    return damage;
  }

  reduceLife(amount: number): void {
    this.life -= amount;
  }

}