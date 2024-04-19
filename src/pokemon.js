const getRandomPokemon = async () => {
    const response = await fetch(" https://pokeapi.co/api/v2/type/grass/")
    const data = await response.json()
    const max = data["pokemon"].length
    const min = 0
    const getslot1 = () => {
        let random = Math.floor(Math.random() * (max - min) + min)

        if (data.pokemon[random].slot == 2) {
            getslot1()
        }
        else {
            return data.pokemon[random]
        }
    }
    let pokemon = getslot1();
    // console.log(localStorage.getItem("pokemon"))
    if(JSON.parse(localStorage.getItem("pokemon")).length==0){
        console.log("empty storage");
        let pokemonArray=[pokemon]
        localStorage.setItem("pokemon",JSON.stringify(pokemonArray))
        console.log(JSON.parse(localStorage.getItem("pokemon")),"updated ")

    }
    // console.log(pokemon)
}
