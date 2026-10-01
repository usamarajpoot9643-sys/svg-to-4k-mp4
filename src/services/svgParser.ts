import type { SvgMetadata } from '../types/svg';

/**
 * Validates, analyzes, and inspects an SVG XML string.
 */
export function analyzeSvg(svgString: string): SvgMetadata {
  if (!svgString || !svgString.trim()) {
    return {
      isValid: false,
      error: 'SVG code is empty.',
      hasViewBox: false,
      isAnimated: false,
      hasCssAnimations: false,
      hasSmilAnimations: false,
      animationDurations: [],
      elementCount: 0,
      hasForeignObject: false,
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  // Check for XML parse errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    const errorText = parseError.textContent || 'Malformed SVG XML syntax.';
    // Clean up typical browser parsererror banner
    const cleanError = errorText.split('\n')[0].replace('This page contains the following errors:', '').trim();
    return {
      isValid: false,
      error: cleanError || 'XML syntax error encountered while parsing SVG.',
      hasViewBox: false,
      isAnimated: false,
      hasCssAnimations: false,
      hasSmilAnimations: false,
      animationDurations: [],
      elementCount: 0,
      hasForeignObject: false,
    };
  }

  const svgElement = doc.documentElement;
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return {
      isValid: false,
      error: 'Root element is not an <svg> tag.',
      hasViewBox: false,
      isAnimated: false,
      hasCssAnimations: false,
      hasSmilAnimations: false,
      animationDurations: [],
      elementCount: 0,
      hasForeignObject: false,
    };
  }

  // Check viewBox and dimensions
  const viewBoxAttr = svgElement.getAttribute('viewBox');
  const widthAttr = svgElement.getAttribute('width');
  const heightAttr = svgElement.getAttribute('height');

  const width = widthAttr ? parseFloat(widthAttr) : undefined;
  const height = heightAttr ? parseFloat(heightAttr) : undefined;

  // Detect SMIL animations
  const smilElements = svgElement.querySelectorAll(
    'animate, animateTransform, animateMotion, set, animateColor'
  );
  const hasSmilAnimations = smilElements.length > 0;

  // Detect CSS animations in style tags or elements
  const styleTags = svgElement.querySelectorAll('style');
  let hasCssAnimations = false;
  const animationDurations: number[] = [];

  for (const style of styleTags) {
    const content = style.textContent || '';
    if (/@keyframes|animation\s*:/i.test(content)) {
      hasCssAnimations = true;
      // Extract durations e.g. "3s" or "500ms"
      const matches = content.matchAll(/(\d+(?:\.\d+)?)(s|ms)\b/gi);
      for (const match of matches) {
        const val = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        const durationSec = unit === 'ms' ? val / 1000 : val;
        if (durationSec > 0 && durationSec <= 120) {
          animationDurations.push(durationSec);
        }
      }
    }
  }

  // Also parse SMIL durations
  smilElements.forEach((el) => {
    const dur = el.getAttribute('dur');
    if (dur) {
      const match = dur.match(/^(\d+(?:\.\d+)?)(s|ms)?$/i);
      if (match) {
        const val = parseFloat(match[1]);
        const unit = match[2]?.toLowerCase() || 's';
        const durationSec = unit === 'ms' ? val / 1000 : val;
        if (durationSec > 0 && durationSec <= 120) {
          animationDurations.push(durationSec);
        }
      }
    }
  });

  const isAnimated = hasSmilAnimations || hasCssAnimations;

  // Determine suggested duration based on animation LCM or max duration
  let suggestedDuration: number | undefined;
  if (animationDurations.length > 0) {
    const maxDur = Math.max(...animationDurations);
    suggestedDuration = Math.min(Math.max(Math.ceil(maxDur), 2), 30);
  } else if (isAnimated) {
    suggestedDuration = 5;
  }

  const allElements = svgElement.querySelectorAll('*');
  const foreignObjectElements = svgElement.querySelectorAll('foreignObject');
  const hasForeignObject = foreignObjectElements.length > 0;

  return {
    isValid: true,
    width: !isNaN(width || NaN) ? width : undefined,
    height: !isNaN(height || NaN) ? height : undefined,
    viewBox: viewBoxAttr || undefined,
    hasViewBox: Boolean(viewBoxAttr),
    isAnimated,
    hasCssAnimations,
    hasSmilAnimations,
    animationDurations,
    suggestedDuration,
    elementCount: allElements.length + 1,
    hasForeignObject,
  };
}

/**
 * Normalizes SVG to ensure it scales cleanly to target canvas dimensions (e.g. 3840x2160)
 * without distortion or clipping.
 */
export function normalizeSvgForResolution(
  svgString: string,
  targetWidth: number,
  targetHeight: number
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svg = doc.documentElement;

  if (!svg || svg.nodeName.toLowerCase() !== 'svg') {
    return svgString;
  }

  // Ensure xmlns
  if (!svg.getAttribute('xmlns')) {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  // Check or synthesize viewBox if missing
  const currentViewBox = svg.getAttribute('viewBox');
  if (!currentViewBox) {
    const w = parseFloat(svg.getAttribute('width') || '0');
    const h = parseFloat(svg.getAttribute('height') || '0');
    if (w > 0 && h > 0) {
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    } else {
      // Default square canvas viewBox
      svg.setAttribute('viewBox', `0 0 ${targetWidth} ${targetHeight}`);
    }
  }

  // Set explicit width & height to target resolution to prevent sub-pixel blurring
  svg.setAttribute('width', targetWidth.toString());
  svg.setAttribute('height', targetHeight.toString());

  // Preserve aspect ratio if not specified
  if (!svg.getAttribute('preserveAspectRatio')) {
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }

  return new XMLSerializer().serializeToString(doc);
}
