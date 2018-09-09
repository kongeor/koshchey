import * as _ from 'lodash';

import { GameCard } from './gamecard';
import { CARDS, Turn, Game } from './game';
import { DeckData, MoveLog } from './iface';

export class Deck {

    private _cards: GameCard[];
    private _activeCardIdx: number;

    constructor(cards: GameCard[]) {
        this._cards = cards;
        this._activeCardIdx = 0;
    }

    get cards(): GameCard[] {
        return this._cards;
    }

    static dummy(): Deck {
        return new Deck([]);
    }

    public areAllDead(): boolean {
        return _.every(this._cards, c => c.isDead());
    }

    public getActiveCard(): GameCard {
        return this.cardAt(this._activeCardIdx);
    }

    public getActiveCardIdx(): number {
        return this._activeCardIdx;
    }

    public cardAt(idx: number): GameCard {
        return this._cards[idx];
    }

    public nextCard(): GameCard {
        return this._cards[this.nextIndex(this._activeCardIdx)];
    }

    public previousCard(): GameCard {
        return this._cards[this.previousIndex(this._activeCardIdx)];
    }

    public previousAliveCard(): GameCard | undefined {

        let currentIdx = this.previousIndex(this._activeCardIdx);

        while (currentIdx !== this._activeCardIdx && !this.cardAt(currentIdx).isAlive()) {
            currentIdx = this.previousIndex(currentIdx);
        }

        if (currentIdx !== this._activeCardIdx) {
            return this.cardAt(currentIdx);
        }
    }

    public advanceIndexes(turn: Turn): boolean {
        let cardCount = CARDS;
        let currentIdx = this._activeCardIdx;

        if (turn === 'attacker') {
            currentIdx = this.nextIndex(this._activeCardIdx);
        }

        // TODO improve
        // technically as soon as we visit the same card it
        // means that we can stop looping
        let found = false;
        for (var i = 0; i < cardCount; i++) {
            if (this.cardAt(currentIdx).isAlive()) {
                found = true;
                break;
            }
            currentIdx = this.nextIndex(this._activeCardIdx);
        }

        this._activeCardIdx = currentIdx;
        return found;
    }

    public nextIndex(idx: number): number {
        return ++idx % CARDS;
    }

    public previousIndex(idx: number): number {
        return (CARDS + idx -1) % CARDS;
    }

    public rotate(n: number): void {
        if (Math.abs(n) >= CARDS) {
            throw "abs(n) must be less than the number of cards in the deck";
        }
        let steps = n;
        if (n < 0) {
            steps = CARDS - n;
        }
        this._cards = _.take(_.drop(_.concat(this._cards, this._cards), steps), CARDS);
    }

    // TODO not used atm
    // public performPostRoundAbilities(): MoveLog[] {
    //     let logs: MoveLog[] = [];
    //     this.cards.forEach(card => {
    //         if (card.postRoundAbilitiy) {
    //             // TODO should provide a method
    //             // to override the active card
    //             logs = logs.concat(card.postRoundAbilitiy.perform(this, Deck.dummy()));
    //         }
    //     })
    //     return logs;
    // }

    toString(): string {
        const cardStrs = _.map(this._cards, c => c.toString());
        const deckStr = cardStrs.join(" ");
        const playCardIdx = _.take(cardStrs, this._activeCardIdx).map(s => s.length).reduce((sum, n) => sum + n, 0);
        const cardPointerStr = _.times(playCardIdx + this._activeCardIdx, x => " ").join("");
        return deckStr + "\n" + cardPointerStr + "⇑";
    }

    asData(): DeckData {
        return { 'cards': []
        // TODO
        // _.map(this.cards, c => c.asData())
        , 'activeCardIdx': this._activeCardIdx };
    }
}