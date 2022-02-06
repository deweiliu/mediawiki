import { Construct } from 'constructs';
import {
    aws_route53 as route53,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_elasticloadbalancingv2 as elb,
    Fn,
    Stack,
} from 'aws-cdk-lib';

import { CdkStackProps } from './main-stack';

export class ImportValues extends Construct implements CdkStackProps {
    public hostedZone: route53.IHostedZone;
    public igwId: string;
    public vpc: ec2.IVpc;
    public albSecurityGroup: ec2.ISecurityGroup;
    public albListener: elb.IApplicationListener;
    public alb: elb.IApplicationLoadBalancer;
    public cluster: ecs.ICluster;
    public clusterSecurityGroup: ec2.ISecurityGroup;

    public maxAzs: number;
    public appId: number;
    public domain: string;
    public dnsRecord: string;
    public appName: string;
    public dockerImage: string;
    public priority: number;
    public dnsName: string;
    public hostPort: number;
    public fsId: string;
    public fsArn: string;
    public dbSecurityGroup: string;
    public instanceCount: number;

    constructor(scope: Construct, props: CdkStackProps) {
        super(scope, 'ImportValues')

        this.maxAzs = props.maxAzs;
        this.appId = props.appId;

        this.domain = props.domain;
        this.dnsRecord = props.dnsRecord;
        this.appName = props.appName;
        this.dockerImage = `deweiliu/${this.appName}`;
        this.priority = this.appId * 10;
        this.dnsName = `${this.dnsRecord}.${this.domain}`;
        this.hostPort = this.appId * 1000;
        this.instanceCount = props.instanceCount;

        this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(scope, 'HostedZone', {
            hostedZoneId: Fn.importValue('DLIUCOMHostedZoneID'),
            zoneName: props.domain,
        });

        this.igwId = Fn.importValue('Core-InternetGateway');

        this.vpc = ec2.Vpc.fromVpcAttributes(scope, 'ALBVPC', {
            vpcId: Fn.importValue('Core-Vpc'),
            availabilityZones: Stack.of(this).availabilityZones,
        });

        this.albSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(scope, "ALBSecurityGroup",
            Fn.importValue('Core-AlbSecurityGroup')
        );
        this.albListener = elb.ApplicationListener.fromApplicationListenerAttributes(scope, "ELBListener", {
            listenerArn: Fn.importValue('Core-AlbListener'),
            securityGroup: this.albSecurityGroup,
        });

        this.alb = elb.ApplicationLoadBalancer.fromApplicationLoadBalancerAttributes(scope, 'ALB', {
            loadBalancerArn: Fn.importValue('Core-Alb'),
            securityGroupId: this.albSecurityGroup.securityGroupId,
            loadBalancerCanonicalHostedZoneId: Fn.importValue('Core-AlbCanonicalHostedZone'),
            loadBalancerDnsName: Fn.importValue('Core-AlbDns'),
        });


        this.clusterSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(scope, 'ClusterSecurityGroup', Fn.importValue('Core-ClusterSecurityGroup'));
        this.cluster = ecs.Cluster.fromClusterAttributes(scope, 'Cluster', {
            clusterName: Fn.importValue('Core-ClusterName'),
            securityGroups: [this.clusterSecurityGroup],
            vpc: this.vpc,
        });

        this.fsId = Fn.importValue('Mediawiki-EfsId');
        this.fsArn = Fn.importValue('Mediawiki-EfsArn');
        this.dbSecurityGroup = Fn.importValue('Mediawiki-DbSecurityGroup');
    }


}