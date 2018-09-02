import * as _ from 'lodash';

import { Card } from './card';
import { GameCard } from './gamecard';
import { Deck } from './deck';
import { CardAbility, Ability } from './ability';
import { Random } from './random';

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

    public static genFlatCard(): GameCard {
        return new GameCard({'attack': 3, 'life': 3, 'luck': 5, abilities: []});
    }

    public static getFlatDeck(): Deck {
        return new Deck(_.times(5, this.genFlatCard));
    }

    // Random based utils

    // Fisher-Yates (aka Knuth) Shuffle
    public static shuffle(array: any[], rnd: Random) {
        let currentIndex = array.length;
        let temporaryValue; 
        let randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = rnd.nextInt(currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
    }

    public static randomAbilities(rnd: Random): Ability[] {
        const abCount = rnd.nextInt(3);
        let abilities = CardAbility.allAbilities();
        Gen.shuffle(abilities, rnd);
        return _.take(abilities, abCount);
    }

    public static randomSimpleCard(rnd: Random): GameCard {
        return new GameCard({
            'attack': rnd.nextIntRange(3, 8), 
            'life': rnd.nextIntRange(3, 8),
            'luck': rnd.nextIntRange(3, 8), 
            abilities: Gen.randomAbilities(rnd)
        });
    }

    public static randomDeck(rnd: Random): Deck {
        return new Deck(_.times(5, () => Gen.randomSimpleCard(rnd)));
    }
}

const rnd = new Random("yo");
const deck = Gen.randomDeck(rnd);
console.log(deck);
