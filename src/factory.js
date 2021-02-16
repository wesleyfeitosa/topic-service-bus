const { ServiceBusClient } = require("@azure/service-bus");
const credencialsServiceBus = require('./config/serviceBusCredentials');

const messages = [
  { body: "Albert Einstein" },
  { body: "Werner Heisenberg" },
  { body: "Marie Curie" },
  { body: "Steven Hawking" },
  { body: "Isaac Newton" },
  { body: "Niels Bohr" },
  { body: "Michael Faraday" },
  { body: "Galileo Galilei" },
  { body: "Johannes Kepler" },
  { body: "Nikolaus Kopernikus" }
];

async function main() {
  const {
    connectionString,
    topicName,
  } = await credencialsServiceBus();

    //Cria a conexão com o Service Bus utilizando as configurações em config/default.json
    const cliente = new ServiceBusClient(connectionString);
    const sender = cliente.createSender(topicName);

    try {
        //Fabricamos 20 mensagens
        for (let i = 0; i < messages.length; i++) {
            //Esse será o conteúdo das nossas mensagens
            const message = {
                body: messages[i].body,
                label: 'testes',
                properties: {
                    country: 'Brazil',
                    state: 'CE'
                }
            };
            await sender.sendMessages(message); //Envia mensagem
            console.log('Enviou a mensagem ' + i)
        }

    } finally {
        await cliente.close(); //Finaliza o cliente do Service Bus
    }
}

main().catch((err) => {
    console.log(err);
});