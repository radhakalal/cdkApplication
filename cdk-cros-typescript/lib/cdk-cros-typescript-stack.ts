
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway'
import * as dynomodb from '@aws-cdk/aws-dynamodb'

export class CdkCrosTypescriptStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

//----------Dynamodb creation 
    const dynamoTable = new dynomodb.Table(this, 'DemoTable', {
      partitionKey: {
        name: 'itemId',
        type: dynomodb.AttributeType.STRING
      },
      tableName: 'DemoTable',
    });

    //--------RestApi gateway creation
    const api = new apigw.RestApi(this, 'itemsApi', {
      restApiName: 'Items Service'
    });

    // root api---------
    const items = api.root.addResource('items');

    //------getOne Api lambda
    const getOneLambda = new lambda.Function(this, 'getOneItemFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'get-one.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'itemId'
      }
    });
      //----- lambda integrate with api gateway
    const singleItem = items.addResource('{id}');
    const getOneIntegration = new apigw.LambdaIntegration(getOneLambda);
    singleItem.addMethod('GET', getOneIntegration);

    //---------provide permision to lambda to connect with db 
    dynamoTable.grantReadWriteData(getOneLambda);

    //----- getAll Api lambda 
    const getAllLambda = new lambda.Function(this, 'getAllItemsFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'get-all.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'itemId'
      }
    });
     
    //------integrate getAll api with gatway 
    const getAllIntegration = new apigw.LambdaIntegration(getAllLambda);
    items.addMethod('GET', getAllIntegration);

    // -----permision to lambda to connect with db
    dynamoTable.grantReadWriteData(getAllLambda);

    //-------- crete Api lambda
    const createOne = new lambda.Function(this, 'createItemFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'create.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'itemId'
      }
    });

    //-- integrate create api with gateway
    const createOneIntegration = new apigw.LambdaIntegration(createOne);
    items.addMethod('POST', createOneIntegration);

    // ------- permission
    dynamoTable.grantReadWriteData(createOne);

    //----- update api lambda 
    const updateOne = new lambda.Function(this, 'updateItemFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'update-one.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'itemId'
      }
    });
       //---- update api lambda integrate with gateway
    const updateOneIntegration = new apigw.LambdaIntegration(updateOne);
    singleItem.addMethod('PATCH', updateOneIntegration);

     // permission--------
    dynamoTable.grantReadWriteData(updateOne);

    //------- delete api lambda
    const deleteOne = new lambda.Function(this, 'deleteItemFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'delete-one.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'itemId'
      }
    });
     //----delete api lambda integrate with gateway
    const deleteOneIntegration = new apigw.LambdaIntegration(deleteOne);
    singleItem.addMethod('DELETE', deleteOneIntegration);
   
    //------db permission
    dynamoTable.grantReadWriteData(deleteOne);
 
  }
}



