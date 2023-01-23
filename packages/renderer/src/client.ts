import {validCodecs} from './codec';
import {getDefaultCrfForCodec, getValidCrfRanges} from './crf';
import {getFileExtensionFromCodec} from './get-extension-from-codec';
import {isAudioCodec} from './is-audio-codec';
import {DEFAULT_PIXEL_FORMAT, validPixelFormats} from './pixel-format';
import {proResProfileOptions} from './prores-profile';

export const BrowserSafeApis = {
	getFileExtensionFromCodec,
	validCodecs,
	getDefaultCrfForCodec,
	getValidCrfRanges,
	isAudioCodec,
	proResProfileOptions,
	validPixelFormats,
	DEFAULT_PIXEL_FORMAT,
};