import { useMemo } from 'react';
import { Hyperspeed as ReactbitsHyperspeed } from '@appletosolutions/reactbits';

import './Hyperspeed.css';

const PRESET_TWO = Object.freeze({
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: 'mountainDistortion',
  length: 400,
  roadWidth: 9,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 50,
  lightPairsPerRoadWay: 50,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [20, 60],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.2, 0.2],
  carFloorSeparation: [0.05, 1],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0x131318,
    brokenLines: 0x131318,
    leftCars: [0xff102a, 0xeb383e, 0xff102a],
    rightCars: [0xf5f5f5, 0xd9d9db, 0xa7a7aa],
    sticks: 0xd9d9db,
  },
});

export default function Hyperspeed({ densityScale = 1, desaturate = false }) {
  const effectOptions = useMemo(() => {
    const density = Math.max(0.45, densityScale);
    const options = {
      ...PRESET_TWO,
      totalSideLightSticks: Math.max(24, Math.round(PRESET_TWO.totalSideLightSticks * density)),
      lightPairsPerRoadWay: Math.max(24, Math.round(PRESET_TWO.lightPairsPerRoadWay * density)),
      movingAwaySpeed: PRESET_TWO.movingAwaySpeed.map((value) => value * (density < 1 ? 0.9 : 1)),
      movingCloserSpeed: PRESET_TWO.movingCloserSpeed.map((value) => value * (density < 1 ? 0.9 : 1)),
      speedUp: density < 1 ? PRESET_TWO.speedUp * 0.85 : PRESET_TWO.speedUp,
      fovSpeedUp: density < 1 ? PRESET_TWO.fovSpeedUp * 0.9 : PRESET_TWO.fovSpeedUp,
      lightStickWidth: [...PRESET_TWO.lightStickWidth],
      lightStickHeight: [...PRESET_TWO.lightStickHeight],
      carLightsLength: [...PRESET_TWO.carLightsLength],
      carLightsRadius: [...PRESET_TWO.carLightsRadius],
      carWidthPercentage: [...PRESET_TWO.carWidthPercentage],
      carShiftX: [...PRESET_TWO.carShiftX],
      carFloorSeparation: [...PRESET_TWO.carFloorSeparation],
      colors: { ...PRESET_TWO.colors },
    };

    if (desaturate) {
      options.colors = {
        roadColor: 0x070707,
        islandColor: 0x050505,
        background: 0x000000,
        shoulderLines: 0xc7c7c9,
        brokenLines: 0xd2d2d4,
        leftCars: [0xd0d0d0, 0xe3e3e3, 0xf5f5f5],
        rightCars: [0xfafafa, 0xe4e4e4, 0xc8c8c8],
        sticks: 0xd0d0d2,
      };
    }

    return options;
  }, [densityScale, desaturate]);

  return (
    <ReactbitsHyperspeed
      className="hyperspeed-wrapper"
      effectOptions={effectOptions}
    />
  );
}
