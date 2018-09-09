import * as _ from 'lodash';
import * as seedrandom from 'seedrandom';

export class Random {

    private _seed: any;

    constructor(seed: string) {
        this._seed = seed;
    }

    nextDouble(): number {
        const val = seedrandom(this._seed).double();
        this.resetSeed(val);
        return val;
    }

    nextInt(to: number): number {
        const num = this.nextDouble();
        return Math.floor(num * to);
    }

    nextIntRange(from: number, to: number): number {
        const num = this.nextDouble();
        return Math.floor(num * (to - from) + from);
    }

    private resetSeed(val: any): void {
        this._seed = val;
    } 
}