/// <reference path="../node_modules/jest-haste-map/build/crawlers/node.d.ts" />
import * as cdk from '@aws-cdk/core';
import * as cfninc from '@aws-cdk/cloudformation-include';
import template from '../../cdk/cdk.out/Mediawiki.template.json';

const fs = require("fs");

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id, { tags: { service: 'mediawiki' } });

    const volumes: any[] = template.Resources.TaskDefinitionB36D86D9.Properties.Volumes;
    volumes.forEach(volume => {
      // CDK bug: https://github.com/aws/aws-cdk/issues/15025
      volume.EfsVolumeConfiguration.FilesystemId = volume.EfsVolumeConfiguration.FileSystemId;
      delete volume.EfsVolumeConfiguration.FileSystemId
      volume.EFSVolumeConfiguration = volume.EfsVolumeConfiguration;
      delete volume.EfsVolumeConfiguration;
    });
    fs.writeFileSync("./template.json", JSON.stringify(template, null, 2));

    new cfninc.CfnInclude(this, 'Template', {
      templateFile: 'template.json',
    });
  }
}
