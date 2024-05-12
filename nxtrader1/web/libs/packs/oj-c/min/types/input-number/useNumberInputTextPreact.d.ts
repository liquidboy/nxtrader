import { ComponentProps } from 'preact';
import { ValueUpdateDetail } from '@oracle/oraclejet-preact/utils/UNSAFE_valueUpdateDetail';
import type { InputNumber } from 'oj-c/input-number';
type InputNumberProps = ComponentProps<typeof InputNumber>;
import { StepEvent } from '@oracle/oraclejet-preact/UNSAFE_NumberInputText/useSteppers';
export declare function useNumberInputTextPreact({ autocomplete, autofocus, converter: propConverter, disabled, displayOptions, inputPrefix, inputSuffix, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, numberRangeExactMessageDetail, numberRangeOverflowMessageDetail, numberRangeUnderflowMessageDetail, placeholder, readonly, required, requiredMessageDetail, step, stepperVariant, textAlign, userAssistanceDensity, validators, value: propValue, virtualKeyboard, onMessagesCustomChanged, onRawValueChanged, onTransientValueChanged, onValidChanged, onValueChanged, ...otherProps }: InputNumberProps, addBusyState?: (desc?: string) => () => void): {
    value: number | null;
    setValue: import("preact/hooks").StateUpdater<number | null>;
    methods: {
        reset: () => void;
        validate: () => Promise<"valid" | "invalid">;
        showMessages: () => void;
    };
    inputNumberProps: Omit<{
        isStepDownDisabled?: boolean | undefined;
        isStepUpDisabled?: boolean | undefined;
        onSpin?: ((event: StepEvent) => void) | undefined;
        onSpinComplete?: (() => void) | undefined;
        onStep?: ((event: StepEvent) => void) | undefined;
    } & Pick<import("@oracle/oraclejet-preact/hooks/UNSAFE_useSpinning").StepProps & {
        hasSteppers?: boolean | undefined;
        stepperVariant?: "directional" | "quantitative" | undefined;
        inputRef: import("preact/hooks").Ref<HTMLInputElement>;
    }, "stepperVariant" | "hasSteppers"> & {
        'aria-describedby'?: string | undefined;
        'aria-valuemax'?: number | undefined;
        'aria-valuemin'?: number | undefined;
        'aria-valuenow'?: number | undefined;
        'aria-valuetext'?: string | undefined;
        assistiveText?: string | undefined;
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        helpSourceLink?: string | undefined;
        helpSourceText?: string | undefined;
        isDisabled?: boolean | undefined;
        isReadonly?: boolean | undefined;
        isRequired?: boolean | undefined;
        isRequiredShown?: boolean | undefined;
        label: string;
        labelEdge?: "start" | "none" | "top" | "inside" | undefined;
        labelStartWidth?: import("@oracle/oraclejet-preact/utils/UNSAFE_size").Size | undefined;
        messages?: import("@oracle/oraclejet-preact/UNSAFE_ComponentMessage").ComponentMessageItem[] | undefined;
        placeholder?: string | undefined;
        prefix?: string | undefined;
        suffix?: string | undefined;
        textAlign?: "start" | "right" | "end" | undefined;
        userAssistanceDensity?: import("@oracle/oraclejet-preact/UNSAFE_UserAssistance").UserAssistanceDensityType | undefined;
        value?: string | undefined;
        variant?: "default" | "embedded" | undefined;
        virtualKeyboard?: "number" | "text" | "auto" | undefined;
        onCommit?: ((detail: ValueUpdateDetail<string>) => void) | undefined;
        onInput: ((detail: ValueUpdateDetail<string>) => void) | undefined;
    }, "ref"> & {
        ref?: import("preact").Ref<import("@oracle/oraclejet-preact/hooks/UNSAFE_useFocusableTextField").FocusableHandle> | undefined;
    };
};
export {};
