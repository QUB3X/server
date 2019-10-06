import { parseArgv } from "@Lobby/index"

test("Pass no parameters", () => {
    expect(parseArgv([])).toThrow(Error)
})

test("Pass port but no players", () => {
    expect(parseArgv(["12345"])).toBe([12345, []])
})