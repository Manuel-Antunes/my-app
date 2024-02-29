import {
  AllowedMethods,
  CachePolicy,
  CachedMethods,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BucketAccessControl } from 'aws-cdk-lib/aws-s3';

import { SSTConfig } from "sst";
import { Bucket, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "my-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const bucket = new Bucket(stack, "sla",{
        blockPublicACLs: false,
        cdk:{
          bucket:{
            accessControl: BucketAccessControl.PUBLIC_READ,
          }
        }
      });
      const site = new NextjsSite(stack, "site", {
        bind: [bucket],
        cdk: {
          distribution: {
            additionalBehaviors: {
              'uploads/*': {
                origin: new S3Origin(bucket.cdk.bucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
                compress: true,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED,
              },
            },
          },
        }
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
