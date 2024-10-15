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
  minimum_raise: number;
  in_action: number;
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
  public CARD_MAPPING: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  public MAX_BET= 1000;

  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    const {community_cards, players} = gameState;
    let bet = 0;
    const hand = this.findMyPlayer(gameState);
    let highestBet = this.getHighestBet(gameState);
    if (highestBet == 0) {
      highestBet = 200;
    }

    const cardsInGame = hand.hole_cards.concat(community_cards);

    if (gameState.round === 0 || gameState.round === 1) {
      if (hand.hole_cards[0].rank === hand.hole_cards[1].rank) {
        bet = highestBet * 1.5;
      }

      if (hand.hole_cards[0].suit === hand.hole_cards[1].suit) {
        bet = highestBet * 1.2;
      }

      if (this.hasPairInHoleCardsCommunityCards(gameState)) {
        bet = highestBet * 1.5;
      }

      if (['J', 'Q', 'K', 'A'].includes(hand.hole_cards[0].rank) || ['J', 'Q', 'K', 'A'].includes(hand.hole_cards[1].rank)) {
        console.log('===== high cards OR =====', highestBet);
        bet = highestBet;
      }

      if (highestBet > 200) {
        bet = 0;
      }

      if (['10', 'J', 'Q', 'K', 'A'].includes(hand.hole_cards[0].rank) && ['10', 'J', 'Q', 'K', 'A'].includes(hand.hole_cards[1].rank)) {
        console.log('===== high cards AND =====', highestBet);
        bet = highestBet * 1.5;
      }

      if (this.checkThreeOfAKind(cardsInGame)) {
        bet = 200 + this.getMinimumRaise(gameState);
      }

    } else {
      hand.hole_cards.forEach((card: Card) => {
        if (this.cardExistsInCommunity(card, community_cards)) {
          console.log('===== cardExistsInCommunity: bet: =====', highestBet);
          bet = highestBet;
        }
      });
    }

    console.log('is this.checkStraight(cardsInGame)', this.checkStraight(cardsInGame));

    if (this.checkFullHouse(cardsInGame) || this.checkThreeOfAKind(cardsInGame) || this.checkFourOfAKind(cardsInGame) || this.checkFlush(cardsInGame)) {
      bet = this.MAX_BET + this.getMinimumRaise(gameState);
      console.log('===== inside check train: bet =====', bet);
    }

    console.log('====== betCallback(bet) bet: ======', bet);
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
    let result = true;

    const sortedCards = cardsInGame.sort((a, b) => this.CARD_MAPPING[a.rank] - this.CARD_MAPPING[b.rank]);

    let lastCard: Card | null = null;
    sortedCards.forEach(card => {
      if (!lastCard) {
        lastCard = card;
        return;
      }
      if (this.CARD_MAPPING[card.rank] - this.CARD_MAPPING[lastCard.rank] !== 1) {
        result = false;
      }
      lastCard = card;
    });
    console.log('===== checkStraight =====', result);
    return result;
  }
};

export default Player;
