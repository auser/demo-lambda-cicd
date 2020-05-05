import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from "aws-lambda";
import axios from "axios";

interface StateData {
  state: string;
  cases: Number;
  todayCases: Number;
  deaths: Number;
  todayDeaths: Number;
  active: Number;
  tests: Number;
  testsPerOneMillion: Number;
}
type ServerData = StateData;
interface ServerResponse {
  data: ServerData;
}

// src/index.ts
export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    return await handle(event);
  } catch (e) {
    console.error(e);
    const errMsg =
      typeof e.message === "string" && e.message.startsWith("ClientError:")
        ? e.message
        : "InternalServerError";
    return {
      statusCode: errMsg === "InternalServerError" ? 500 : 400,
      body: errMsg,
    };
  }
};

export default handler;

const handle = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const params = event.queryStringParameters;

  if (!params) {
    throw new Error(`ClientError: parameters cannot be empty`);
  }
  const type = params.type || "states";
  const url = `https://corona.lmao.ninja/v2/${type}`;
  try {
    const resp = await axios({ url, method: "GET" });
    const data = resp.data;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (e) {
    throw new Error(e);
  }
};
