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


const glass = {
    roughness: 0.0,
    metalness: 0.2,
    clearcoat: 0.9,
    clearcoatRoughness: 0.5,
    alphaMap: null,
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

const glassConfigs = ['TK_CK029_alpha','TK_chuyuan_007','TK_CK014','TK_CK015','TK_CK028_alpha','TK_boli002_alpha','TK_boli002_alpha','TK_CK017_alpha','TK_CK025','TK_CK025_alpha','TK_CK061','TK_boli004_alpha','TK_CK049','TK_CK069','TK_CK027_alpha','TK_CK064','TK_CK042','TK_CK002'].map((n) => {
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
            url: publicPath + 'wuyuan/wuyuan_01.FBX',
            id: 'index_1',
            replaceMaterial: 'MeshPhysicalMaterial', // 是否替换材质
            pick: [], // 拾取的物体  'all' 为所有物体
            bake: [{
                name: 'DX001',
                uv2: 'DX001'
            },
            {
                name: 'DX002',
                uv2: 'DX002'
            },
            { name: 'JZ01', uv2: 'JZ01' },
            // { name: 'JZ02', uv2: 'JZ02' }, 
            { name: 'JZ03', uv2: 'JZ03' },
            { name: 'JZ04', uv2: 'JZ04' },
            { name: 'JZ05', uv2: 'JZ05' },
            { name: 'JZ06', uv2: 'JZ06' },
            { name: 'JZ07', uv2: 'JZ07' },
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
                    name: 'Material #2097639734',
                    transparent: true,
                    vertexColors: false,
                    ...glass
                },
                ...glassConfigs

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
                camera: { x: -739.66, y: 111.63, z: 1357 },
                target: { x: -173.26, y: 0, z: 316.57 }
            },
            {
                camera: { x: -28.07, y: 60.21, z: 200.97 },
                target: { x: -4.94, y: 0, z: 37.13 }
            }]
        },
        {
            id: 'path_2',
            time: 54000,
            easing: 'Quartic.InOut', // 当前动画的缓动 可以添加导子数据上
            cohesion: true, // 是否衔接当前视角过度
            loop: true, // 循环 默认false
            pause: true, // 是否允许暂停， 默认false
            data: [{
                camera: { x: 434.08, y: 102.4, z: 229.36 },
                target: { x: 232.22, y: 0, z: 29.78 }
            },
            {
                camera: { x: 355.21, y: 105.48, z: -222.7 },
                target: { x: 233.61, y: 0, z: 32.64 }
            },
            {
                camera: { x: 158.94, y: 40.87, z: -201.75 },
                target: { x: 110.01, y: -0, z: -118.72 }
            },
            {
                camera: { x: -257.93, y: 81.2, z: -73.06 },
                target: { x: -157.76, y: -0, z: -143.35 }
            }, {
                camera: { x: -99.85, y: 116.44, z: 297.75 },
                target: { x: 37.61, y: -0, z: -1.2 }
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
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: wuyuanTree.tree_a
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'wuyuan/tree_a.FBX', // 模型地址

                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: wuyuanTree.tree_b
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'wuyuan/tree_b.FBX', // 模型地址

                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: wuyuanTree.tree_c
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'wuyuan/tree_c.FBX', // 模型地址

                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: wuyuanTree.tree_d
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'wuyuan/tree_d.FBX', // 模型地址
                    randomRotate: {
                        z: Math.PI * 2
                    },
                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: wuyuanTree.tree_e
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'wuyuan/tree_e.FBX', // 模型地址

                    randomRotate: {
                        z: Math.PI * 2
                    },
                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: wuyuanTree.tree_f
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'wuyuan/tree_f.FBX', // 模型地址

                    randomRotate: {
                        z: Math.PI * 2
                    },
                }
            },
            {
                renderOrder: 1,
                meshData: {
                    type: 'data',
                    data: wuyuanTree.ld
                }, //实例化的数据，可以为模型数据或者是JSON数据
                model: {
                    url: publicPath + 'wuyuan/deng.FBX', // 模型地址
                }
            },

        ],
        material: {
            side: 2,
            transparent: true,
            depthWrite: true,
            alphaMap: null,
            alphaTest: 0.4,
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
            timeOutArray[1] =setTimeout(() => {
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
        // tone: {
        //     toneMapping: THREE.CineonToneMapping,
        //     toneMappingExposure: 1.0
        // }
    },
    sky: {
        created: true, // 是否创建
        currentSky: 'type_3', // name(初始天空盒，对应name) / null(初始不启动天空盒)
        environment: 'type_1', // 环境贴图
        skys: [
            {
                name: 'type_1',
                type: 'hdr', // 类别
                url: path + 'texture/basic.hdr'
                // url: 'texture/test.hdr'
            },
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
        flyerComp2
    ],

    loadEndCallback() {
        // 所有组件加载完毕回调
        timeOutArray[0] = setTimeout(() => {
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
                }).start('江苏'); // 开始入场 '四川'
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
        id: 'DX001',
        url: publicPath + 'wuyuan/DX001.jpg'
    },
    {
        id: 'DX002',
        url: publicPath + 'wuyuan/DX002.jpg'
    },
    {
        id: 'JZ01',
        url: publicPath + 'wuyuan/JZ01.jpg'
    },
    {
        id: 'JZ03',
        url: publicPath + 'wuyuan/JZ03.jpg'
    },
    {
        id: 'JZ04',
        url: publicPath + 'wuyuan/JZ04.jpg'
    },
    {
        id: 'JZ05',
        url: publicPath + 'wuyuan/JZ05.jpg'
    },
    {
        id: 'JZ06',
        url: publicPath + 'wuyuan/JZ06.jpg'
    },
    {
        id: 'JZ07',
        url: publicPath + 'wuyuan/JZ07.jpg'
    },
    ]
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
