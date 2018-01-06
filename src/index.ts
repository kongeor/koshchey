import { Gen } from "./gen";
import { Game } from "./game";

class Runner {
    public static main(): number {
        const p1 = Gen.genSimpleDeck();
        const p2 = Gen.genSimpleDeck();
        const game = new Game(p1, p2);
        game.play();
        return 0;
    }
}

Runner.main();