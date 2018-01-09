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

    public getActiveCard(): GameCard {
        return this.cardAt(this.activeCardIdx);
    }

    public cardAt(idx: number): GameCard {
        return this.cards[idx];
    }

    public nextCard(): GameCard {
        return this.cards[this.nextIndex(this.activeCardIdx)];
    }

    public previousCard(): GameCard {
        return this.cards[this.previousIndex(this.activeCardIdx)];
    }

    public advanceIndexes(turn: Turn) {
        let cardCount = CARDS;
        let currentIdx = this.activeCardIdx;

        if (turn === 'attacker') {
            // for attackers we start from the next card
            // so we need to check one card less
            cardCount--;
            currentIdx = this.nextIndex(this.activeCardIdx);
        }

        // TODO improve
        // technically as soon as we visit the same card it
        // means that we can stop looping
        for (var i = 0; i < cardCount; i++) {
            if (this.cardAt(currentIdx).isAlive()) {
                break;
            }
            currentIdx = this.nextIndex(this.activeCardIdx);
        }

        this.activeCardIdx = currentIdx;
    }

    public nextIndex(idx: number): number {
        return ++idx % CARDS;
    }

    public previousIndex(idx: number): number {
        return (CARDS + idx -1) % CARDS;
    }

    toString(): string {
        const cardStrs = _.map(this.cards, c => c.toString());
        const deckStr = cardStrs.join(" ");
        const playCardIdx = _.take(cardStrs, this.activeCardIdx).map(s => s.length).reduce((sum, n) => sum + n, 0);
        const cardPointerStr = _.times(playCardIdx + this.activeCardIdx * 2, x => " ").join("");
        return deckStr + "\n" + cardPointerStr + "⇑";
    }
}