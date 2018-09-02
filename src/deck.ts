import * as _ from 'lodash';

import { GameCard } from './gamecard';
import { CARDS, Turn, Game } from './game';
import { DeckData, MoveLog } from './iface';

export class Deck {

    private cards: GameCard[];
    private activeCardIdx: number;

    // private _game: Game;

    constructor(cards: GameCard[]) {
        this.cards = cards;
        // this.cards.forEach(c => {
        //     c.deck = this;
        // })
        this.activeCardIdx = 0;
    }

    // set game(game: Game) {
    //     this._game = game;
    // } 

    static dummy(): Deck {
        return new Deck([]);
    }

    public areAllDead(): boolean {
        return _.every(this.cards, c => c.isDead());
    }

    public getActiveCard(): GameCard {
        return this.cardAt(this.activeCardIdx);
    }

    public getActiveCardIdx(): number {
        return this.activeCardIdx;
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

    public previousAliveCard(): GameCard | undefined {

        let currentIdx = this.previousIndex(this.activeCardIdx);

        while (currentIdx !== this.activeCardIdx && !this.cardAt(currentIdx).isAlive()) {
            currentIdx = this.previousIndex(currentIdx);
        }

        if (currentIdx !== this.activeCardIdx) {
            return this.cardAt(currentIdx);
        }
    }

    public advanceIndexes(turn: Turn): boolean {
        let cardCount = CARDS;
        let currentIdx = this.activeCardIdx;

        if (turn === 'attacker') {
            currentIdx = this.nextIndex(this.activeCardIdx);
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
            currentIdx = this.nextIndex(this.activeCardIdx);
        }

        this.activeCardIdx = currentIdx;
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
        this.cards = _.take(_.drop(_.concat(this.cards, this.cards), steps), CARDS);
    }

    // TODO not used atm
    public performPostRoundAbilities(): MoveLog[] {
        let logs: MoveLog[] = [];
        this.cards.forEach(card => {
            if (card.postRoundAbilitiy) {
                // TODO should provide a method
                // to override the active card
                logs = logs.concat(card.postRoundAbilitiy.perform(this, Deck.dummy()));
            }
        })
        return logs;
    }

    toString(): string {
        const cardStrs = _.map(this.cards, c => c.toString());
        const deckStr = cardStrs.join(" ");
        const playCardIdx = _.take(cardStrs, this.activeCardIdx).map(s => s.length).reduce((sum, n) => sum + n, 0);
        const cardPointerStr = _.times(playCardIdx + this.activeCardIdx, x => " ").join("");
        return deckStr + "\n" + cardPointerStr + "⇑";
    }

    asData(): DeckData {
        return { 'cards': []
        // TODO
        // _.map(this.cards, c => c.asData())
        , 'activeCardIdx': this.activeCardIdx };
    }
}