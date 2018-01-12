import { Deck } from './deck';

type Player = "p1" | "p2";

type State = "active" | "ended";

export type Turn = 'attacker' | 'defender';

export const CARDS = 5;

export class Game {
    private p1: Deck;
    private p2: Deck;

    private round: number;

    private state: State;

    private turn: Player;

    constructor(p1: Deck, p2: Deck) {
        this.p1 = p1;
        this.p2 = p2;

        this.p1.game = this;
        this.p2.game = this;

        this.round = 0;
        this.state = "active";

        this.turn = "p1";
    }

    static dummy(): Game {
        return new Game(Deck.dummy(), Deck.dummy());
    }

    public isFinished(): boolean {
        return this.p1.areAllDead() || this.p2.areAllDead();
    }

    private updateState(): void {
        if (this.isFinished()) {
            this.state = 'ended';
        }
    }

    public play() {
        while(this.state === 'active') {
            this.playRound();
        }
    }

    public playRound() {
        if (this.state === 'active') {
            this.playTurn();
            this.updateState();
            this.advanceIndexes();
            this.switchTurn();
            this.round++;
        }
    }

    private playTurn(): number {
        switch (this.turn) {
            case 'p1': return this.playDeckAgainst(this.p1, this.p2);
            case 'p2': return this.playDeckAgainst(this.p2, this.p1);
        }
    }

    private playDeckAgainst(attacker: Deck, defender: Deck): number {
        let attackingCard = attacker.getActiveCard();
        let defendingCard = defender.getActiveCard();

        let passiveAbility = attackingCard.passiveAbility;
        if (passiveAbility) {
            passiveAbility.perform(attackingCard, defendingCard,
                attacker, defender, this);
        }

        let attackingAbility = attackingCard.attackingAbility;

        let damage = 0; // TODO
        if (attackingAbility) {
            attackingAbility.perform(attackingCard, defendingCard, 
                attacker, defender, this);
        } else {
            damage = attackingCard.playCardAgainst(defendingCard);
        }

        return damage;
    }

    private advanceIndexes(): void {
        if (this.turn == 'p1') {
            this.p1.advanceIndexes('attacker');
            this.p2.advanceIndexes('defender');
        } else {
            this.p1.advanceIndexes('defender');
            this.p2.advanceIndexes('attacker');
        }
    }

    private switchTurn(): void {
        if (this.turn == 'p1') {
            this.turn = 'p2';
        } else {
            this.turn = 'p1';
        }
    }

    toString(): string {
        return `Round: ${this.round}, State: ${this.state}, ${this.stateDescription()}\n${this.p1}\n${this.p2}`;
    }

    private stateDescription(): string {
        if(this.isFinished()) {
            if (this.p1.areAllDead() && this.p2.areAllDead()) {
                return 'Result: Tie';
            } else if (this.p1.areAllDead()) {
                return 'Result: P2 wins';
            } else {
                return 'Result: P1 wins';
            }
        }
        return `Turn: ${this.turn}`;
    }
}