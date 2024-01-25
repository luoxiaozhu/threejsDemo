/* 
* 广州粤园
* 2021-08-04
* 饶岩
*/
const path = ''; // 公共资源
const publicPath = ''; // 当前项目资源

const timeOutArray = [];
let instance = new glInstance();

window._instance = instance;

const rect_id = 'test1';
const doms = `
        <div id="eft_loading" style="position:absolute;left:0;right:0;bottom:0;top:0;z-index:100;background:#000;">
        <img src= "${path}texture/loading.gif" style="position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);">
        </div>
        <div id="eft_canvas_frame" style="width: 100%; height: 100%;"></div>
    `;
document.querySelector('#' + rect_id).innerHTML = doms;

// 玻璃
const glass = {
    roughness: 0.0,
    metalness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.5,
    side: 2,
    sheen: new THREE.Color("#ffe08a")
};
// 屋顶
const roof = {
    roughness: 1,
    metalness: 0.1,
    clearcoat: 0.1,
    clearcoatRoughness: 1
};

const loadeComp = {
    name: 'LoaderModel', // 当前组件的名称 用于调用对应的组件
    id: 'model1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        order: false, // true 按照顺序加载 false 一起加载
        chassis: {
            radius: 5000,
            position: {
                x: 0,
                y: -50,
                z: 0
            },
            gradient: [
                'rgba(10,13,26,0.5)',
                'rgba(10,13,26,0.0)',
            ]
        }, // 配置底盘显示  装饰作用
        model: [{
            url: publicPath + 'shuyuan/shuyuan01.FBX',
            id: 'index_1',
            replaceMaterial: 'MeshPhysicalMaterial', // 是否替换材质
            pick: [], // 拾取的物体  'all' 为所有物体
            bake: [
                {
                    "name": "JZ03",
                    "uv2": "JZ03"
                },
                {
                    "name": "JZ04",
                    "uv2": "JZ04"
                },
                {
                    "name": "JZ01",
                    "uv2": "JZ01"
                },
                {
                    "name": "JZ02",
                    "uv2": "JZ02"
                },
                {
                    "name": "JZ05",
                    "uv2": "JZ05"
                },
                {
                    "name": "JZ07",
                    "uv2": "JZ07"
                },
                {
                    "name": "JZ06",
                    "uv2": "JZ06"
                },
                {
                    "name": "DX02",
                    "uv2": "DX02"
                },
                {
                    "name": "DX01",
                    "uv2": "DX01"
                }
            ],
            animate: [],
            mesh: [{
                name: 'water',
                renderOrder: 1,
                replace: {
                    name: 'water',
                    speed: 0.3,
                    waterColor: '#317f96'
                }
            }],
            material: [
                {
                    "name": "Material #2097638634",
                    "transparent": true,
                    "metalness": 0.5,
                    color: new THREE.Color("rgb(89,86,72)")
                },
                {
                    "name": "tree_SZCL_tree3_out",
                    "transparent": true,
                    reflectivity: 1
                }
            ]
        },

        ]
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 1, // 当前组件的渲染顺序
    created(group) {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
        const scale = 0.0001;
        group.scale.set(scale, scale, scale)
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        // console.log("mounted");
        // const com1 = instance.getComponent({ sort: 1 });
        // com1.setVisible(false);
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update(object) {
        /* 当前组件中的mesh发生变化 触发 */
        // console.log(object);
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    }
};

const cameraComp = {
    name: 'CameraAnimate', // 当前组件的名称 用于调用对应的组件
    id: 'Path_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        data: [{
            id: 'path_1',
            time: 5000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: false, // 是否衔接当前视角过度
            data: [{
                camera: { x: -1092.15, y: 240.04, z: 263.26 },
                target: { x: -421.72, y: -0, z: 46.06 }
            },
            {
                camera: { x: -115.49, y: 89.59, z: 67.08 },
                target: { x: 61.34, y: -0, z: -93.23 }
            }]
        },
        {
            id: 'path_2',
            time: 34000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: true, // 是否衔接当前视角过度
            loop: true, // 循环 默认false
            pause: true, // 是否允许暂停， 默认false
            data: [
                {
                    camera: { x: 34.03, y: 27.49, z: -24.76 },
                    target: { x: 123.81, y: -0, z: -63.22 }
                },
                {
                    camera: { x: 316.76, y: 131.53, z: -11.41 },
                    target: { x: 153.08, y: -0, z: -65.89 }
                },
                { type: 'spin', angle: [0, -Math.PI * 0.8], speed: 5 },
                {
                    camera: {x: -254.72, y: 98.11, z: -231.95},
                    target: {x: -90.26, y: 0, z: -77.23}
                },
                {
                    camera: { x: -234.11, y: 117.7, z: 64.21 },
                    target: { x: -31.24, y: -0, z: -110.64 }
                }


            ]
        },
        ]
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 2, // 当前组件的渲染顺序
    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        console.log("mounted");
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log("update");
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    },
    eftEnd() {
        /* console.log("end");
        setTimeout(() => {
            _instance.getComponent({ sort: 4 }).setConfig('show', {
                time: 1600,
                callback: function () {
                    setTimeout(() => {
                        _instance.getComponent({ sort: 4 }).setConfig('hide');
                    }, 3000)
                }
            });
        }, 400) */
    }
};

