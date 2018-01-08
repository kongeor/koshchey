import { Card } from './card';
import { CardAbility, Ability } from './ability';
import * as _ from 'lodash';

export class GameCard {

  private _attack: number;
  private readonly _initialAttack: number;
  private _life: number;
  private readonly _initialLife: number;
  private _luck: number;
  private _abilities: CardAbility[];

  constructor(card: Card) {
    this._attack = this._initialAttack = card.attack;
    this._life = this._initialLife = card.life;
    this._luck = card.luck;
    // this.abilities = _.map(card.abilities, CardAbility.create); // TODO
  }

  get life(): number {
    return this._life;
  }

  // ability filters
  get passiveAbility(): CardAbility | undefined {
    return _.head(_.filter(this._abilities, a => a.isPassive()));
  }

  get defendingAbility(): CardAbility | undefined {
    return _.head(_.filter(this._abilities, a => a.isDefending()));
  }

  get attackingAbility(): CardAbility | undefined {
    return _.head(_.filter(this._abilities, a => a.isAttacking()));
  }

  isAlive(): boolean {
    return this._life > 0;
  }

  isDead(): boolean {
    return !this.isAlive();
  }

  attackCard(other: GameCard): number {
    const damage = Math.min(this._attack, other.life);
    other.reduceLife(damage);
    return damage;
  }

  reduceLife(amount: number): void {
    this._life -= amount;
  }

  resurrect(): void {
    // TODO check: passive activities can be performed in GameCard
    if (this.isDead()) {
      this._life += 1;
    }
  }

  heal(): void {
    if (this.isAlive() && this.life < this._initialLife) {
      this._life += 1;
    }
  }

}