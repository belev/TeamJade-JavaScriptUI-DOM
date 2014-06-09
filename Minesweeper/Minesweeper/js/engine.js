var Game = new function () {

    this.initialize = function (canvasElementId, sprite_data, callback) {
        this.canvas = $('#'+canvasElementId);
        this.width = this.canvas[0].width;
        this.height= this.canvas[0].height;

        this.ctx = this.canvas[0].getContext && this.canvas[0].getContext('2d');
        if (!this.ctx) { return alert("Please upgrade your browser to play"); }

        SpriteSheet.load(sprite_data, callback);
    };
};

var SpriteSheet = new function () {
    this.map = { };

    this.load = function (spriteData, callback) {
        this.map = spriteData;
        this.image = new Image();
        this.image.onload = callback;
        this.image.src = 'img/sprites.png';
    };

    this.draw = function (ctx, spriteName, x, y, frame) {
        var sprite = this.map[spriteName];
        if (!frame) frame = 0;
        ctx.drawImage(this.image,
                        sprite.sx + frame * sprite.w,
                        sprite.sy,
                        sprite.w, sprite.h,
                        Math.floor(x), Math.floor(y),
                        sprite.w, sprite.h);
    };
};

var Sprite = function () { };

Sprite.prototype.setup = function (sprite, props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w =  SpriteSheet.map[sprite].w;
    this.h =  SpriteSheet.map[sprite].h;
};

Sprite.prototype.merge = function (props) {
    if (props) {
        for (var prop in props) {
            this[prop] = props[prop];
        }
    }
};

Sprite.prototype.draw = function(ctx) {
    SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
};
