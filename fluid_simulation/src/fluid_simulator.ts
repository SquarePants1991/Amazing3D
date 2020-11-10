import HPMath from './high_perf_math'

class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    lengthPow2() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
    }
}

export class FluidUnit {
    xLoc: number = 0;
    yLoc: number = 0;
    prevXLoc: number = 0;
    prevYLoc: number = 0;
    velocityX: number = 0;
    velocityY: number = 0;
    pressure: number = 0;
    pressureNear: number = 0;
    nearestToNeighbour: number = 0;

    nextXLoc: number = 0;
    nextYLoc: number = 0;
}

export default class FluidSimulator {

    units: FluidUnit[];
    unitHashMap: Object;
    canvasWidth: number;
    canvasHeight: number;

    GRID_COUNT: number = 55;
    INTERACTION_RADIUS: number = 60;
    INTERACTION_RADIUS_POW2: number = 0;
    STIFFNESS: number = 35;
    STIFFNESS_NEAR: number = 120;
    REST_DENSITY: number = 5;
    GRAVITY: number = 55;
    BOUND_RADIUS: number = 0;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.units = [];
        this.unitHashMap = {}
        this.INTERACTION_RADIUS = canvasWidth / this.GRID_COUNT * 3;
        this.INTERACTION_RADIUS_POW2 = Math.pow(this.INTERACTION_RADIUS, 2);
        this.BOUND_RADIUS = canvasWidth / 4;

