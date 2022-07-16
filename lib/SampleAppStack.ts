import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { HitCounter } from "./hitCounter";
import { Stack, StackProps } from "aws-cdk-lib";

export class SampleAppStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const hitCounter = new HitCounter(this, "HitCounter");

        const helloLambda = new lambda.Function(this, "HelloHandler", {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset("lambda"),
            handler: "hello.handler",
            environment: {
                HITCOUNTER_QUEUE_URL: hitCounter.hitQueue.queueUrl,
            },
        });

        hitCounter.hitQueue.grantSendMessages(helloLambda);

        new apiGateway.LambdaRestApi(this, "Endpoint", {
            handler: helloLambda,
        });
    }
}
