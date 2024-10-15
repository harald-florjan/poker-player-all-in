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
    const { community_cards, players } = gameState;
    let bet = 0;
    const hand = this.findMyPlayer(gameState);
    let highestBet = this.getHighestBet(gameState);
    if (highestBet == 0) {
      highestBet = 200;
    }

    const cardsInGame = hand.hole_cards.concat(community_cards);

    if (gameState.round === 0) {
      if (hand.hole_cards[0].rank === hand.hole_cards[1].rank || hand.hole_cards[0].suit === hand.hole_cards[1].suit) {
        bet = highestBet * 1.5;
      }
    } else {
      hand.hole_cards.forEach((card: Card) => {
        if (this.cardExistsInCommunity(card, community_cards)) {
          bet = highestBet * 1.5;
        }
      });
    }

    if (this.checkDoubles(cardsInGame)) {
      bet = highestBet * 2;
    }

    console.log("---> BET" + bet);
    betCallback(bet > 1000 ? 1000 : bet);
  }

  public showdown(gameState: any): void {

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
};

export default Player;
