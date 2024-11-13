class Pokemon {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;

    this.hasFemaleSprite = data.sprites.front_female != null;
    this.hasShinySprite = data.sprites.front_shiny != null;

    // Shiny sprite doesn't always work... Just disable
    this.hasShinySprite = false;

    this.sex = randomRange(0, 1) == 0 ? "female" : "male";
    this.shiny = this.hasShinySprite && randomRange(0, 100) >= 99;

    let imageURL = "";
    imageURL += this.hasShinySprite && this.shiny ? "_shiny" : "";
    imageURL +=
      this.hasFemaleSprite && this.sex == "female" ? "_female" : "_default";

    this.frontSprite = data.sprites[`front${imageURL}`];
    this.backSprite = data.sprites[`back${imageURL}`];

    this.types = [];

    for (let index = 0; index < data.types.length; index++) {
      const element = data.types[index];
      this.types.push(element.type.name);
    }
  }
}
