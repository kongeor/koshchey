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

const rnd = new Random("5");

console.log(rnd.nextIntRange(5, 8));
console.log(rnd.nextIntRange(5, 8));
console.log(rnd.nextIntRange(5, 8));

console.log(rnd.nextInt(3));
console.log(rnd.nextInt(3));
console.log(rnd.nextInt(3));

console.log(rnd.nextIntRange(5, 8));
console.log(rnd.nextIntRange(5, 8));
console.log(rnd.nextIntRange(5, 8));


// console.log(rnd.nextDouble());
// console.log(rnd.nextDouble());
// console.log(rnd.nextDouble());
// console.log(rnd.nextDouble());
// console.log(rnd.nextDouble());
// console.log(rnd.nextDouble());
// console.log(rnd.nextDouble());

// const vals = _.times(10000, x => rnd.nextDouble());

// const freqs = _
//     .chain(vals)
//     .map(x => x * 10)
//     .groupBy(Math.floor).value();

// console.log(freqs);