module.exports = {
  roots: ["<rootDir>/src/", "<rootDir>/test/"],
  verbose: true,
  moduleFileExtensions: ["js", "ts", "tsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/deployment/"],
  collectCoverage: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
