import { GameCard } from "./gamecard";
import { Deck } from "./deck";
import { Game } from "./game";

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
   * Passive abilities will be played before attacking. Such
   * abilities include healing, resurrecting, shuffling, etc.
   */
  abstract isPassive(): boolean;

  /**
   * Defending card will be picked when this card is being attacked
   * by another one
   */
  abstract isDefending(): boolean;

  /**
   * Attacking abilities can also alter card indexes, switch turns,
   * shuffle etc.
   */
  abstract isAttacking(): boolean;

  abstract perform(attackingCard: GameCard, defendingCard: GameCard,
    attacker: Deck, defender: Deck, game: Game): void;

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

  isPassive(): boolean {
    return true;
  }

  isDefending(): boolean {
    return false;
  }

  isAttacking(): boolean {
    return false;
  }

  perform(attackingCard: GameCard, defendingCard: GameCard, attacker: Deck, defender: Deck, game: Game): void {
    // TODO when is the proper time to resurrect?
    attackingCard.resurrect();
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

  isPassive(): boolean {
    return true;
  }

  isDefending(): boolean {
    return false;
  }

  isAttacking(): boolean {
    return false;
  }

  perform(attackingCard: GameCard, defendingCard: GameCard, attacker: Deck, defender: Deck, game: Game): void {
    const next = attacker.nextCard();
    if (next.isAlive()) {
      next.heal();
    }
    const previous = attacker.previousCard();
    if (previous.isAlive()) {
      previous.heal();
    }
  }

  toString(): string {
    return '✚';
  }

}

class RotationAbility extends CardAbility {

  ability(): Ability {
    return Ability.Rotate1;
  }

  isPassive(): boolean {
    return true;
  }

  isDefending(): boolean {
    return false;
  }

  isAttacking(): boolean {
    return false;
  }

  perform(attackingCard: GameCard, defendingCard: GameCard, attacker: Deck, defender: Deck, game: Game): void {
    defender.rotate(1);
  }

  toString(): string {
    return '↺';
  }

}

class ConfusionAbility extends CardAbility {

  ability(): Ability {
    return Ability.Confusion;
  }

  isPassive(): boolean {
    return false;
  }

  isDefending(): boolean {
    return true;
  }

  isAttacking(): boolean {
    return false;
  }

  perform(attackingCard: GameCard, defendingCard: GameCard, attacker: Deck, defender: Deck, game: Game): void {
    let card = attacker.previousAliveCard();
    if (card) {
        attackingCard.playCardAgainst(card); 
    }
  }

  toString(): string {
    return '☹';
  }
}

class DeathtouchAbility extends CardAbility {

  ability(): Ability {
    return Ability.Deathtouch;
  }

  isPassive(): boolean {
    return false;
  }

  isDefending(): boolean {
    return false;
  }

  isAttacking(): boolean {
    return true;
  }

  perform(attackingCard: GameCard, defendingCard: GameCard, attacker: Deck, defender: Deck, game: Game): void {
    // TODO create a defending ability
    // TODO create a class method
    defendingCard.reduceLife(defendingCard.life);
  }

  toString(): string {
    return '☠';
  }
}

class BloodlustAbility extends CardAbility {

  ability(): Ability {
    return Ability.Bloodlust;
  }

  isPassive(): boolean {
    return true;
  }

  isDefending(): boolean {
    return false;
  }

  isAttacking(): boolean {
    return true;
  }


  perform(attackingCard: GameCard, defendingCard: GameCard, attacker: Deck, defender: Deck, game: Game): void {
    let killed;
    do  {
        const card = defender.getActiveCard();
        attackingCard.playCardAgainst(card);
        killed = card.isDead();
    } while(attackingCard.isAlive() && killed && defender.advanceIndexes('attacker'));
  }

  toString(): string {
    return '💧';
  }


}