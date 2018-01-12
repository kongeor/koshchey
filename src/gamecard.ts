import { Card } from './card';
import { CardAbility, Ability } from './ability';
import * as _ from 'lodash';
import { Deck } from './deck';
import { Game } from './game';

export class GameCard {

  private _attack: number;
  private readonly _initialAttack: number;
  private _life: number;
  private readonly _initialLife: number;
  private _luck: number;
  private _abilities: CardAbility[];

  private _deck: Deck;

  constructor(card: Card) {
    this._attack = this._initialAttack = card.attack;
    this._life = this._initialLife = card.life;
    this._luck = card.luck;
    this._abilities = _.map(card.abilities, CardAbility.createFromNum);
  }

  set deck(deck: Deck) {
    this._deck = deck;
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

  private attackCard(other: GameCard): number {
    const damage = Math.min(this._attack, other.life);
    other.reduceLife(damage);
    return damage;
  }

  playCardAgainst(other: GameCard): number {
    // TODO in some cases like confusion 
    // the defending ability must come first
    // in these cases the order of the cards/parameters also matters
    const damage = this.attackCard(other);

    if (other.defendingAbility) {
        // TODO
        other.defendingAbility.perform(other, this, Deck.dummy(), Deck.dummy(), 
        Game.dummy());
    } else {
        const counter = Math.random() > 0.7;

        if (counter) {
          other.attackCard(this);
        }
    }

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

  toString(): string {
    const abString = _.map(this._abilities, a => a.toString()).join();
    return `{ ${this._attack}/${this._initialAttack} ⚔ - ${this._life}/${this._initialLife} ♥ - ${this._luck} ☘ - [${abString}] }`;
  }

}