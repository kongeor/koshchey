import * as _ from 'lodash';

import { Card } from './card';
import { GameCard } from './gamecard';
import { Deck } from './deck';

export class Gen {

    public static genSimpleCard(): GameCard {
        return new GameCard({'attack': 3, 'life': 3, 'luck': 5, abilities: []});
    }

    public static genSimpleDeck(): Deck {
        return new Deck(_.times(5, this.genSimpleCard));
    }
}

