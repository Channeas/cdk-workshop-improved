import * as cdk from "aws-cdk-lib";
import * as dynamoDB from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class HitCounter extends Construct {
    public readonly hitQueue: sqs.Queue;
    private processingLambda: lambda.Function;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const table = new dynamoDB.Table(this, "Hits", {
            partitionKey: { name: "path", type: dynamoDB.AttributeType.STRING },
            billingMode: dynamoDB.BillingMode.PAY_PER_REQUEST,
        });

        this.hitQueue = new sqs.Queue(this, "HitQueue", {
            visibilityTimeout: cdk.Duration.seconds(90),
        });

        this.processingLambda = new lambda.Function(this, "HitCounterHandler", {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: "hitCounter.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                HITS_TABLE_NAME: table.tableName,
            },
        });

        const eventSource = new SqsEventSource(this.hitQueue);
        this.processingLambda.addEventSource(eventSource);

        table.grantReadWriteData(this.processingLambda);
    }
}
