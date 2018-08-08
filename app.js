var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3979, function () {
   console.log('%s Escutando em %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("VOCÊ DISSE: %s", session.message.text);
});


// Aqui setamos nossos dialogos para serem chamados nas Sessions
var DialogLabels = {
    intencao01: 'StarWars',
    intencao02: 'Pokemon',
    ajuda: 'Ajuda'
};
// Usamos armazenamento em memória
var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, [
     (session) => {
        session.preferredLocale("pt"); // Passamos o Bot para português
        // prompt para pesquisar opção
        builder.Prompts.choice(
            session,'Qual opção você deseja? \n',
            [
                DialogLabels.intencao02, 
                DialogLabels.intencao01
            ],
            {
                maxRetries: 3, // Defino quantas tentativas
                retryPrompt: 'Não é uma opção válida. \n escolha entre: \n' // Disparo erro pelas tentativas
            });
            
    },
     (session, result) => {
        if (!result.response) {
            // Quando passar das quantidade de tentativas fazemos isso
            session.send('Ooops! Muitas ***tentativas sem sucesso*** :( \n Mas não se preocupe, você pode tentar de novo!');
            return session.endDialog();
        }

        // Quando houver erro, começamos de novo
        session.on('error', (err) => {
            session.send('Falha com a Mensagem: %s', err.message);
            session.endDialog();
        });

        //  Continuamos no dialogo apropriado usando Cases
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.intencao02:
                return session.beginDialog('pokemon');
            case DialogLabels.intencao01:
                return session.beginDialog('starWars');
        }
    }
]).set('storage', inMemoryStorage); // Registramos os dados em "memory storage"

bot.dialog('starWars', require('./src/starWars'));
bot.dialog('pokemon', require('./src/pokemon'))
// bot.dialog('support', require('./support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });

// Registramos quaisquer erros do bot no console
bot.on('error', function (e) {
    console.log('E ocorreu o erro ', e);
});