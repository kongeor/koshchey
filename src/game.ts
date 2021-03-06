import { Deck } from './deck';
import { TurnLog, MoveLog } from './iface';
import { Random } from './random';

export type Player = "p1" | "p2";

type State = "active" | "ended";

export type Turn = 'attacker' | 'defender';

export const CARDS = 5;

export class Game {
    private _p1: Deck;
    private _p2: Deck;

    private round: number;

    private state: State;

    private turn: Player;

    private _logs: TurnLog[];

    private _rnd: Random;

    constructor(p1: Deck, p2: Deck, rnd: Random) {
        this._p1 = p1;
        this._p2 = p2;

        this.round = 0;
        this.state = "active";

        this.turn = "p1";

        this._logs = [];

        this._rnd = rnd;
    }

    get p1(): Deck {
        return this._p1;
    }

    get p2(): Deck {
        return this._p2;
    }

    get logs(): TurnLog[] {
        return this._logs;
    }

    get rnd(): Random {
        return this._rnd;
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
            case 'p1': return this.playDeckAgainst(this, this.p1, this.p2);
            case 'p2': return this.playDeckAgainst(this, this.p2, this.p1);
        }
    }

    private playDeckAgainst(game: Game, attacker: Deck, defender: Deck): TurnLog {
        let attackingCard = attacker.getActiveCard();
        let defendingCard = defender.getActiveCard();

        let moveLogs: MoveLog[] = [];

        let passiveAbility = attackingCard.preRoundAbility;
        if (passiveAbility) {
            moveLogs = passiveAbility.perform(game, attacker, defender);
        }

        let attackingAbility = attackingCard.attackingAbility;
        let defendingAbility = defendingCard.defendingAbility;

        if (defendingAbility && defendingAbility.playsBeforeAttack(attackingAbility)) {
            moveLogs = moveLogs.concat(defendingAbility.perform(game, attacker, defender));
        } else if (attackingAbility) {
            moveLogs = moveLogs.concat(attackingAbility.perform(game, attacker, defender));
        } else {
            moveLogs = moveLogs.concat(attackingCard.playCardAgainst(game, defendingCard, attacker, defender));
        }

        this.updateState();

        // TODO hack
        if (!this.isFinished()) {
            const postRoundAbility = attackingCard.postRoundAbilitiy;
            if (postRoundAbility) {
                moveLogs = moveLogs.concat(postRoundAbility.perform(game, attacker, defender));
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