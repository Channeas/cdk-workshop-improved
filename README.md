# Intro

This is a slighlty improved version of the project created during the [CDK Workshop](https://cdkworkshop.com/)

# Why improve the hitcounter

In the original project, a hitcounter is created by adding an additional Lambda in front of the target Lambda.

This is a terrible way to design a hitcounter, as the hitcounter Lambda will record a hit and then wait for the response of the target Lambda, drastically increasing the response time of the target Lambda and the total billed time.

A better approach is to introduce an SQS queue, so that the target Lambda can fire off an event, and then proceed right away with answering the request that came in.

The hits can then be analyzed (or in this case just written to a DynamoDB table) at will without adding to the response time of the target Lambda, or incurring double billed time.

(Now, technically, since the SQS queue in this example just invokes a Lambda, the SQS queue could be skipped by having the target Lambda invoke the hitcounter Lambda asynchronously. But hey, having an SQS queue means that the target Lambda is decoupled from how the hitcounting is done, allowing it to be changed without having to modify the target Lambda.)
