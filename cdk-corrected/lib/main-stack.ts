/// <reference path="../node_modules/jest-haste-map/build/crawlers/node.d.ts" />
import { Construct } from 'constructs';
import { Stack, cloudformation_include as cfninc } from 'aws-cdk-lib';

import template from '../../cdk/cdk.out/Mediawiki.template.json';

const fs = require("fs");

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, { tags: { service: 'mediawiki' } });

    const volumes: any[] = template.Resources.TaskDefinitionB36D86D9.Properties.Volumes;
    volumes.forEach(volume => {
      // CDK bug: https://github.com/aws/aws-cdk/issues/15025
      volume.EfsVolumeConfiguration.FilesystemId = volume.EfsVolumeConfiguration.FileSystemId;
      delete volume.EfsVolumeConfiguration.FileSystemId
      volume.EFSVolumeConfiguration = volume.EfsVolumeConfiguration;
      delete volume.EfsVolumeConfiguration;
    });

    delete (template as any).Parameters.BootstrapVersion;
    delete (template as any).Rules.CheckBootstrapVersion;

    fs.writeFileSync("./template.json", JSON.stringify(template, null, 2));

    new cfninc.CfnInclude(this, 'Template', {
      templateFile: 'template.json',
    });
  }
}
