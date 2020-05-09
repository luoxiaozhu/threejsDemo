var _Collects = {
	/**
	 * [_createCanvas 根据文字内容生成canvas纹理]
	 * @Author   DUKAI
	 * @DateTime 2018-07-05T15:27:04+0800
	 * @param    {[type]}                 datas [description]
	 * @param    {[type]}                 color [description]
	 * @return   {[type]}                       [description]
	 */
	createCanvas: function(content) {

		var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
		var context = canvas.getContext('2d');
		canvas.width = canvas.height = 64;
		canvas.style.backgroundColor = 'rgba(255,255,255,0)';
		context.font = "normal 40px Arial";
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		//设置字体填充颜色
		context.fillStyle = 'white';
		context.lineWidth = 1;
		context.fillText(content, 32, 32);

		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		texture._scale = canvas.width / 16;
		canvas = null;
		return texture;

	},
	createGradiualCanvas: function(opts) {
		opts = opts || {};
		var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
		var context = canvas.getContext('2d');
		canvas.width = opts.width || 64, canvas.height = opts.height || 64;
		var grd = context.createLinearGradient(0, 0, 0, canvas.width);
		grd.addColorStop(0, "rgba(255,255,255,1.0)");
		grd.addColorStop(0.4, "rgba(255,255,255,1)");
		grd.addColorStop(0.6, "rgba(255,255,255,1)");
		grd.addColorStop(1, "rgba(255,255,255,1.0)");
		context.fillStyle = grd;
		context.fillRect(0, 0, canvas.width, canvas.height);

		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		texture._scale = canvas.width / 16;
		canvas = null;
		return texture;
	},
	color: function(c) {
		return new THREE.Color(c);
	},
	isArray: function(o) {
		return Object.prototype.toString.call(o) == '[object Array]';
	},
	getColorArr: function(str) {
		if (this.isArray(str)) return str; //error
		var _arr = [];
		str = str + '';
		str = str.toLowerCase().replace(/\s/g, "");
		if (/^((?:rgba)?)\(\s*([^\)]*)/.test(str)) {
			var arr = str.replace(/rgba\(|\)/gi, '').split(',');
			var hex = [
				pad2(Math.round(arr[0] * 1 || 0).toString(16)),
				pad2(Math.round(arr[1] * 1 || 0).toString(16)),
				pad2(Math.round(arr[2] * 1 || 0).toString(16))
			];
			_arr[0] = this.color('#' + hex.join(""));
			_arr[1] = Math.max(0, Math.min(1, (arr[3] * 1 || 0)));
		} else if ('transparent' === str) {
			_arr[0] = this.color();
			_arr[1] = 0;
		} else {
			_arr[0] = this.color(str);
			_arr[1] = 1;
		}

		function pad2(c) {
			return c.length == 1 ? '0' + c : '' + c;
		}
		return _arr;
	},
	isFunction: function(a) {
		return Object.prototype.toString.call(a) === '[object Function]';
	},
	toFunction: function(a) {
		var b = Object.prototype.toString.call(a) === '[object Function]';
		return b ? a : function(o) {};
	},
	/**
	 * [disposeObj 销毁对象，解绑与GPU的联系，删除子对象，释放内存]
	 * @Author   ZHOUPU
	 * @DateTime 2018-08-02
	 * @param    {[object]}   obj [待销毁的object3D对象]
	 * @return   {[void]}
	 */
	disposeObj: function(obj) {
		if (obj instanceof THREE.Object3D) {

			_Collects.objectTraverse(obj, function(child) {

				if (child._txueArr) {
					child._txueArr[1].dispose();
					child._txueArr[2].dispose();
					child._txueArr[1] = null;
					child._txueArr[2] = null;
				}
				if (child.geometry) {
					if (child.geometry._bufferGeometry) {
						child.geometry._bufferGeometry.dispose();
					}
					child.geometry.dispose();
					child.geometry = null;
				}

				if (_Collects.isArray(child.material)) {
					child.material.forEach(function(mtl) {
						_Collects.disposeMaterial(mtl);
					});
				} else if (child.material) {
					_Collects.disposeMaterial(child.material);
				}

				if (child.parent) child.parent.remove(child);
				child = null;

			});
		}
	},
	/**
	 * [disposeMaterial 销毁材质]
	 * @Author   ZHOUPU
	 * @DateTime 2018-08-02
	 * @param    {[object]}   obj      [THREE的材质对象]
	 * @return   {[void]}
	 */
	disposeMaterial: function(mtl) {
		if (mtl.uniforms && mtl.uniforms.u_txue && mtl.uniforms.u_txue.value) {
			if (mtl.__webglShader) {
				mtl.__webglShader.uniforms.u_txue.value.dispose();
				mtl.__webglShader.uniforms.u_txue.value = null;
			} else {
				mtl.uniforms.u_txue.value.dispose();
				mtl.uniforms.u_txue.value = null;
			}
		}
		if (mtl.map) {
			mtl.map.dispose();
			mtl.map = null;
			if (mtl.__webglShader) {
				mtl.__webglShader.uniforms.map.value.dispose();
				mtl.__webglShader.uniforms.map.value = null;
			}
		}
		mtl.dispose();
		mtl = null;
	},
	/**
	 * [objectTraverse 遍历对象树，由叶到根]
	 * @Author   ZHOUPU
	 * @DateTime 2018-08-02
	 * @param    {[object]}   obj      [THREE的object3D对象]
	 * @param    {Function} callback [回调函数，返回遍历对象]
	 * @return   {[void]}
	 */
	objectTraverse: function(obj, callback) {
		if (!_Collects.isFunction(callback)) return;
		var children = obj.children;
		for (var i = children.length - 1; i >= 0; i--) {
			_Collects.objectTraverse(children[i], callback);
		}
		callback(obj);
	}
};

