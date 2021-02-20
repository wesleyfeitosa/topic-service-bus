const { ServiceBusClient, delay, isServiceBusError, } = require('@azure/service-bus');
const credencialsServiceBus = require('./config/serviceBusCredentials');

async function main() {
  const {
    connectionString,
    topicName,
    subscriptionName,
  } = await credencialsServiceBus();

  const sbClient = new ServiceBusClient(
    "Endpoint=sb://teste-service.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=DQkKF6YC7V8TMbWd7bI0+HgzMRsP1gnF0HdP5L8P3vM="
  );
  const receiver = sbClient.createReceiver(topicName, subscriptionName, {receiveMode: 'receiveAndDelete'})

  console.log("ConnectionString", connectionString);
  console.log("TopicName", topicName);
  console.log("SubscriptionName", subscriptionName);
  
  console.log(`Listen messages:${subscriptionName}`);
  console.log('Received messages:');
  
  try {
    const subscription = receiver.subscribe({
      // After executing this callback you provide, the receiver will remove the message from the queue if you
      // have not already settled the message in your callback.
      // You can disable this by passing `false` to the `autoCompleteMessages` option in the `subscribe()` method.
      // If your callback _does_ throw an error before the message is settled, then it will be abandoned.
      processMessage: async (brokeredMessage) => {
        console.log(`Received message: ${brokeredMessage.body}`);
      },
      // This callback will be called for any error that occurs when either in the receiver when receiving the message
      // or when executing your `processMessage` callback or when the receiver automatically completes or abandons the message.
      processError: async (args) => {
        console.log(`Error from source ${args.errorSource} occurred: `, args.error);

        // the `subscribe() call will not stop trying to receive messages without explicit intervention from you.
        if (isServiceBusError(args.error)) {
          switch (args.error.code) {
            case "MessagingEntityDisabled":
            case "MessagingEntityNotFound":
            case "UnauthorizedAccess":
              // It's possible you have a temporary infrastructure change (for instance, the entity being
              // temporarily disabled). The handler will continue to retry if `close()` is not called on the subscription - it is completely up to you
              // what is considered fatal for your program.
              console.log(
                `An unrecoverable error occurred. Stopping processing. ${args.error.code}`,
                args.error
              );
              await subscription.close();
              break;
            case "MessageLockLost":
              console.log(`Message lock lost for message`, args.error);
              break;
            case "ServiceBusy":
              // choosing an arbitrary amount of time to wait.
              await delay(1000);
              break;
          }
        }
      }
    });
  } finally {}
}

main().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});