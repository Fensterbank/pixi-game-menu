function GameMenuButton(mtext, top, buttonType, buttonTexture) {
    var that = this;
    this._buttonType = buttonType;
    this._onPressCallback = null;
    this._driveInFinished = false;
    this._driveOutFinished = false;

    var currentState = 'default';
    var speed = 0;
    var sprite = new PIXI.Sprite(buttonTexture);

    var text = new PIXI.Text(mtext, { font: "48px Arial", fill: '#FFF' });

    sprite.position.x = 0 - sprite.width;
    sprite.position.y = top;
    sprite.interactive = true;
    text.position.x = (0 - sprite.width) + 20;
    text.position.y = top + 20;


    sprite.click = function(mouseData) {
        if (that._onPressCallback != null)
        {
            that._onPressCallback(that);
        }
    };

    sprite.tap = function(tapData) {
        if (that._onPressCallback != null)
        {
            that._onPressCallback(that);
        }
    };

    this.animate = function() {
        switch (currentState) {
            case 'driveIn':
                sprite.position.x += speed;
                text.position.x += speed;

                if (sprite.position.x > -100 && speed > 3)
                {
                    speed -= 2;
                }

                if (sprite.position.x > speed * (-1))
                {
                    currentState = 'default';
                    that._driveInFinished = true;
                }
                break;
            case 'driveOut':
                sprite.position.x -= speed;
                text.position.x -= speed;

                if ((sprite.position.x + sprite.width) < 100 && speed > 3)
                {
                    speed -= 2;
                }

                if ((sprite.position.x + sprite.width) < speed * (-1))
                {
                    currentState = 'default';
                    that._driveOutFinished = true;
                }
                break;
        }
    };

    this.getHeight = function() {
        return 86;
        //return sprite.height;
    };

    this.addToStage = function(stage) {
        stage.addChild(sprite);
        stage.addChild(text);
    };

    this.driveIn = function() {
        currentState = 'driveIn';
        that._driveInFinished = false;
        that._driveOutFinished = false;
        speed = 20;
    };

    this.driveOut = function() {
        currentState = 'driveOut';
        that._driveInFinished = false;
        that._driveOutFinished = false;
        speed = 20;
    };
}