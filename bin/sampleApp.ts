#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { SampleAppStack } from "../lib/SampleAppStack";

const app = new cdk.App();
new SampleAppStack(app, "SampleAppStack");
