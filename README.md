# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`SampleAppStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

-   `npm run build` compile typescript to js
-   `npm run watch` watch for changes and compile
-   `npm run test` perform the jest unit tests
-   `cdk deploy` deploy this stack to your default AWS account/region
-   `cdk diff` compare deployed stack with current state
-   `cdk synth` emits the synthesized CloudFormation template

# Why improve the hitcounter

In the original project, a hitcounter is created by adding an additional Lambda in front of the target Lambda.
This is a terrible way to design a hit counter, as the hitcounter Lambda will wait for the response of the target Lambda, drastically increasing the response time and the total billed time.
A better approach is to introduce an SQS queue, so that the target Lambda can fire off an event, and then proceed answering the request that came in.
The hits can then be analyzed without adding to the response time, or incurring double billed time.
