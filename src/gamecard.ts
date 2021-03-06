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

  constructor(card: Card) {
    this._attack = this._initialAttack = card.attack;
    this._life = this._initialLife = card.life;
    this._luck = card.luck;
    this._abilities = _.map(card.abilities, CardAbility.createFromNum);
  }

  get attack(): number {
    return this._attack;
  }

  get life(): number {
    return this._life;
  }

  get luck(): number {
    return this._luck;
  }

  get abilities(): CardAbility[] {
    return this._abilities;
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

  attackCard(other: GameCard): MoveLog[] {
    const damage = other.reduceLife(this._attack);
    let logs: MoveLog[] = [{'source': this.asData(), 'target': other.asData(),
      'damage': damage}];
    return logs;
  }

  playCardAgainst(game: Game, other: GameCard, attacker: Deck, defender: Deck): MoveLog[] {
    let logs: MoveLog[] = this.attackCard(other);

    const defendingAbility = other.defendingAbility;
    if (other.defendingAbility) {
        // TODO logs
        logs = logs.concat(other.defendingAbility.perform(game, attacker, defender));
    } else {
        const counter = game.rnd.nextDouble() > 0.7;

        if (counter) {
          const counterLogs = other.attackCard(this);
          logs = logs.concat(counterLogs.map(log => _.merge(log, {'counter': true})));
        }
    }
    return logs;
  }

  reduceLife(amount: number): number {
    const damage = Math.min(amount, this.life);
    this._life -= damage;
    return damage;
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