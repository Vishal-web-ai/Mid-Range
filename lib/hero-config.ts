type RingsConfig = {
  ringCount: number;
  attenuation: number;
  lineThickness: number;
  baseRadius: number;
  radiusStep: number;
  opacity: number;
  rotation: number;
};

type CarouselConfig = {
  RX: number;
  RY: number;
  CARD: number;
  SPEED: number;
};

export type HeroConfig = {
  rings: RingsConfig;
  carousel: CarouselConfig;
};

type Keyframe = HeroConfig & { width: number };

const KEYFRAMES: Keyframe[] = [
  {
    width: 360,
    rings: { ringCount: 6, attenuation: 24, lineThickness: 2, baseRadius: 0.5, radiusStep: 0.08, opacity: 1, rotation: 90 },
    carousel: { RX: 166, RY: 114, CARD: 119, SPEED: 0.045 },
  },
  {
    width: 430,
    rings: { ringCount: 6, attenuation: 24, lineThickness: 2, baseRadius: 0.5, radiusStep: 0.08, opacity: 1, rotation: 90 },
    carousel: { RX: 216, RY: 148, CARD: 155, SPEED: 0.045 },
  },
  {
    width: 768,
    rings: { ringCount: 5, attenuation: 16, lineThickness: 2.5, baseRadius: 0.65, radiusStep: 0.11, opacity: 0.8, rotation: 45 },
    carousel: { RX: 250, RY: 160, CARD: 180, SPEED: 0.045 },
  },
  {
    width: 1024,
    rings: { ringCount: 4, attenuation: 12, lineThickness: 3, baseRadius: 0.8, radiusStep: 0.13, opacity: 0.6, rotation: 22 },
    carousel: { RX: 310, RY: 195, CARD: 215, SPEED: 0.045 },
  },
  {
    width: 1440,
    rings: { ringCount: 4, attenuation: 10, lineThickness: 3, baseRadius: 0.9, radiusStep: 0.15, opacity: 0.5, rotation: 0 },
    carousel: { RX: 400, RY: 250, CARD: 260, SPEED: 0.045 },
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function interpolate(a: Keyframe, b: Keyframe, t: number): HeroConfig {
  return {
    rings: {
      ringCount: Math.round(lerp(a.rings.ringCount, b.rings.ringCount, t)),
      attenuation: lerp(a.rings.attenuation, b.rings.attenuation, t),
      lineThickness: lerp(a.rings.lineThickness, b.rings.lineThickness, t),
      baseRadius: lerp(a.rings.baseRadius, b.rings.baseRadius, t),
      radiusStep: lerp(a.rings.radiusStep, b.rings.radiusStep, t),
      opacity: lerp(a.rings.opacity, b.rings.opacity, t),
      rotation: lerp(a.rings.rotation, b.rings.rotation, t),
    },
    carousel: {
      RX: lerp(a.carousel.RX, b.carousel.RX, t),
      RY: lerp(a.carousel.RY, b.carousel.RY, t),
      CARD: lerp(a.carousel.CARD, b.carousel.CARD, t),
      SPEED: lerp(a.carousel.SPEED, b.carousel.SPEED, t),
    },
  };
}

export function getHeroConfig(width: number): HeroConfig {
  if (width <= KEYFRAMES[0].width) {
    return { rings: { ...KEYFRAMES[0].rings }, carousel: { ...KEYFRAMES[0].carousel } };
  }

  for (let i = 1; i < KEYFRAMES.length; i++) {
    const next = KEYFRAMES[i];
    if (width <= next.width) {
      const prev = KEYFRAMES[i - 1];
      return interpolate(prev, next, (width - prev.width) / (next.width - prev.width));
    }
  }

  const last = KEYFRAMES[KEYFRAMES.length - 1];
  return { rings: { ...last.rings }, carousel: { ...last.carousel } };
}

