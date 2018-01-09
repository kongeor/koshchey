import { Gen } from "./gen";
import { Game } from "./game";

class Runner {
    public static main(): number {
        const p1 = Gen.genSimpleDeck();
        const p2 = Gen.genSimpleDeck();
        const game = new Game(p1, p2);
        while(!game.isFinished()) {
            console.log(game.toString());
            console.log();
            game.playRound();
        }
        console.log(game.toString());
        console.log();
        return 0;
    }
}

Runner.main();