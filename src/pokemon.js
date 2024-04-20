class Pokemon {
    constructor(xpos, ypos, isMine, width, height) {
        this.xpos = xpos
        this.ypos = ypos
        this.isMine = isMine
        this.width = width
        this.height = height
        this.image = new Image()
    }
    draw(context) {
        this.image.src = this.isMine
            ? JSON.parse(localStorage.getItem("pokemon"))[0].pokemonData.sprites.other.showdown.back_default 
            : JSON.parse(localStorage.getItem("rivalPokemon")).rivalPokemonData.sprites.other.showdown.front_default
        const pokImage = this.image

        if (pokImage.complete) {
            context.drawImage(pokImage, this.xpos, this.ypos, 200, 200)
        }
    }
}