const instanceCom1 = {
    name: 'InstanceMesh', // 当前组件的名称 用于调用对应的组件
    id: 'Instance_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        replaceMaterial: 'MeshPhysicalMaterial',
        data: [
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.deng
                },
                "model": {
                    "url": publicPath + "shuyuan/deng.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_a
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_a.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_b
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_b.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_c
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_c.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_d
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_d.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_e
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_e.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_f
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_f.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_g
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_g.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_h
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_h.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_i
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_i.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_j
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_j.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_k
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_k.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_l
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_l.FBX"
                }
            },
            {
                "renderOrder": 1,
                "meshData": {
                    "type": "data",
                    "data": shuyuanTreeData.tree_m
                },
                "model": {
                    "url": publicPath + "shuyuan/tree_m.FBX"
                }
            }
        ],
        material: {
            side: 2,
            opacity: 1.0,
            alphaTest: 0.35,
            alphaMap: null,
            transparent: true,
            vertexColors: false,
            roughness: 1,
            metalness: 0.1,
            clearcoat: 0.2,
            clearcoatRoughness: 1
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 3, // 当前组件的渲染顺序
    created(group) {
        /* 生成组件后的生命周期 （在生成效果前） */
        const scale = 0.0001;
        group.scale.set(scale, scale, scale)
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        //console.log("mounted");
        // const com1 = instance.getComponent({ sort: 3 });
        // com1.setVisible(false);
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log("update");
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    }
}

const switchCmp = {
    name: 'SwitchAnimate', // 当前组件的名称 用于调用对应的组件
    id: 'sw_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    visible: true,
    config: {
        start: false,
        earth: {
            radius: 10
        },
        showMaps: false,
        baseColor: '#004933',
        lightColor: '#B1AC07', // #079FB1
    },
    renderOrder: 0, // 当前组件的渲染层级
    renderSort: 4, // 当前组件的渲染顺序

    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        //console.log('created');
    },
    mounted(group) {
        // return;
        /* 组件创建完成并且效果完成后的回调 */
        instance.setOption('skyCube', {
            visible: true
        });

        const com1 = instance.getComponent({
            sort: 1
        });
        const com2 = instance.getComponent({
            sort: 2
        });
        const com3 = instance.getComponent({
            sort: 3
        });
        /* const com4 = instance.getComponent({
            sort: 4
        });

        com4.dispose(); */
        /* com1.setVisible(true)
        com3.setVisible(true) */
        /* com1.group.visible = true;
        com3.group.visible = true; */
        const scale = 1;
        com1.group.scale.set(scale, scale, scale);
        com3.group.scale.set(scale, scale, scale);

        com2.start('path_1').then(res => {
            timeOutArray[1] = setTimeout(() => {
                com2.start('path_2');
            }, 1000)
        });

        timeOutArray[2] = setTimeout(() => {
            const com5 = instance.getComponent({
                sort: 5
            });
            const com6 = instance.getComponent({
                sort: 6
            });

            com5.setConfig('show');
            com6.setConfig('show');
        }, 300)
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log('destroyed');
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log('update');
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log('watch');
    }
};

