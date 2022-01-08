#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkStack } from '../lib/main-stack';

const app = new cdk.App();
new CdkStack(app, 'Mediawiki');
