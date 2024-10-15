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

  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    betCallback(2);
  }

  public showdown(gameState: any): void {

  }
};

export default Player;