var _Shaders = {
	BaseEarthVShader: [
		"varying vec2 vUv;",
		"uniform vec3 u_AmbientColor;",
		"uniform vec3 u_LightingDirection;",
		"uniform vec3 u_DirectionalColor;",
		"uniform float u_lightIntensity;",
		"varying vec3 vLightWeighting;",
		"void main() {",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);",
		"vUv = uv;",
		"vec3 transformedNormal = normalMatrix * normal;",
		"float directionalLightWeighting = max(dot(transformedNormal, u_LightingDirection)*u_lightIntensity, 0.0);",
		"vLightWeighting = u_AmbientColor + u_DirectionalColor * directionalLightWeighting;",
		"}"
	].join("\n"),
	BaseEarthFShader: [
		"uniform sampler2D u_texture;",
		"uniform vec3 u_texColor;",
		"uniform float u_opacity;",
		"uniform float u_time;",
		"varying vec2 vUv;",
		"varying vec3 vLightWeighting;",
		"void main() {",
		"vec4 texture = texture2D( u_texture,vUv);",
		"vec4 mapColor = vec4(u_texColor,u_opacity)*texture;",
		"gl_FragColor = vec4(mapColor.rgb * vLightWeighting, mapColor.a);",
		"}"
	].join("\n")
};

let shader = {
	griadient: {
		uniforms: {
			color: {
				value: new THREE.Vector3(1., 1., 1.)
			},
			gradientColor: {
				value: new THREE.Vector3(1., 0., 0.)
			},
			width: {
				value: 0.2
			},
			time: {
				value: 0.0
			},
			speed: {
				value: 0.05
			},
			l: {
				value: 1.0
			},
			texture: {
				value: null
			},
			u_AmbientColor: {
				value: new THREE.Color(1., 1., 1.)
			},
			u_DirectionalColor: {
				value: new THREE.Color(1., 1., 1.)
			},
			u_LightingDirection: {
				value: new THREE.Color(1., 1., 1.)
			},
			u_lightIntensity: {
				value: 1.0
			}
		},
		vertexShader: `
                    varying float h;
                    uniform vec3 u_AmbientColor;
                    uniform vec3 u_LightingDirection;
					uniform vec3 u_DirectionalColor;
					uniform float u_lightIntensity;
					varying vec3 vLightWeighting;
                    void main() {
                        h = position.y;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        vec3 transformedNormal = normalMatrix * normal;
						float directionalLightWeighting = max(dot(transformedNormal, u_LightingDirection)*u_lightIntensity, 0.0);
						vLightWeighting = u_AmbientColor + u_DirectionalColor * directionalLightWeighting;
                    }
                `,
		fragmentShader: `
                    uniform vec3 color;
                    uniform vec3 gradientColor;
                    uniform float width;
                    uniform float speed;
                    uniform float time; // 0 - 1
                    uniform float l; // total h
                    uniform sampler2D texture;
					varying vec3 vLightWeighting;
                    varying float h;

                    vec3 lerpHSV(in vec3 a, in vec3 b, in float x)
                    {
                        float hue = (mod(mod((b.x-a.x), 1.) + 1.5, 1.)-0.5)*x + a.x;
                        return vec3(hue, mix(a.yz, b.yz, x));
                    }

                    float noise(vec2 p) {
                        return texture2D(texture, p*0.1).y;
                    }

                    void main() {
                        
                        float t = fract(time*speed)*2.-1.;
                        float r = clamp(h/l, -0.5,0.5);
                        float s = smoothstep( t, t+width, r) - smoothstep( t+width, t+width*2., r);
                        // vec3 col = lerpHSV(color, gradientColor, s);
                        //float n = noise(vec2(h, t));
                        vec3 col = mix(color, gradientColor, s);
                        gl_FragColor = vec4(col*vLightWeighting, 1.0);
                        
                    }
                `
	}
};

var _Materials = {

	basic: function(params) {
		return new THREE.MeshBasicMaterial(params);
	},
	shader: function(params) {
		return new THREE.ShaderMaterial(params);
	},
	point: function(params) {
		return new THREE.PointsMaterial(params);
	},
	line: function(params) {
		return new THREE.LineBasicMaterial(params);
	},
	dashline: function(params) {
		return new THREE.LineDashedMaterial(params);
	},
	phong: function(params) {
		return new THREE.MeshPhongMaterial(params);
	},
	lambert: function(params) {
		return new THREE.MeshLambertMaterial(params);
	},
	standard: function(params) {
		return new THREE.MeshStandardMaterial(params);
	}
};

var cyDatas = [{
	name: "1",
	value: 20
}];