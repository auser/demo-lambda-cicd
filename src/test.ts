import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';

export class DeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const apiVersion = "v1";
    const code = lambda.Code.asset(path.join(__dirname, "..", "..", "dist"));
    const environment = {
      NODE_ENV: process.env.NODE_ENV || "dev",
    };
    const fnProps = {
      runtime: lambda.Runtime.NODEJS_12_X,
      code,
      environment,
    };
    const covidRequestHandler = new lambda.Function(this, "CovidHandler", {
      ...fnProps,
      handler: "index.handler",
    });
    // DO THINGS
  }
}
