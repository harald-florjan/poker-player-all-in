import { Card, Player } from './Player';

const player = new Player();

let cardsInGame: Card[];

describe('Player', () => {
    describe('checkStraight', () => {
        beforeEach(() => {
            cardsInGame = [{
                rank: '5',
                suit: 'hearts'
            }, {
                rank: '4',
                suit: 'hearts'
            }, {
                rank: '6',
                suit: 'hearts'
            }];
        });
        
        it('should return true', () => {
            const result = player.checkStraight(cardsInGame);
            expect(result).toBeTruthy();
        });
    
        it('should return false', () => {
            cardsInGame[0].rank = '10';
            const result = player.checkStraight(cardsInGame);
            expect(result).toBeFalsy();
        })
    });

    describe('checkFlush', () => {
        beforeEach(() => {
            cardsInGame = [{
                rank: '5',
                suit: 'hearts'
            }, {
                rank: '4',
                suit: 'hearts'
            }, {
                rank: 'A',
                suit: 'hearts'
            }, {
                rank: '6',
                suit: 'hearts'
            },{
                rank: 'K',
                suit: 'hearts'
            }];
        });

        it('should return true', () => {
            const result = player.checkFlush(cardsInGame);
            expect(result).toBeTruthy();
        });

        it('should return true', () => {
            cardsInGame[0].suit = 'clubs';
            const result = player.checkFlush(cardsInGame);
            expect(result).toBeFalsy();
        });
    });

    describe('checkFourOfAKind', () => {
        beforeEach(() => {
            cardsInGame = [{
                rank: '5',
                suit: 'hearts'
            }, {
                rank: '5',
                suit: 'clubs'
            }, {
                rank: '5',
                suit: 'spades'
            }, {
                rank: '5',
                suit: 'diamonds'
            },{
                rank: 'K',
                suit: 'hearts'
            }];
        });

        it('should return true', () => {
            const result = player.checkFourOfAKind(cardsInGame);
            expect(result).toBeTruthy();
        });

        it('should return false', () => {
            cardsInGame[0].rank = '4';
            const result = player.checkFourOfAKind(cardsInGame);
            expect(result).toBeFalsy();
        });
    });

    describe('checkFullHouse', () => {
        beforeEach(() => {
            cardsInGame = [{
                rank: '5',
                suit: 'hearts'
            }, {
                rank: '5',
                suit: 'clubs'
            }, {
                rank: '5',
                suit: 'spades'
            }, {
                rank: 'K',
                suit: 'diamonds'
            },{
                rank: 'K',
                suit: 'hearts'
            }];
        });

        it('should return true', () => {
            const result = player.checkFullHouse(cardsInGame);
            expect(result).toBeTruthy();
        });

        it('should return false', () => {
            cardsInGame[0].rank = '4';
            const result = player.checkFullHouse(cardsInGame);
            expect(result).toBeFalsy();
        });
    });
});