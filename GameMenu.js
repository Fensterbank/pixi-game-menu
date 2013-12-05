function GameMenu(topPosition, buttonTexturePath, onAssetsLoadedCallback) {
    var that = this;

    this._buttons = [];
    this._onDriveInFinishedCallback = null;
    this._onDriveOutFinishedCallback = null;
    this._onAssetsLoadedCallback = onAssetsLoadedCallback;

    var menuState = 0;
    var startHeight = topPosition;
    var counter = 0;
    var destroy = false;
    var buttonTexture = null;
    var bTexturePath = buttonTexturePath;
    var pressedButton = null;

    this.loadAssets = function() {
        var assetsToLoad = [buttonTexturePath];

        var loader = new PIXI.AssetLoader(assetsToLoad);

        loader.onComplete = function() {
            buttonTexture = PIXI.Texture.fromImage(bTexturePath);
            if (that._onAssetsLoadedCallback!=null) {
                that._onAssetsLoadedCallback();
            }
        };
        loader.load();
    };

    this.addButton = function(text, stage, buttonType) {
        var newHeight = startHeight;
        that._buttons.forEach(function(element, index) {
            newHeight += element.getHeight();
        });
        var newMenuButton = new GameMenuButton(text, newHeight, buttonType, buttonTexture);
        newMenuButton.addToStage(stage);
        newMenuButton._onPressCallback = that.buttonPressed.bind(that);
        that._buttons.push(newMenuButton);
    };

    this.animate = function() {
        switch (menuState)
        {
            case 0:
                that._buttons[0].driveIn();
                counter = 1;
                menuState = 1;
                break;
            case 1:
                if (that._buttons[counter - 1]._driveInFinished)
                {
                    if (that._buttons.length > counter)
                    {
                        that._buttons[counter].driveIn();
                        counter++;
                    }
                    else
                    {
                        menuState = 2;
                        this.onDriveInFinished();
                    }
                }
                break;
            case 2:
                // Do nothing;
                break;
            case 3:
                that._buttons[0].driveOut();
                counter = 1;
                menuState = 4;
                break;
            case 4:
                if (that._buttons[counter - 1]._driveOutFinished)
                {
                    if (that._buttons.length > counter)
                    {
                        that._buttons[counter].driveOut();
                        counter++;
                    }
                    else
                    {
                        menuState = 2;
                        //EventArgs args = new EventArgs();
                        this.onDriveOutFinished(pressedButton);
                        if (destroy)
                            that._alive = false;
                    }
                }
                break;
        }

        that._buttons.forEach(function(element, index) {
            element.animate();
        });
    };

    this.buttonPressed = function(button) {
        if (menuState <= 2) {
            pressedButton = button;
            this.driveOut(false);
        }
    };

    this.onDriveOutFinished = function(pressedButton) {
        if (that._onDriveOutFinishedCallback!=null) {
            that._onDriveOutFinishedCallback(pressedButton);
        }
    };

    this.onDriveInFinished = function() {
        if (that._onDriveInFinishedCallback!=null) {
            that._onDriveInFinishedCallback();
        }
    };

    this.driveOut = function(sdestroy) {
        menuState = 3;
        destroy = sdestroy
    };

    this.driveIn = function() {
        menuState = 0;
    };
}