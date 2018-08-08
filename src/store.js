var Promise = require('bluebird');

module.exports = {
    searchPokemons: function(pokedex) {
        return new Promise(function(resolve) {
            var infoPoke = [];
            for (var i = 1; i <= 5; i++) {
                infoPoke.push({
                    name: pokedex + ' Pokemon ' + i,
                    meuPokemon: pokedex,
                    image: 'https://images.scrapee.net/testesimagefiles/1755-teste.jpg' + i 
                });
            }
            setTimeout(function() { resolve(infoPoke); }, 1000);
        });
    }
};