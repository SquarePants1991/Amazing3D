export default class HPMath {
    static distance(from: number[], to: number[], distancePow2CB:Function) {
        if (from.length != to.length) {
            return 0;
        }
        var distancePow2 = 0;
        for (let i = 0; i < from.length; ++i) {
            distancePow2 += Math.pow(to[i] - from[i], 2);
        }
        if (distancePow2CB) {
            if (!distancePow2CB(distancePow2)) {
                return 0;
            }
        }
        return Math.sqrt(distancePow2);
    }

    static normalizeApro(vec: number[]) {
        // Get absolute value of each vector
        let ax = Math.abs(vec[0]);
        let ay = Math.abs(vec[1]);

        // Create a ratio
        let ratio = 1 / Math.max(ax, ay);
        ratio = ratio * (1.29289 - (ax + ay) * ratio * 0.29289)

        return [vec[0] * ratio, vec[1] * ratio];
    }
}