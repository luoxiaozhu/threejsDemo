var initWebGL = function () {
    "use strict";

    this.scene;
    this.camera;
    this.renderer;
    this.controls;

    this.GId = '';
    this.tipconts;
    this.container;
    this.parentCont;
    this.Tweens = [];
    this.Result = false;

    this.init = function (cts, config) {
        var conts = parseCts(cts);
        if (detector() && conts != null) {
            try {
                var config = config || {};
                df_Config = $.extend(true, {}, defaultConfig, config);

                thm.parentCont = conts;
                thm.GId += THREE.Math.generateUUID();
                var TId = conts.attr('id') + '_' + thm.GId;
                thm.container = creatContainer(TId);
                thm.parentCont.html(thm.container);

                try {
                    InitFbx();
                } catch (err) {
                    console.log("缺少加载FBX文件");
                }
                try {
                    InitControls();
                } catch (err) {
                    console.log("缺少Controls文件");
                }


                if (df_Config.loading)
                    loading(thm.container);
                creatTips(thm.container);
                loadTexture()
                initiate();
                init3DMesh();
                is_Init = true;
            } catch (e) {
                thm.Result = 'error! Initialization Error!';
                console.log(e);
                creatError(conts);
                return;
            }
        } else
            thm.Result = 'error! Not Support WebGL!';
    };

    this.render = function (func) {
        if (is_Init) {
            if (!testing())
                return;
            removeLoading(thm.container);
            if (is_Stats)
                df_Stats.begin();
            renderers(func);
            initTween();
        }
    };

    this.rotaScene = function (angle, times) {
        if (is_Init) {
            angle = isNaN(angle * 1) ? 0 : Math.max(0, angle);
            times = isNaN(times * 1) ? 1 : Math.max(100, times);
            rotateScene(angle, times);
        }
    };

    this.disposeRender = function () {
        if (is_Init && testing()) {
            removeEvent();
            thm.controls.dispose();
            thm.container.remove();
            thm.renderer.forceContextLoss();
            thm.renderer.domElement = null;
            thm.renderer.context = null;
            thm.renderer = null;
            is_Init = false;
        }
    };

    var thm = this;
    var df_Stats,
        is_Stats = false; //stats
    var df_Raycaster,
        df_Mouse,
        df_Intersects,
        df_MouseEvent = false; //tips
    var df_Clock,
        df_Width = 0,
        df_Height = 0,
        is_Init = false,
        txues = {},
        df_Config = {}; //essential

    var defaultConfig = {
        stats: false,
        loading: false,
        background: {
            color: '#1E1F22',
            opacity: 1
        },
        camera: {
            fov: 45,
            near: 32,
            far: 10000,
            position: [0, 256, 512]
        },
        controls: {
            enablePan: true,
            enableZoom: true,
            enableRotate: true,
            enableDamping: true, //是否阻尼
            dampingFactor: 0.1, //阻尼系数
            keyPanSpeed: 5.0,
            panSpeed: 0.1, //平移系数
            zoomSpeed: 0.1, //缩放系数
            rotateSpeed: 0.013, //旋转系数
            distance: [64, 2048], //缩放距离区间
            polarAngle: [0, Math.PI * .43], //上下旋转区间
            azimuthAngle: [-Infinity, Infinity], //左右旋转区间
        },
        light: {
            Ambient: {
                color: '#FFFFFF',
                strength: 1.0
            },
            isHemisphere: false,
            hemisphere: {
                color: '#EFEFEF',
                groundColor: '#EFEFEF',
                strength: 0.7,
                position: [0, 0, 2000]
            },
        },
        backMap: {
            texture: null,
            opacity: 1,
            lw: [0, 0],
            position: [0, 0, 0],
            side: true
        },
        texture: {}
    };

    function initiate() {

        thm.scene = new THREE.Scene();
        df_Clock = new THREE.Clock();

        var wh = getWH();
        df_Width = wh.w;
        df_Height = wh.h;
        var cm = df_Config.camera,
            bg = df_Config.background;

        thm.camera = new THREE.PerspectiveCamera(cm.fov, wh.w / wh.h, cm.near, cm.far);
        thm.camera.position.set(cm.position[0], cm.position[1], cm.position[2]);
        //
        //thm.camera.lookAt({ x: 0, y: 0, z: 100 });

        thm.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        thm.renderer.setSize(df_Width, df_Height);
        thm.renderer.setClearColor(bg.color, bg.opacity);

        // controls
        thm.controls = new THREE.OrbitControls(thm.camera, thm.container[0]);
        // setControls(thm.controls, df_Config.controls);

        setLight(thm.scene, df_Config.light);

        // state
        is_Stats = (df_Config.stats === true) ? true : false;
        if (is_Stats) {
            df_Stats = new Stats();
            thm.container.append($(df_Stats.dom));
        }

        thm.container.append($(thm.renderer.domElement));

        window.addEventListener('resize', onWindowResize, false);

        // mouse event
        df_Raycaster = new THREE.Raycaster();
        df_Mouse = new THREE.Vector2();
        thm.renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        thm.renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    }

    function init3DMesh(opts) {
        thm.txueLoader = new THREE.TextureLoader();
        thm.createMesh()
    }

    thm.createMesh = () => {
        const geometry = new THREE.SphereGeometry(128, 64, 64);
        thm.material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            // map: thm.txueLoader.load("/assets//cube_wood_parquet_20_77/cube_wood_parquet_20_77_ao.jpg")
        });
        thm.sphere = new THREE.Mesh(geometry, thm.material);
        thm.scene.add(thm.sphere);
    }

    thm.setMap = (name, map) => {
        if (!map) return false;
        const tmap = thm.txueLoader.load(map, (tex) => {

            tex.anisotropy = 10;
            tex.minFilter = tex.magFilter = THREE.LinearFilter;


        })
        thm.sphere.material[name] = tmap;
       
        thm.sphere.material.needsUpdate = true;

        console.log(name, tmap)
    }
    thm.clearMap = (names) => {
        names.forEach(name => {
            if (thm.sphere.material[name]) {
                thm.sphere.material[name].dispose();
            }
            thm.sphere.material[name] = null;
        });
        thm.sphere.material.needsUpdate = true;
    }

    function animation(dt) {}
    //-
    function loadTexture() {
        var txueLoader = new THREE.TextureLoader();
        var _n = df_Config.texture;
        for (var k in _n) {
            txues['_' + k] = txueLoader.load(_n[k], function (tex) {
                tex.anisotropy = 10;
                tex.minFilter = tex.magFilter = THREE.LinearFilter;
            });
        }
    }

    // mouse event
    function onDocumentMouseMove(event) {
        event.preventDefault();

        if (!df_MouseEvent) {
            df_Mouse.x = (event.layerX / df_Width) * 2 - 1;
            df_Mouse.y = -(event.layerY / df_Height) * 2 + 1;
            df_Raycaster.setFromCamera(df_Mouse, thm.camera);

            //df_Intersects = df_Raycaster.intersectObject( gusMesh );
            /*
            if ( df_Intersects.length > 0 ) {
            thm.container[0].style.cursor = 'pointer';

            } else {
            removeTips();
            thm.container[0].style.cursor = 'auto';
            }
             */
        }
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        df_Mouse.x = (event.layerX / df_Width) * 2 - 1;
        df_Mouse.y = -(event.layerY / df_Height) * 2 + 1;
        df_Raycaster.setFromCamera(df_Mouse, thm.camera);
        var intersects = df_Raycaster.intersectObjects([]);
        if (intersects.length != 0 && event.buttons == 1) {

        } else {}

    }

    function onWindowResize(event) {
        var wh = getWH();
        df_Width = wh.w;
        df_Height = wh.h;
        thm.camera.aspect = wh.w / wh.h;
        thm.renderer.setSize(wh.w, wh.h);
        thm.controls.reset();
    }

    function renderers(func) {
        var fnc = toFunction(func);
        var Animations = function () {
            if (is_Init) {
                fnc.bind(thm)();

                var delta = df_Clock.getDelta();
                if (delta > 0)
                    animation(delta);

                thm.controls.update();
                if (is_Stats) df_Stats.update();
                //thm.camera.lookAt({ x: 0, y: 0, z: 100 });

                requestAnimationFrame(Animations);
                thm.renderer.render(thm.scene, thm.camera);
            }
        };
        Animations();
    }

    function testing() {
        return thm.renderer instanceof THREE.WebGLRenderer;
    }

    function rotateScene(angle, times) {
        var ay = thm.scene.rotation.y + angle;
        new TWEEN.Tween(thm.scene.rotation).to({
            y: ay
        }, times).start();
    }

    function initTween() {
        for (var k = thm.Tweens.length - 1; k >= 0; k--) {
            thm.Tweens[k].start(TWEEN.now());
        }
    }

    function getWH() {
        return {
            w: thm.container.width(),
            h: thm.container.height()
        };
    }

    function setControls(controls, opts) {
        controls.enablePan = opts.enablePan;
        controls.enableKeys = opts.enablePan;
        controls.enableZoom = opts.enableZoom;
        controls.enableRotate = opts.enableRotate;

        controls.enableDamping = opts.enableDamping;
        controls.dampingFactor = opts.dampingFactor;
        controls.keyPanSpeed = opts.keyPanSpeed;

        controls.panSpeed = opts.panSpeed;
        controls.zoomSpeed = opts.zoomSpeed;
        controls.rotateSpeed = opts.rotateSpeed;

        controls.minDistance = opts.distance[0];
        controls.maxDistance = opts.distance[1];
        controls.minPolarAngle = opts.polarAngle[0];
        controls.maxPolarAngle = opts.polarAngle[1];
        controls.minAzimuthAngle = opts.azimuthAngle[0];
        controls.maxAzimuthAngle = opts.azimuthAngle[1];
        // controls.mouseDownPrevent = opts.mouseDownPrevent;
    }

    function setLight(scene, opts) {
        scene.add(new THREE.AmbientLight(opts.Ambient.color, opts.Ambient.strength));
        if (opts.isHemisphere) {
            var lh = opts.hemisphere,
                hLight = new THREE.HemisphereLight(lh.color, lh.groundColor, lh.strength);
            hLight.position.set(lh.position[0], lh.position[2], lh.position[1]);
            scene.add(hLight);
        }

        const light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(100, 100, 100);
        scene.add(light);
    }

    function detector() {
        try {
            return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
        } catch (e) {
            return false;
        }
    }

    function isFunction(a) {
        return Object.prototype.toString.call(a) === '[object Function]';
    }

    function toFunction(a) {
        var b = Object.prototype.toString.call(a) === '[object Function]';
        return b ? a : function (o) {};
    }

    function parseCts(cts) {
        var $dom = (typeof cts == 'object') ? $(cts) : $('#' + cts);
        if ($dom.length <= 0)
            return null;
        return $dom;
    }

    function removeEvent() {
        window.removeEventListener('resize', onWindowResize, false);
        thm.renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        thm.renderer.domElement.removeEventListener('mousedown', onDocumentMouseDown, false);
    }

    //tips
    function creatTips(container) {
        var tmp = {
            tipCont: '<div id="GM_tips"></div>',
            icon: '<i></i>',
            txt: '<span id="DM_txt"></span>',
            bage: '<div></div>'
        };
        var tipcont = $(tmp.tipCont).css({
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'display': 'none',
            'z-index': '30000'
        });
        tipcont.append($(tmp.bage).css({
            'position': 'absolute',
            'background': '#000',
            'opacity': '0.3',
            'border-radius': '5px',
            'height': '100%',
            'width': '100%'
        }));
        tipcont.append($(tmp.bage).css({
                'position': 'relative',
                'padding': '4px 6px',
                'color': '#fff',
                'font-size': '12px',
                'margin-left': '10px'
            })
            .append($(tmp.icon).css({
                'border': '3px solid #fff',
                'position': 'absolute',
                'left': '-2px',
                'margin-top': '6px',
                'border-radius': '3px'
            }))
            .append($(tmp.txt).css({
                'position': 'relative',
                'padding': '4px 6px',
                'color': '#fff;',
                'font-size': '12px'
            }).html('')));
        thm.tipconts = tipcont;
        $(container).append(tipcont);
    }

    function removeTips() {
        thm.tipconts.css('display', 'none');
        thm.tipconts.find('span#DM_txt').html('');
    }

    function setTips(conts, position) {
        var vec2 = transCoord(position),
            tmx = Math.max(10, Math.min(df_Width - 40, vec2.x + 6)),
            tmy = Math.max(10, Math.min(df_Height - 34, vec2.y - 12));
        thm.tipconts.css({
            'left': tmx,
            'top': tmy,
            'display': 'block'
        });
        thm.tipconts.find('span#DM_txt').html(conts);
    }

    function transCoord(position) {
        var halfW = df_Width / 2,
            halfH = df_Height / 2,
            vec3 = position.clone().applyMatrix4(thm.scene.matrix).project(thm.camera),
            mx = Math.round(vec3.x * halfW + halfW),
            my = Math.round(-vec3.y * halfH + halfH);
        return new THREE.Vector2(mx, my);
    }

    // loading
    function loading(container) {
        var loading = $('<div id="t_loading"></div>');
        loading.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'right': 0,
            'bottom': 0,
            'z-index': 20000
        });
        var loadImg = 'data:image/gif;base64,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';
        loading.css('background', '#000000 url(' + loadImg + ') center center no-repeat');
        $(container).append(loading);
    }

    function removeLoading(container) {
        $(container).children('div#t_loading').css({
            'background': 'none',
            'display': 'none'
        });
    }

    function creatContainer(id) {
        var containers = $('<div></div>');
        containers.css("cssText", "height:100%;width:100%;position:relative !important");
        containers.attr('id', id);
        return containers;
    }

    function creatError(conts, errorText) {
        var error = $('<div class="data-error"></div>'),
            error_text = errorText || '数据错误。。。';
        if (undefined != conts) {
            var ctxt = "color:#fff;position:absolute;top:49%;width:100%;text-align:center;";
            error.css("cssText", ctxt);
            conts.html(error.html(error_text));
        }
    }

};