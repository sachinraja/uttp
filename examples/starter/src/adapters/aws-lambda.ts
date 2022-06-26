import { getAwsLambdaAdapter } from 'unhttp/adapters/aws-lambda'
import { handler } from '../handler.js'

export const awsLambdaHandler = getAwsLambdaAdapter(handler)
