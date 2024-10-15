module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.spec.(ts|tsx)?$': 'ts-jest',
        '^.+\\.spec.(js|jsx)$': 'babel-jest',
    }
};