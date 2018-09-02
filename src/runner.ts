import { Random } from "./random";
import { Gen } from "./gen";
import { Game } from "./game";

class Runner {
    public static main(): number {
        const rnd = new Random("yo");
        const p1 = Gen.randomDeck(rnd)
        const p2 = Gen.randomDeck(rnd);
        const game = new Game(p1, p2, rnd);
        while(!game.isFinished()) {
            console.log(game.toString());
            console.log();
            game.playRound();
        }
        console.log(game.toString());
        // console.log(JSON.stringify(game.logs, null, 4));
        console.log();
        return 0;
    }
}

Runner.main();