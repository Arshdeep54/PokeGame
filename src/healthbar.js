class Healthbar {
    constructor(xpos, ypos, hp, maxhp, level, exp, expforNextlevel, isMine, width, height, pokemonName) {
        this.xpos = xpos
        this.ypos = ypos
        this.hp = hp
        this.maxhp = maxhp
        this.level = level
        this.exp = exp
        this.expforNextlevel = expforNextlevel
        this.isMine = isMine
        this.width = width
        this.height = height
        this.pokemonName =" "
        this.totalbarwidth = 190

    }
    loadData(){
        this.pokemonName=this.isMine
        ? JSON.parse(localStorage.getItem("pokemon"))[0].pokemonName.pokemon.name
        : JSON.parse(localStorage.getItem("rivalPokemon")).rivalPokemon.pokemon.name
        this.hp =this.isMine
        ? JSON.parse(localStorage.getItem("pokemon"))[0].playerData.currenthp
        : JSON.parse(localStorage.getItem("rivalPokemon")).rivalData.hp
        this.maxhp = this.isMine
        ? JSON.parse(localStorage.getItem("pokemon"))[0].playerData.maxhp
        : JSON.parse(localStorage.getItem("rivalPokemon")).rivalData.maxhp
        this.level = this.isMine
        ? JSON.parse(localStorage.getItem("pokemon"))[0].playerData.level
        : JSON.parse(localStorage.getItem("rivalPokemon")).rivalData.level
        this.exp = JSON.parse(localStorage.getItem("pokemon"))[0].playerData.exp
        this.expforNextlevel = JSON.parse(localStorage.getItem("pokemon"))[0].playerData.expNextlvl
    }
    draw(context) {
        this.loadData()
        context.fillStyle = "yellow"
        context.fillRect(this.xpos, this.ypos, this.width, this.height)
        context.fillStyle = "black"
        context.font = "16px serif"
        
        context.fillText(this.pokemonName, this.xpos + 20, this.ypos + 20)
        context.fillText("lvl " + this.level.toString(), this.xpos + this.width - 50, this.ypos + 20)
        context.fillText("HP ", this.xpos + 20, this.ypos + 50)
        context.fillStyle = "black"
        context.lineWidth = 1
        context.strokeRect(this.xpos + 50, this.ypos + 40, this.totalbarwidth, 6)
        let hpfill = (this.hp / this.maxhp) * this.totalbarwidth
        context.fillRect(this.xpos + 50, this.ypos + 40, hpfill, 6)
        let hpstring = (this.hp).toString() + "/" + this.maxhp.toString()
        context.fillText(hpstring, this.xpos + this.width - 60, this.ypos + 65)
        if (this.isMine) {
            context.fillText("XP ", this.xpos + 20, this.ypos + 90)
            context.fillStyle = "black"
            context.lineWidth = 1
            context.strokeRect(this.xpos + 50, this.ypos + 80, this.totalbarwidth, 6)
            let xpfill = (this.exp / this.expforNextlevel) * this.totalbarwidth
            context.fillRect(this.xpos + 50, this.ypos + 80, xpfill, 6)
        }

    }
}