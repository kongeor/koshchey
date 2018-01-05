import { Deck } from './deck';

type Player = "p1" | "p2";

type State = "active" | "ended";

export type Turn = 'attacker' | 'defender';

export const CARDS = 5;

export class Game {

    private p1: Deck;
    private p2: Deck;

    private p1Idx: CardIdx;
    private p2Idx: CardIdx;

    private round: number;

    private state: State;

    private turn: Player;

    constructor(p1: Deck, p2: Deck) {
        this.p1 = p1;
        this.p2 = p2;

        this.p1Idx = 0;
        this.p2Idx = 0;

        this.round = 0;
        this.state = "active";

        this.turn = "p1";
    }

    public isFinished(): boolean {
        return this.p1.areAllDead() || this.p2.areAllDead();
    }

    private updateState(): void {
        if (this.isFinished()) {
            this.state = 'ended';
        }
    }

    public playRound() {
        if (this.state === 'active') {
            this.playTurn();
            this.advanceIndexes();
            this.switchTurn();
        }
    }

    private playTurn(): number {
        switch (this.turn) {
            case 'p1': return this.playDeckAgainst(this.p1, this.p1Idx, this.p2, this.p2Idx);
            case 'p2': return this.playDeckAgainst(this.p2, this.p2Idx, this.p1, this.p1Idx);
        }
    }

    private playDeckAgainst(attacker: Deck, attackerIdx: number, 
        defender: Deck, defenderIdx: number): number {
        let attackingCard = attacker.cardAt(attackerIdx);
        let defendingCard = defender.cardAt(defenderIdx);

        const damage = attackingCard.attackCard(defendingCard);

        const counter = Math.random() > 0.5;

        if (counter) {
            defendingCard.attackCard(attackingCard);
        }

        return damage;
    }

    private advanceIndexes(): void {

    }

    private switchTurn(): void {
        if (this.turn = 'p1') {
            this.turn = 'p2';
        } else {
            this.turn = 'p1';
        }
    }

}