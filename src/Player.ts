export interface GameState {
  players: Player[];
  tournament_id: string;
  game_id: string;
  round: number;
  bet_index: number;
  small_blind: number;
  orbits: number;
  dealer: number;
  community_cards: Card[];
  current_buy_in: number;
  pot: number;
}

export interface Card {
  rank: string;
  suit: string;
}

export class Player {
  public name = '';
  public stack = 0;
  public status = '';
  public bet = 0;
  public hole_cards: Card[] = [];
  public version = '';
  public id = 0;
  public CARD_MAPPING = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    const {community_cards, players} = gameState;
    let bet = 0;
    const hand = this.findMyPlayer(gameState);
    let highestBet = this.getHighestBet(gameState);
    if (highestBet == 0) {
      highestBet = 200;
    }

    const cardsInGame = hand.hole_cards.concat(community_cards);

    if (gameState.round === 0) {
      if (hand.hole_cards[0].rank === hand.hole_cards[1].rank) {
        bet = Math.round(highestBet * 1.5);
      }

      if (hand.hole_cards[0].suit === hand.hole_cards[1].suit) {
        bet = Math.round(highestBet * 1.2);
      }

      if (['J', 'Q', 'K', 'A'].includes(hand.hole_cards[0].rank) || ['J', 'Q', 'K', 'A'].includes(hand.hole_cards[1].rank)) {
        bet = highestBet;
      }

      if (['10', 'J', 'Q', 'K', 'A'].includes(hand.hole_cards[0].rank) && ['10', 'J', 'Q', 'K', 'A'].includes(hand.hole_cards[1].rank)) {
        bet = Math.round(highestBet * 1.5);
      }
    } else {
      hand.hole_cards.forEach((card: Card) => {
        if (this.cardExistsInCommunity(card, community_cards)) {
          bet = Math.round(highestBet * 1.5);
        }
      });
    }

    if (this.checkFullHouse(cardsInGame) || this.checkFourOfAKind(cardsInGame)) {
      bet = Math.round(highestBet * 2);

      if (this.checkFourOfAKind(cardsInGame)) {
        bet = Math.round(highestBet * 2);
      }
    }
    betCallback(bet > 1000 ? 1000 : bet);
  }

  public showdown(gameState: any): void {
    //
  }

  private findMyPlayer(gameState: GameState): any {

    return gameState.players.find(player => player.name === 'All in');
  }

  private getHighestBet(gameState: GameState): number {
    return gameState.players.reduce((highestBet, player) => {
      if (player.bet > highestBet) {
        return player.bet;
      }
      return highestBet;
    } , 0);
  }

  private cardExistsInCommunity(handCard: Card, community_cards: Card[]): boolean {
    return community_cards.some(communityCard => communityCard.rank === handCard.rank);
  }

  private checkDoubles(cardsInGame: Card[]): boolean {
    return true;
  }

  private checkHighestCard(gameState: GameState, hand: Card[]): number {
    return 0;
  }

  // TODO: check logic should check for suits of 5 colors
  private checkFlush(cardsInGame: Card[]): boolean {
    let result = false;
    cardsInGame.forEach(card => {
      const flush = cardsInGame.filter(c => c.suit === card.suit);
      result = flush.length > 4;
    });
    return result;
  }

  private checkStraight(cardsInGame: Card[]): any {
    let result = false;
    let straightSet = [];
  }

  private checkFourOfAKind(cardsInGame: Card[]): boolean {
    let result = false;
    cardsInGame.forEach(card => {
      const count = cardsInGame.filter(c => c.rank === card.rank).length;
      if (count === 4) {
        result = true;
      }
    });
    return result;
  }

  private checkFullHouse(cardsInGame: Card[]): boolean {
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
    return result;
  }
};

export default Player;
