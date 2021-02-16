const getCredentials = async () => {
  const [
    connectionString,
    topicName,
    subscriptionName,
  ] = [
    "Endpoint=sb://teste-service.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=DQkKF6YC7V8TMbWd7bI0+HgzMRsP1gnF0HdP5L8P3vM=",
    "topico",
    "mysubscription",
  ]

  return {
    connectionString,
    topicName,
    subscriptionName,
  };
};

module.exports = getCredentials;