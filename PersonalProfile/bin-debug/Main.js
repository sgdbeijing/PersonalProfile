var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.onloadmusic = function (event) {
        var hailoader = new egret.URLLoader();
        hailoader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        hailoader.load(new egret.URLRequest("resource/haishang.mp3"));
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        //页面滑动功能
        this.scrollRect = new egret.Rectangle(0, 0, stageW * 5, this.stage.stageHeight); //页面数修改处
        this.cacheAsBitmap = true;
        this.touchEnabled = true;
        var starttouchpointX = 0;
        var startstagepointX = 0;
        var movedistance = 0;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startScroll, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, stopScroll, this);
        function startScroll(e) {
            if ((this.scrollRect.x % stageW) != 0) {
                this.scrollRect.x = startstagepointX; //如果图片位置错误，返回上一个正确位置；
            }
            starttouchpointX = e.stageX;
            startstagepointX = this.scrollRect.x;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, onScroll, this);
        }
        function onScroll(e) {
            var rect = this.scrollRect;
            movedistance = starttouchpointX - e.stageX;
            rect.x = (startstagepointX + movedistance);
            this.scrollRect = rect;
        }
        function stopScroll(e) {
            var rect = this.scrollRect;
            if ((movedistance >= (this.stage.stageWidth / 3)) && startstagepointX != stageW * 4) {
                rect.x = startstagepointX + stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else if ((movedistance <= (-(this.stage.stageWidth / 3))) && startstagepointX != 0) {
                rect.x = startstagepointX - stageW;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else {
                movedistance = 0;
                rect.x = startstagepointX;
                this.scrollRect = rect;
            }
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, onScroll, this);
        }
        //页面滑动功能结束
        //第一页开始
        var page1 = new egret.DisplayObjectContainer();
        this.addChild(page1);
        page1.width = stageW;
        page1.height = stageH;
        var sky = this.createBitmapByName("02_jpg");
        page1.addChild(sky);
        sky.width = stageW;
        sky.height = stageH;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        page1.addChild(topMask);
        var icon = this.createBitmapByName("egret_icon_png");
        page1.addChild(icon);
        icon.x = 26;
        icon.y = 33;
        var avatar = this.createBitmapByName("avatar_png");
        page1.addChild(avatar);
        avatar.width = 400;
        avatar.height = 400;
        avatar.anchorOffsetX = avatar.width / 2;
        avatar.anchorOffsetY = avatar.height / 2;
        avatar.x = this.stage.stageWidth / 2;
        avatar.y = this.stage.stageHeight / 2 - 50;
        var line1 = new egret.Shape();
        line1.graphics.lineStyle(2, 0xffffff);
        line1.graphics.moveTo(0, 0);
        line1.graphics.lineTo(0, 117);
        line1.graphics.endFill();
        line1.x = 172;
        line1.y = 61;
        page1.addChild(line1);
        var line2 = new egret.Shape();
        line2.graphics.lineStyle(4, 0xffffff);
        line2.graphics.moveTo(0, 0);
        line2.graphics.lineTo(stageW - 100, 0);
        line2.graphics.endFill();
        line2.anchorOffsetX = line2.width / 2;
        line2.anchorOffsetY = line2.height / 2;
        line2.x = avatar.x;
        line2.y = avatar.y + 250;
        page1.addChild(line2);
        var text1 = new egret.TextField();
        text1.textColor = 0xffffff;
        text1.width = stageW - 172;
        text1.textAlign = "center";
        text1.text = "个人简介";
        text1.size = 80;
        text1.anchorOffsetX = text1.width / 2;
        text1.anchorOffsetY = text1.height / 2;
        text1.x = avatar.x;
        text1.y = avatar.y + 350;
        page1.addChild(text1);

        var text2 = new egret.TextField();
        text2.textColor = 0xffffff;
        text2.width = stageW - 172;
        text2.textAlign = "center";
        text2.text = "向左划《==《==";
        text2.size = 40;
        text2.anchorOffsetX = text2.width / 2;
        text2.anchorOffsetY = text2.height / 2;
        text2.x = text1.x;
        text2.y = text1.y + 100;
        page1.addChild(text2);

        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Powered By Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        page1.addChild(colorLabel);
        var textfield = new egret.TextField();
        page1.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        //第一页结束
        //第二页开始
        var page2 = new egret.DisplayObjectContainer();
        this.addChild(page2);
        page2.x = stageW;
        page2.width = stageW;
        page2.height = stageH;
        var sky2 = this.createBitmapByName("02_jpg");
        page2.addChild(sky2);
        sky2.width = stageW;
        sky2.height = stageH;
        var topMask2 = new egret.Shape();
        topMask2.graphics.beginFill(0x000000, 0.5);
        topMask2.graphics.drawRect(0, 0, stageW, stageH - 200);
        topMask2.graphics.endFill();
        topMask2.y = 95;
        page2.addChild(topMask2);
        var avatar2 = this.createBitmapByName("avatar_png");
        page2.addChild(avatar2);
        avatar2.width = 200;
        avatar2.height = 200;
        avatar2.anchorOffsetX = avatar2.width / 2;
        avatar2.anchorOffsetY = avatar2.height / 2;
        avatar2.x = this.stage.stageWidth / 4;
        avatar2.y = this.stage.stageHeight / 4;
        var changeavatar = function () {
            var avatartw = egret.Tween.get(avatar2);
            avatartw.to({ "rotation": 10 }, 100);
            avatartw.to({ "rotation": -10 }, 100);
            avatartw.to({ "rotation": 0 }, 100);
            avatartw.wait(2000);
            avatartw.call(changeavatar, self);
        };
        changeavatar();
        var page2text2 = new egret.TextField();
        page2text2.textColor = 0xffffff;
        page2text2.width = stageW - 172;
        page2text2.textAlign = "center";
        page2text2.text = "姓名  sgdbeijing";
        page2text2.size = 40;
        page2text2.anchorOffsetX = page2text2.width / 2;
        page2text2.x = avatar2.x + 280;
        page2text2.y = avatar2.y - 100;
        page2.addChild(page2text2);
        var page2text3 = new egret.TextField();
        page2text3.textColor = 0xffffff;
        page2text3.width = stageW - 172;
        page2text3.textAlign = "center";
        page2text3.text = "性别  男";
        page2text3.size = 40;
        page2text3.anchorOffsetX = page2text2.width / 2;
        page2text3.x = page2text2.x;
        page2text3.y = page2text2.y + 80;
        page2.addChild(page2text3);
        var page2text4 = new egret.TextField();
        page2text4.textColor = 0xffffff;
        page2text4.width = stageW - 172;
        page2text4.textAlign = "center";
        page2text4.text = "年龄  20";
        page2text4.size = 40;
        page2text4.anchorOffsetX = page2text4.width / 2;
        page2text4.x = page2text3.x;
        page2text4.y = page2text3.y + 80;
        page2.addChild(page2text4);
        var page2text5 = new egret.TextField();
        page2text5.textColor = 0xffffff;
        page2text5.width = stageW - 110;
        page2text5.text = "对图像识别感兴趣";
        page2text5.size = 35;
        page2text5.x = avatar2.x - avatar2.width / 2 - 8;
        page2text5.y = page2text4.y + 100;
        page2.addChild(page2text5);
        var page2text6 = new egret.TextField();
        page2text6.textColor = 0xffffff;
        page2text6.width = stageW - 110;
        page2text6.text = "读过一些相关的国内外论文";
        page2text6.size = 35;
        page2text6.x = page2text5.x;
        page2text6.y = page2text5.y + 50;
        page2.addChild(page2text6);
        var page2text7 = new egret.TextField();
        page2text7.textColor = 0xffffff;
        page2text7.width = stageW - 110;
        page2text7.text = "喜欢交朋友";
        page2text7.size = 35;
        page2text7.x = page2text6.x;
        page2text7.y = page2text6.y + 70;
        page2.addChild(page2text7);
        var page2text8 = new egret.TextField();
        page2text8.textColor = 0xffffff;
        page2text8.width = stageW - 110;
        page2text8.text = "兴趣爱好十分广泛";
        page2text8.size = 35;
        page2text8.x = page2text7.x;
        page2text8.y = page2text7.y + 70;
        page2.addChild(page2text8);
        var page2text9 = new egret.TextField();
        page2text9.textColor = 0xffffff;
        page2text9.width = stageW - 110;
        page2text9.text = "喜欢看小说、电影、动漫";
        page2text9.size = 35;
        page2text9.x = page2text8.x;
        page2text9.y = page2text8.y + 50;
        page2.addChild(page2text9);
        var page2text10 = new egret.TextField();
        page2text10.textColor = 0xffffff;
        page2text10.width = stageW - 110;
        page2text10.text = "热爱运动";
        page2text10.size = 35;
        page2text10.x = page2text9.x;
        page2text10.y = page2text9.y + 70;
        page2.addChild(page2text10);
        var page2text11 = new egret.TextField();
        page2text11.textColor = 0xffffff;
        page2text11.width = stageW - 110;
        page2text11.text = "喜欢跑步、骑自行车";
        page2text11.size = 35;
        page2text11.x = page2text10.x;
        page2text11.y = page2text10.y + 50;
        page2.addChild(page2text11);
        //第二页结束
        //第三页开始
        var page3 = new egret.DisplayObjectContainer();
        this.addChild(page3);
        page3.x = stageW * 2;
        page3.width = stageW;
        page3.height = stageH;
        var sky3 = this.createBitmapByName("02_jpg");
        page3.addChild(sky3);
        sky3.width = stageW;
        sky3.height = stageH;
        var topMask3 = new egret.Shape();
        topMask3.graphics.beginFill(0x000000, 0.5);
        topMask3.graphics.drawRect(0, 0, stageW, stageH - 200);
        topMask3.graphics.endFill();
        topMask3.y = 95;
        page3.addChild(topMask3);
        var page3text1 = new egret.TextField();
        page3text1.textColor = 0xffffff;
        page3text1.width = stageW - 172;
        page3text1.textAlign = "center";
        page3text1.text = "喜爱的小说";
        page3text1.size = 60;
        page3text1.anchorOffsetX = page3text1.width / 2;
        page3text1.anchorOffsetY = page3text1.height / 2;
        page3text1.x = stageW / 2;
        page3text1.y = topMask3.y + 60;
        page3.addChild(page3text1);
        var banruo = this.createBitmapByName("banruo_jpg");
        page3.addChild(banruo);
        banruo.scaleX = 1.25;
        banruo.scaleY = 1.25;
        banruo.anchorOffsetX = banruo.width / 2;
        banruo.anchorOffsetY = banruo.height / 2;
        banruo.x = page3text1.x;
        banruo.y = this.stage.stageHeight / 4 + 100;
        var santi = this.createBitmapByName("santi_jpg");
        page3.addChild(santi);
        santi.scaleX = banruo.width * 1.25 / santi.width;
        santi.scaleY = banruo.width * 1.25 / santi.width;
        santi.anchorOffsetX = santi.width / 2;
        santi.anchorOffsetY = santi.height / 2;
        santi.x = page3text1.x;
        santi.y = this.stage.stageHeight / 4 + 500;
        var pictureMask = new egret.Shape();
        pictureMask.graphics.beginFill(0x000000, 1);
        pictureMask.graphics.drawRect(0, 0, stageW, stageH - 200);
        pictureMask.graphics.endFill();
        pictureMask.y = 95;
        banruo.touchEnabled = true;
        banruo.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchbanruobig, this);
        var banruoBIG = this.createBitmapByName("banruo_jpg");
        banruoBIG.scaleX = 2;
        banruoBIG.scaleY = 2
        banruoBIG.anchorOffsetX = banruoBIG.width / 2;
        banruoBIG.anchorOffsetY = banruoBIG.height / 2;
        banruoBIG.x = this.stage.stageWidth / 2;
        banruoBIG.y = this.stage.stageWidth / 5 * 4;
        banruoBIG.touchEnabled = true;
        function onTouchbanruobig(event) {
            page3.addChild(pictureMask);
            page3.addChild(banruoBIG);
            banruo.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchbanruobig, this);
            banruoBIG.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchbanruosmall, this);
        }
        function onTouchbanruosmall(event) {
            page3.removeChild(pictureMask);
            page3.removeChild(banruoBIG);
            banruoBIG.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchbanruosmall, this);
            banruo.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchbanruobig, this);
        }
        santi.touchEnabled = true;
        santi.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchsantibig, this);
        var santiBIG = this.createBitmapByName("santi_jpg");
        santiBIG.scaleX = banruoBIG.width * 2 / santiBIG.width;
        santiBIG.scaleY = banruoBIG.width * 2 / santiBIG.width;
        santiBIG.anchorOffsetX = santiBIG.width / 2;
        santiBIG.anchorOffsetY = santiBIG.height / 2;
        santiBIG.x = this.stage.stageWidth / 2;
        santiBIG.y = this.stage.stageWidth / 5 * 4;
        santiBIG.touchEnabled = true;
        function onTouchsantibig(event) {
            page3.addChild(pictureMask);
            page3.addChild(santiBIG);
            santi.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchsantibig, this);
            santiBIG.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchsantismall, this);
        }
        function onTouchsantismall(event) {
            page3.removeChild(pictureMask);
            page3.removeChild(santiBIG);
            santiBIG.removeEventListener(egret.TouchEvent.TOUCH_TAP, onTouchsantismall, this);
            santi.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchsantibig, this);
        }

        var page3text2 = new egret.TextField();
        page3text2.textColor = 0xffffff;
        page3text2.width = stageW - 172;
        page3text2.textAlign = "center";
        page3text2.text = "点击看大图";
        page3text2.size = 40;
        page3text2.anchorOffsetX = page3text2.width / 2;
        page3text2.anchorOffsetY = page3text2.height / 2;
        page3text2.x = page3text1.x+10;
        page3text2.y = santi.y - 190;
        page3.addChild(page3text2);
        
        //第四页开始
        var page4 = new egret.DisplayObjectContainer();
        this.addChild(page4);
        page4.x = stageW * 3;
        page4.width = stageW;
        page4.height = stageH;
        var sky4 = this.createBitmapByName("02_jpg");
        page4.addChild(sky4);
        sky4.width = stageW;
        sky4.height = stageH;
        var topMask4 = new egret.Shape();
        topMask4.graphics.beginFill(0x000000, 0.5);
        topMask4.graphics.drawRect(0, 0, stageW, stageH - 200);
        topMask4.graphics.endFill();
        topMask4.y = 95;
        page4.addChild(topMask4);
        var page4text1 = new egret.TextField();
        page4text1.textColor = 0xffffff;
        page4text1.width = stageW - 172;
        page4text1.textAlign = "center";
        page4text1.text = "最喜爱的音乐";
        page4text1.size = 60;
        page4text1.anchorOffsetX = page4text1.width / 2;
        page4text1.anchorOffsetY = page4text1.height / 2;
        page4text1.x = stageW / 2;
        page4text1.y = topMask4.y + 60;
        page4.addChild(page4text1);
        var haishang = this.createBitmapByName("haishang1_png");
        page4.addChild(haishang);
        haishang.scaleX = 0.5;
        haishang.scaleY = 0.5;
        haishang.anchorOffsetX = haishang.width / 2;
        haishang.anchorOffsetY = haishang.height / 2;
        haishang.x = this.stage.stageWidth / 4+175;
        haishang.y = this.stage.stageHeight / 4 + 300;
        var page4text2 = new egret.TextField();
        page4text2.textColor = 0xffffff;
        page4text2.width = stageW - 172;
        page4text2.textAlign = "center";
        page4text2.text = "The Legend of 1900";
        page4text2.size = 30;
        page4text2.anchorOffsetX = page4text2.width / 2;
        page4text2.anchorOffsetY = page4text2.height / 2;
        page4text2.x = haishang.x;
        page4text2.y = haishang.y + 300;
        page4.addChild(page4text2);
        var page4text3 = new egret.TextField();
        page4text3.textColor = 0xffffff;
        page4text3.width = stageW - 110;
        page4text3.text = "Playing Love";
        page4text3.size = 30;
        page4text3.x = page4text2.x - 80;
        page4text3.y = page4text2.y + 50;
        page4.addChild(page4text3);
        var page4text4 = new egret.TextField();
        page4text4.textColor = 0xffffff;
        page4text4.width = stageW - 110;
        page4text4.text = "PS：歌曲开头节奏比较慢，请稍候";
        page4text4.size = 30;
        page4text4.x = page4text3.x - 150;
        page4text4.y = page4text3.y + 50;
        page4.addChild(page4text4);
        //音频播放
        var channel = this.soundChannel;
        var playsign = false;
        var haisign = false;
        var haianimesign = false;
        function animestop() {
            haianimesign = false;
            haishang.touchEnabled = true;
            haishang.rotation = 0;
            egret.Tween.removeTweens(haishang);
        }
        var hailoader = new egret.URLLoader();
        hailoader.dataFormat = egret.URLLoaderDataFormat.SOUND;
        hailoader.load(new egret.URLRequest("resource/haishang.mp3"));
        hailoader.addEventListener(egret.Event.COMPLETE, function hailoadOver(event) {
            haisign = true;
        }, this);
        haishang.touchEnabled = true;
        haishang.addEventListener(egret.TouchEvent.TOUCH_TAP, onTouchhaishang, this);
        //结束建造停止播放按钮
        //播放按钮开始
        function onTouchhaishang(event) {
            animestop();
            haishang.touchEnabled = false;
            if (playsign == true) {
                channel.stop();
            }
            var sound = hailoader.data;
            if (haisign == true) {
                channel = sound.play(0, -1);
                playsign = true;
                haianimesign = true;
                var haiplayanime = function () {
                    if (haianimesign == true) {
                        var haiplaytw = egret.Tween.get(haishang);
                        haiplaytw.to({ "rotation": 180 }, 800);
                        haiplaytw.to({ "rotation": 360 }, 800);
                        haiplaytw.to({ "rotation": 540 }, 800);
                        haiplaytw.to({ "rotation": 720 }, 800);
                        haiplaytw.call(haiplayanime, self);
                    }
                };
                haiplayanime();
            }
            else {
                var haitw = egret.Tween.get(haishang);
                haitw.to({ "rotation": 10 }, 100);
                haitw.to({ "rotation": -10 }, 100);
                haitw.to({ "rotation": 0 }, 100);
                haishang.touchEnabled = true;
            }
        }
        //音频播放结束
        //第四页结束        
        //第五页开始
        var page5 = new egret.DisplayObjectContainer();
        this.addChild(page5);
        page5.x = stageW * 4;
        page5.width = stageW;
        page5.height = stageH;
        var sky5 = this.createBitmapByName("02_jpg");
        page5.addChild(sky5);
        sky5.width = stageW;
        sky5.height = stageH;
        var topMask5 = new egret.Shape();
        topMask5.graphics.beginFill(0x000000, 0.5);
        topMask5.graphics.drawRect(0, 0, stageW, stageH - 200);
        topMask5.graphics.endFill();
        topMask5.y = 95;
        page5.addChild(topMask5);
        var page5text1 = new egret.TextField();
        page5text1.textColor = 0xffffff;
        page5text1.width = stageW - 172;
        page5text1.textAlign = "center";
        page5text1.text = "最喜爱的动漫";
        page5text1.size = 60;
        page5text1.anchorOffsetX = page5text1.width / 2;
        page5text1.anchorOffsetY = page5text1.height / 2;
        page5text1.x = stageW / 2;
        page5text1.y = topMask5.y + 60;
        page5.addChild(page5text1);
        var changeqinshi = function () {
            var qinshitw = egret.Tween.get(qinshi);
            qinshitw.to({ "alpha": 1 }, 500);
            qinshitw.wait(2000);
            qinshitw.to({ "alpha": 0 }, 500);
            qinshitw.call(changebanben, self);
        };
        var changebanben = function () {
            var banbentw = egret.Tween.get(banben);
            banbentw.to({ "alpha": 1 }, 500);
            banbentw.wait(2000);
            banbentw.to({ "alpha": 0 }, 500);
            banbentw.call(changeduannao, self);
        };
        var changeduannao = function () {
            var duannaotw = egret.Tween.get(duannao);
            duannaotw.to({ "alpha": 1 }, 500);
            duannaotw.wait(2000);
            duannaotw.to({ "alpha": 0 }, 500);
            duannaotw.call(changeqinshi, self);
        };
        var qinshi = this.createBitmapByName("qinshi_jpg");
        page5.addChild(qinshi);
        qinshi.scaleX = 1;
        qinshi.scaleY = 1;
        qinshi.anchorOffsetX = qinshi.width / 2;
        qinshi.anchorOffsetY = qinshi.height / 2;
        qinshi.x = this.stage.stageWidth / 2;
        qinshi.y = this.stage.stageHeight / 2;
        qinshi.alpha = 1;
        var banben = this.createBitmapByName("banben_jpg");
        page5.addChild(banben);
        banben.scaleX = qinshi.width / banben.width;
        banben.scaleY = qinshi.width / banben.width;
        banben.anchorOffsetX = banben.width / 2;
        banben.anchorOffsetY = banben.height / 2;
        banben.x = this.stage.stageWidth / 2;
        banben.y = this.stage.stageHeight / 2;
        banben.alpha = 0;
        var duannao = this.createBitmapByName("duannao_jpg");
        page5.addChild(duannao);
        duannao.scaleX = qinshi.width / duannao.width;
        duannao.scaleY = qinshi.width / duannao.width;
        duannao.anchorOffsetX = duannao.width / 2;
        duannao.anchorOffsetY = duannao.height / 2;
        duannao.x = this.stage.stageWidth / 2;
        duannao.y = this.stage.stageHeight / 2;
        duannao.alpha = 0;
        changeqinshi(); //封面循环
        //第五页结束
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map