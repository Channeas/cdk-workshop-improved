import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import { HitCounter } from "./hitCounter";

export class SampleAppStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Define a Lambda
        const hello = new lambda.Function(this, "HelloHandler", {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset("lambda"), // Load code from the lambda directory
            handler: "hello.handler", // File is "hello", function is exports["handler"]
        });

        const helloWithCounter = new HitCounter(this, "HelloHitCounter", {
            downstreamLambda: hello,
        });

        new apiGateway.LambdaRestApi(this, "Endpoint", {
            handler: helloWithCounter.handler,
        });
    }
}
