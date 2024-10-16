import Player from "./Player";

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
    rank: Rank;
    suit: Suit;
}

export enum Rank {
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
    TEN = '10',
    JACK = 'J',
    QUEEN = 'Q',
    KING = 'K',
    ACE = 'A'
}

export enum Suit {
    HEARTS = 'hearts',
    SPADES = 'spades',
    DIAMONDS = 'diamonds',
    CLUBS = 'clubs'
}
