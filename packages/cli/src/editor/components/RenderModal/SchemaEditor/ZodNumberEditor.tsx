import React, {useCallback} from 'react';
import type {z} from 'zod';
import {Spacing} from '../../layout';
import {InputDragger} from '../../NewComposition/InputDragger';
import {ValidationMessage} from '../../NewComposition/ValidationMessage';
import {narrowOption, optionRow} from '../layout';
import {useLocalState} from './local-state';
import {SchemaLabel} from './SchemaLabel';
import type {JSONPath} from './zod-types';
import type {UpdaterFunction} from './ZodSwitch';

const fullWidth: React.CSSProperties = {
	width: '100%',
};

const getMinValue = (schema: z.ZodTypeAny) => {
	const minCheck = (schema as z.ZodNumber)._def.checks.find(
		(c) => c.kind === 'min'
	);
	if (!minCheck) {
		return -Infinity;
	}

	if (minCheck.kind !== 'min') {
		throw new Error('Expected min check');
	}

	if (!minCheck.inclusive) {
		return -Infinity;
	}

	return minCheck.value;
};

const getMaxValue = (schema: z.ZodTypeAny) => {
	const maxCheck = (schema as z.ZodNumber)._def.checks.find(
		(c) => c.kind === 'max'
	);
	if (!maxCheck) {
		return Infinity;
	}

	if (maxCheck.kind !== 'max') {
		throw new Error('Expected max check');
	}

	if (!maxCheck.inclusive) {
		return Infinity;
	}

	return maxCheck.value;
};

const getStep = (schema: z.ZodTypeAny): number | undefined => {
	const multipleStep = (schema as z.ZodNumber)._def.checks.find(
		(c) => c.kind === 'multipleOf'
	);

	if (!multipleStep) {
		return undefined;
	}

	if (multipleStep.kind !== 'multipleOf') {
		throw new Error('Expected multipleOf check');
	}

	return multipleStep.value;
};

export const ZodNumberEditor: React.FC<{
	schema: z.ZodTypeAny;
	jsonPath: JSONPath;
	value: number;
	setValue: UpdaterFunction<number>;
	compact: boolean;
	defaultValue: number;
	onSave: UpdaterFunction<number>;
	onRemove: null | (() => void);
	showSaveButton: boolean;
	saving: boolean;
	saveDisabledByParent: boolean;
}> = ({
	jsonPath,
	value,
	schema,
	setValue,
	onSave,
	compact,
	defaultValue,
	onRemove,
	showSaveButton,
	saving,
	saveDisabledByParent,
}) => {
	const {localValue, onChange: setLocalValue} = useLocalState({
		value,
		schema,
		setValue,
	});

	const onNumberChange = useCallback(
		(newValue: number) => {
			setLocalValue(() => newValue, false);
		},
		[setLocalValue]
	);

	const isDefault = value === defaultValue;

	const reset = useCallback(() => {
		setLocalValue(() => defaultValue, true);
	}, [defaultValue, setLocalValue]);

	const onTextChange = useCallback(
		(newValue: string) => {
			setLocalValue(() => Number(newValue), false);
		},
		[setLocalValue]
	);

	const save = useCallback(() => {
		onSave(() => value, false);
	}, [onSave, value]);

	return (
		<div style={compact ? narrowOption : optionRow}>
			<SchemaLabel
				isDefaultValue={isDefault}
				jsonPath={jsonPath}
				onReset={reset}
				onSave={save}
				showSaveButton={showSaveButton}
				compact={compact}
				onRemove={onRemove}
				saving={saving}
				valid={localValue.zodValidation.success}
				saveDisabledByParent={saveDisabledByParent}
			/>
			<div style={fullWidth}>
				<InputDragger
					type={'number'}
					value={localValue.value}
					style={fullWidth}
					status={localValue.zodValidation.success ? 'ok' : 'error'}
					placeholder={jsonPath.join('.')}
					onTextChange={onTextChange}
					onValueChange={onNumberChange}
					min={getMinValue(schema)}
					max={getMaxValue(schema)}
					step={getStep(schema)}
					rightAlign={false}
				/>
				{!localValue.zodValidation.success && (
					<>
						<Spacing y={1} block />
						<ValidationMessage
							align="flex-start"
							message={localValue.zodValidation.error.format()._errors[0]}
							type="error"
						/>
					</>
				)}
			</div>
		</div>
	);
};