/* Formstack Core JS */

/* We use this library to open a Formstack Core form in Sandbox Management */

function FSLightbox(config) {
    if(!config){return false;}
    this.config = config;

    this.ie = document.all;
    this.ns6 = document.getElementById && !document.all;

    this.closeHandle = document.getElementById('fsLightboxClose' + config.form);

    var scope = this;
    var p = document.getElementsByTagName('div')[0];

    if (config.handle === null || !document.getElementById(config.handle)) {
        this.handle = document.createElement('div');
        this.handle.style.background = '#000';
        this.handle.style.border = '#FFF solid 2px';
        this.handle.style.zIndex = '1';
        this.handle.className = 'fsLightboxHandle';

        if (config.handlePosition == 'right') {
            this.handle.style.right = '0px';
            this.handle.style.top = '200px';
            this.handleAngle = '-90';
            this.handle.style.borderRight = '0px';
            this.handle.style.position = 'absolute';
            this.handle.onmouseover = function() {
                scope.handle.style.paddingRight = '10px';
            };

            this.handle.onmouseout = function() {
                scope.handle.style.paddingRight = '0px';
            };
        } else if (config.handlePosition == 'bottomLeft') {
            this.handle.style.left = '100px';
            this.handle.style.bottom = '0px';
            this.handleAngle = '0';
            this.handle.style.borderBottom = '0px';
            this.handle.style.position = 'fixed';

            this.handle.onmouseover = function() {
                scope.handle.style.paddingBottom = '10px';
            };

            this.handle.onmouseout = function() {
                scope.handle.style.paddingBottom = '0px';
            };
        } else if (config.handlePosition == 'bottomRight') {
            this.handle.style.right = '100px';
            this.handle.style.bottom = '0px';
            this.handleAngle = '0';
            this.handle.style.borderBottom = '0px';
            this.handle.style.position = 'fixed';

            this.handle.onmouseover = function() {
                scope.handle.style.paddingBottom = '10px';
            };

            this.handle.onmouseout = function() {
                scope.handle.style.paddingBottom = '0px';
            };
        } else if (config.handlePosition == 'topLeft') {
            this.handle.style.left = '100px';
            this.handle.style.top = '0px';
            this.handleAngle = '0';
            this.handle.style.borderTop = '0px';
            this.handle.style.position = 'absolute';

            this.handle.onmouseover = function() {
                scope.handle.style.paddingTop = '10px';
            };

            this.handle.onmouseout = function() {
                scope.handle.style.paddingTop = '0px';
            };
        } else if (config.handlePosition == 'topRight') {
            this.handle.style.right = '100px';
            this.handle.style.top = '0px';
            this.handleAngle = '0';
            this.handle.style.borderTop = '0px';
            this.handle.style.position = 'absolute';

            this.handle.onmouseover = function() {
                scope.handle.style.paddingTop = '10px';
            };

            this.handle.onmouseout = function() {
                scope.handle.style.paddingTop = '0px';
            };
        } else {
            this.handle.style.left = '0px';
            this.handle.style.top = '200px';
            this.handleAngle = '-90';
            this.handle.style.borderLeft = '0px';
            this.handle.style.position = 'absolute';

            this.handle.onmouseover = function() {
                scope.handle.style.paddingLeft = '10px';
            };

            this.handle.onmouseout = function() {
                scope.handle.style.paddingLeft = '0px';
            };
        }

        if(!!config.handleImage){
            this.handleImage = config.handleImage + '&angle=' + this.handleAngle;
            this.handleLink =
                '<img src="' +
                this.handleImage +
                '" border="0" alt="' +
                this.config.handleText +
                '" />';
            this.handle.innerHTML =
                '<a href="#" style="color:#FFF; text-decoration:none;">' + this.handleLink + '</a>';
        }
        this.handle.onclick = function() {
            scope.show(scope.config.form);
            return false;
        };

        p.parentNode.insertBefore(this.handle, p);
    } else {
        this.handle = document.getElementById(config.handle);

        this.handle.onclick = function() {
            scope.show(scope.config.form);
            return false;
        };
    }

    this.closeHandle.onclick = function() {
        scope.hide(scope.config.form);
        return false;
    };

    this.fadeOverlay = document.createElement('div');
    this.fadeOverlay.style.display = 'none';
    this.fadeOverlay.style.zIndex = '9999';
    this.fadeOverlay.style.position = 'absolute';
    this.fadeOverlay.style.background = '#000';
    this.fadeOverlay.style.overflow = 'hidden';
    this.fadeOverlay.innerHTML = '&nbsp';
    this.fadeOverlay.onclick = function() {
        scope.fade('out');
        scope.hide();
    };

    p.parentNode.insertBefore(this.fadeOverlay, p);

    var lightbox = document.getElementById('fsLightbox' + config.form);
    lightbox.style.position = 'absolute';
    lightbox.style.background = '#EEE';
    lightbox.style.border = 'solid 0.5px #c8d6d9';
    lightbox.style.zIndex = '10000';
    //lightbox.style.width = '650px';
    //lightbox.style.height = '500px';
    // lightbox.style.padding = '5px';
    lightbox.style.scroll = 'auto';
    lightbox.style.display = 'none';
    lightbox.style.borderRadius = '4px';
    lightbox.style.boxShadow = '0px 1px 5.5px 1.5px rgba(167, 167, 167, 0.44)';
    lightbox.style.backgroundColor = '#ffffff';
    this.show = function() {
        this.fade('in');

        var lightbox = document.getElementById('fsLightbox' + this.config.form);
        var iframe = lightbox.getElementsByTagName('iframe');
        iframe[0].src = iframe[0].src;
        lightbox.style.display = lightbox.style.display != 'block' ? 'block' : 'none';

        var scrollTop = document.documentElement.scrollTop
            ? document.documentElement.scrollTop
            : document.body.scrollTop;
        var x = document.body.clientWidth / 2 - lightbox.offsetWidth / 2;
        var y = this.iecompattest().clientHeight / 2 + scrollTop - lightbox.offsetHeight / 2;

        lightbox.style.left = Math.round(x) + 'px';
        lightbox.style.top = Math.round(y > scrollTop ? y : scrollTop) + 'px';
    };

    this.reload = function() {

        var lightbox = document.getElementById('fsLightbox' + this.config.form);
        var iframe = lightbox.getElementsByTagName('iframe');
        iframe[0].src = iframe[0].src;

    };

    this.hide = function() {
        this.fade('out');
        document.getElementById('fsLightbox' + this.config.form).style.display = 'none';
    };

    this.fade = function(direction) {
        var windowWidth =
            this.ie && !window.opera
                ? this.iecompattest().scrollLeft + this.iecompattest().clientWidth
                : window.pageXOffset + window.innerWidth;
        //var windowHeight= this.ie && !window.opera? this.iecompattest().scrollTop + this.iecompattest().clientHeight : window.pageYOffset + window.innerHeight;
        D = window.document;
        height = Math.max(
            Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
            Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
            Math.max(D.body.clientHeight, D.documentElement.clientHeight)
        );

        this.fadeOverlay.style.left = '0px';
        this.fadeOverlay.style.top = '0px';
        this.fadeOverlay.style.width = windowWidth + 'px';
        this.fadeOverlay.style.height = height + 'px';

        if (direction == 'in' && this.getOpacity() > 0.6) {
            return;
        }
        if (direction == 'out' && this.getOpacity() < 0.1) {
            return;
        }
        var opacity = direction == 'in' ? 0.0 : 0.7;

        this.fadeOverlay.style.display = 'block';

        this._fader(direction, opacity);
    };

    this._fader = function(direction, opacity) {
        if (direction == 'in') {
            opacity += 0.05;
        } else {
            opacity -= 0.05;
        }

        if (this.fadeOverlay.style.filter !== null) {
            this.fadeOverlay.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
            this.fadeOverlay.style.opacity = opacity;
        } else if (this.fadeOverlay.filters && this.fadeOverlay.filters[0]) {
            if (typeof this.fadeOverlay.filters[0].opacity == 'number') {
                //IE 6.0
                this.fadeOverlay.filters[0].opacity = opacity * 100;
            } else {
                //IE 5.5
                this.fadeOverlay.style.filter = 'alpha(opacity=' + opacity * 100 + ')';
            }
        } else if (typeof this.fadeOverlay.style.MozOpacity != 'undefined' && opacity !== '') {
            this.fadeOverlay.style.MozOpacity = opacity;
        } else {
            this.fadeOverlay.style.opacity = opacity;
        }

        if (direction == 'in' && opacity >= 0.7) {
            return;
        } else if (direction == 'out' && opacity <= 0) {
            this.fadeOverlay.style.display = 'none';
            return;
        }

        var scope = this;
        setTimeout(function() {
            scope._fader(direction, opacity);
        }, 10);
    };

    this.getOpacity = function() {
        var opacity = -1;

        opacity = this.fadeOverlay.style.opacity;

        if (opacity < 0) {
            if (this.fadeOverlay.style.filter !== null) {
                var tmp = this.fadeOverlay.style.filter.replace('alpha(opacity=', '');
                opacity = parseInt(tmp.replace(')', ''));
            } else {
                opacity = 0;
            }
        }
        return opacity;
    };

    this.iecompattest = function() {
        return document.compatMode && document.compatMode != 'BackCompat'
            ? document.documentElement
            : document.body;
    };

    this.getposOffset = function(overlay, offsettype) {
        var totaloffset = offsettype == 'left' ? overlay.offsetLeft : overlay.offsetTop;
        var parentEl = overlay.offsetParent;
        while (parentEl !== null) {
            totaloffset =
                offsettype == 'left'
                    ? totaloffset + parentEl.offsetLeft
                    : totaloffset + parentEl.offsetTop;
            parentEl = parentEl.offsetParent;
        }
        return totaloffset;
    };
    
}

    //var container = {id:'',title:'',src:''};
    function initIframe (pIframe) {
        var iframeContainer = window.document.createElement('div');
        iframeContainer.classList.add('fsLightbox');
        iframeContainer.classList.add('displaynone');
        iframeContainer.id = 'fsLightbox' +pIframe.id
        var iframeHeader = window.document.createElement('div');
        iframeHeader.classList.add('header');

        var closeTest = window.document.createElement('span');
        closeTest.classList.add('header-text');
        closeTest.textContent = pIframe.title;

        var closeSpan = window.document.createElement('a');
        closeSpan.classList.add('close');
        closeSpan.title = 'Close';
        closeSpan.href = '#';
        closeSpan.id = 'fsLightboxClose' + pIframe.id;
        closeSpan.text = 'Close';
        
        iframeHeader.append(closeSpan);
        iframeHeader.append(closeTest);

        var iframeInnerContainer = window.document.createElement('div');
        iframeInnerContainer.id = 'fsLightboxContent' + pIframe.id;
        iframeInnerContainer.style = 'width:676px; height:641px; padding-top:0px; overflow:auto;';

        var iframe = window.document.createElement('iframe');
        iframe.src = pIframe.src;
        iframe.title = pIframe.title;
        iframe.width = '676';
        iframe.height = '100%';

        iframeInnerContainer.append(iframe);


        iframeContainer.append(iframeHeader);
        iframeContainer.append(iframeInnerContainer);

        return iframeContainer;
    };
