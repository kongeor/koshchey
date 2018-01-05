import { GameCard } from '../src/gamecard';
import { expect } from 'chai';
import 'mocha';

describe('Gamecard', () => {

  it('should be alive when has life', () => {
    const card = new GameCard({"attack": 5, "life": 3, "luck": 4, "abilities": []});
    expect(card.isAlive()).to.be.true;
  });

  it('should be dead when life is 0', () => {
    const card = new GameCard({"attack": 5, "life": 0, "luck": 4, "abilities": []});
    expect(card.isAlive()).to.be.false;
  });

});