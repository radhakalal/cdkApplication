#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkCrosTypescriptStack } from '../lib/cdk-cros-typescript-stack';

const app = new cdk.App();
new CdkCrosTypescriptStack(app, 'CdkCrosTypescriptStack',{
    env :{
        
        // region:"us-east-2"
        region:"us-west-2"
     },
});
