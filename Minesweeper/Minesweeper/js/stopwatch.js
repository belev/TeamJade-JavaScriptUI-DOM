function StopWatch() {

    this.startTime = null;
    this.stopTime = null;
    this.running = false;
}

StopWatch.prototype.start = function () {

    if (this.running == true) {
        return;
    }
    else if (this.startTime != null) {
        this.stopTime = null;
    }

    this.running = true;
    this.startTime = this.getTime();
};

StopWatch.prototype.stop = function () {

    if (this.running == false) {
        return;
    }

    this.stopTime = this.getTime();
    this.running = false;
};

StopWatch.prototype.duration = function () {
    if (this.startTime == null || this.stopTime == null) {
        return 'Undefined';
    } else {
        return (this.stopTime - this.startTime) / 1000;
    }
};

StopWatch.prototype.getTime = function getTime() {
    var day = new Date();
    return day.getTime();
};
