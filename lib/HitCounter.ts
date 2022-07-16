import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamoDB from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface HitCounterProps {
    downstreamLambda: lambda.IFunction;
}

export class HitCounter extends Construct {
    public readonly handler: lambda.Function;

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        const table = new dynamoDB.Table(this, "Hits", {
            partitionKey: { name: "path", type: dynamoDB.AttributeType.STRING },
            billingMode: dynamoDB.BillingMode.PAY_PER_REQUEST,
        });

        this.handler = new lambda.Function(this, "HitCounterHandler", {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: "hitCounter.handler",
            code: lambda.Code.fromAsset("lambda"),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstreamLambda.functionName,
                HITS_TABLE_NAME: table.tableName,
            },
        });

        table.grantReadWriteData(this.handler);
        props.downstreamLambda.grantInvoke(this.handler);
    }
}
