import { Deck } from './deck';
import { TurnLog, MoveLog } from './iface';

export type Player = "p1" | "p2";

type State = "active" | "ended";

export type Turn = 'attacker' | 'defender';

export const CARDS = 5;

export class Game {
    private p1: Deck;
    private p2: Deck;

    private round: number;

    private state: State;

    private turn: Player;

    private _logs: TurnLog[];

    constructor(p1: Deck, p2: Deck) {
        this.p1 = p1;
        this.p2 = p2;

        this.p1.game = this;
        this.p2.game = this;

        this.round = 0;
        this.state = "active";

        this.turn = "p1";

        this._logs = [];
    }

    static dummy(): Game {
        return new Game(Deck.dummy(), Deck.dummy());
    }

    get logs(): TurnLog[] {
        return this._logs;
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
            this._logs.push(this.playTurn());
        }
    }

    private playTurn(): TurnLog {
        switch (this.turn) {
            case 'p1': return this.playDeckAgainst(this.p1, this.p2);
            case 'p2': return this.playDeckAgainst(this.p2, this.p1);
        }
    }

    private playDeckAgainst(attacker: Deck, defender: Deck): TurnLog {
        let attackingCard = attacker.getActiveCard();
        let defendingCard = defender.getActiveCard();

        let moveLogs: MoveLog[] = [];

        let passiveAbility = attackingCard.preRoundAbility;
        if (passiveAbility) {
            moveLogs = passiveAbility.perform(attacker, defender);
        }

        let attackingAbility = attackingCard.attackingAbility;

        if (attackingAbility) {
            moveLogs = moveLogs.concat(attackingAbility.perform(attacker, defender));
        } else {
            moveLogs = moveLogs.concat(attackingCard.playCardAgainst(defendingCard));
        }

        this.updateState();

        // TODO hack
        if (!this.isFinished()) {
            const postRoundAbility = attackingCard.postRoundAbilitiy;
            if (postRoundAbility) {
                moveLogs = moveLogs.concat(postRoundAbility.perform(attacker, defender));
            }
        }

        this.advanceIndexes();
        this.switchTurn();
        this.round++;

        return {
            'p1': attacker.asData(),
            'p2': defender.asData(),
            'round': this.round,
            'turn': this.turn,
            'moves': moveLogs
        };
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
        return `Round: ${this.round}, P1 Idx: ${this.p1.getActiveCardIdx()}, P2 Idx: ${this.p2.getActiveCardIdx()}, State: ${this.state}, ${this.stateDescription()}\n${this.p1}\n${this.p2}`;
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