export const calcVertexLines = (points, distance) => {
    const vertexLines = {}
    points.forEach((point, index) => {
        //every 3 points has a vertex, 
        if (index > 1) {
            const p1 = points[index - 2];
            const p2 = points[index - 1];
            const p3 = point;
            const vectorP2P1_x = p1.x - p2.x;
            const vectorP2P1_y = p1.y - p2.y;
            const vectorP2P3_x = p3.x - p2.x;
            const vectorP2P3_y = p3.y - p2.y;

            // Calculate the angles of these vectors relative to the positive x-axis
            const angleP2P1 = Math.atan2(vectorP2P1_y, vectorP2P1_x);
            const angleP2P3 = Math.atan2(vectorP2P3_y, vectorP2P3_x);

            // Calculate the angle bisector
            // This method robustly finds the bisector angle, handling cases where angles cross the -PI/PI boundary.
            let bisectorAngle;
            let angleDifference = angleP2P3 - angleP2P1;

            // Normalize angleDifference to be within [-PI, PI)
            if (angleDifference > Math.PI) {
                angleDifference -= 2 * Math.PI;
            } else if (angleDifference < -Math.PI) {
                angleDifference += 2 * Math.PI;
            }

            bisectorAngle = angleP2P1 + angleDifference / 2;

            // Calculate the end point of the bisector line
            const bisectorEndPointX = p2.x + distance * Math.cos(bisectorAngle);
            const bisectorEndPointY = p2.y + distance * Math.sin(bisectorAngle);
            vertexLines[index] = {
                x1: p2.x,
                y1: p2.y,
                x2: bisectorEndPointX,
                y2: bisectorEndPointY
            };
        }
    });
    return vertexLines;

}