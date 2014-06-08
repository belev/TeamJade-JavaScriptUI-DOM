var Game = new function () {

    this.initialize = function(canvasElementId, sprite_data, callback) {
        this.canvas = document.getElementById(canvasElementId);
        this.width = this.canvas.width;
        this.height= this.canvas.height;

        this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
        if(!this.ctx) { return alert("Please upgrade your browser to play"); }

        SpriteSheet.load(sprite_data, callback);
    };

};

var SpriteSheet = new function() {
    this.map = { };

    this.load = function(spriteData, callback) {
        this.map = spriteData;
        this.image = new Image();
        this.image.onload = callback;
        this.image.src = 'img/sprites.png';
    };

    this.draw = function(ctx, sprite, x, y, frame) {
        var s = this.map[sprite];
        if(!frame) frame = 0;
        ctx.drawImage(this.image,
                        s.sx + frame * s.w,
                        s.sy,
                        s.w, s.h,
                        Math.floor(x), Math.floor(y),
                        s.w, s.h);
    };
};
