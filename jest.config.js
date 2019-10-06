module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@Lobby/(.*)$": "<rootDir>/src/lobby/$1"
    }
}