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

const glassConfigs = ['TK_taiyangneng', 'TK_boli001', 'TK_boli003', 'TK_boli005', 'TK_CK040', 'TK_CK020', 'TK_CK041', 'TK_CK089', 'Material #1245', 'TK_CK059', 'TK_boli004', 'TK_CK049', 'TK_CK048', 'TK_brick_006', 'TK_boli001', 'TK_boli001', 'TK_CK010', 'TK_qiang_002'].map((n) => {
    return {
        name: n,
        ...glass
    }
})

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
            url: publicPath + 'shenyuan/SY01.FBX',
            id: 'index_1',
            replaceMaterial: 'MeshPhysicalMaterial', // 是否替换材质
            pick: [], // 拾取的物体  'all' 为所有物体
            bake: [
                {
                    name: 'DX001',
                    uv2: 'DX001'
                },
                {
                    name: 'DX002',
                    uv2: 'DX002'
                },
                { name: 'JZ_01', uv2: 'JZ_01' },
                { name: 'JZ_02', uv2: 'JZ_02' },
                { name: 'JZ_03', uv2: 'JZ_03' },
                { name: 'JZ_04', uv2: 'JZ_04' },
                { name: 'JZ_05', uv2: 'JZ_05' },
                { name: 'JZ_06', uv2: 'JZ_06' },
                { name: 'JZ_07', uv2: 'JZ_07' },
                { name: 'JZ_08', uv2: 'JZ_08' },
                { name: 'JZ_09', uv2: 'JZ_09' },
                { name: 'JZ_10', uv2: 'JZ_10' },
                { name: 'JZ_11', uv2: 'JZ_11' },
                { name: 'JZ_12', uv2: 'JZ_12' },

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
                ...glassConfigs,
                {
                    name: 'Material #2097638973',
                    transparent: true,
                    vertexColors: false,
                    color: new THREE.Color('#999666'),
                    ...glass
                },
                {
                    name: 'TK_langan_003_alpha',
                    transparent: true,
                    vertexColors: false,
                    ...glass
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
            data: [
                {
                    camera: { x: -1403.79, y: 146.35, z: 1605.64 },
                    target: { x: -595, y: 0, z: 825.61 }
                },
                {
                    camera: { x: -201.99, y: 200.56, z: 551.5 },
                    target: { x: 41.77, y: 0, z: 240.46 }
                }]
        },
        {
            id: 'path_2',
            time: 45000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: true, // 是否衔接当前视角过度
            loop: true, // 循环 默认false
            pause: true, // 是否允许暂停， 默认false
            data: [
                {
                    camera: { x: 510.48, y: 200.26, z: 671.75 },
                    target: { x: 165.53, y: 0, z: 208.9 }
                },
                { type: 'spin', angle: [0, -Math.PI * 0.4], speed: 5 },
                {
                    camera: { x: 430.44, y: 175.16, z: -458.7 },
                    target: { x: 62.98, y: -0, z: 49.69 }
                },
                {
                    camera: { x: -372.99, y: 180.06, z: -197.97 },
                    target: { x: 97.96, y: -0, z: 97.96 }
                }, {
                    camera: { x: -486.25, y: 188.01, z: 500.45 },
                    target: { x: 26.12, y: -0, z: 140.25 }
                }


                /*  {"camera":{"x":-85.4,"y":4,"z":52.28},"target":{"x":11.38,"y":0,"z":58.15}},
                 {"camera":{"x":48.72,"y":3.24,"z":52.12},"target":{"x":127.06,"y":0,"z":56.87}},
                 {"camera":{"x":249.61,"y":97.03,"z":198.78},"target":{"x":51.09,"y":0,"z":-16.6}},
                 { type: 'spin', angle: [0, Math.PI * 3], speed: 1 }, */
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
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: shenyuanTree.tree_a
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'shenyuan/tree_a.FBX', // 模型地址 
                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: shenyuanTree.tree_b
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'shenyuan/tree_b.FBX', // 模型地址 
                }
            }, {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: shenyuanTree.tree_c
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'shenyuan/tree_c.FBX', // 模型地址 
                }
            }, {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: shenyuanTree.tree_d
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'shenyuan/tree_d.FBX', // 模型地址 
                }
            }, {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: shenyuanTree.tree_e
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'shenyuan/tree_e.FBX', // 模型地址 
                }
            }, {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: shenyuanTree.tree_f
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'shenyuan/tree_f.FBX', // 模型地址 
                    randomRotate: {
                        z: Math.PI * 2
                    }
                }
            }, {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: shenyuanTree.tree_g
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'shenyuan/tree_g.FBX', // 模型地址 
                }
            }
        ],
        material: {
            side: 2,
            transparent: true,
            depthWrite: true,
            alphaMap: null,
            alphaTest: 0.45,
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
        const com4 = instance.getComponent({
            sort: 4
        });

        com4.dispose();
        /* com1.setVisible(true)
        com3.setVisible(true) */
        /* com1.group.visible = true;
        com3.group.visible = true; */
        const scale = 1;
        com1.group.scale.set(scale, scale, scale);
        com3.group.scale.set(scale, scale, scale);

        com2.start('path_1').then(res => {
            timeOutArray[0] = setTimeout(() => {
                com2.start('path_2');
            }, 1000)
        });

        timeOutArray[1] = setTimeout(() => {
            const com5 = instance.getComponent({
                sort: 5
            });


            com5.setConfig('show');
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
        width: 4, // 2的n次方，决定数量(width*width)和纹理(dataTxue的大小)
        count: 0.4, // 0 ~ 1, 数量系数

        center: {
            x: 680,
            y: 1000,
            z: 250
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
            toneMappingExposure: 1.0
        } */
    },
    sky: {
        created: true, // 是否创建
        currentSky: 'type_3', // name(初始天空盒，对应name) / null(初始不启动天空盒)
        environment: 'type_1', // 环境贴图
        skys: [
            {
                name: 'type_1',
                type: 'hdr', // 类别
                url: path+'texture/basic.hdr'
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
            {
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
            }
        ],
        material: []
    },
    components: [
        switchCmp,
        loadeComp,
        cameraComp,
        instanceCom1,
        flyerComp,
        // flyerComp2
    ],

    loadEndCallback() {
        // 所有组件加载完毕回调
        timeOutArray[2] = setTimeout(() => {
            instance.getComponent({
                sort: 4
            }).startInit(); // 初始相机角度
            document.querySelector('#eft_loading').style.opacity = 1;
            instance.loadingHide(document.querySelector('#eft_loading').style, {
                opacity: 0
            }, () => {
                document.querySelector('#eft_loading').remove();

                instance.getComponent({
                    sort: 4
                }).start('上海'); // 开始入场 '四川'
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
    { id: 'DX001', url: publicPath + 'shenyuan/DX001.jpg' },
    { id: 'DX002', url: publicPath + 'shenyuan/DX002.jpg' },
    { id: 'JZ_01', url: publicPath + 'shenyuan/JZ_01.jpg' },
    { id: 'JZ_02', url: publicPath + 'shenyuan/JZ_02.jpg' },
    { id: 'JZ_03', url: publicPath + 'shenyuan/JZ_03.jpg' },
    { id: 'JZ_04', url: publicPath + 'shenyuan/JZ_04.jpg' },
    { id: 'JZ_05', url: publicPath + 'shenyuan/JZ_05.jpg' },
    { id: 'JZ_06', url: publicPath + 'shenyuan/JZ_06.jpg' },
    { id: 'JZ_07', url: publicPath + 'shenyuan/JZ_07.jpg' },
    { id: 'JZ_08', url: publicPath + 'shenyuan/JZ_08.jpg' },
    { id: 'JZ_09', url: publicPath + 'shenyuan/JZ_09.jpg' },
    { id: 'JZ_10', url: publicPath + 'shenyuan/JZ_10.jpg' },
    { id: 'JZ_11', url: publicPath + 'shenyuan/JZ_11.jpg' },
    { id: 'JZ_12', url: publicPath + 'shenyuan/JZ_12.jpg' },
    ]
});

// 判断用于代码注入
if (typeof jQuery !== 'undefined') {
    const _element = $("#" + rect_id).widget()._element;
    $(_element).on("$destroy", function () {
        timeOutArray.forEach(time => {
            clearTimeout(time);
        })
        // 销毁
        instance.dispose();
        instance = null;
    });
}

