#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { CdkStack } from '../lib/main-stack';

const app = new App();
new CdkStack(app, 'Mediawiki');
