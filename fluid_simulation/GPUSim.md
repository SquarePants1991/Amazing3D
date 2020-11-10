FluidUnit Vertex {
    xLoc, yLoc: number = 0; 5000, 5000
    index: number = 0
    velocityX: number = 0;
    velocityY: number = 0;
}

Force =》 uniform

FluidUnit[]

// Hash Map, 如何将二维的距离用一维的数组排序表现
canvas size  FBO {
    Vertex Shader => Force Apply, Veolocity Apply, position change
}

FluidUnit[]
Canvas Size FBO 01 / 检索neighbour

1 x particle size  FBO {
    Vertex Shader => checkout neighbour，calc pressure，update location, check bounds， update velocity

    > canvas size image, 每个像素包含粒子新的位置信息, 按照索引排序，每个像素携带新的位置信息，保持和FluidUnit[] vertex buffer一样的格式
    根据index决定使用的像素位置，写入velocity，new loc
}

FluidUnit[]
shader渲染