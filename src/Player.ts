import * as helper from './helper';
import { GameState, Card } from './types';
import { CARD_MAPPING } from './helper';

export class Player {
  public name = '';
  public stack = 0;
  public status = '';
  public bet = 0;
  public hole_cards: Card[] = [];
  public version = '';
  public id = 0;
  public MAX_BET= 1000;

  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    const {community_cards, players} = gameState;
    let bet = 0;
    const hand = this.findMyPlayer(gameState);
    const player = this.findMyPlayer(gameState);
    console.log('=== MY HAND ===', hand);

    if (helper.isPreFlop(gameState)) {
      if(helper.isStrongDealtHand(player.hole_cards)) {
        bet = 1000;
      }

      if(helper.isMediumDealtHand(player.hole_cards)) {
        if(gameState.current_buy_in < 200) {
          bet = 200;
        } else {
          bet = gameState.current_buy_in * 1.2
        }
      }

      if(helper.isWeakDealtHand(player.hole_cards)) {
        bet = 0; // check hand, server will decide if we check of fold
      }
    } else if(helper.isFlop(gameState)) {

    } else if(helper.isTurn(gameState)) {

    } else if(helper.isRiver(gameState)) {

    }

    console.log(`==== ROUND ${gameState.round} BET: ${bet}`);
    betCallback(Math.round(bet));
  }

  public showdown(gameState: any): void {
    //
  }

  private hasPairInHoleCardsCommunityCards(gameState: GameState): boolean {
    let flag = false;
    this.findMyPlayer(gameState).hole_cards.forEach((card: Card) => {
      if (this.cardExistsInCommunity(card, gameState.community_cards)) {
        flag = true;
      }
    });
    return flag;
  }

  private findMyPlayer(gameState: GameState): any {
    return gameState.players.find(player => player.name === 'All in');
  }

  public getHighestBet(gameState: GameState): number {
    return gameState.players.reduce((highestBet, player) => {
      if (player.bet > highestBet) {
        return player.bet;
      }
      console.log('===== getHighestBet =====', highestBet);
      return highestBet;
    } , 0);
  }

  public cardExistsInCommunity(handCard: Card, community_cards: Card[]): boolean {
    return community_cards.some(communityCard => communityCard.rank === handCard.rank);
  }

  public checkFlush(cardsInGame: Card[]): boolean {
    let result = false;
    cardsInGame.forEach(card => {
      const flush = cardsInGame.filter(c => c.suit === card.suit);
      result = flush.length >= 5;
    });
    return result;
  }

  public checkThreeOfAKind(cardsInGame: Card[]): boolean {
    let result = false;
    cardsInGame.forEach(card => {
      const count = cardsInGame.filter(c => c.rank === card.rank).length;
      if (count === 3) {
        result = true;
      }
    });
    console.log('===== checkThreeOfAKind =====', result);
    return result;
  }

  public checkFourOfAKind(cardsInGame: Card[]): boolean {
    let result = false;
    cardsInGame.forEach(card => {
      const count = cardsInGame.filter(c => c.rank === card.rank).length;
      if (count === 4) {
        result = true;
      }
    });
    console.log('===== checkFourOfAKind =====', result);
    return result;
  }

  public checkFullHouse(cardsInGame: Card[]): boolean {
    let result = false;

    cardsInGame.forEach(card => {
      const threeOfAKind = cardsInGame.filter(c => c.rank === card.rank);

      if ( threeOfAKind.length === 3) {
        cardsInGame.forEach(card2 => {
          if (card2.rank === card.rank) {
            return;
          }

          const count2 = cardsInGame.filter(c => c.rank === card2.rank).length;
          if (count2 === 2) {
            result = true;
            return;
          }
        });
      }
    });
    console.log('===== checkFullHouse =====', result);
    return result;
  }

  private getMinimumRaise(gameState: GameState): number {
    return gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise;
  }

  public checkStraight(cardsInGame: Card[]): boolean {    
    if (this.aceLowStraight(cardsInGame)) {
      return true;
    }
    
    let result = true;
    const sortedCards = cardsInGame.sort((a, b) => CARD_MAPPING[a.rank] - CARD_MAPPING[b.rank]);

    let lastCard: Card | null = null;
    sortedCards.forEach(card => {
      if (!lastCard) {
        lastCard = card;
        return;
      }
      if (CARD_MAPPING[card.rank] - CARD_MAPPING[lastCard.rank] !== 1) {
        result = false;
      }
      lastCard = card;
    });
    console.log('===== checkStraight =====', result);
    return result;
  }

  public aceLowStraight(cardsInGame: Card[]): boolean {
    return cardsInGame.filter(card => card.rank === '2' || card.rank === '3'
      || card.rank === '4' || card.rank === '5' || card.rank === 'A').length === 5;
  }

  public checkSrtaightFlush(cardsInGame: Card[]): boolean {
    return this.checkStraight(cardsInGame) && this.checkFlush(cardsInGame);
  }

  public checkTwoPairs(cardsInGame: Card[]): boolean {
    let result = false;
    cardsInGame.forEach(card => {
      const pair = cardsInGame.filter(c => c.rank === card.rank);
      if (pair.length === 2) {
        cardsInGame.forEach(card2 => {
          if (card2.rank === card.rank) {
            return;
          }

          const pair2 = cardsInGame.filter(c => c.rank === card2.rank);
          if (pair2.length === 2) {
            result = true;
          }
        });
      }
    });
    return result;
  }
};

export default Player;
