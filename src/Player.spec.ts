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
});