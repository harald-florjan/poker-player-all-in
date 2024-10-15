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
  public hole_cards = [];
  public version = '';
  public id = 0;

  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    const { community_cards, players } = gameState;
    let bet = 0;
    const hand = this.findMyPlayer(gameState);
    const highestBet = this.getHighestBet(gameState);

    if (hand.hole_cards[0].rank === hand.hole_cards[1].rank) {
      bet = highestBet * 1,1;
    } else {
      bet = 0;
    }

    betCallback(bet);
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
};

export default Player;
