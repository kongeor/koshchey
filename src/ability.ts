import { GameCard } from "./gamecard";
import { Deck } from "./deck";
import { Game } from "./game";
import { MoveLog } from "./iface";
import * as _ from "lodash";

export enum Ability {
  // passive
  Undead = 1000,
  Healing = 1001,

  // passive/swapping
  Rotate1 = 2000,


  // defending
  Confusion = 4000,

  // attacking and defending
  // Foo = 5000

  // attacking pre
  Deathtouch = 6000,

  // attacking post
  Bloodlust = 7000,

}

export abstract class CardAbility {

  abstract ability(): Ability;

  /**
   * Pre round abilities will be played before attacking. Such
   * abilities include healing, rotating, etc.
   */
  public isPreRound(): boolean {
    return false;
  }

  /**
   * Defending card will be picked when this card is being attacked
   * by another one
   */
  public isDefending(): boolean {
    return false;
  }

  /**
   * Attacking abilities can also alter card indexes, switch turns,
   * shuffle etc.
   */
  public isAttacking(): boolean {
    return false;
  }

  /**
   * Post round abilities will be performed after end game check has been
   * made. This will allow abilities like resurrection to take place.
   */
  public isPostRound(): boolean {
    return false;
  }

  /**
   * Some abilities (like Confusion) will take place before the attacking ability
   */
  public playsBeforeAttack(other: CardAbility | undefined): boolean {
    return false;
  }

  abstract perform(attacker: Deck, defender: Deck): MoveLog[];

  public static create(from: Ability): CardAbility {
    switch (from) {
      case Ability.Undead: return new UndeadAbility();
      case Ability.Healing: return new HealingAbility();
      case Ability.Rotate1: return new RotationAbility();
      case Ability.Confusion: return new ConfusionAbility();
      case Ability.Deathtouch: return new DeathtouchAbility();
      case Ability.Bloodlust: return new BloodlustAbility();
    }
  }

  public static createFromNum(from: number): CardAbility {
    const ability = CardAbility.create(from);
    if (ability == undefined) {
      throw `Invalid ability identifier: ${from}`;
    }
    return ability;
  }

  public static allAbilities(): number[] {
    const nums: number[] = [];
    for (var ab in Ability) {
      const numAb = parseInt(ab, 10);
      if (numAb > 0) {
        nums.push(numAb);
      }
    }
    return nums;
  }

  abstract toString(): string;
}

class UndeadAbility extends CardAbility {

  ability(): Ability {
    return Ability.Undead;
  }

  isPostRound(): boolean {
    return true;
  }

  perform(attacker: Deck, defender: Deck): MoveLog[] {
    const source = attacker.getActiveCard();
    const resurrected = source.resurrect();
    return [{'source': source.asData(), 'ability': this.ability(), 
      'resurrected': resurrected
    }];
  }

  toString(): string {
    return `☭`
  }

}

/**
 * Heals the live creatures next to this card
 */
export class HealingAbility extends CardAbility {

  ability(): Ability {
    return Ability.Healing;
  }

  isPreRound(): boolean {
    return true;
  }

  perform(attacker: Deck, defender: Deck): MoveLog[] {
    const next = attacker.nextCard();
    const log: MoveLog[] = [];
    if (next.isAlive()) {
      const healing = next.heal();
      log.push({'source': attacker.getActiveCard().asData(),
        'target': next.asData(), 'healing': healing});
    }
    const previous = attacker.previousCard();
    if (previous.isAlive()) {
      const healing = previous.heal();
      log.push({'source': attacker.getActiveCard().asData(),
        'target': previous.asData(), 'healing': healing});
    }
    return log;
  }

  toString(): string {
    return '✚';
  }

}

class RotationAbility extends CardAbility {

  ability(): Ability {
    return Ability.Rotate1;
  }

  isPreRound(): boolean {
    return true;
  }

  perform(attacker: Deck, defender: Deck): MoveLog[] {
    defender.rotate(1);
    return [{'source': attacker.getActiveCard().asData(), 'rotation': 1,
      'ability': this.ability()}]
  }

  toString(): string {
    return '↺';
  }

}

class ConfusionAbility extends CardAbility {

  ability(): Ability {
    return Ability.Confusion;
  }

  isDefending(): boolean {
    return true;
  }

  playsBeforeAttack(other: CardAbility): boolean {
    return true;
  }

  perform(attacker: Deck, defender: Deck): MoveLog[] {
    let card = attacker.previousAliveCard();
    if (card) {
        const attackingCard = attacker.getActiveCard();
        const logs: MoveLog[] = attackingCard.attackCard(card); 
        return logs.map(log => _.merge(log, {'ability': this.ability()}));
    }
    return [];
  }

  toString(): string {
    return '☹';
  }
}

class DeathtouchAbility extends CardAbility {

  ability(): Ability {
    return Ability.Deathtouch;
  }

  isAttacking(): boolean {
    return true;
  }

  perform(attacker: Deck, defender: Deck): MoveLog[] {
    // TODO create a defending ability
    // TODO create a class method
    const defendingCard = defender.getActiveCard();
    defendingCard.reduceLife(defendingCard.life);
    return [{'source': attacker.getActiveCard().asData(), 
      'target': defendingCard.asData(), 'ability': this.ability(),
      'damage': defendingCard.life}];
  }

  toString(): string {
    return '☠';
  }
}

class BloodlustAbility extends CardAbility {

  ability(): Ability {
    return Ability.Bloodlust;
  }

  isAttacking(): boolean {
    return true;
  }

  perform(attacker: Deck, defender: Deck): MoveLog[] {
    let killed;
    let logs: MoveLog[] = [];
    do  {
        const card = defender.getActiveCard();
        logs = logs.concat(attacker.getActiveCard().playCardAgainst(card, attacker, defender));
        killed = card.isDead();
    } while(attacker.getActiveCard().isAlive() && killed && defender.advanceIndexes('attacker'));
    return logs.map(log => _.merge(log, {'ability': this.ability()}));
  }

  toString(): string {
    return '⚇';
  }


}