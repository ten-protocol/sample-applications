export type Particle = {
    x: number;
    y: number;
    angle: number;
    rotationSpeed: number;
    startRadius: number;
    endRadius: number;
    startHeight: number;
    endHeight: number;
    duration: number;
    color: number;
    age?: number;
    ageReset?: boolean;
};
