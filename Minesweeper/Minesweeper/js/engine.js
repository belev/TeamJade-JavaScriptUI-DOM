var Game = function (id, width, height) {

    this.stage = new Kinetic.Stage({
        container: id,
        width: width,
        height: height
    });

    this.layer = new Kinetic.Layer();


    this.addToLayer = function (elements) {
        for (var i = 0, len = elements.lenght; i < len; i += 1) {
            this.layer.add(elements[i]);
        }
    }

    this.render = function () {
        this.stage.add(this.layer);
    }
};
