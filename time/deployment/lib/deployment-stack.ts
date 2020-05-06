import * as apigateway from '@aws-cdk/aws-apigateway';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codedeploy from '@aws-cdk/aws-codedeploy';
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
    const apiGatewayPolicy = new iam.PolicyDocument({});
    apiGatewayPolicy.addStatements(
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
      policy: apiGatewayPolicy,
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

    // const version = covidRequestHandler.addVersion(
    //   new Date().toISOString() + 1
    // );
    // const alias = new lambda.Alias(this, "LambdaAlias", {
    //   aliasName: "Prod",
    //   version,
    // });
    // new codedeploy.LambdaDeploymentGroup(this, "DeploymentGroup", {
    //   alias,
    //   deploymentConfig:
    //     codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
    // });

    // cdk build
    const cdkBuild = new codebuild.PipelineProject(this, "CdkBuild", {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: ["cd time", "npm install"],
          },
          build: {
            commands: [
              "npm run build",
              "cd deployment",
              "./node_modules/.bin/cdk synth -- -o dist",
            ],
          },
        },
        artifacts: {
          "base-directory": "./time/dist",
          files: ["DeploymentStack.template.json"],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
      },
    });

    const lambdaBuild = new codebuild.PipelineProject(this, "LambdaBuild", {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: ["cd time", "npm install"],
          },
        },
        build: {
          commands: ["npm run build", "npm test"],
        },
        artifacts: {
          "base-directory": "./time",
          files: ["index.js", "node_modules/**/*"],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1,
      },
    });

    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact("CdkBuildOutput");
    const lambdaBuildOutput = new codepipeline.Artifact("LambdaBuildOutput");

    const pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "cicd-pipeline",
      stages: [
        {
          stageName: "Source",
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              owner: "auser",
              repo: "demo-lambda-cicd",
              branch: "master",
              oauthToken: cdk.SecretValue.secretsManager(
                "demo-cicd-github-token"
              ),
              actionName: "GithubSource",
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: "lambdaBuild",
              project: lambdaBuild,
              input: sourceOutput,
              outputs: [lambdaBuildOutput],
            }),
            new codepipeline_actions.CodeBuildAction({
              actionName: "cdkBuild",
              project: cdkBuild,
              input: sourceOutput,
              outputs: [cdkBuildOutput],
            }),
          ],
        },
        {
          stageName: "Deploy",
          actions: [
            new codepipeline_actions.CloudFormationCreateUpdateStackAction({
              actionName: "lambda_cfn_deploy",
              templatePath: cdkBuildOutput.atPath(
                "DeploymentStack.template.json"
              ),
              stackName: "DeploymentStack",
              adminPermissions: true,
              extraInputs: [lambdaBuildOutput],
            }),
          ],
        },
      ],
    });

    new cdk.CfnOutput(this, "PipelineName", { value: pipeline.pipelineName });
    new cdk.CfnOutput(this, "ApiGatewayId", { value: api.restApiId });
    new cdk.CfnOutput(this, "ApiGatewayDomainUrl", { value: api.url });
  }
}