const flyerComp = {
    name: 'FlyerEft', // 当前组件的名称 用于调用对应的组件
    id: 'flyer_1', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        url: path + 'flyers/Stork.glb', // 模型路径
        size: 0.05, // 大小
        width: 8, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
        count: 0.4, // 0 ~ 1, 数量系数

        center: {
            x: 450,
            y: 700,
            z: 0
        }, // 效果环绕中心
        radius: 0.7, // 半径系数
        isPrey: true, // 是否鼠标位置影响
        preyRadius: 200, // 鼠标位置影响半径

        // freedom: 0.75, // 自由率
        cohesion: 20, // 凝聚距离
        alignment: 20, // 队列距离
        separation: 20, // 离散距离

        scopeR: {
            x: 1,
            y: 0.2,
            z: 1
        } // 效果范围影响系数
    },
    renderOrder: 4, // 当前组件的渲染层级
    renderSort: 5, // 当前组件的渲染顺序
    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        console.log("mounted1");
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log("update");
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    },
    eftEnd() {
        console.log("end");
    }
};

const flyerComp2 = {
    name: 'FlyerEft', // 当前组件的名称 用于调用对应的组件
    id: 'flyer_2', // 当前组件的key值 用于监控当前组件的变化或者事件
    config: {
        url: path + 'flyers/Flamingo.glb', // 模型路径
        size: 0.04, // 大小
        width: 4, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
        count: 0.3, // 0 ~ 1, 数量系数

        center: {
            x: -200,
            y: 500,
            z: 200
        }, // 效果环绕中心
        radius: 0.7, // 半径系数
        isPrey: true, // 是否鼠标位置影响
        preyRadius: 200, // 鼠标位置影响半径

        // freedom: 0.75, // 自由率
        cohesion: 20, // 凝聚距离
        alignment: 20, // 队列距离
        separation: 20, // 离散距离

        scopeR: {
            x: 1,
            y: 0.2,
            z: 1
        } // 效果范围影响系数
    },
    renderOrder: 4, // 当前组件的渲染层级
    renderSort: 6, // 当前组件的渲染顺序
    created() {
        /* 生成组件后的生命周期 （在生成效果前） */
        // console.log("created");
    },
    mounted(group) {
        /* 组件创建完成并且效果完成后的回调 */
        console.log("mounted2");
    },
    destroyed() {
        /* 当前组件销毁后执行的回调 */
        console.log("destroyed");
    },
    update() {
        /* 当前组件中的mesh发生变化 触发 */
        console.log("update");
    },
    watch(object) {
        /* 当前组件每次修改效果后的回调 增删改 */
        console.log("watch");
    },
    eftEnd() {
        console.log("end");
    }
};

