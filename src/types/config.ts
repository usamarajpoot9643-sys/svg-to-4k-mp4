export type ResolutionPreset = '4k' | '1440p' | '1080p' | '720p' | 'custom';

export interface ResolutionConfig {
  id: ResolutionPreset;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  recommendedBitrate: number; // in bps
}

export const RESOLUTION_PRESETS: Record<Exclude<ResolutionPreset, 'custom'>, ResolutionConfig> = {
  '4k': {
    id: '4k',
    label: '4K UHD (3840 x 2160)',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    recommendedBitrate: 35_000_000, // 35 Mbps for pristine 4K H.264
  },
  '1440p': {
    id: '1440p',
    label: '1440p QHD (2560 x 1440)',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    recommendedBitrate: 18_000_000,
  },
  '1080p': {
    id: '1080p',
    label: '1080p Full HD (1920 x 1080)',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    recommendedBitrate: 8_000_000,
  },
  '720p': {
    id: '720p',
    label: '720p HD (1280 x 720)',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    recommendedBitrate: 4_000_000,
  },
};

export type FPSOption = 30 | 60;

export type BackgroundType = 'solid' | 'gradient' | 'transparent';

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle: number; // in degrees for linear
  startColor: string;
  endColor: string;
}

export interface BackgroundConfig {
  type: BackgroundType;
  color: string;
  gradient: GradientConfig;
}

export type RenderMode = 'frame-stepping' | 'real-time';

export interface VideoSettings {
  resolutionPreset: ResolutionPreset;
  customWidth: number;
  customHeight: number;
  fps: FPSOption;
  duration: number; // 1 to 60 seconds
  bitrate: number; // in bps
  background: BackgroundConfig;
  renderMode: RenderMode;
}

export type ConversionStage = 
  | 'idle' 
  | 'parsing' 
  | 'rasterizing' 
  | 'encoding' 
  | 'finalizing' 
  | 'done' 
  | 'error' 
  | 'cancelled';

export interface ConversionProgress {
  stage: ConversionStage;
  currentFrame: number;
  totalFrames: number;
  percentage: number;
  fpsRate: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  statusMessage: string;
  error?: string;
}

export interface ExportResult {
  blob: Blob;
  url: string;
  filename: string;
  fileSizeBytes: number;
  width: number;
  height: number;
  duration: number;
  fps: number;
  bitrate: number;
  timestamp: number;
}
