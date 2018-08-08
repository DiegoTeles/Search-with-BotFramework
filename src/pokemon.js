var builder = require('botbuilder');
var Store = require('./store');

module.exports = [
    // Destino
    function(session) {
        session.send('Bem vindo ao seu localizador de Pokémons!');
        builder.Prompts.text(session, 'Qual Pokémon?');
    },
    function(session, results, next) {
        session.dialogData.nomePokemon = results.response;
        next();
    },

    // Busca...
    function(session) {
        var {nomePokemon} = session.dialogData;

        session.send(
            `Certo! Estou buscando por... ${nomePokemon}`);

        // pesquisa Async
        Store.searchPokemons(nomePokemon)
            .then(function(poke) {
                // Resultado
                session.send('Encontrei um total de %d Pokémons com esse nome:', poke.length);

                var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(poke.map(pokemonAsAttachment));

                session.send(message);

                // Fim
                session.endDialog();
            });
    }
];

// Helpers, para realizar a busca dos pokemons
// tambem podemos o dialog "Attachment" usar para envio de anexos e arquivos
function pokemonAsAttachment(poke) {
    return new builder.HeroCard()
        .title(poke.name)
        // .images([new builder.CardImage().url(poke.image)])
        .buttons([
            new builder.CardAction()
            // titulo do card
            .title('Mais detalhes')
            // abrimos a url de conexao externa
            .type('openUrl')

            // Setamos a url de localização do Pokemon, ou seja, qual seu provedor de buscas do Pokemon 
            .value('https://www.bing.com//images/search?q=pokemons+' + encodeURIComponent(poke.meuPokemon))
        ]);
}
