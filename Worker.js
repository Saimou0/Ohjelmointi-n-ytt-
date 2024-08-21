self.onmessage = function(e) {
    const {cubes, gridCenter, rotationMatrix} = e.data;

    const rotatedCubes = cubes.map(cube => {
        return {
            ...cube,
            vertices: cube.vertices.map(vertex => {
                const translatedVertex = [
                    vertex.x - gridCenter.x,
                    vertex.y - gridCenter.y,
                    vertex.z - gridCenter.z
                ];

                //! Techincally, there is no need to return more than the rotated vertex

                const rotatedVertex = applyMatrix(translatedVertex, rotationMatrix);

                return [
                    rotatedVertex[0] + gridCenter.x,
                    rotatedVertex[1] + gridCenter.y,
                    rotatedVertex[2] + gridCenter.z
                ];
            })
        };
    });
    self.postMessage(rotatedCubes);

};

function applyMatrix(vertex, matrix) {
    const [x, y, z] = vertex;

    return [
        x * matrix[0][0] + y * matrix[0][1] + z * matrix[0][2],
        x * matrix[1][0] + y * matrix[1][1] + z * matrix[1][2],
        x * matrix[2][0] + y * matrix[2][1] + z * matrix[2][2]
    ];
}