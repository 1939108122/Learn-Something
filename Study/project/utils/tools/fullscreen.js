// 指定元素开启全屏
export function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
}

// 退出全屏
export function exitFullscreen() {
    if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else {
        console.log(11111);
    }
}

// 判断是否为全屏
export function isFullScreen() {
    return !!(
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
    );
}

// 判断是否支持部分全屏
export function canIUseFullScreen(element) {
    return !! (
        element.requestFullscreen ||
        element.mozRequestFullScreen ||
        element.webkitRequestFullScreen ||
        element.msRequestFullscreen
    );
}

const fullScreenChangeList   = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'];

export function addFullScreenChangeListener(launchCallback, exitCallback) {
    fullScreenChangeList.forEach(item => {
        window.addEventListener(item, () => {
            if (isFullScreen()) {
                launchCallback && launchCallback();
            } else {
                exitCallback && exitCallback();
            }
        });
    });
}

export function isFullscreenForNoScroll(){
    var explorer = window.navigator.userAgent.toLowerCase();
    if(explorer.indexOf('chrome')>0){//webkit
        if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
            console.log("全屏");
            return true;
        } else {
            console.log("不全屏");
            return false;
        }
    }else{//IE 9+  fireFox
        if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
            console.log("全屏");
            return true;
        } else {
            console.log("不全屏");
            return false;
        }
    }
}