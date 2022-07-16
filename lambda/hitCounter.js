const { DynamoDB, Lambda } = require("aws-sdk");

exports.handler = async function (event) {
    console.log("Request:", JSON.stringify(event, undefined, 2));

    // Create AWS SDK clients
    const dynamoDB = new DynamoDB();
    const lambda = new Lambda();

    // Update database entry for the path with hits++
    await dynamoDB
        .updateItem({
            TableName: process.env.HITS_TABLE_NAME,
            Key: { path: { S: event.path } },
            UpdateExpression: "ADD hits :incr",
            ExpressionAttributeValues: { ":incr": { N: "1" } },
        })
        .promise();

    console.log("Hit recorded");

    // Call the actual Lambda function and capture the response
    // This seems like a stupid way to do it, now we will have 2x Lambda usage as this function will wait for the other to finish
    // A much better way would be to fire off an event that triggers the hitCounter lambda
    // Besides, if the hitCounter were to fail for any reason, the actual API call would also fail. The API should NOT depend on the hitCounter working properly
    const response = await lambda
        .invoke({
            FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
            Payload: JSON.stringify(event),
        })
        .promise();

    console.log("Downstream response:", JSON.stringify(response, undefined, 2));

    return JSON.parse(response.Payload);
};
