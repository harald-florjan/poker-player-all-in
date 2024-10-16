import { Card, Player } from './Player';

const player = new Player();

let cardsInGame: Card[];

describe('Player', () => {
    describe('checkStraight', () => {
        beforeEach(() => {
            cardsInGame = [{
                rank: 'A',
                suit: 'hearts'
            },{
                rank: '3',
                suit: 'hearts'
            },{
                rank: '2',
                suit: 'hearts'
            }, {
                rank: '4',
                suit: 'hearts'
            }, {
                rank: '5',
                suit: 'hearts'
            }];
        });
        
        it('should return true when ace low straight', () => {
            const result = player.checkStraight(cardsInGame);
            expect(result).toBeTruthy();
        });

        it('should return true when ace high straight', () => {
            cardsInGame = [{
                rank: 'A',
                suit: 'hearts'
            },{
                rank: 'K',
                suit: 'hearts'
            },{
                rank: 'Q',
                suit: 'hearts'
            }, {
                rank: 'J',
                suit: 'hearts'
            }, {
                rank: '10',
                suit: 'hearts'
            }];
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

    describe('checkSrtaightFlush', () => {
        beforeEach(() => {
            cardsInGame = [{
                rank: '5',
                suit: 'hearts'
            }, {
                rank: '7',
                suit: 'hearts'
            }, {
                rank: '9',
                suit: 'hearts'
            }, {
                rank: '6',
                suit: 'hearts'
            },{
                rank: '8',
                suit: 'hearts'
            }];
        });

        it('should return true', () => {
            const result = player.checkSrtaightFlush(cardsInGame);
            expect(result).toBeTruthy();
        });

        it('should return false', () => {
            cardsInGame[0].suit = 'clubs';
            const result = player.checkSrtaightFlush(cardsInGame);
            expect(result).toBeFalsy();
        });

        it('should return false', () => {
            cardsInGame[0].rank = 'A';
            const result = player.checkSrtaightFlush(cardsInGame);
            expect(result).toBeFalsy();
        });

        describe('when ace low straight flush', () => {
            beforeEach(() => { 
                cardsInGame = [{
                    rank: 'A',
                    suit: 'hearts'
                }, {
                    rank: '2',
                    suit: 'hearts'
                }, {
                    rank: '3',
                    suit: 'hearts'
                }, {
                    rank: '4',
                    suit: 'hearts'
                },{
                    rank: '5',
                    suit: 'hearts'
                }];
            });
            it('and a flush should return true', () => {
                const result = player.checkSrtaightFlush(cardsInGame);
                expect(result).toBeTruthy();
            });

            it('and not a flush should return false', () => {
                cardsInGame[0].suit = 'clubs';
                const result = player.checkSrtaightFlush(cardsInGame);
                expect(result).toBeFalsy();
            });
        });
    });

    describe('cardExistsInCommunity', () => {
        let community_cards: Card[] = [{
            rank: '5',
            suit: 'clubs'
        }, {
            rank: '7',
            suit: 'spades'
        }, {
            rank: 'K',
            suit: 'diamonds'
        },{
            rank: 'K',
            suit: 'hearts'
        }];

        it('should return true', () => {
            const handCard = {
                rank: '5',
                suit: 'hearts'
            };
            const result = player.cardExistsInCommunity(handCard, community_cards);
            expect(result).toBeTruthy();
        });

        it('should return false', () => {
            const handCard = {
                rank: '4',
                suit: 'clubs'
            };
            const result = player.cardExistsInCommunity(handCard, community_cards);
            expect(result).toBeFalsy();
        });
    });

    describe('checkTwoPairs', () => {
        beforeEach(() => {
            cardsInGame = [{
                rank: '5',
                suit: 'hearts'
            }, {
                rank: '5',
                suit: 'clubs'
            }, {
                rank: 'K',
                suit: 'spades'
            }, {
                rank: 'K',
                suit: 'diamonds'
            },{
                rank: 'A',
                suit: 'hearts'
            }];
        });

        it('should return true', () => {
            const result = player.checkTwoPairs(cardsInGame);
            expect(result).toBeTruthy();
        });

        it('should return false', () => {
            cardsInGame[0].rank = '4';
            const result = player.checkTwoPairs(cardsInGame);
            expect(result).toBeFalsy();
        });
    });
});