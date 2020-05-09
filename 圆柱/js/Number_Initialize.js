var Number_Initialize = function() {
	"use strict";
	//- 
	this.scene;
	this.camera;
	this.renderer;
	this.controls;

	this.GId = '';
	this.container;
	this.parentCont;
	this.Result = false;
	//-init
	this.init = function(cts, config) {
		var conts = parseCts(cts);
		if (detector() && conts != null) {
			try {
				var config = config || {};
				df_Config = $.extend(true, {}, default_Config, config);

				thm.parentCont = conts;
				thm.GId += THREE.Math.generateUUID();
				var TId = conts.attr('id') + '_' + thm.GId;
				thm.container = creatContainer(TId);
				thm.parentCont.html(thm.container);
				__setControls();
				initiate();
				init3DMesh();
				is_Init = true;
			} catch (e) {
				thm.Result = 'error! Initialization Error!';
				creatError(conts, e);
				return;
			}
		} else thm.Result = 'error! Not Support WebGL!';
	};

	this.render = function(func) {
		if (is_Init) {
			renderers(func);
		}
	};

	this.disposeRender = function() {
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

	this.setDatas = function(datas, opts) {
		if (thm.pillars) {
			_Collects.disposeObj(thm.pillars);
			thm.pillars = null;
		}
		opts = opts || {};
		thm.pillars = new THREE.Object3D();
		thm.scene.add(thm.pillars);
		var length = 10;
		var positions = getBoxPositions(opts.type, length);
		for (var i = 0; i < length; i++) {
			var pillar = createPillarGroup({
				name: i + "",
				value: Math.floor(Math.random() * (i + 1) * 10)
			});
			//if(opts.type=="circle")pillar.lookAt(new THREE.Vector3(0,0,0));
			pillar.position.copy(positions[i]);
			thm.pillars.add(pillar);
		}
	};

	var thm = this,
		df_Clock, df_Width = 0,
		df_Height = 0,
		df_Raycaster, df_Mouse,
		is_Init = false,
		df_Config = {};
	var default_Config = {
		controls: {
			enableZoom: true,
			enableRotate: true,
			autoRotate: true,
			autoRotateSpeed: 0.0,

			enableDamping: true,
			dampingFactor: 0.05,
			panSpeed: .1,
			zoomSpeed: .1,
			rotateSpeed: .05,
			distance: [0, 1000],
			polarAngle: [-Infinity, Infinity],
			azimuthAngle: [-Infinity, Infinity]
		},
		background: {
			color: '#ffffff',
			opacity: 0.0
		},
		camera: {
			fov: 45,
			near: 8,
			far: 20000,
			position: [0, 200, 0],
			zoom: 1.0
		},
		earth: {
			color: "#ffffff"
		},
		scene: {
			position: [0, 0, 0],
			rotateSpeed: 0.01
		},
		light: {
			Ambient: {
				color: '#FFFFFF',
				strength: 1.0
			},
			isHemisphere: false,
			isDirectional: true,
			hemisphere: {
				color: '#EFEFEF',
				groundColor: '#EFEFEF',
				strength: 0.7,
				position: [0, 0, 500]
			},
			directional: {
				color: '#1A1A1A',
				strength: 1.0,
				position: [75, 100, 75]
			},
		}
	};

	//-init
	function initiate() {

		thm.scene = new THREE.Scene();
		thm.scene.position.set(df_Config.scene.position[0], df_Config.scene.position[1], df_Config.scene.position[2]);
		thm.ambientLight = new THREE.AmbientLight(0x000000); // soft white light
		thm.scene.add(thm.ambientLight);

		thm.directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
		thm.directionalLight.position.set(-0.5, 1.6, 0.7);
		thm.directionalLight.position.multiplyScalar(100);
		thm.scene.add(thm.directionalLight);

		df_Clock = new THREE.Clock();
		//thm.scene.fog = new THREE.FogExp2(0x000000, 0.00025);
		var wh = getWH();
		df_Width = wh.w;
		df_Height = wh.h;
		var cm = df_Config.camera,
			bg = df_Config.background;

		thm.camera = new THREE.PerspectiveCamera(45, wh.w / wh.h, cm.near, cm.far);
		//thm.camera = new THREE.OrthographicCamera(wh.w / -2, wh.w / 2, wh.h / 2, wh.h / -2, 1, 1000);
		thm.camera.position.set(cm.position[0], cm.position[1], cm.position[2]);
		//thm.camera.zoom = cm.zoom;
		//thm.camera.updateProjectionMatrix();
		// renderer
		thm.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		thm.renderer.autoClear = false;
		thm.renderer.setSize(df_Width, df_Height);

		thm.renderer.setPixelRatio(window.devicePixelRatio);
		thm.renderer.setClearColor(bg.color, bg.opacity);

		// controls
		thm.controls = new THREE.OrbitControls(thm.camera, thm.container[0]);
		setControls(thm.controls, df_Config.controls, true);
		thm.container.append(thm.renderer.domElement);
		window.addEventListener('resize', onContResize, false);

		// var size = 1000;
		// var divisions = 100;

		// var gridHelper = new THREE.GridHelper(size, divisions, new THREE.Color(1, 0, 0));
		// thm.scene.add(gridHelper);

		// mouse event
		df_Mouse = new THREE.Vector2();
		df_Raycaster = new THREE.Raycaster();
		thm.container[0].addEventListener('click', onClick, true);

		thm.container[0].addEventListener('mouseup', onDocumentMouseUp, false);
		// thm.container[0].addEventListener( 'wheel', onDocumentMouseWheel, false );
		thm.container[0].addEventListener('mousemove', onDocumentMouseMove, false);
		thm.container[0].addEventListener('mousedown', onDocumentMouseDown, false);
	}

	function init3DMesh() {
		thm.plane = createNetPlane();
		thm.scene.add(thm.plane);

		thm.coin = createCoinHeap();
		thm.coin.position.set(0, 10, 100);
		thm.scene.add(thm.coin);

	}

	function createNetPlane() {
		var geometry = new THREE.PlaneBufferGeometry(500, 500, 64, 64);
		geometry.rotateX(-Math.PI / 2);

		var position = geometry.attributes.position;
		position.dynamic = true;

		for (var i = 0; i < position.count; i++) {
			position.setY(i, -Math.random() * 5);
		}
		var material = new THREE.MeshPhongMaterial({
			color: 0x0044ff,
			transparent: true,
			wireframe: true
		});

		var plane = new THREE.Mesh(geometry, material);
		return plane;
	}

	function createCoinHeap() {
		var geometry = new THREE.CylinderBufferGeometry(5, 5, 20, 32, 2, false);
		var texture = new THREE.TextureLoader().load("images/coin.png");
		texture.wrapS = THREE.MirroredRepeatWrapping;
		texture.wrapT = THREE.MirroredRepeatWrapping;
		texture.repeat.set(1, 20);
		var material = _Materials.phong({
			map: texture,
			color: "#F4A305",
			transparent: true
		});
		var coin = new THREE.Mesh(geometry, material);
		coin.position.y += 50;
		return coin;
	}

	function getBoxPositions(type, length) {
		type = type || "line";
		var arr = [];
		for (var i = 0; i < length; i++) {
			var position;
			if (type == "line") {
				position = new THREE.Vector3(12 * Math.pow(-1, i) * Math.floor((i + 1 + 0.1) / 2), 0, 0);

			} else if (type == "circle") {
				var radius = 50;
				position = new THREE.Vector3(radius * Math.cos(-i * Math.PI / length), 0, radius * Math.sin(-i * Math.PI / length));

			} else {
				position = new THREE.Vector3(i * 10, 0, i * 10);
			}
			arr.push(position);
		}

		return arr;
	}

	function createPillarGroup(data, opts) {
		var group = new THREE.Object3D();
		var pillar = createPillar(data, opts);
		var word = createPlaneWord(data);
		word.position.z = 10;
		group.add(pillar);
		group.add(word);
		return group;

	}

	function createPlaneWord(data) {
		var geometry = new THREE.PlaneGeometry(10, 10);
		var texture = _Collects.createCanvas(data.name);
		var material = _Materials.phong({
			map: texture,
			transparent: true,
			depthTest: false
		});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x = -Math.PI / 2;
		return mesh;
	}

	function createPillar(data, opts) {
		var height = data.value < 10 ? 10 : data.value || 20,
			name = data.name || "";
		var ambientColor = _Collects.getColorArr("#494A4C")[0];
		var directionalLightColor = _Collects.getColorArr("#FFFFFF")[0];
		var lightDirection = thm.directionalLight.position.normalize();
		var lightIntensity = thm.directionalLight.intensity;
		var colors = _Collects.getColorArr("#ffffff");
		var geometry = new THREE.CylinderBufferGeometry(5, 5, height, 16, 2, false);

		// var material = _Materials.phong({
		// 	//map:texture,
		// 	transparent: true
		// });

		// var texture = _Collects.createGradiualCanvas();
		// // texture.wrapS = THREE.MirroredRepeatWrapping;
		// // texture.wrapT = THREE.MirroredRepeatWrapping;
		// // texture.repeat.set(4, 1);
		// var material = _Materials.shader({
		// 	uniforms: {
		// 		u_texture: {
		// 			value: texture
		// 		},
		// 		u_texColor: {
		// 			value: colors[0]
		// 		},
		// 		u_time: {
		// 			value: 0.0
		// 		},
		// 		u_opacity: {
		// 			value: colors[1]
		// 		},
		// 		u_AmbientColor: {
		// 			value: ambientColor
		// 		},
		// 		u_DirectionalColor: {
		// 			value: directionalLightColor
		// 		},
		// 		u_LightingDirection: {
		// 			value: lightDirection
		// 		},
		// 		u_lightIntensity: {
		// 			value: lightIntensity
		// 		}
		// 	},
		// 	vertexShader: _Shaders.BaseEarthVShader,
		// 	fragmentShader: _Shaders.BaseEarthFShader,
		// 	transparent: true,
		// 	//lights: true,
		// 	side: THREE.FrontSide
		// });
		// material.needsUpdate = true;
		var material = _Materials.shader({
			uniforms: shader.griadient.uniforms,
			vertexShader: shader.griadient.vertexShader,
			fragmentShader: shader.griadient.fragmentShader,
			//wireframe:true
		});
		material.uniforms.l.value = height;
		material.uniforms.u_AmbientColor.value = ambientColor;
		material.uniforms.u_DirectionalColor.value = directionalLightColor;
		material.uniforms.u_LightingDirection.value = lightDirection;
		material.uniforms.u_lightIntensity.value = lightIntensity;

		var cylinder = new THREE.Mesh(geometry, material);
		cylinder._isCylinder = true;
		cylinder._height = height / 2;
		//cylinder.position.y -= height/2;
		cylinder.scale.y = 0.0;
		//cylinder.lookAt(new THREE.Vector3(0,0,0));
		//var helper = new THREE.VertexNormalsHelper(cylinder, 2, 0x00ff00, 1);
		//cylinder.add(helper);
		//cylinder.rotation.z = Math.PI;
		return cylinder;
	}

	function createEarth() {
		var geometry = new THREE.SphereGeometry(100, 64, 64);
		var texture = new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABHgAAAJjCAIAAAD4UTF2AAAACXBIWXMAABcSAAAXEgFnn9JSAAAJDGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTA5LTEwVDEwOjM3OjM3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wOS0xMFQxMTo0NjoxOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wOS0xMFQxMTo0NjoxOSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmVkY2Q2MGQ4LWUzYzctNWE0NS1hMzNjLTM0MTY3ZDc0NDk1NSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4ZWE1ODc0NS00OTdjLWZjNGItYjM4YS0yZWViYjM1Njk3YmUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkZTc0ZWM0MS1kMjQyLTY3NDEtOWI3OC1lYTlkYjgwYmE4NjciIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjE1MDAwMDAvMTAwMDAiIHRpZmY6WVJlc29sdXRpb249IjE1MDAwMDAvMTAwMDAiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjExNDQiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI2MTEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gaW1hZ2UvcG5nIHRvIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmRlNzRlYzQxLWQyNDItNjc0MS05Yjc4LWVhOWRiODBiYTg2NyIgc3RFdnQ6d2hlbj0iMjAxOS0wOS0xMFQxMTo0NjoxOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252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");
		var material = new THREE.MeshPhongMaterial({
			map: texture,
			color: df_Config.earth.color
		});
		var earth = new THREE.Mesh(geometry, material);
		return earth;
	}

	function detector() {
		try {
			return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
		} catch (e) {
			return false;
		}
	}

	function parseCts(cts) {
		var $dom = (typeof cts == 'object') ? $(cts) : $('#' + cts);
		if ($dom.length <= 0) return null;
		return $dom;
	}
	// Container
	function creatContainer(id) {
		var containers = $('<div></div>');
		containers.css("cssText", "height:100%;width:100%;overflow:hidden;position:relative;");
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

	function getWH() {
		return {
			w: thm.container.width(),
			h: thm.container.height()
		};
	}
	//采用
	function setControls(controls, opts, isInit) {

		controls.enablePan = opts.enablePan;
		controls.enableKeys = opts.enablePan;
		controls.enableZoom = opts.enableZoom;
		controls.enableRotate = opts.enableRotate;

		if (isInit) {
			var _opts = opts;

			controls.enableDamping = _opts.enableDamping;
			controls.dampingFactor = _opts.dampingFactor;

			controls.panSpeed = _opts.panSpeed;
			controls.zoomSpeed = _opts.zoomSpeed;
			controls.rotateSpeed = _opts.rotateSpeed;
			controls.autoRotate = _opts.autoRotate;
			controls.autoRotateSpeed = _opts.autoRotateSpeed;

			controls.minDistance = _opts.distance[0];
			controls.maxDistance = _opts.distance[1];
			controls.minPolarAngle = _opts.polarAngle[0];
			controls.maxPolarAngle = _opts.polarAngle[1];
			controls.minAzimuthAngle = _opts.azimuthAngle[0];
			controls.maxAzimuthAngle = _opts.azimuthAngle[1];
		}
	}
	//- animation  

	function animation(dt) {
		if (dt > .1) return;
		if (thm.earthObject) thm.earthObject.rotation.y += df_Config.scene.rotateSpeed;
		if (thm.pillars) {
			_Collects.objectTraverse(thm.pillars, function(child) {
				if (child._isCylinder) {
					if (child.scale.y < 1) {
						child.scale.y += 0.01;
						child.position.y += child._height / 100;
					} else
						//if (child.material.uniforms.time.value <= 1)
						child.material.uniforms.time.value += 0.01;
					//else child.material.uniforms.time.value = 0.0;

				}
			});
		}
	}

	function toFunction(a) {
		var b = Object.prototype.toString.call(a) === '[object Function]';
		return b ? a : function(o) {};
	}
	//采用
	function onContResize() {
		var wh = getWH();
		df_Width = wh.w;
		df_Height = wh.h;
		thm.camera.aspect = wh.w / wh.h;
		thm.camera.updateProjectionMatrix();
		thm.renderer.setSize(wh.w, wh.h);
	}
	//- renderer
	function renderers(func) {
		var fnc = toFunction(func);
		var Animations = function() {
			if (is_Init) {
				//update();
				//thm.camera.rotation.x +=0.01;
				if (thm.controls) thm.controls.update();
				var delta = df_Clock.getDelta();
				if (delta > 0) animation(delta);
				fnc.bind(thm)(delta);
				thm.renderer.render(thm.scene, thm.camera);
				requestAnimationFrame(Animations);

			}
		};
		Animations();
	}


	function onDocumentMouseUp(event) {


	}

	// function onDocumentMouseWheel ( event ) {
	//
	// }

	function onDocumentMouseMove(event) {

		event.preventDefault();

	}

	function onDocumentMouseDown(event) {

	}

	function onClick(event) {}

	function __setControls() {
		THREE.OrbitControls = function(F, G) {
			function h() {
				return Math.pow(.95, a.zoomSpeed)
			}

			function z(b) {
				a.object instanceof THREE.PerspectiveCamera ? k /= b : a.object instanceof THREE.OrthographicCamera ? (a.object.zoom = Math.max(a.minZoom, Math.min(a.maxZoom, a.object.zoom * b)), a.object.updateProjectionMatrix(), y = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), a.enableZoom = !1)
			}

			function A(b) {
				a.object instanceof THREE.PerspectiveCamera ? k *= b : a.object instanceof THREE.OrthographicCamera ?
					(a.object.zoom = Math.max(a.minZoom, Math.min(a.maxZoom, a.object.zoom / b)), a.object.updateProjectionMatrix(), y = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), a.enableZoom = !1)
			}

			function H(b) {
				if (!1 !== a.enabled) {
					b.preventDefault();
					if (b.button === a.mouseButtons.ORBIT) {
						if (!1 === a.enableRotate) return;
						l.set(b.clientX, b.clientY);
						d = c.ROTATE
					} else if (b.button === a.mouseButtons.ZOOM) {
						if (!1 === a.enableZoom) return;
						m.set(b.clientX, b.clientY);
						d = c.DOLLY
					} else if (b.button ===
						a.mouseButtons.PAN) {
						if (!1 === a.enablePan) return;
						n.set(b.clientX, b.clientY);
						d = c.PAN
					}
					d !== c.NONE && (document.addEventListener("mousemove", B, !1), document.addEventListener("mouseup", C, !1), a.dispatchEvent(D))
				}
			}

			function B(b) {
				!1 !== a.enabled && (b.preventDefault(), d === c.ROTATE ? !1 !== a.enableRotate && (p.set(b.clientX, b.clientY), q.subVectors(p, l), b = a.domElement === document ? a.domElement.body : a.domElement, e.theta -= 2 * Math.PI * q.x / b.clientWidth * a.rotateSpeed, e.phi -= 2 * Math.PI * q.y / b.clientHeight * a.rotateSpeed, l.copy(p), a.update()) :
					d === c.DOLLY ? !1 !== a.enableZoom && (r.set(b.clientX, b.clientY), t.subVectors(r, m), 0 < t.y ? z(h()) : 0 > t.y && A(h()), m.copy(r), a.update()) : d === c.PAN && !1 !== a.enablePan && (u.set(b.clientX, b.clientY), v.subVectors(u, n).multiplyScalar(a.panSpeed), w(v.x, v.y), n.copy(u), a.update()))
			}

			function C(b) {
				!1 !== a.enabled && (document.removeEventListener("mousemove", B, !1), document.removeEventListener("mouseup", C, !1), a.dispatchEvent(E), d = c.NONE)
			}

			function I(b) {
				!1 === a.enabled || !1 === a.enableZoom || d !== c.NONE && d !== c.ROTATE || (b.preventDefault(),
					b.stopPropagation(), 0 > b.deltaY ? A(h()) : 0 < b.deltaY && z(h()), a.update(), a.dispatchEvent(D), a.dispatchEvent(E))
			}

			function J(b) {
				if (!1 !== a.enabled && !1 !== a.enableKeys && !1 !== a.enablePan) switch (b.keyCode) {
					case a.keys.UP:
						w(0, 7 * -a.panSpeed);
						a.update();
						break;
					case a.keys.BOTTOM:
						w(0, 7 * a.panSpeed);
						a.update();
						break;
					case a.keys.LEFT:
						w(7 * -a.panSpeed, 0);
						a.update();
						break;
					case a.keys.RIGHT:
						w(7 * a.panSpeed, 0), a.update()
				}
			}

			function K(b) {
				if (!1 !== a.enabled) {
					switch (b.touches.length) {
						case 1:
							if (!1 === a.enableRotate) return;
							l.set(b.touches[0].pageX,
								b.touches[0].pageY);
							d = c.TOUCH_ROTATE;
							break;
						case 2:
							if (!1 === a.enableZoom) return;
							var g = b.touches[0].pageX - b.touches[1].pageX;
							b = b.touches[0].pageY - b.touches[1].pageY;
							m.set(0, Math.sqrt(g * g + b * b));
							d = c.TOUCH_DOLLY;
							break;
						case 3:
							if (!1 === a.enablePan) return;
							n.set(b.touches[0].pageX, b.touches[0].pageY);
							d = c.TOUCH_PAN;
							break;
						default:
							d = c.NONE
					}
					d !== c.NONE && a.dispatchEvent(D)
				}
			}

			function L(b) {
				if (!1 !== a.enabled) switch (b.preventDefault(), b.stopPropagation(), b.touches.length) {
					case 1:
						if (!1 === a.enableRotate) break;
						if (d !== c.TOUCH_ROTATE) break;
						p.set(b.touches[0].pageX, b.touches[0].pageY);
						q.subVectors(p, l);
						var g = a.domElement === document ? a.domElement.body : a.domElement;
						e.theta -= 2 * Math.PI * q.x / g.clientWidth * a.rotateSpeed;
						e.phi -= 2 * Math.PI * q.y / g.clientHeight * a.rotateSpeed;
						l.copy(p);
						a.update();
						break;
					case 2:
						if (!1 === a.enableZoom) break;
						if (d !== c.TOUCH_DOLLY) break;
						g = b.touches[0].pageX - b.touches[1].pageX;
						b = b.touches[0].pageY - b.touches[1].pageY;
						r.set(0, Math.sqrt(g * g + b * b));
						t.subVectors(r, m);
						0 < t.y ? A(h()) : 0 > t.y && z(h());
						m.copy(r);
						a.update();
						break;
					case 3:
						if (!1 ===
							a.enablePan) break;
						if (d !== c.TOUCH_PAN) break;
						u.set(b.touches[0].pageX, b.touches[0].pageY);
						v.subVectors(u, n);
						w(v.x, v.y);
						n.copy(u);
						a.update();
						break;
					default:
						d = c.NONE
				}
			}

			function M(b) {
				!1 !== a.enabled && (a.dispatchEvent(E), d = c.NONE)
			}

			function N(a) {
				a.preventDefault()
			}
			this.object = F;
			this.domElement = void 0 !== G ? G : document;
			this.enabled = !0;
			this.target = new THREE.Vector3;
			this.minDistance = 0;
			this.maxDistance = Infinity;
			this.minZoom = 0;
			this.maxZoom = Infinity;
			this.minPolarAngle = 0;
			this.maxPolarAngle = Math.PI;
			this.minAzimuthAngle = -Infinity;
			this.maxAzimuthAngle = Infinity;
			this.enableDamping = !1;
			this.dampingFactor = .25;
			this.enableZoom = !0;
			this.zoomSpeed = 1;
			this.enableRotate = !0;
			this.rotateSpeed = 1;
			this.enablePan = !0;
			this.panSpeed = 1;
			this.autoRotate = !1;
			this.autoRotateSpeed = 2;
			this.enableKeys = !0;
			this.keys = {
				LEFT: 37,
				UP: 38,
				RIGHT: 39,
				BOTTOM: 40
			};
			this.mouseButtons = {
				ORBIT: THREE.MOUSE.LEFT,
				ZOOM: THREE.MOUSE.MIDDLE,
				PAN: THREE.MOUSE.RIGHT
			};
			this.target0 = this.target.clone();
			this.position0 = this.object.position.clone();
			this.zoom0 = this.object.zoom;
			this.getPolarAngle =
				function() {
					return f.phi
				};
			this.getAzimuthalAngle = function() {
				return f.theta
			};
			this.reset = function() {
				a.target.copy(a.target0);
				a.object.position.copy(a.position0);
				a.object.zoom = a.zoom0;
				a.object.updateProjectionMatrix();
				a.dispatchEvent(O);
				a.update();
				d = c.NONE
			};
			this.update = function() {
				var b = new THREE.Vector3,
					g = (new THREE.Quaternion).setFromUnitVectors(F.up, new THREE.Vector3(0, 1, 0)),
					U = g.clone().inverse(),
					P = new THREE.Vector3,
					Q = new THREE.Quaternion;
				return function() {
					var h = a.object.position;
					b.copy(h).sub(a.target);
					b.applyQuaternion(g);
					f.setFromVector3(b);
					a.autoRotate && d === c.NONE && (e.theta -= 2 * Math.PI / 60 / 60 * a.autoRotateSpeed);
					f.theta += e.theta;
					f.phi += e.phi;
					f.theta = Math.max(a.minAzimuthAngle, Math.min(a.maxAzimuthAngle, f.theta));
					f.phi = Math.max(a.minPolarAngle, Math.min(a.maxPolarAngle, f.phi));
					f.makeSafe();
					f.radius *= k;
					f.radius = Math.max(a.minDistance, Math.min(a.maxDistance, f.radius));
					a.target.add(x);
					b.setFromSpherical(f);
					b.applyQuaternion(U);
					h.copy(a.target).add(b);
					a.object.lookAt(a.target);
					!0 === a.enableDamping ? (k +=
						(1 - k) * a.dampingFactor * .6, e.theta *= 1 - a.dampingFactor, e.phi *= 1 - a.dampingFactor, x.multiplyScalar(1 - a.dampingFactor)) : (k = 1, e.set(0, 0, 0), x.set(0, 0, 0));
					return y || P.distanceToSquared(a.object.position) > R || 8 * (1 - Q.dot(a.object.quaternion)) > R ? (a.dispatchEvent(O), P.copy(a.object.position), Q.copy(a.object.quaternion), y = !1, !0) : !1
				}
			}();
			this.dispose = function() {
				a.domElement.removeEventListener("contextmenu", N, !1);
				a.domElement.removeEventListener("mousedown", H, !1);
				a.domElement.removeEventListener("wheel", I, !1);
				a.domElement.removeEventListener("touchstart",
					K, !1);
				a.domElement.removeEventListener("touchend", M, !1);
				a.domElement.removeEventListener("touchmove", L, !1);
				document.removeEventListener("mousemove", B, !1);
				document.removeEventListener("mouseup", C, !1);
				window.removeEventListener("keydown", J, !1)
			};
			var a = this,
				O = {
					type: "change"
				},
				D = {
					type: "start"
				},
				E = {
					type: "end"
				},
				c = {
					NONE: -1,
					ROTATE: 0,
					DOLLY: 1,
					PAN: 2,
					TOUCH_ROTATE: 3,
					TOUCH_DOLLY: 4,
					TOUCH_PAN: 5
				},
				d = c.NONE,
				R = 1E-6,
				f = new THREE.Spherical,
				e = new THREE.Spherical,
				k = 1,
				x = new THREE.Vector3,
				y = !1,
				l = new THREE.Vector2,
				p = new THREE.Vector2,
				q = new THREE.Vector2,
				n = new THREE.Vector2,
				u = new THREE.Vector2,
				v = new THREE.Vector2,
				m = new THREE.Vector2,
				r = new THREE.Vector2,
				t = new THREE.Vector2,
				S = function() {
					var a = new THREE.Vector3;
					return function(b, c) {
						a.setFromMatrixColumn(c, 0);
						a.multiplyScalar(-b);
						x.add(a)
					}
				}(),
				T = function() {
					var a = new THREE.Vector3;
					return function(b, c) {
						a.setFromMatrixColumn(c, 1);
						a.multiplyScalar(b);
						x.add(a)
					}
				}(),
				w = function() {
					var b = new THREE.Vector3;
					return function(c, d) {
						var e = a.domElement === document ? a.domElement.body : a.domElement;
						if (a.object instanceof THREE.PerspectiveCamera) {
							b.copy(a.object.position).sub(a.target);
							var f = b.length(),
								f = f * Math.tan(a.object.fov / 2 * Math.PI / 180);
							S(2 * c * f / e.clientHeight, a.object.matrix);
							T(2 * d * f / e.clientHeight, a.object.matrix)
						} else a.object instanceof THREE.OrthographicCamera ? (S(c * (a.object.right - a.object.left) / a.object.zoom / e.clientWidth, a.object.matrix), T(d * (a.object.top - a.object.bottom) / a.object.zoom / e.clientHeight, a.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),
							a.enablePan = !1)
					}
				}();
			a.domElement.addEventListener("contextmenu", N, !1);
			a.domElement.addEventListener("mousedown", H, !1);
			a.domElement.addEventListener("wheel", I, !1);
			a.domElement.addEventListener("touchstart", K, !1);
			a.domElement.addEventListener("touchend", M, !1);
			a.domElement.addEventListener("touchmove", L, !1);
			window.addEventListener("keydown", J, !1);
			this.update()
		};
		THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
		THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;
	}
};