        for (let i = 0; i < 350; i++) {
            let unit = new FluidUnit();

            unit.xLoc = Math.cos(Math.random() * Math.PI * 2) * this.BOUND_RADIUS * 0.7;
            unit.yLoc = Math.sin(Math.random() * Math.PI * 2) * this.BOUND_RADIUS * 0.7;
            this.units.push(unit);
        }
    }

    step(dt: number) {
        if (dt == 0) {
            return;
        }
        this.updateUnits(dt);
    }

    updateUnits(dt: number) {

        for (let key in this.unitHashMap) {
            this.unitHashMap[key].splice(0, this.unitHashMap[key].length);
        }
        this.unitHashMap = {};

        for (let key in this.units) {
            let unit: FluidUnit = this.units[key];
            unit.prevXLoc = unit.xLoc;
            unit.prevYLoc = unit.yLoc;

            this.applyGlobalForce(unit, dt);

            unit.xLoc += unit.velocityX * dt;
            unit.yLoc += unit.velocityY * dt;

            let cellX = parseInt((unit.xLoc / this.canvasWidth + 0.5) * this.GRID_COUNT + '');
            let cellY = parseInt((unit.yLoc / this.canvasHeight + 0.5) * this.GRID_COUNT + '');
            let hashIdx = cellX * this.GRID_COUNT + cellY;
            if (hashIdx in this.unitHashMap) {
                this.unitHashMap[hashIdx].push(unit);
            } else {
                this.unitHashMap[hashIdx] = [unit];
            }

            unit.nextXLoc = unit.xLoc;
            unit.nextYLoc = unit.yLoc;
        }

        for (let key in this.units) {
            let unit = this.units[key];

            const neighbours: FluidUnit[] = this.getNeighboursWithGradients(unit);
            this.updateDensities(unit, neighbours);
        
            // perform double density relaxation
            this.relax(unit, neighbours, dt);
        
        }

        for (let key in this.units) {
            let unit = this.units[key];
            unit.xLoc = unit.nextXLoc;
            unit.yLoc = unit.nextYLoc;
            this.contain(unit, dt);
            this.updateVelocity(unit, dt);
        }
    }

    applyGlobalForce(unit: FluidUnit, dt: number) {
        let gravityX:number = 0;
        let gravityY:number = this.GRAVITY;
        unit.velocityX += gravityX * dt;
        unit.velocityY += gravityY * dt;
    }

    getNeighboursWithGradients(unit: FluidUnit): FluidUnit[] {
        let neighbours = [];

        let cellX = parseInt((unit.xLoc / this.canvasWidth + 0.5) * this.GRID_COUNT + '');
        let cellY = parseInt((unit.yLoc / this.canvasHeight + 0.5) * this.GRID_COUNT + '');

        let findRadius = parseInt((this.INTERACTION_RADIUS / this.canvasWidth + 0.5) * this.GRID_COUNT + '');
        for (let x = cellX - findRadius; x < cellX + findRadius; ++x) {
            for (let y = cellY - findRadius; y < cellY + findRadius; ++y) {
                let limitedX = Math.min(this.GRID_COUNT - 1, x);
                let limitedY = Math.min(this.GRID_COUNT - 1, y);
                let index = limitedX * this.GRID_COUNT + limitedY;
                if (index in this.unitHashMap) {
                    for (let unitIdx in this.unitHashMap[index]) {
                        let neighbourUnit: FluidUnit = this.unitHashMap[index][unitIdx];
                        if (neighbourUnit != unit) {
                            let nearestToNeighbour = this.gradients(unit, neighbourUnit);
                            if (nearestToNeighbour > 0) {
                                neighbourUnit.nearestToNeighbour = nearestToNeighbour;
                                neighbours.push(neighbourUnit);
                            }
                        }
                    }
                }
            }
        }
        return neighbours;
    }

    gradients(from: FluidUnit, to: FluidUnit) {
        var retVal = 0;
        var shouldReturn = false;
    
        let distance = HPMath.distance([to.xLoc, to.yLoc], [from.xLoc, from.yLoc], (pow2) => {
            if (pow2 > this.INTERACTION_RADIUS_POW2) {
                shouldReturn = true;
                retVal = 0;
                return false;
            }
            return true;
        });

        if (shouldReturn) {
            return retVal;
        }
        return 1 - distance / this.INTERACTION_RADIUS;
    }

    updateDensities(unit: FluidUnit, neighbours: FluidUnit[]) {
        let density = 0;
        let nearDensity = 0;
        
        for (let key in neighbours) {
            let neighbourUnit = neighbours[key];
            density += Math.pow(neighbourUnit.nearestToNeighbour, 2);
            nearDensity += Math.pow(neighbourUnit.nearestToNeighbour, 3);
        }

        unit.pressure = this.STIFFNESS * (density - this.REST_DENSITY);
        unit.pressureNear = this.STIFFNESS_NEAR * nearDensity;
    }

    relax(unit: FluidUnit, neighbours: FluidUnit[], dt: number) {
        for (let key in neighbours) {
            let nUnit = neighbours[key];
            let pressure = unit.pressure * nUnit.nearestToNeighbour + unit.pressureNear * Math.pow(nUnit.nearestToNeighbour, 2);
            let forceDir = [
                nUnit.xLoc - unit.xLoc,
                nUnit.yLoc - unit.yLoc
            ];
            let force =HPMath.normalizeApro(forceDir);
            force[0] *= pressure;
            force[1] *= pressure;
            let disDeltaX = force[0] * dt * dt;
            let disDeltaY = force[1] * dt * dt; 
            unit.nextXLoc = unit.nextXLoc + disDeltaX * -0.5;
            unit.nextYLoc = unit.nextYLoc + disDeltaY * -0.5;
            // nUnit.xLoc += disDeltaX * 0.5;
            // nUnit.yLoc += disDeltaY * 0.5;
            // nUnit.nextXLoc = nUnit.nextXLoc + disDeltaX * 0.5;
            // nUnit.nextYLoc = nUnit.nextYLoc + disDeltaY * 0.5;

        }
    }

    contain(unit: FluidUnit, dt: number) {
        let escapeEdgeOffset = this.INTERACTION_RADIUS * dt;

        let unitToCenterVec = new Vector3(unit.xLoc, unit.yLoc, 0);
        let lenPow2 = unitToCenterVec.lengthPow2();
        let normVec = HPMath.normalizeApro([unitToCenterVec.x, unitToCenterVec.y]);
        if (lenPow2 > this.BOUND_RADIUS && Math.sqrt(lenPow2) > this.BOUND_RADIUS) {
            unit.xLoc = normVec[0] * this.BOUND_RADIUS;
            unit.yLoc = normVec[1] * this.BOUND_RADIUS;

            unit.prevXLoc = normVec[0] * escapeEdgeOffset + unit.xLoc;
            unit.prevYLoc = normVec[1] * escapeEdgeOffset + unit.yLoc;
        }
    }

    updateVelocity(unit: FluidUnit, dt: number) {
        unit.velocityX = (unit.xLoc - unit.prevXLoc) / dt;
        unit.velocityY = (unit.yLoc - unit.prevYLoc) / dt;
    }
}