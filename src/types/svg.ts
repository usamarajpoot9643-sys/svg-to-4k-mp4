export interface SvgMetadata {
  isValid: boolean;
  error?: string;
  width?: number;
  height?: number;
  viewBox?: string;
  hasViewBox: boolean;
  isAnimated: boolean;
  hasCssAnimations: boolean;
  hasSmilAnimations: boolean;
  animationDurations: number[];
  suggestedDuration?: number;
  elementCount: number;
}

export interface SvgPreset {
  id: string;
  name: string;
  description: string;
  category: 'cyberpunk' | 'abstract' | 'hud' | 'brand' | 'static';
  recommendedDuration: number;
  recommendedFps: 30 | 60;
  svgCode: string;
}