// 初始化
instance.init({
    visible: true, // 设置所有组显示设置  可以设置单个组件的显示隐藏
    sort: true,
    // 基础配置
    render: {
        cts: 'eft_canvas_frame', // 容器 dom 或id
        camera: {
            fov: 45,
            near: 3,
            far: 10000,
            position: {
                x: -1.55,
                y: 30.98,
                z: 30.86
            }
        },
        controls: {
            target: {
                x: 0,
                y: 0,
                z: 0
            } // 中心位置
        },
        light: { // 灯光参数
            Ambient: {
                color: '#FFFFFF',
                strength: 1
            }, // 环境光 strength -2
        },
        /* tone: {
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.9
        }  */
    },
    sky: {
        created: true, // 是否创建
        currentSky: null, // name(初始天空盒，对应name) / null(初始不启动天空盒)
        environment: 'type_1', // 环境贴图
        skys: [
            {
                name: 'type_1',
                type: 'hdr', // 类别
                url: path + 'texture/basic.hdr'
                // url: 'texture/test.hdr'
            },
            /* {
                name: 'type_2',
                type: 'cube',
                url: [
                    path + 'texture/skyboxsun25deg/px.jpg',
                    path + 'texture/skyboxsun25deg/nx.jpg',
                    path + 'texture/skyboxsun25deg/py.jpg',
                    path + 'texture/skyboxsun25deg/ny.jpg',
                    path + 'texture/skyboxsun25deg/pz.jpg',
                    path + 'texture/skyboxsun25deg/nz.jpg',
                ]
            }, */
            /* {
                name: 'type_3',
                type: 'cube',
                url: [
                    path + 'texture/MilkyWay/px.jpg',
                    path + 'texture/MilkyWay/nx.jpg',
                    path + 'texture/MilkyWay/py.jpg',
                    path + 'texture/MilkyWay/ny.jpg',
                    path + 'texture/MilkyWay/pz.jpg',
                    path + 'texture/MilkyWay/nz.jpg',
                ]
            } */
        ],
        material: []
    },
    components: [
        // switchCmp,
        loadeComp,
        cameraComp,
        instanceCom1,
        flyerComp,
        flyerComp2
    ],

    loadEndCallback() {
        // 所有组件加载完毕回调
        timeOutArray[0] = setTimeout(() => {
            /* instance.getComponent({
                sort: 4
            }).startInit(); // 初始相机角度 */
            document.querySelector('#eft_loading').style.opacity = 1;
            instance.loadingHide(document.querySelector('#eft_loading').style, {
                opacity: 0
            }, () => {
                document.querySelector('#eft_loading').remove();

                /* instance.getComponent({
                    sort: 4
                }).start('广州'); // 开始入场 '四川' */

                instance.setOption('skyCube', {
                    visible: true
                });
        
                const com1 = instance.getComponent({
                    sort: 1
                });
                const com2 = instance.getComponent({
                    sort: 2
                });
                const com3 = instance.getComponent({
                    sort: 3
                });
                /* const com4 = instance.getComponent({
                    sort: 4
                });
        
                com4.dispose(); */
                /* com1.setVisible(true)
                com3.setVisible(true) */
                /* com1.group.visible = true;
                com3.group.visible = true; */
                const scale = 1;
                com1.group.scale.set(scale, scale, scale);
                com3.group.scale.set(scale, scale, scale);
        
                com2.start('path_1').then(res => {
                    timeOutArray[1] = setTimeout(() => {
                        com2.start('path_2');
                    }, 1000)
                });
        
                timeOutArray[2] = setTimeout(() => {
                    const com5 = instance.getComponent({
                        sort: 5
                    });
                    const com6 = instance.getComponent({
                        sort: 6
                    });
        
                    com5.setConfig('show');
                    com6.setConfig('show');
                }, 300)
            });
        }, 200);
    },
    textures: [{
        id: 'waternormals',
        url: path + 'texture/waternormals.jpg',
        isRepeat: true,
        repeat: {
            x: 10,
            y: 10
        }
    }, {
        id: 'watert',
        url: path + 'texture/watert.jpg',
        isRepeat: true,
        repeat: {
            x: 10,
            y: 10
        }
    }, {
        id: 'water',
        url: path + 'texture/water.jpg',
        isRepeat: true
    }, {
        id: 'em_color',
        url: path + 'em/color.jpg'
    },
    {
        id: 'em_normal',
        url: path + 'em/normal.jpg'
    }, {
        id: 'em_aomap',
        url: path + 'em/aomap.jpg'
    }, {
        id: 'em_display',
        url: path + 'em/display.jpg'
    }, {
        id: 'em_cloud',
        url: path + 'em/cloud.png'
    },

    // 项目资源
    {
        "id": "JZ03",
        "url": publicPath + "shuyuan/JZ03.jpg"
    },
    {
        "id": "JZ04",
        "url": publicPath + "shuyuan/JZ04.jpg"
    },
    {
        "id": "JZ01",
        "url": publicPath + "shuyuan/JZ01.jpg"
    },
    {
        "id": "JZ02",
        "url": publicPath + "shuyuan/JZ02.jpg"
    },
    {
        "id": "JZ05",
        "url": publicPath + "shuyuan/JZ05.jpg"
    },
    {
        "id": "JZ07",
        "url": publicPath + "shuyuan/JZ07.jpg"
    },
    {
        "id": "JZ06",
        "url": publicPath + "shuyuan/JZ06.jpg"
    },
    {
        "id": "DX02",
        "url": publicPath + "shuyuan/DX02.jpg"
    },
    {
        "id": "DX01",
        "url": publicPath + "shuyuan/DX01.jpg"
    }]
});

// 判断用于代码注入
if (typeof jQuery !== 'undefined') {
    const _element = $("#" + rect_id).widget();
    $(_element).on("$destroy", function () {
        timeOutArray.forEach(time => {
            clearTimeout(time);
        })
        // 销毁
        instance.dispose();
        instance = null;
    });
}
