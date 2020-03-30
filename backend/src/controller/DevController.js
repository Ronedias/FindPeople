const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');


module.exports = {

    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },


    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });
        if (!dev) {


            try{
                const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
                if(response.status === 404){
                  throw new Error("usuário invalido")
                }
                //vai chegar aqui caso de tudo certo

                           

            let { name = login, avatar_url, bio } = apiResponse.data;


            if (!name) {
                name = apiResponse.data.login;
            }

            const techsArray = parseStringAsArray(techs);
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

             dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,

            });

            //filtrar as conexoes que estao no max 10 km de distancia e q o novo dev tenha pela menos uma das 
            //tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
                )

                sendMessage(sendSocketMessageTo, 'new-dev', dev);

              }catch(err){
                alert("usuario invalido")
              }
        }
        return response.json(dev);
    }


}