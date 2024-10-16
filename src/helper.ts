import { GameState, Card, Rank } from './types';

export const CARD_MAPPING: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

export const stuff = () => {
    return 'stuff';
}

export function isFullHouse(hand: Card[]): boolean {
    // Create a map to count occurrences of each rank
    const rankCount: { [key in Rank]?: number } = {};

    // Count the occurrences of each rank
    hand.forEach(card => {
        if (rankCount[card.rank]) {
            rankCount[card.rank]! += 1;
        } else {
            rankCount[card.rank] = 1;
        }
    });

    // Check the counts: there should be exactly one rank with 3 cards and one with 2 cards
    const counts = Object.values(rankCount);

    const hasThreeOfAKind = counts.includes(3);
    const hasPair = counts.includes(2);

    return hasThreeOfAKind && hasPair;
}

export function isRoyalFlush(hand: Card[]): boolean {
    // First, check if all cards are of the same suit (Flush)
    const firstSuit = hand[0].suit;
    const isFlush = hand.every(card => card.suit === firstSuit);

    // Define the ranks for a Royal Flush
    const royalRanks = new Set([Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE]);

    // Check if the hand contains exactly the ranks of a Royal Flush
    const handRanks = new Set(hand.map(card => card.rank));
    const isRoyal = royalRanks.size === handRanks.size && [...royalRanks].every(rank => handRanks.has(rank));

    // Return true if it's both a flush and contains all the royal ranks
    return isFlush && isRoyal;
}

export function isStraight(hand: Card[]): boolean {
    // Extract and sort the rank values
    const sortedRanks = [...new Set(hand.map(card => CARD_MAPPING[card.rank]))].sort((a, b) => a - b);

    // Check if we have 5 unique ranks (no duplicates) after sorting
    if (sortedRanks.length !== 5) {
        return false;
    }

    // Check if the ranks are consecutive (difference between highest and lowest should be 4)
    const isConsecutive = sortedRanks[4] - sortedRanks[0] === 4;

    // Special case for Ace acting as 1 (low straight: A, 2, 3, 4, 5)
    const isLowAceStraight = JSON.stringify(sortedRanks) === JSON.stringify([2, 3, 4, 5, 14]);

    // Return true if it's a regular consecutive straight or a low Ace straight
    return isConsecutive || isLowAceStraight;
}


export function isFlush(hand: Card[]): boolean {
    // Get the suit of the first card
    const firstSuit = hand[0].suit;

    // Check if all cards have the same suit as the first card
    return hand.every(card => card.suit === firstSuit);
}

export function isThreeOfAKind(hand: Card[]): boolean {
    // Create a map to count occurrences of each rank
    const rankCount: { [key in Rank]?: number } = {};

    // Count the occurrences of each rank
    hand.forEach(card => {
        if (rankCount[card.rank]) {
            rankCount[card.rank]! += 1;
        } else {
            rankCount[card.rank] = 1;
        }
    });

    // Check if there is exactly one rank that appears three times
    return Object.values(rankCount).includes(3);
}

export function isTwoPairs(hand: Card[]): boolean {
    // Create a map to count occurrences of each rank
    const rankCount: { [key in Rank]?: number } = {};

    // Count the occurrences of each rank
    hand.forEach(card => {
        if (rankCount[card.rank]) {
            rankCount[card.rank]! += 1;
        } else {
            rankCount[card.rank] = 1;
        }
    });

    // Filter the counts to find how many ranks appear exactly 2 times
    const pairs = Object.values(rankCount).filter(count => count === 2);

    // Check if we have exactly two pairs
    return pairs.length === 2;
}

export function isFourOfAKind(hand: Card[]): boolean {
    // Create a map to count occurrences of each rank
    const rankCount: { [key in Rank]?: number } = {};

    // Count the occurrences of each rank
    hand.forEach(card => {
        if (rankCount[card.rank]) {
            rankCount[card.rank]! += 1;
        } else {
            rankCount[card.rank] = 1;
        }
    });

    // Check if there is exactly one rank that appears four times
    return Object.values(rankCount).includes(4);
}

export function isDealtHandOneHighCard(hand: Card[]): boolean {
    return ['10', 'J', 'Q', 'K', 'A'].includes(hand[0].rank) || ['10', 'J', 'Q', 'K', 'A'].includes(hand[1].rank);
}

export function isDealtHandTwoHighCard(hand: Card[]): boolean {
    return ['10', 'J', 'Q', 'K', 'A'].includes(hand[0].rank) && ['10', 'J', 'Q', 'K', 'A'].includes(hand[1].rank);
}

export function isStrongDealtHand(hand: Card[]): boolean {
    const sortedHand = sortHandByRank(hand);
    if(['10', 'J', 'Q', 'K', 'A'].includes(sortedHand[0].rank)) {
        if(hand[1].rank === hand[0].rank) {
            return true;
        }
    }
   return sortedHand[1].rank === 'A' && ['K', 'Q'].includes(sortedHand[0].rank);
}

export function isMediumDealtHand(hand: Card[]): boolean {
    const sortedHand = sortHandByRank(hand);
    if(['6', '7', '8', '9'].includes(sortedHand[0].rank)) {
        if(hand[1].rank === hand[0].rank) {
            return true;
        }
    }

    if(['J', 'Q'].includes(sortedHand[0].rank) && sortedHand[1].rank === 'K') {
        return true;
    }

    return sortedHand[0].rank === 'J' && sortedHand[1].rank === 'Q';
}

export function isMediumHand(hand: Card[]): boolean {
    const sortedHand = sortHandByRank(hand);


}

export function isWeakDealtHand(hand: Card[]): boolean {
    return !isStrongDealtHand(hand) || !isMediumDealtHand(hand);
}

export function sortHandByRank(hand: Card[]): Card[] {
    return hand.sort((a, b) => CARD_MAPPING[a.rank] - CARD_MAPPING[b.rank]);
}

export function isPreFlop(gameState: GameState): boolean {
    return gameState.community_cards.length === 0;
}

export function isFlop(gameState: GameState): boolean {
    return gameState.community_cards.length === 3;
}

export function isTurn(gameState: GameState): boolean {
    return gameState.community_cards.length === 4;
}

export function isRiver(gameState: GameState): boolean {
    return gameState.community_cards.length === 5;
}

export function isAllInCombination(hand: Card[]): boolean {
    return isFullHouse(hand) || isStraight(hand) || isFlush(hand) || isFourOfAKind(hand) || isRoyalFlush(hand);
}
