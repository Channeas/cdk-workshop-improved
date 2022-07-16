const { SQS } = require("aws-sdk");

exports.handler = async function (event) {
    console.log("Request:", JSON.stringify(event, undefined, 2));

    const hitCounterQueueUrl = process.env.HITCOUNTER_QUEUE_URL;
    await writeMessageToSQSQueue({ path: event?.path }, hitCounterQueueUrl);

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: `Good Night, CDK! You've hit ${event?.path}\n`,
    };
};

async function writeMessageToSQSQueue(messageBody, queueUrl) {
    const sqs = new SQS({
        region: "us-east-1",
    });

    const sqsMessage = {
        MessageBody: JSON.stringify(messageBody),
        QueueUrl: queueUrl,
    };

    try {
        const sqsResponse = await sqs.sendMessage(sqsMessage).promise();
        console.log("SQS response", sqsResponse);
    } catch (error) {
        console.error(
            `Error writing message to SQS queue ${queueUrl}`,
            JSON.stringify(error, undefined, 2)
        );

        // Note: the request should be fulfilled even if the hit cannot be recorded
    }
}
