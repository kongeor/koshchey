import { GameCard } from '../src/gamecard';
import { Gen } from '../src/gen';
import { expect } from 'chai';
import 'mocha';
import { HealingAbility } from '../src/ability';
import { Game } from '../src/game';
import { Random } from '../src/random';

describe('Abilities', () => {

    describe('Healing Ability', () => {
        it('should heal', () => {
            const d1 = Gen.getFlatDeck();
            const d2 = Gen.getFlatDeck();
            d1.cardAt(1).reduceLife(1);
            d1.cardAt(4).reduceLife(1);
            const ab = new HealingAbility();
            expect(d1.cardAt(1).life).to.be.eq(2);
            expect(d1.cardAt(4).life).to.be.eq(2);
            const game = new Game(d1, d2, new Random("seed"));
            ab.perform(game, d1, d2);
            expect(d1.cardAt(1).life).to.be.eq(3);
            expect(d1.cardAt(4).life).to.be.eq(3);
        });
    });

});