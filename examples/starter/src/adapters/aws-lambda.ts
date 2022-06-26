import { getAwsLambdaAdapter } from 'uttp/adapters/aws-lambda'
import { handler } from '../handler.js'

export const awsLambdaHandler = getAwsLambdaAdapter(handler)
