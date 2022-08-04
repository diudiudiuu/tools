from __future__ import print_function

import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

cloudwatch = boto3.client('cloudwatch')

def lambda_handler(event, context):
    logger.info("Event: " + str(event))
    message = json.loads(event['Records'][0]['Sns']['Message'])
    #logger.info("Event: " + event['Records'][0]['Sns']['Message'])

    alarm_name = message['AlarmName']
    new_state = message['NewStateValue']
    #logger.info("%s state is now %s" % (alarm_name, new_state))

    try:
        cloudwatch.set_alarm_state(
            AlarmName=alarm_name,
            StateValue='OK',
            StateReason='Change Alarm To OK'
        )
        #logger.info("alarm state is change to ok.")
    except Exception as e:
        logger.error(e)