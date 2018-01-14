import { Card } from './card';
import { CardAbility, Ability } from './ability';
import * as _ from 'lodash';
import { Deck } from './deck';
import { Game } from './game';
import { CardData, MoveLog } from './iface';

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

  get deck(): Deck {
    return this._deck;
  }

  get life(): number {
    return this._life;
  }

  // ability filters
  get preRoundAbility(): CardAbility | undefined {
    return _.head(_.filter(this._abilities, a => a.isPreRound()));
  }

  get defendingAbility(): CardAbility | undefined {
    return _.head(_.filter(this._abilities, a => a.isDefending()));
  }

  get attackingAbility(): CardAbility | undefined {
    return _.head(_.filter(this._abilities, a => a.isAttacking()));
  }

  get postRoundAbilitiy(): CardAbility | undefined {
    return _.head(_.filter(this._abilities, a => a.isPostRound()));
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

  playCardAgainst(other: GameCard): MoveLog[] {
    // TODO in some cases like confusion 
    // the defending ability must come first
    // in these cases the order of the cards/parameters also matters
    const damage = this.attackCard(other);

    let logs: MoveLog[] = [{'source': this.asData(), 'target': other.asData(),
      'damage': damage}];

    if (other.defendingAbility) {
        // TODO logs
        logs = logs.concat(other.defendingAbility.perform(this._deck, other._deck));
    } else {
        const counter = Math.random() > 0.7;

        if (counter) {
          other.attackCard(this);
          logs.push({'source': this.asData(), 'target': other.asData(),
            'damage': damage, 'counter': true
          })
        }
    }
    return logs;
  }

  reduceLife(amount: number): void {
    this._life -= amount;
  }

  resurrect(): boolean {
    // TODO check: passive activities can be performed in GameCard
    if (this.isDead()) {
      this._life += 1;
      return true;
    }
    return false;
  }

  heal(): number {
    if (this.isAlive() && this.life < this._initialLife) {
      const before = this._life;
      this._life += 1;
      return this._life - before;
    }
    return 0;
  }

  asData(): CardData {
    return {
      'attack': this._attack,
      'initialAttack': this._initialAttack,
      'life': this._life,
      'initialLife': this._initialLife,
      'luck':this._luck,
      'abilities': this._abilities.map(c => Ability[c.ability()])
    };
  }

  toString(): string {
    const abString = _.map(this._abilities, a => a.toString()).join();
    return `{ ${this._attack}/${this._initialAttack} ⚔ - ${this._life}/${this._initialLife} ♥ - ${this._luck} ☘ - [${abString}] }`;
  }

}