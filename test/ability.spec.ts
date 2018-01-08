import { GameCard } from '../src/gamecard';
import { Gen } from '../src/gen';
import { expect } from 'chai';
import 'mocha';
import { HealingAbility } from '../src/ability';

describe('Abilities', () => {

    describe('Healing Ability', () => {
        it('should heal', () => {
            const d1 = Gen.genSimpleDeck();
            const d2 = Gen.genSimpleDeck();
            d1.cardAt(1).reduceLife(1);
            d1.cardAt(4).reduceLife(1);
            const ab = new HealingAbility();
            expect(d1.cardAt(1).life).to.be.eq(2);
            expect(d1.cardAt(4).life).to.be.eq(2);
            ab.perform(d1.getActiveCard(), null, d1, null, null);
            expect(d1.cardAt(1).life).to.be.eq(3);
            expect(d1.cardAt(4).life).to.be.eq(3);
        });
    });

});