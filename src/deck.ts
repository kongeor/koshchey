import * as _ from 'lodash';

import { GameCard } from './gamecard';
import { CARDS, Turn } from './game';

export class Deck {

    private cards: GameCard[];
    private activeCardIdx: number;

    constructor(cards: GameCard[]) {
        this.cards = cards;
        this.activeCardIdx = 0;
    }

    public areAllDead(): boolean {
        return _.every(this.cards, c => c.isDead());
    }

    public cardAt(idx: number): GameCard {
        return this.cards[idx];
    }

    public advanceIndexes(turn: Turn) {
        let cardCount = CARDS;
        let currentIdx = this.activeCardIdx;

        if (turn === 'attacker') {
            cardCount--;
            currentIdx = this.nextIndex(this.activeCardIdx);
        }

        // check dead
    }

    public nextIndex(idx: number): number {
        return ++idx % CARDS;
    }
}