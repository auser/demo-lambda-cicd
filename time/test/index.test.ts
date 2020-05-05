const { handler } = require("../src");
const { promisify } = require("util");
const { readFile } = require("fs");
const { resolve, join } = require("path");

const readFileP = promisify(readFile);
const fixturesDir = resolve(__dirname, "fixtures");

import axios from "axios";

jest.mock("axios");

describe("lambdaService", () => {
  beforeEach(() => jest.restoreAllMocks());

  it("returns a 400 without params", async () => {
    expect.assertions(1);
    const resp = await handler({});
    expect(resp.statusCode).toBe(400);
  });

  it("returns a ClientError: parameters cannot be empty without params", async () => {
    expect.assertions(1);
    const resp = await handler({});
    expect(resp.body).toBe("ClientError: parameters cannot be empty");
  });

  describe("service is down", () => {
    beforeEach(() => {
      const mocked = jest.spyOn(axios, "get");
      mocked.mockImplementation(() =>
        Promise.reject(new Error("Service is down"))
      );
    });

    it("returns a 500 when the api cannot be hit", async () => {
      expect.assertions(1);
      const resp = await handler({
        queryStringParameters: {
          type: "states",
        },
      });
      expect(resp.statusCode).toBe(500);
    });

    it("returns a 500 when the api cannot be hit", async () => {
      expect.assertions(1);
      const resp = await handler({
        queryStringParameters: {
          type: "states",
        },
      });
      expect(resp.body).toBe("InternalServerError");
    });
  });

  describe("service is up and working", () => {
    let data: any = {};

    beforeEach(async () => {
      data = await readFileP(join(fixturesDir, "states.json"), "utf-8");
      data = JSON.parse(data);
    });

    beforeEach(() => {
      const mocked = jest.spyOn(axios, "get");
      mocked.mockImplementation(() =>
        Promise.resolve({ statusCode: 200, data })
      );
    });

    it("returns 200 with data", async () => {
      expect.assertions(1);
      const resp = await handler({
        queryStringParameters: {},
      });
      expect(resp.statusCode).toBe(200);
    });

    it("returns data", async () => {
      expect.assertions(1);
      const resp = await handler({
        queryStringParameters: {},
      });
      expect(resp.body).toBe(JSON.stringify(data));
    });
  });
});
