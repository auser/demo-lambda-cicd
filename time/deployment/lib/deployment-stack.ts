import * as apigateway from '@aws-cdk/aws-apigateway';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
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

    // Policies
    const policy = new iam.PolicyDocument({});
    policy.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("apigateway.amazonaws.com")],
        actions: [
          "sts:AssumeRole",
          "lambda:InvokeFunction",
          "execute-api:Invoke",
        ],
        resources: [covidRequestHandler.functionArn],
      })
    );

    const api = new apigateway.RestApi(this, "covidApi", {
      restApiName: "COVID Service",
      description: "Serves Covid API",
      policy,
      deployOptions: {
        stageName: apiVersion,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        // accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
      },
    });

    const covid = api.root.addResource("covid");
    const listFilesIntegration = new apigateway.LambdaIntegration(
      covidRequestHandler
    );
    covid.addMethod("GET", listFilesIntegration, {
      apiKeyRequired: false,
    });

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: "LambdaCodeCommit",
      repository: repo,
      output: sourceOutput,
    });

    new cdk.CfnOutput(this, "ApiGatewayId", { value: api.restApiId });
    new cdk.CfnOutput(this, "ApiGatewayDomainUrl", { value: api.url });
  }
}
