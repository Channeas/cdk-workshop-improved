const { DynamoDB } = require("aws-sdk");

exports.handler = async function (event) {
    console.log("Request:", JSON.stringify(event, undefined, 2));

    // Create AWS SDK clients
    const dynamoDB = new DynamoDB();

    // Update database entry for the path with hits++
    for (const sqsRecord of event.Records) {
        const recordBody = JSON.parse(sqsRecord.body);
        await dynamoDB
            .updateItem({
                TableName: process.env.HITS_TABLE_NAME,
                Key: { path: { S: recordBody.path } },
                UpdateExpression: "ADD hits :incr",
                ExpressionAttributeValues: { ":incr": { N: "1" } },
            })
            .promise();
    }

    const moreThanOneHit = event.Records.length > 1;
    console.log(`Hit${moreThanOneHit ? "s" : ""} recorded`);
};
