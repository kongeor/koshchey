import * as _ from 'lodash';

import { Card } from './card';
import { GameCard } from './gamecard';
import { Deck } from './deck';
import { CardAbility, Ability } from './ability';

export class Gen {

    static genRandomAbilities(): any {
        const abCount = _.random(0, 3);
        const shuffled = _.shuffle(CardAbility.allAbilities());
        return _.take(shuffled, abCount);
    }

    public static genSimpleCard(): GameCard {
        return new GameCard({'attack': _.random(3, 8), 'life': _.random(3, 8),
             'luck': 5, abilities: Gen.genRandomAbilities()});
    }

    public static genSimpleDeck(): Deck {
        return new Deck(_.times(5, this.genSimpleCard));
    }
}
