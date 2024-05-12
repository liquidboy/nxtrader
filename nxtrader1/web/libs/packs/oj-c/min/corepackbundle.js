
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/highlight-text/highlight-text',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_HighlightText", "css!oj-c/highlight-text/highlight-text-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_HighlightText_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HighlightText = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.HighlightText = (0, ojvcomponent_1.registerCustomElement)('oj-c-highlight-text', ({ matchText, text }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_HighlightText_1.HighlightText, { matchText: matchText, children: text }) }));
    }, "HighlightText", { "properties": { "matchText": { "type": "string" }, "text": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/highlight-text',["require", "exports", "./highlight-text/highlight-text"], function (require, exports, highlight_text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HighlightText = void 0;
    Object.defineProperty(exports, "HighlightText", { enumerable: true, get: function () { return highlight_text_1.HighlightText; } });
});

define('oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText',["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useAssistiveText = void 0;
    function determineAssistiveText(help, validatorHint, helpHints, converterHint, displayOptions, userAssistanceDensity) {
        const helpHintsDef = userAssistanceDensity !== 'compact' ? helpHints?.definition : undefined;
        return (help?.instruction ||
            (displayOptions?.validatorHint === 'none' ? undefined : validatorHint) ||
            helpHintsDef ||
            (displayOptions?.converterHint === 'none' ? undefined : converterHint));
    }
    function determineSyncValidatorHints(validators) {
        if (!validators.length) {
            return undefined;
        }
        const syncHints = validators
            .map((validator) => typeof validator.getHint === 'function'
            ? validator.getHint()
            : undefined)
            .filter(Boolean);
        return syncHints.join('\n');
    }
    function useAssistiveText({ addBusyState, converter, displayOptions, help, helpHints, userAssistanceDensity, validators }) {
        const [validatorHint, setValidatorHint] = (0, hooks_1.useState)(!validators || !validators.length ? undefined : determineSyncValidatorHints(validators));
        const staleIdentity = (0, hooks_1.useRef)();
        (0, hooks_1.useEffect)(() => {
            if (!validators || !validators.length) {
                setValidatorHint(undefined);
                return;
            }
            setValidatorHint(determineSyncValidatorHints(validators));
            const asyncHints = validators
                .map((validator) => validator.hint)
                .filter(Boolean);
            const localStaleIdentity = (staleIdentity.current = Symbol());
            const resolver = addBusyState?.('resolving the async validator hints');
            Promise.allSettled(asyncHints).then((hints) => {
                setValidatorHint((currentHints) => {
                    const treatedHints = hints
                        .map((result) => (result.status === 'fulfilled' ? result.value : undefined))
                        .filter(Boolean);
                    if (localStaleIdentity !== staleIdentity.current || !treatedHints.length) {
                        return currentHints;
                    }
                    return [currentHints, ...treatedHints].join('\n');
                });
                resolver?.();
            });
        }, [validators]);
        const helpSourceText = userAssistanceDensity !== 'compact'
            ? helpHints?.sourceText
            : helpHints?.definition || helpHints?.sourceText;
        return {
            assistiveText: determineAssistiveText(help, validatorHint, helpHints, converter?.getHint?.() ?? undefined, displayOptions, userAssistanceDensity),
            helpSourceLink: helpHints?.source,
            helpSourceText
        };
    }
    exports.useAssistiveText = useAssistiveText;
});

define('oj-c/editable-value/utils/utils',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isShallowEqual = exports.normalizeValue = exports.treatNull = exports.createMessageFromError = void 0;
    function createMessageFromError(error) {
        if (typeof error.getMessage === 'function') {
            return {
                severity: 'error',
                detail: error.getMessage().detail
            };
        }
        return { severity: 'error', detail: error.message };
    }
    exports.createMessageFromError = createMessageFromError;
    function treatNull(value, defaultValue) {
        if (value === null) {
            return defaultValue;
        }
        return value;
    }
    exports.treatNull = treatNull;
    function normalizeValue(value) {
        if (typeof value === 'string' && value === '') {
            return null;
        }
        return value;
    }
    exports.normalizeValue = normalizeValue;
    const isShallowEqual = (a, b) => a === b || (a.length === b.length && a.every((v, i) => v === b[i]));
    exports.isShallowEqual = isShallowEqual;
});

define('oj-c/editable-value/UNSAFE_useComponentMessaging/useComponentMessaging',["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useUncontrolledState", "preact/hooks", "../utils/utils"], function (require, exports, UNSAFE_useUncontrolledState_1, hooks_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useComponentMessaging = void 0;
    function useComponentMessaging({ messagesCustom: messagesCustomProp = [], onMessagesCustomChanged }) {
        const [messagesCustom, setMessagesCustom] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(messagesCustomProp, onMessagesCustomChanged);
        const [componentMessages, setComponentMessages] = (0, hooks_1.useState)([]);
        const [deferredComponentMessages, setDeferredComponentMessages] = (0, hooks_1.useState)([]);
        const prevMessagesCustomPropRef = (0, hooks_1.useRef)(messagesCustomProp);
        const addComponentMessage = (0, hooks_1.useCallback)((...messages) => {
            setComponentMessages((prevMessages) => [...prevMessages, ...messages]);
        }, []);
        const addDeferredComponentMessage = (0, hooks_1.useCallback)((message) => {
            setComponentMessages((prevMessages) => [...prevMessages, message]);
        }, []);
        const clearAllComponentMessages = (0, hooks_1.useCallback)(() => {
            setComponentMessages([]);
            setDeferredComponentMessages([]);
        }, []);
        const clearDeferredComponentMessages = (0, hooks_1.useCallback)(() => {
            setDeferredComponentMessages([]);
        }, []);
        const clearAllMessages = (0, hooks_1.useCallback)(() => {
            setComponentMessages([]);
            setDeferredComponentMessages([]);
            setMessagesCustom([]);
        }, []);
        const hasCustomErrorMessages = (0, hooks_1.useCallback)(() => {
            return messagesCustom.some((message) => message.severity === 'error');
        }, [messagesCustom]);
        const hasNoErrorMessages = (0, hooks_1.useCallback)(() => {
            return (componentMessages.length === 0 &&
                deferredComponentMessages.length === 0 &&
                hasCustomErrorMessages() === false);
        }, [componentMessages, deferredComponentMessages, hasCustomErrorMessages]);
        const hasHiddenMessages = (0, hooks_1.useCallback)(() => {
            return deferredComponentMessages.length !== 0;
        }, [deferredComponentMessages]);
        const showHiddenMessages = (0, hooks_1.useCallback)(() => {
            setComponentMessages((prevMessages) => [...prevMessages, ...deferredComponentMessages]);
            setDeferredComponentMessages([]);
        }, [deferredComponentMessages]);
        (0, hooks_1.useEffect)(() => {
            if (prevMessagesCustomPropRef.current === messagesCustomProp) {
                return;
            }
            prevMessagesCustomPropRef.current = messagesCustomProp;
            if ((0, utils_1.isShallowEqual)(messagesCustom, messagesCustomProp)) {
                return;
            }
            setMessagesCustom(messagesCustomProp);
        }, [messagesCustom, messagesCustomProp]);
        return (0, hooks_1.useMemo)(() => ({
            componentMessages,
            deferredComponentMessages,
            messagesCustom,
            visibleMessages: [...messagesCustom, ...componentMessages],
            addComponentMessage,
            addDeferredComponentMessage,
            clearAllComponentMessages,
            clearAllMessages,
            clearDeferredComponentMessages,
            hasCustomErrorMessages,
            hasHiddenMessages,
            hasNoErrorMessages,
            setComponentMessages,
            setDeferredComponentMessages,
            showHiddenMessages
        }), [
            componentMessages,
            deferredComponentMessages,
            messagesCustom,
            hasCustomErrorMessages,
            hasHiddenMessages,
            hasNoErrorMessages,
            showHiddenMessages
        ]);
    }
    exports.useComponentMessaging = useComponentMessaging;
});

define('oj-c/editable-value/UNSAFE_useConverter/useConverter',["require", "exports", "ojs/ojconverter-nativenumber", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "../utils/utils"], function (require, exports, ojconverter_nativenumber_1, hooks_1, UNSAFE_useTranslationBundle_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useConverter = exports.ConverterErrorSymbol = void 0;
    exports.ConverterErrorSymbol = Symbol('ConverterError');
    function shouldSkipParse(value) {
        return value === '' || value === null;
    }
    function shouldSkipFormat(value) {
        return value === null;
    }
    function useConverter({ componentMessagingState, validationState, converter }) {
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const converterParseError = translations.inputNumber_converterParseError();
        const parse = (0, hooks_1.useCallback)((displayValue) => {
            if (!converter || shouldSkipParse(displayValue)) {
                return displayValue;
            }
            try {
                return converter.parse(displayValue);
            }
            catch (error) {
                const errorMsg = error?.cause === ojconverter_nativenumber_1.USER_INPUT_ERROR
                    ? {
                        severity: 'error',
                        detail: converterParseError
                    }
                    : (0, utils_1.createMessageFromError)(error);
                componentMessagingState.setComponentMessages([errorMsg]);
                validationState.setValid('invalidShown');
                return exports.ConverterErrorSymbol;
            }
        }, [converter, componentMessagingState, validationState]);
        const format = (0, hooks_1.useCallback)((value, shouldSuppressError = false) => {
            if (!converter || shouldSkipFormat(value)) {
                return (0, utils_1.treatNull)(value, '') ?? '';
            }
            try {
                return converter.format(value);
            }
            catch (error) {
                if (!shouldSuppressError) {
                    componentMessagingState.setComponentMessages([(0, utils_1.createMessageFromError)(error)]);
                    validationState.setValid('invalidShown');
                }
                return (0, utils_1.treatNull)(value, '');
            }
        }, [converter, componentMessagingState, validationState]);
        return (0, hooks_1.useMemo)(() => ({
            format,
            parse
        }), [format, parse]);
    }
    exports.useConverter = useConverter;
});

define('oj-c/editable-value/UNSAFE_useConverterLifecycle/useConverterLifecycle',["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useConverterLifecycle = void 0;
    function useConverterLifecycle({ converter, validationState, refreshDisplayValue, runFullValidationAndUpdateValue }) {
        const prevConverterRef = (0, hooks_1.useRef)(converter);
        (0, hooks_1.useEffect)(() => {
            if (prevConverterRef.current === converter) {
                return;
            }
            prevConverterRef.current = converter;
            const { valid } = validationState;
            switch (valid) {
                case 'invalidShown':
                    runFullValidationAndUpdateValue();
                    break;
                case 'valid':
                case 'invalidHidden':
                default:
                    refreshDisplayValue();
                    break;
            }
        }, [converter, validationState, refreshDisplayValue, runFullValidationAndUpdateValue]);
    }
    exports.useConverterLifecycle = useConverterLifecycle;
});

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/editable-value/UNSAFE_useDeferredValidators/useDeferredValidators',["require", "exports", "ojs/ojvalidator-required", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle"], function (require, exports, ojvalidator_required_1, hooks_1, UNSAFE_useTranslationBundle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDeferredValidators = void 0;
    ojvalidator_required_1 = __importDefault(ojvalidator_required_1);
    function useDeferredValidators({ labelHint, required, requiredMessageDetail: propRequiredMessageDetail }) {
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const requiredMessageDetail = propRequiredMessageDetail || translations.formControl_requiredMessageDetail();
        const requiredValidator = (0, hooks_1.useMemo)(() => {
            if (required) {
                return new ojvalidator_required_1.default({
                    label: labelHint,
                    messageDetail: requiredMessageDetail
                });
            }
            return null;
        }, [required]);
        return (0, hooks_1.useMemo)(() => [requiredValidator].filter(Boolean), [requiredValidator]);
    }
    exports.useDeferredValidators = useDeferredValidators;
});

define('oj-c/editable-value/UNSAFE_useStaleIdentity/useStaleIdentity',["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useStaleIdentity = void 0;
    function useStaleIdentity() {
        const staleIdentityMap = (0, hooks_1.useRef)(new Map());
        const setStaleIdentity = (0, hooks_1.useCallback)((id) => {
            const localStaleIdentity = Symbol();
            staleIdentityMap.current.set(id, localStaleIdentity);
            return {
                isStale: () => localStaleIdentity !== staleIdentityMap.current.get(id)
            };
        }, []);
        return { setStaleIdentity };
    }
    exports.useStaleIdentity = useStaleIdentity;
});

define('oj-c/editable-value/UNSAFE_useValidators/useValidators',["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useUncontrolledState", "preact/hooks", "../UNSAFE_useStaleIdentity/useStaleIdentity", "../utils/utils"], function (require, exports, UNSAFE_useUncontrolledState_1, hooks_1, useStaleIdentity_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useValidators = exports.ValidationResult = void 0;
    exports.ValidationResult = {
        VALID: 'VALID',
        INVALID: 'INVALID',
        STALE: 'STALE'
    };
    function useValidators({ componentMessagingState, defaultValidState, deferredValidators = [], validators = [], addBusyState, onValidChanged }) {
        const [valid, setValid] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(defaultValidState, onValidChanged);
        const { setStaleIdentity } = (0, useStaleIdentity_1.useStaleIdentity)();
        (0, hooks_1.useLayoutEffect)(() => {
            if (defaultValidState !== undefined) {
                onValidChanged?.(defaultValidState);
            }
        }, []);
        const fullValidate = (0, hooks_1.useCallback)(async (value, options = {}) => {
            const { addComponentMessage, clearAllComponentMessages, clearAllMessages, hasCustomErrorMessages, setComponentMessages } = componentMessagingState;
            const { doNotClearMessagesCustom = false } = options;
            const hadCustomErrorMessages = hasCustomErrorMessages();
            setValid('pending');
            if (doNotClearMessagesCustom) {
                clearAllComponentMessages();
            }
            else {
                clearAllMessages();
            }
            if (validators.length === 0 && deferredValidators.length === 0) {
                if (hadCustomErrorMessages && doNotClearMessagesCustom) {
                    setValid('invalidShown');
                }
                else {
                    setValid('valid');
                }
                return true;
            }
            function nonDeferredValidate(validator, value) {
                try {
                    const validateResult = validator.validate(value);
                    if (validateResult instanceof Promise) {
                        return validateResult.then(() => { }, (error) => (0, utils_1.createMessageFromError)(error));
                    }
                }
                catch (error) {
                    return (0, utils_1.createMessageFromError)(error);
                }
                return;
            }
            const errors = [];
            const maybeErrorsPromise = [];
            const deferredErrors = deferredValidate(value);
            if (deferredErrors !== undefined) {
                errors.push(...deferredErrors);
            }
            if (value !== null) {
                for (const validator of validators) {
                    const maybeComponentMessageItem = nonDeferredValidate(validator, value);
                    if (maybeComponentMessageItem !== undefined) {
                        if (maybeComponentMessageItem instanceof Promise) {
                            maybeErrorsPromise.push(maybeComponentMessageItem);
                        }
                        else {
                            errors.push(maybeComponentMessageItem);
                        }
                    }
                }
            }
            if (!errors.length && !maybeErrorsPromise.length) {
                if (hadCustomErrorMessages && doNotClearMessagesCustom) {
                    setValid('invalidShown');
                }
                else {
                    setValid('valid');
                }
                return true;
            }
            const hasSyncError = errors.length !== 0;
            if (hasSyncError) {
                setComponentMessages(errors);
                setValid('invalidShown');
            }
            if (!maybeErrorsPromise.length) {
                return !hasSyncError;
            }
            const resolver = addBusyState?.('running validation');
            const { isStale } = setStaleIdentity('useValidators-validate');
            let hasAsyncError = false;
            for (const asyncValidationResult of maybeErrorsPromise) {
                const maybeValidationError = await asyncValidationResult;
                if (maybeValidationError && !isStale()) {
                    addComponentMessage(maybeValidationError);
                    setValid('invalidShown');
                    hasAsyncError = true;
                }
            }
            if (!hasSyncError && !hasAsyncError && !isStale()) {
                if (hadCustomErrorMessages && doNotClearMessagesCustom) {
                    setValid('invalidShown');
                }
                else {
                    setValid('valid');
                }
            }
            resolver?.();
            return !hasSyncError && !hasAsyncError;
        }, [componentMessagingState, deferredValidators, validators]);
        const deferredValidate = (0, hooks_1.useCallback)((value) => {
            const errors = [];
            for (const validator of deferredValidators) {
                try {
                    validator.validate(value);
                }
                catch (error) {
                    errors.push((0, utils_1.createMessageFromError)(error));
                }
            }
            if (errors.length) {
                return errors;
            }
            return undefined;
        }, [deferredValidators]);
        const validateValueOnInternalChange = (0, hooks_1.useCallback)(async (value, options = {}) => {
            const { isStale } = setStaleIdentity('useValidationLifeCycle-validateValueOnInternalChange');
            const resolver = addBusyState?.('running validateValueOnInternalChange');
            const validationResult = await fullValidate(value, options);
            resolver?.();
            if (isStale()) {
                return exports.ValidationResult.STALE;
            }
            return validationResult ? exports.ValidationResult.VALID : exports.ValidationResult.INVALID;
        }, [addBusyState, fullValidate]);
        const validateValueOnExternalChange = (0, hooks_1.useCallback)((value) => {
            const { clearAllMessages, setDeferredComponentMessages } = componentMessagingState;
            clearAllMessages();
            const maybeErrors = deferredValidate(value);
            if (maybeErrors) {
                setDeferredComponentMessages(maybeErrors);
                setValid('invalidHidden');
            }
            else {
                setValid('valid');
            }
            return exports.ValidationResult.VALID;
        }, [componentMessagingState, deferredValidate]);
        return (0, hooks_1.useMemo)(() => ({
            valid,
            setValid,
            deferredValidate,
            fullValidate,
            validateValueOnExternalChange,
            validateValueOnInternalChange
        }), [
            valid,
            deferredValidate,
            fullValidate,
            validateValueOnExternalChange,
            validateValueOnInternalChange
        ]);
    }
    exports.useValidators = useValidators;
});

define('oj-c/editable-value/UNSAFE_useValidationLifecycle/useValidationLifecycle',["require", "exports", "preact/hooks", "../UNSAFE_useConverter/useConverter", "../UNSAFE_useValidators/useValidators", "../utils/utils"], function (require, exports, hooks_1, useConverter_1, useValidators_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useValidationLifecycle = void 0;
    function useValidationLifecycle({ componentMessagingState, disabled, deferredValidators, readonly, validationState, validators, getValueForValidation, setValueAfterValidation }) {
        const prevDeferredValidatorsRef = (0, hooks_1.useRef)(deferredValidators);
        const prevValidatorsRef = (0, hooks_1.useRef)(validators);
        const prevMessagesCustomRef = (0, hooks_1.useRef)(componentMessagingState.messagesCustom);
        const prevReadonlyRef = (0, hooks_1.useRef)(readonly);
        const prevDisabledRef = (0, hooks_1.useRef)(disabled);
        const isFirstRender = (0, hooks_1.useRef)(true);
        const runFullValidationAndUpdateValue = (0, hooks_1.useCallback)(async () => {
            if (readonly || disabled)
                return;
            const { valid, validateValueOnInternalChange } = validationState;
            const value = getValueForValidation(valid);
            if (value === useConverter_1.ConverterErrorSymbol) {
                return;
            }
            const validationResult = await validateValueOnInternalChange(value, {
                doNotClearMessagesCustom: true
            });
            if (validationResult === useValidators_1.ValidationResult.VALID) {
                setValueAfterValidation(value);
            }
        }, [disabled, readonly, validationState, getValueForValidation, setValueAfterValidation]);
        (0, hooks_1.useEffect)(() => {
            if (!isFirstRender.current)
                return;
            isFirstRender.current = false;
            if (readonly || disabled) {
                return;
            }
            const value = getValueForValidation('valid');
            if (value === useConverter_1.ConverterErrorSymbol) {
                return;
            }
            const { deferredValidate, setValid } = validationState;
            const { hasCustomErrorMessages, setDeferredComponentMessages } = componentMessagingState;
            const maybeErrors = deferredValidate(value);
            if (maybeErrors) {
                setDeferredComponentMessages(maybeErrors);
                setValid('invalidHidden');
            }
            if (hasCustomErrorMessages()) {
                setValid('invalidShown');
            }
        }, [disabled, readonly]);
        (0, hooks_1.useEffect)(() => {
            const isRequiredToggledToFalse = prevDeferredValidatorsRef.current !== deferredValidators && deferredValidators.length === 0;
            if (prevDeferredValidatorsRef.current === deferredValidators &&
                prevReadonlyRef.current === readonly &&
                prevDisabledRef.current === disabled) {
                return;
            }
            else {
                prevReadonlyRef.current = readonly;
                prevDisabledRef.current = disabled;
                prevDeferredValidatorsRef.current = deferredValidators;
            }
            const runValidation = isRequiredToggledToFalse || (!readonly && !disabled);
            if (!runValidation) {
                return;
            }
            const { valid, deferredValidate, setValid } = validationState;
            const { clearDeferredComponentMessages, setDeferredComponentMessages } = componentMessagingState;
            switch (valid) {
                case 'valid':
                    const value = getValueForValidation(valid);
                    if (value !== useConverter_1.ConverterErrorSymbol) {
                        const maybeErrors = deferredValidate(value);
                        if (maybeErrors) {
                            setDeferredComponentMessages(maybeErrors);
                            setValid('invalidHidden');
                        }
                    }
                    break;
                case 'invalidHidden':
                    if (deferredValidators.length === 0) {
                        setValid('valid');
                        clearDeferredComponentMessages();
                    }
                    break;
                case 'invalidShown':
                    runFullValidationAndUpdateValue();
                    break;
            }
        }, [
            disabled,
            readonly,
            deferredValidators,
            componentMessagingState,
            validationState,
            getValueForValidation,
            runFullValidationAndUpdateValue
        ]);
        (0, hooks_1.useEffect)(() => {
            if (prevValidatorsRef.current === validators) {
                return;
            }
            else {
                prevValidatorsRef.current = validators;
            }
            if (readonly || disabled) {
                return;
            }
            switch (validationState.valid) {
                case 'invalidShown':
                    runFullValidationAndUpdateValue();
                    break;
            }
        }, [disabled, readonly, validators, validationState]);
        (0, hooks_1.useEffect)(() => {
            if ((0, utils_1.isShallowEqual)(prevMessagesCustomRef.current, componentMessagingState.messagesCustom)) {
                return;
            }
            const { messagesCustom, hasCustomErrorMessages, hasHiddenMessages, hasNoErrorMessages } = componentMessagingState;
            const { valid, setValid } = validationState;
            prevMessagesCustomRef.current = messagesCustom;
            if (hasCustomErrorMessages()) {
                setValid('invalidShown');
            }
            else if (valid === 'pending') {
                return;
            }
            else if (hasNoErrorMessages()) {
                setValid('valid');
            }
            else if (hasHiddenMessages()) {
                setValid('invalidHidden');
            }
        }, [componentMessagingState, validationState]);
        return {
            runFullValidationAndUpdateValue
        };
    }
    exports.useValidationLifecycle = useValidationLifecycle;
});

define('oj-c/editable-value/UNSAFE_useValue/useValue',["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useUncontrolledState", "preact/hooks", "../utils/utils"], function (require, exports, UNSAFE_useUncontrolledState_1, hooks_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useValue = void 0;
    function useValue({ value: valueProp, format, parse, onRawValueChanged, onTransientValueChanged, onValueChanged }) {
        const [displayValue, setDisplayValue] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(format(valueProp, true), onRawValueChanged);
        const [value, setValue] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(valueProp, onValueChanged);
        (0, hooks_1.useEffect)(() => {
            if (displayValue !== undefined) {
                onRawValueChanged?.(displayValue);
            }
        }, []);
        const [transientValue, setTransientValue] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(valueProp, onTransientValueChanged);
        (0, hooks_1.useEffect)(() => {
            if (valueProp !== undefined) {
                onTransientValueChanged?.(valueProp);
            }
        }, []);
        return {
            displayValue,
            transientValue,
            value,
            getValueForValidation: (0, hooks_1.useCallback)((valid) => {
                if (valid !== 'invalidShown') {
                    return value;
                }
                return parse((0, utils_1.normalizeValue)(displayValue));
            }, [displayValue, value, parse]),
            setValueAfterValidation: (0, hooks_1.useCallback)((value) => {
                setValue(value);
                setDisplayValue(format(value));
            }, [format]),
            setDisplayValue,
            setTransientValue,
            setValue,
            refreshDisplayValue: (0, hooks_1.useCallback)(() => {
                setDisplayValue(format(value));
            }, [value, format])
        };
    }
    exports.useValue = useValue;
});

define('oj-c/editable-value/UNSAFE_useValueLifecycle/useValueLifecycle',["require", "exports", "preact/hooks", "../UNSAFE_useValidators/useValidators"], function (require, exports, hooks_1, useValidators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useValueLifecycle = void 0;
    function useValueLifecycle({ value, valueState, format, validateValueOnExternalChange }) {
        const previousValueRef = (0, hooks_1.useRef)(value);
        (0, hooks_1.useEffect)(() => {
            const { value, setDisplayValue } = valueState;
            setDisplayValue(format(value));
        }, []);
        (0, hooks_1.useEffect)(() => {
            if (previousValueRef.current === value) {
                return;
            }
            previousValueRef.current = value;
            if (value !== undefined && value !== valueState.value) {
                const { setDisplayValue, setValue } = valueState;
                const validationResult = validateValueOnExternalChange(value);
                if (validationResult === useValidators_1.ValidationResult.VALID) {
                    setValue(value);
                    setDisplayValue(format(value));
                }
            }
        }, [value, valueState, format]);
    }
    exports.useValueLifecycle = useValueLifecycle;
});

define('oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue',["require", "exports", "preact/hooks", "../UNSAFE_useComponentMessaging/useComponentMessaging", "../UNSAFE_useConverter/useConverter", "../UNSAFE_useConverterLifecycle/useConverterLifecycle", "../UNSAFE_useDeferredValidators/useDeferredValidators", "../UNSAFE_useValidationLifecycle/useValidationLifecycle", "../UNSAFE_useValidators/useValidators", "../UNSAFE_useValue/useValue", "../UNSAFE_useValueLifecycle/useValueLifecycle", "../utils/utils"], function (require, exports, hooks_1, useComponentMessaging_1, useConverter_1, useConverterLifecycle_1, useDeferredValidators_1, useValidationLifecycle_1, useValidators_1, useValue_1, useValueLifecycle_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useEditableValue = void 0;
    function useEditableValue({ ariaDescribedBy, converter, disabled, displayOptions, implicitComponentValidator, labelHint, messagesCustom, readonly, required, requiredMessageDetail, shouldNormalizeValueOnCommit = true, validators, value: valueProp, addBusyState, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, onTransientValueChanged, wrapValueState }) {
        const componentMessagingState = (0, useComponentMessaging_1.useComponentMessaging)({
            messagesCustom,
            onMessagesCustomChanged
        });
        const { clearAllMessages, visibleMessages } = componentMessagingState;
        const deferredValidators = (0, useDeferredValidators_1.useDeferredValidators)({
            labelHint,
            required,
            requiredMessageDetail
        });
        const combinedValidators = !implicitComponentValidator
            ? validators
            : validators
                ? [implicitComponentValidator, ...validators]
                : [implicitComponentValidator];
        const validationState = (0, useValidators_1.useValidators)({
            componentMessagingState,
            defaultValidState: 'valid',
            deferredValidators,
            validators: combinedValidators,
            addBusyState,
            onValidChanged
        });
        const { validateValueOnExternalChange, validateValueOnInternalChange } = validationState;
        const { format, parse } = (0, useConverter_1.useConverter)({
            componentMessagingState,
            converter,
            validationState
        });
        const defaultValueState = (0, useValue_1.useValue)({
            value: valueProp,
            format,
            parse,
            onRawValueChanged,
            onTransientValueChanged,
            onValueChanged
        });
        const valueState = wrapValueState ? wrapValueState(defaultValueState) : defaultValueState;
        const { displayValue, value, getValueForValidation, setValueAfterValidation, refreshDisplayValue, setDisplayValue, setTransientValue, setValue } = valueState;
        const { runFullValidationAndUpdateValue } = (0, useValidationLifecycle_1.useValidationLifecycle)({
            componentMessagingState,
            validationState,
            deferredValidators,
            validators,
            getValueForValidation,
            setValueAfterValidation,
            readonly,
            disabled
        });
        (0, useConverterLifecycle_1.useConverterLifecycle)({
            converter,
            validationState,
            refreshDisplayValue,
            runFullValidationAndUpdateValue
        });
        (0, useValueLifecycle_1.useValueLifecycle)({
            value: valueProp,
            valueState,
            format,
            validateValueOnExternalChange
        });
        const normalizeAndParseValue = (0, hooks_1.useCallback)((value) => {
            return parse(shouldNormalizeValueOnCommit ? (0, utils_1.normalizeValue)(value) : value);
        }, [shouldNormalizeValueOnCommit, parse]);
        const onCommitValue = (0, hooks_1.useCallback)(async (value, doCommitOnValid = true) => {
            const validationResult = await validateValueOnInternalChange(value);
            if (validationResult === useValidators_1.ValidationResult.VALID && doCommitOnValid) {
                setValue(value);
            }
            return validationResult;
        }, [validateValueOnInternalChange]);
        const onCommit = (0, hooks_1.useCallback)(async ({ value }) => {
            const parsedValueOrSymbol = normalizeAndParseValue(value);
            if (parsedValueOrSymbol === useConverter_1.ConverterErrorSymbol) {
                return;
            }
            const parsedValue = parsedValueOrSymbol;
            const validationResult = await onCommitValue(parsedValue);
            if (validationResult === useValidators_1.ValidationResult.VALID) {
                setDisplayValue(format(parsedValue));
            }
        }, [format, onCommitValue, normalizeAndParseValue]);
        const onInput = (0, hooks_1.useCallback)(({ value }) => {
            setDisplayValue(value ?? '');
        }, []);
        const reset = (0, hooks_1.useCallback)(() => {
            clearAllMessages();
            validateValueOnExternalChange(value);
            refreshDisplayValue();
        }, [value, clearAllMessages, refreshDisplayValue, validateValueOnExternalChange]);
        const validate = (0, hooks_1.useCallback)(async () => {
            if (readonly || disabled) {
                return 'valid';
            }
            const { fullValidate } = validationState;
            const { displayValue, value, setValueAfterValidation } = valueState;
            const newValueOrSymbol = normalizeAndParseValue(displayValue);
            if (newValueOrSymbol === useConverter_1.ConverterErrorSymbol) {
                return 'invalid';
            }
            const newValue = newValueOrSymbol;
            const resolver = addBusyState?.('running component method validate');
            const validateResult = await fullValidate(newValue);
            resolver?.();
            if (validateResult) {
                if (newValue !== value) {
                    setValueAfterValidation(newValue);
                }
                return 'valid';
            }
            return 'invalid';
        }, [validationState, valueState, addBusyState, normalizeAndParseValue, readonly, disabled]);
        const showMessages = (0, hooks_1.useCallback)(() => {
            const { hasHiddenMessages, showHiddenMessages } = componentMessagingState;
            const { setValid } = validationState;
            if (hasHiddenMessages()) {
                showHiddenMessages();
                setValid('invalidShown');
            }
        }, [componentMessagingState, validationState]);
        return {
            value,
            setValue,
            displayValue,
            setDisplayValue,
            setTransientValue,
            methods: {
                reset,
                validate,
                showMessages
            },
            textFieldProps: {
                messages: displayOptions?.messages !== 'none' ? visibleMessages : undefined,
                value: displayValue,
                'aria-describedby': ariaDescribedBy,
                onCommit,
                onInput
            },
            onCommitValue,
            format,
            normalizeAndParseValue
        };
    }
    exports.useEditableValue = useEditableValue;
});

define('oj-c/input-date-text/useImplicitDateConverter',["require", "exports", "preact/hooks", "ojs/ojconverter-localdate"], function (require, exports, hooks_1, ojconverter_localdate_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitDateConverter = void 0;
    function useImplicitDateConverter({ converter }) {
        const implicitConverter = (0, hooks_1.useMemo)(() => {
            return converter ?? new ojconverter_localdate_1.LocalDateConverter({ dateStyle: 'short' });
        }, [converter]);
        return implicitConverter;
    }
    exports.useImplicitDateConverter = useImplicitDateConverter;
});

define('oj-c/input-date-text/useImplicitDateRangeValidator',["require", "exports", "ojs/ojvalidator-localdaterange", "preact/hooks"], function (require, exports, ojvalidator_localdaterange_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitDateRangeValidator = void 0;
    function useImplicitDateRangeValidator({ formatObj, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, max, min }) {
        const dateRangeValidator = (0, hooks_1.useMemo)(() => {
            if (min !== undefined || max !== undefined) {
                return new ojvalidator_localdaterange_1.LocalDateRangeValidator({
                    formatObj,
                    max,
                    min,
                    rangeOverflowMessageDetail: dateRangeOverflowMessageDetail,
                    rangeUnderflowMessageDetail: dateRangeUnderflowMessageDetail
                });
            }
            return null;
        }, [formatObj, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, min, max]);
        return dateRangeValidator;
    }
    exports.useImplicitDateRangeValidator = useImplicitDateRangeValidator;
});

define('oj-c/input-date-text/useInputDateTextPreact',["require", "exports", "oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue", "oj-c/editable-value/utils/utils", "./useImplicitDateConverter", "./useImplicitDateRangeValidator"], function (require, exports, useEditableValue_1, utils_1, useImplicitDateConverter_1, useImplicitDateRangeValidator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInputDateTextPreact = void 0;
    function useInputDateTextPreact({ autocomplete = 'on', autofocus, converter: propConverter, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, readonly, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        const minTreatNull = (0, utils_1.treatNull)(min);
        const maxTreatNull = (0, utils_1.treatNull)(max);
        const converter = (0, useImplicitDateConverter_1.useImplicitDateConverter)({
            converter: propConverter
        });
        const implicitComponentValidator = (0, useImplicitDateRangeValidator_1.useImplicitDateRangeValidator)({
            formatObj: converter,
            dateRangeOverflowMessageDetail,
            dateRangeUnderflowMessageDetail,
            max: maxTreatNull,
            min: minTreatNull
        });
        const { methods, textFieldProps, value, setValue } = (0, useEditableValue_1.useEditableValue)({
            ariaDescribedBy: otherProps['aria-describedby'],
            converter,
            disabled,
            displayOptions,
            implicitComponentValidator,
            labelHint,
            messagesCustom,
            readonly,
            required,
            requiredMessageDetail,
            validators,
            value: propValue,
            addBusyState,
            onMessagesCustomChanged,
            onRawValueChanged,
            onValidChanged,
            onValueChanged
        });
        const hasNoValue = value === null || (typeof value === 'string' && value === '');
        return {
            value,
            setValue,
            methods,
            inputTextProps: {
                autoComplete: autocomplete,
                autoFocus: autofocus,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                textAlign,
                userAssistanceDensity,
                ...textFieldProps
            }
        };
    }
    exports.useInputDateTextPreact = useInputDateTextPreact;
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/input-date-text/input-date-text',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_InputText", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "ojs/ojvcomponent", "ojs/ojvcomponent-binding", "preact", "preact/compat", "preact/hooks", "./useInputDateTextPreact", "@oracle/oraclejet-preact/UNSAFE_IntlDateTime", "css!oj-c/input-date-text/input-date-text-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_useAccessibleContext_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_InputText_1, useAssistiveText_1, ojcontext_1, ojvcomponent_1, ojvcomponent_binding_1, preact_1, compat_1, hooks_1, useInputDateTextPreact_1, UNSAFE_IntlDateTime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputDateText = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    const FunctionalInputDateText = (0, compat_1.forwardRef)((props, ref) => {
        const { busyContextRef, converter, displayOptions, help, helpHints, validators } = props;
        const inputDateTextRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-input-date-text id=${props.id} is ${desc}`
            });
        }, []);
        const { inputTextProps, methods } = (0, useInputDateTextPreact_1.useInputDateTextPreact)(props, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => inputDateTextRef.current?.blur(),
            focus: () => inputDateTextRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            converter,
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: inputTextProps.userAssistanceDensity,
            validators
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        return ((0, jsx_runtime_1.jsx)(UNSAFE_InputText_1.InputText, { ref: inputDateTextRef, ...assistiveTextProps, ...inputTextProps, variant: variant }));
    });
    let InputDateText = class InputDateText extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.busyContextRef = (0, preact_1.createRef)();
            this.inputDateTextRef = (0, preact_1.createRef)();
            this.rootRef = (0, preact_1.createRef)();
        }
        componentDidMount() {
            this.busyContextRef.current = ojcontext_1.default.getContext(this.rootRef.current).getBusyContext();
        }
        render(props) {
            const containerProps = {
                isFormLayout: props.containerReadonly !== undefined,
                isReadonly: props.containerReadonly,
                labelWrapping: props.labelWrapping
            };
            if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(props.value)) {
                throw new Error('value must be a date-only ISO string');
            }
            if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(props.min)) {
                throw new Error('min must be a date-only ISO string');
            }
            if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(props.max)) {
                throw new Error('max must be a date-only ISO string');
            }
            const accessibleProps = {
                UNSAFE_ariaLabelledBy: props.unsafe_labelledBy
            };
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: this.rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(FunctionalInputDateText, { busyContextRef: this.busyContextRef, ref: this.inputDateTextRef, ...props }) }) }) }));
        }
        componentWillUnmount() {
            this.busyContextRef.current = null;
        }
        reset() {
            this.inputDateTextRef.current?.reset();
        }
        showMessages() {
            this.inputDateTextRef.current?.showMessages();
        }
        validate() {
            return this.inputDateTextRef.current?.validate();
        }
        blur() {
            this.inputDateTextRef.current?.blur();
        }
        focus() {
            this.inputDateTextRef.current?.focus();
        }
    };
    InputDateText.defaultProps = {
        autocomplete: 'on',
        disabled: false,
        displayOptions: {
            converterHint: 'display',
            messages: 'display',
            validatorHint: 'display'
        },
        help: {
            instruction: ''
        },
        helpHints: {
            definition: '',
            source: '',
            sourceText: undefined
        },
        messagesCustom: [],
        readonly: false,
        required: false,
        userAssistanceDensity: 'reflow',
        validators: [],
        value: null
    };
    InputDateText._metadata = { "properties": { "autocomplete": { "type": "string" }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "converter": { "type": "object|null", "properties": { "format": { "type": "function" }, "parse": { "type": "function" } } }, "dateRangeOverflowMessageDetail": { "type": "string" }, "dateRangeUnderflowMessageDetail": { "type": "string" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "converterHint": { "type": "string", "enumValues": ["display", "none"] }, "messages": { "type": "string", "enumValues": ["display", "none"] }, "validatorHint": { "type": "string", "enumValues": ["display", "none"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "labelEdge": { "type": "string", "enumValues": ["start", "none", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["wrap", "truncate"], "binding": { "consume": { "name": "labelWrapping" } } }, "max": { "type": "string|null" }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "min": { "type": "string|null" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["start", "right", "end"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "efficient", "reflow"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "validators": { "type": "Array<object>|null" }, "value": { "type": "string|null", "writeback": true }, "rawValue": { "type": "string", "readOnly": true, "writeback": true }, "valid": { "type": "string", "enumValues": ["valid", "pending", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "rawValue", "valid", "value"], "_READ_ONLY_PROPS": ["rawValue", "valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id", "autofocus"] }, "methods": { "reset": {}, "showMessages": {}, "validate": {}, "blur": {}, "focus": {} } };
    InputDateText._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    InputDateText._consumedContexts = [UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext];
    InputDateText = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-input-date-text')
    ], InputDateText);
    exports.InputDateText = InputDateText;
});

define('oj-c/input-date-text',["require", "exports", "./input-date-text/input-date-text"], function (require, exports, input_date_text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputDateText = void 0;
    Object.defineProperty(exports, "InputDateText", { enumerable: true, get: function () { return input_date_text_1.InputDateText; } });
});

define('oj-c/input-number/useImplicitNumberConverter',["require", "exports", "ojs/ojconverter-nativenumber", "preact/hooks"], function (require, exports, ojconverter_nativenumber_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitNumberConverter = void 0;
    function useImplicitNumberConverter({ converter }) {
        const implicitConverter = (0, hooks_1.useMemo)(() => {
            return converter ?? new ojconverter_nativenumber_1.NumberConverter();
        }, [converter]);
        return implicitConverter;
    }
    exports.useImplicitNumberConverter = useImplicitNumberConverter;
});

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/input-number/useImplicitNumberRangeValidator',["require", "exports", "preact/hooks", "ojs/ojvalidator-numberrange"], function (require, exports, hooks_1, ojvalidator_numberrange_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useImplicitNumberRangeValidator = void 0;
    ojvalidator_numberrange_1 = __importDefault(ojvalidator_numberrange_1);
    function useImplicitNumberRangeValidator({ converter, max, min, numberRangeExactMessageDetail, numberRangeOverflowMessageDetail, numberRangeUnderflowMessageDetail }) {
        const numberRangeValidator = (0, hooks_1.useMemo)(() => {
            if (min !== undefined || max !== undefined) {
                return new ojvalidator_numberrange_1.default({
                    converter,
                    max,
                    min,
                    messageDetail: {
                        exact: numberRangeExactMessageDetail,
                        rangeOverflow: numberRangeOverflowMessageDetail,
                        rangeUnderflow: numberRangeUnderflowMessageDetail
                    }
                });
            }
            return null;
        }, [converter, min, max]);
        return numberRangeValidator;
    }
    exports.useImplicitNumberRangeValidator = useImplicitNumberRangeValidator;
});

define('oj-c/input-number/stepBasisUtils',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.determineSteppedValue = void 0;
    function determineSteppedValue(step, stepOpt, currentParsedValue, initialValue, maxOpt, minOpt) {
        const precision = _precision(stepOpt, initialValue, minOpt);
        if (precision > 0) {
            const power = Math.pow(10, precision);
            const minOptPower = minOpt !== undefined ? Math.round(minOpt * power) : minOpt;
            const maxOptPower = maxOpt != null ? Math.round(maxOpt * power) : maxOpt;
            const stepOptPower = Math.round(stepOpt * power);
            const adjustValuePower = _adjustValueForZeroPrecision(Math.round(step * power), stepOptPower, Math.round(currentParsedValue * power), initialValue !== undefined && initialValue !== null
                ? Math.round(initialValue * power)
                : initialValue, maxOptPower, minOptPower);
            return adjustValuePower / power;
        }
        return _adjustValueForZeroPrecision(step, stepOpt, currentParsedValue, initialValue, maxOpt, minOpt);
    }
    exports.determineSteppedValue = determineSteppedValue;
    function _adjustValueForZeroPrecision(step, stepOpt, currentParsedValue, initialValue, maxOpt, minOpt) {
        let stepBase = minOpt != null ? minOpt : initialValue;
        if (stepBase === null || stepBase === undefined) {
            stepBase = 0;
        }
        try {
            currentParsedValue = parseFloat(currentParsedValue.toFixed(0));
        }
        catch (e) {
            if (e instanceof TypeError) {
                currentParsedValue = +currentParsedValue;
            }
        }
        let aboveMin = currentParsedValue - stepBase;
        let rounded = Math.round(aboveMin / stepOpt) * stepOpt;
        rounded = parseFloat(rounded.toFixed(0));
        const multiple = rounded === aboveMin;
        let newValue;
        if (!multiple) {
            if (step < 0) {
                aboveMin = Math.ceil(aboveMin / stepOpt) * stepOpt;
            }
            else {
                aboveMin = Math.floor(aboveMin / stepOpt) * stepOpt;
            }
            newValue = stepBase + aboveMin + step;
        }
        else {
            newValue = currentParsedValue + step;
        }
        newValue = parseFloat(newValue.toFixed(0));
        if (minOpt != null && newValue < minOpt) {
            return minOpt;
        }
        if (maxOpt != null && newValue > maxOpt) {
            let validMax = Math.floor((maxOpt - stepBase) / stepOpt) * stepOpt + stepBase;
            validMax = parseFloat(validMax.toFixed(0));
            return validMax;
        }
        return newValue;
    }
    function _precision(stepOpt, initialValue, minOpt) {
        let precision = _precisionOf(stepOpt);
        if (minOpt != null) {
            precision = Math.max(precision, _precisionOf(minOpt));
        }
        if (initialValue != null) {
            precision = Math.max(precision, _precisionOf(initialValue));
        }
        return precision;
    }
    function _precisionOf(num) {
        const str = num.toString();
        const decimal = str.indexOf('.');
        return decimal === -1 ? 0 : str.length - decimal - 1;
    }
});

define('oj-c/input-number/useNumberInputTextPreact',["require", "exports", "oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue", "oj-c/editable-value/UNSAFE_useValidators/useValidators", "./useImplicitNumberConverter", "./useImplicitNumberRangeValidator", "preact/hooks", "oj-c/editable-value/utils/utils", "./stepBasisUtils"], function (require, exports, useEditableValue_1, useValidators_1, useImplicitNumberConverter_1, useImplicitNumberRangeValidator_1, hooks_1, utils_1, stepBasisUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useNumberInputTextPreact = void 0;
    function useNumberInputTextPreact({ autocomplete = 'on', autofocus, converter: propConverter, disabled, displayOptions, inputPrefix, inputSuffix, labelEdge, labelHint, labelStartWidth, max, messagesCustom, min, numberRangeExactMessageDetail, numberRangeOverflowMessageDetail, numberRangeUnderflowMessageDetail, placeholder, readonly, required, requiredMessageDetail, step, stepperVariant, textAlign, userAssistanceDensity, validators, value: propValue, virtualKeyboard, onMessagesCustomChanged, onRawValueChanged, onTransientValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        const minTreatNull = (0, utils_1.treatNull)(min);
        const maxTreatNull = (0, utils_1.treatNull)(max);
        const converter = (0, useImplicitNumberConverter_1.useImplicitNumberConverter)({
            converter: propConverter
        });
        const implicitComponentValidator = (0, useImplicitNumberRangeValidator_1.useImplicitNumberRangeValidator)({
            converter,
            max: maxTreatNull,
            min: minTreatNull,
            numberRangeExactMessageDetail,
            numberRangeOverflowMessageDetail,
            numberRangeUnderflowMessageDetail
        });
        const { onCommitValue, format, normalizeAndParseValue, methods, textFieldProps, value, setValue, displayValue, setDisplayValue, setTransientValue } = (0, useEditableValue_1.useEditableValue)({
            ariaDescribedBy: otherProps['aria-describedby'],
            converter,
            disabled,
            displayOptions,
            implicitComponentValidator,
            messagesCustom,
            readonly,
            required,
            requiredMessageDetail,
            validators,
            value: propValue,
            addBusyState,
            onMessagesCustomChanged,
            onRawValueChanged,
            onTransientValueChanged,
            onValidChanged,
            onValueChanged
        });
        const hasMin = minTreatNull !== undefined;
        const hasMax = maxTreatNull !== undefined;
        const isValidating = (0, hooks_1.useRef)(false);
        const stepQueue = (0, hooks_1.useRef)(new Array());
        const currentDisplayValueInStep = (0, hooks_1.useRef)(displayValue);
        const initialValue = (0, hooks_1.useRef)((0, utils_1.treatNull)(propValue));
        if (propValue !== value) {
            initialValue.current = (0, utils_1.treatNull)(propValue);
        }
        const [valueNow, setValueNow] = (0, hooks_1.useState)((0, utils_1.treatNull)(value));
        const [prevValue, setPrevValue] = (0, hooks_1.useState)(value);
        if (value !== prevValue) {
            setPrevValue(value);
            setValueNow((0, utils_1.treatNull)(value));
            setTransientValue(value);
        }
        const [hasUncommittedDisplayValue, setHasUncommittedDisplayValue] = (0, hooks_1.useState)(false);
        currentDisplayValueInStep.current = displayValue;
        const onCommit = (0, hooks_1.useCallback)(async ({ value }) => {
            setHasUncommittedDisplayValue(false);
            const parsedValueOrSymbol = normalizeAndParseValue(value);
            const parsedValue = parsedValueOrSymbol;
            if (typeof parsedValueOrSymbol === 'symbol') {
                setValueNow(undefined);
                return;
            }
            const validationResult = await onCommitValue(parsedValue);
            if (validationResult === useValidators_1.ValidationResult.VALID) {
                const formattedValue = format(parsedValue);
                setDisplayValue(formattedValue);
            }
            else {
                setValueNow(parsedValue);
            }
        }, [format, normalizeAndParseValue, onCommitValue]);
        const onInput = (0, hooks_1.useCallback)(({ value }) => {
            setDisplayValue(value ?? '');
            setHasUncommittedDisplayValue(true);
        }, []);
        const textFieldPropsWithOverride = { ...textFieldProps, onCommit, onInput };
        const doStep = (0, hooks_1.useCallback)(async (direction, doCommit) => {
            if (step === undefined || isValidating.current) {
                return;
            }
            const displayValueToStep = currentDisplayValueInStep.current || '0';
            const parsedValueOrSymbol = normalizeAndParseValue(displayValueToStep);
            if (typeof parsedValueOrSymbol === 'symbol') {
                return;
            }
            const parsedValue = parsedValueOrSymbol;
            let newSteppedValue;
            if (direction !== undefined) {
                const stepValue = direction === 'increase' ? step : -1 * step;
                newSteppedValue = (0, stepBasisUtils_1.determineSteppedValue)(stepValue, step, parsedValue, initialValue.current, maxTreatNull, minTreatNull);
            }
            else {
                newSteppedValue = parsedValue;
            }
            isValidating.current = true;
            const formattedValue = format(newSteppedValue);
            setDisplayValue(formattedValue);
            currentDisplayValueInStep.current = formattedValue;
            const validationResult = await onCommitValue(newSteppedValue, doCommit);
            const isSpinning = doCommit === false;
            const valueCommitted = doCommit && validationResult === useValidators_1.ValidationResult.VALID;
            if (isSpinning && validationResult === useValidators_1.ValidationResult.VALID) {
                setTransientValue(newSteppedValue);
            }
            if (!valueCommitted) {
                setValueNow(newSteppedValue);
            }
            isValidating.current = false;
        }, [value, displayValue, format, normalizeAndParseValue, onCommitValue]);
        const processStepQueue = (0, hooks_1.useCallback)(async (direction) => {
            await doStep(direction, true);
            if (stepQueue.current.length > 0) {
                const direction = stepQueue.current.shift();
                processStepQueue(direction);
            }
        }, [doStep]);
        const handleStep = (0, hooks_1.useCallback)(async ({ direction }) => {
            if (isValidating.current) {
                stepQueue.current.push(direction);
            }
            else {
                processStepQueue(direction);
            }
        }, [processStepQueue]);
        const handleSpin = (0, hooks_1.useCallback)(async ({ direction }) => {
            const doCommit = false;
            stepQueue.current = [];
            doStep(direction, doCommit);
        }, [doStep]);
        const handleSpinComplete = (0, hooks_1.useCallback)(async () => {
            const parsedValueOrSymbol = normalizeAndParseValue(currentDisplayValueInStep.current);
            const parsedValue = parsedValueOrSymbol;
            if (typeof parsedValueOrSymbol === 'symbol') {
                return;
            }
            await onCommitValue(parsedValue);
        }, [onCommitValue, normalizeAndParseValue]);
        const valueText = calculateValueText(hasUncommittedDisplayValue, displayValue, valueNow, format);
        return {
            value,
            setValue,
            methods,
            inputNumberProps: {
                'aria-valuemax': maxTreatNull,
                'aria-valuemin': minTreatNull,
                'aria-valuenow': valueNow ?? undefined,
                'aria-valuetext': valueText,
                autoComplete: autocomplete,
                autoFocus: autofocus,
                hasSteppers: step !== undefined && step > 0,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || (0, utils_1.treatNull)(value) === undefined),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                stepperVariant,
                onSpin: step ? handleSpin : undefined,
                onSpinComplete: step ? handleSpinComplete : undefined,
                onStep: step ? handleStep : undefined,
                placeholder,
                prefix: inputPrefix,
                suffix: inputSuffix,
                isStepDownDisabled: disabled ||
                    (hasMin &&
                        ((valueNow !== undefined && valueNow <= minTreatNull) ||
                            (displayValue === '' && minTreatNull === 0))),
                isStepUpDisabled: disabled ||
                    (hasMax &&
                        ((valueNow !== undefined && valueNow >= maxTreatNull) ||
                            (displayValue === '' && maxTreatNull === 0))),
                textAlign,
                userAssistanceDensity,
                virtualKeyboard,
                ...textFieldPropsWithOverride
            }
        };
    }
    exports.useNumberInputTextPreact = useNumberInputTextPreact;
    function calculateValueText(hasUncommittedDisplayValue, displayValue, valueNow, format) {
        if (!hasUncommittedDisplayValue) {
            return displayValue !== '' ? displayValue : undefined;
        }
        let valueText;
        if (valueNow) {
            valueText = format(valueNow);
        }
        return valueText === '' || valueText === null ? undefined : valueText;
    }
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/input-number/input-number',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_NumberInputText", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "ojs/ojvcomponent", "ojs/ojvcomponent-binding", "preact", "preact/compat", "preact/hooks", "./useNumberInputTextPreact", "css!oj-c/input-number/input-number-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_useAccessibleContext_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_NumberInputText_1, useAssistiveText_1, ojcontext_1, ojvcomponent_1, ojvcomponent_binding_1, preact_1, compat_1, hooks_1, useNumberInputTextPreact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputNumber = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    const FunctionalInputNumber = (0, compat_1.forwardRef)((props, ref) => {
        const { busyContextRef, converter, displayOptions, help, helpHints, validators } = props;
        const inputNumberRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-input-number id=${props.id} is ${desc}`
            });
        }, []);
        const { inputNumberProps, methods } = (0, useNumberInputTextPreact_1.useNumberInputTextPreact)(props, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => inputNumberRef.current?.blur(),
            focus: () => inputNumberRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            converter,
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: inputNumberProps.userAssistanceDensity,
            validators
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        return ((0, jsx_runtime_1.jsx)(UNSAFE_NumberInputText_1.NumberInputText, { ref: inputNumberRef, ...assistiveTextProps, ...inputNumberProps, variant: variant }));
    });
    let InputNumber = class InputNumber extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.busyContextRef = (0, preact_1.createRef)();
            this.inputNumberRef = (0, preact_1.createRef)();
            this.rootRef = (0, preact_1.createRef)();
        }
        componentDidMount() {
            this.busyContextRef.current = ojcontext_1.default.getContext(this.rootRef.current).getBusyContext();
        }
        render(props) {
            const containerProps = {
                isFormLayout: props.containerReadonly !== undefined,
                isReadonly: props.containerReadonly,
                labelWrapping: props.labelWrapping
            };
            if (props.step !== undefined && props.step < 0) {
                throw new Error('step must be a positive number');
            }
            if (props.min != null && props.max != null && props.max < props.min) {
                throw new Error('max cannot be less than min');
            }
            const accessibleProps = {
                UNSAFE_ariaLabelledBy: props.unsafe_labelledBy
            };
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: this.rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(FunctionalInputNumber, { busyContextRef: this.busyContextRef, ref: this.inputNumberRef, ...props }) }) }) }));
        }
        componentWillUnmount() {
            this.busyContextRef.current = null;
        }
        reset() {
            this.inputNumberRef.current?.reset();
        }
        showMessages() {
            this.inputNumberRef.current?.showMessages();
        }
        validate() {
            return this.inputNumberRef.current?.validate();
        }
        blur() {
            this.inputNumberRef.current?.blur();
        }
        focus() {
            this.inputNumberRef.current?.focus();
        }
    };
    InputNumber.defaultProps = {
        autocomplete: 'on',
        converter: null,
        disabled: false,
        displayOptions: {
            converterHint: 'display',
            messages: 'display',
            validatorHint: 'display'
        },
        help: {
            instruction: ''
        },
        helpHints: {
            definition: '',
            source: '',
            sourceText: undefined
        },
        messagesCustom: [],
        readonly: false,
        required: false,
        userAssistanceDensity: 'reflow',
        validators: [],
        value: null,
        virtualKeyboard: 'auto',
        stepperVariant: 'directional'
    };
    InputNumber._metadata = { "properties": { "autocomplete": { "type": "string" }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "converter": { "type": "object|null" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "converterHint": { "type": "string", "enumValues": ["display", "none"] }, "messages": { "type": "string", "enumValues": ["display", "none"] }, "validatorHint": { "type": "string", "enumValues": ["display", "none"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "inputPrefix": { "type": "string" }, "inputSuffix": { "type": "string" }, "labelEdge": { "type": "string", "enumValues": ["start", "none", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["wrap", "truncate"], "binding": { "consume": { "name": "labelWrapping" } } }, "max": { "type": "number|null" }, "min": { "type": "number|null" }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "numberRangeExactMessageDetail": { "type": "string" }, "numberRangeOverflowMessageDetail": { "type": "string" }, "numberRangeUnderflowMessageDetail": { "type": "string" }, "placeholder": { "type": "string" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "step": { "type": "number" }, "stepperVariant": { "type": "string", "enumValues": ["directional", "quantitative"] }, "textAlign": { "type": "string", "enumValues": ["start", "right", "end"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "efficient", "reflow"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "validators": { "type": "Array<object>|null" }, "value": { "type": "number|null", "writeback": true }, "virtualKeyboard": { "type": "string", "enumValues": ["number", "text", "auto"] }, "rawValue": { "type": "string", "readOnly": true, "writeback": true }, "transientValue": { "type": "number", "readOnly": true, "writeback": true }, "valid": { "type": "string", "enumValues": ["valid", "pending", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "rawValue", "transientValue", "valid", "value"], "_READ_ONLY_PROPS": ["rawValue", "transientValue", "valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id", "autofocus"] }, "methods": { "reset": {}, "showMessages": {}, "validate": {}, "blur": {}, "focus": {} } };
    InputNumber._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    InputNumber._consumedContexts = [UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext];
    InputNumber = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-input-number')
    ], InputNumber);
    exports.InputNumber = InputNumber;
});

define('oj-c/input-number',["require", "exports", "./input-number/input-number"], function (require, exports, input_number_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputNumber = void 0;
    Object.defineProperty(exports, "InputNumber", { enumerable: true, get: function () { return input_number_1.InputNumber; } });
});

define('oj-c/input-password/useInputPasswordPreact',["require", "exports", "oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue"], function (require, exports, useEditableValue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInputPasswordPreact = void 0;
    function useInputPasswordPreact({ autocomplete = 'on', autofocus, clearIcon = 'never', disabled, displayOptions, labelEdge, labelHint, labelStartWidth, maskIcon, messagesCustom, placeholder, readonly, required, requiredMessageDetail, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        const { methods, textFieldProps, value, setValue } = (0, useEditableValue_1.useEditableValue)({
            ariaDescribedBy: otherProps['aria-describedby'],
            disabled,
            displayOptions,
            messagesCustom,
            readonly,
            required,
            requiredMessageDetail,
            validators,
            value: propValue,
            addBusyState,
            onMessagesCustomChanged,
            onRawValueChanged,
            onValidChanged,
            onValueChanged
        });
        const hasNoValue = value === null || (typeof value === 'string' && value === '');
        const hasClearIcon = clearIcon === 'conditional' ? 'conditionally' : clearIcon;
        const hasRevealToggle = maskIcon === 'hidden' ? 'never' : 'always';
        return {
            value,
            setValue,
            methods,
            inputPasswordProps: {
                autoComplete: autocomplete,
                autoFocus: autofocus,
                hasClearIcon: hasClearIcon,
                hasRevealToggle,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge: labelEdge,
                labelStartWidth,
                placeholder,
                textAlign,
                userAssistanceDensity,
                ...textFieldProps
            }
        };
    }
    exports.useInputPasswordPreact = useInputPasswordPreact;
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/input-password/input-password',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_InputPassword", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "ojs/ojvcomponent", "ojs/ojvcomponent-binding", "preact", "preact/compat", "preact/hooks", "./useInputPasswordPreact", "css!oj-c/input-password/input-password-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_useAccessibleContext_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_InputPassword_1, useAssistiveText_1, ojcontext_1, ojvcomponent_1, ojvcomponent_binding_1, preact_1, compat_1, hooks_1, useInputPasswordPreact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputPassword = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    const FunctionalInputPassword = (0, compat_1.forwardRef)((props, ref) => {
        const { busyContextRef, displayOptions, help, helpHints, validators } = props;
        const inputPasswordRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-input-password id=${props.id} is ${desc}`
            });
        }, [props.id, busyContextRef]);
        const { inputPasswordProps, methods } = (0, useInputPasswordPreact_1.useInputPasswordPreact)(props, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => inputPasswordRef.current?.blur(),
            focus: () => inputPasswordRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: inputPasswordProps.userAssistanceDensity,
            validators
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        return ((0, jsx_runtime_1.jsx)(UNSAFE_InputPassword_1.InputPassword, { ref: inputPasswordRef, ...assistiveTextProps, ...inputPasswordProps, variant: variant }));
    });
    let InputPassword = class InputPassword extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.busyContextRef = (0, preact_1.createRef)();
            this.inputPasswordRef = (0, preact_1.createRef)();
            this.rootRef = (0, preact_1.createRef)();
        }
        componentDidMount() {
            this.busyContextRef.current = ojcontext_1.default.getContext(this.rootRef.current).getBusyContext();
        }
        render(props) {
            const containerProps = {
                isFormLayout: props.containerReadonly !== undefined,
                isReadonly: props.containerReadonly,
                labelWrapping: props.labelWrapping
            };
            const accessibleProps = {
                UNSAFE_ariaLabelledBy: props.unsafe_labelledBy
            };
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: this.rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(FunctionalInputPassword, { busyContextRef: this.busyContextRef, ref: this.inputPasswordRef, ...props }) }) }) }));
        }
        componentWillUnmount() {
            this.busyContextRef.current = null;
        }
        reset() {
            this.inputPasswordRef.current?.reset();
        }
        showMessages() {
            this.inputPasswordRef.current?.showMessages();
        }
        validate() {
            return this.inputPasswordRef.current?.validate();
        }
        blur() {
            this.inputPasswordRef.current?.blur();
        }
        focus() {
            this.inputPasswordRef.current?.focus();
        }
    };
    InputPassword.defaultProps = {
        autocomplete: 'on',
        clearIcon: 'never',
        maskIcon: 'visible',
        disabled: false,
        displayOptions: {
            converterHint: 'display',
            messages: 'display',
            validatorHint: 'display'
        },
        help: {
            instruction: ''
        },
        helpHints: {
            definition: '',
            source: '',
            sourceText: undefined
        },
        messagesCustom: [],
        readonly: false,
        required: false,
        userAssistanceDensity: 'reflow',
        validators: [],
        value: null
    };
    InputPassword._metadata = { "properties": { "autocomplete": { "type": "string" }, "clearIcon": { "type": "string", "enumValues": ["always", "never", "conditional"] }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "converterHint": { "type": "string", "enumValues": ["display", "none"] }, "messages": { "type": "string", "enumValues": ["display", "none"] }, "validatorHint": { "type": "string", "enumValues": ["display", "none"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "labelEdge": { "type": "string", "enumValues": ["start", "none", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["wrap", "truncate"], "binding": { "consume": { "name": "labelWrapping" } } }, "maskIcon": { "type": "string", "enumValues": ["hidden", "visible"] }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "placeholder": { "type": "string" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["start", "right", "end"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "efficient", "reflow"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "validators": { "type": "Array<object>|null" }, "value": { "type": "string|null", "writeback": true }, "rawValue": { "type": "string", "readOnly": true, "writeback": true }, "valid": { "type": "string", "enumValues": ["valid", "pending", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "rawValue", "valid", "value"], "_READ_ONLY_PROPS": ["rawValue", "valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id", "autofocus"] }, "methods": { "reset": {}, "showMessages": {}, "validate": {}, "blur": {}, "focus": {} } };
    InputPassword._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    InputPassword._consumedContexts = [UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext];
    InputPassword = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-input-password')
    ], InputPassword);
    exports.InputPassword = InputPassword;
});

define('oj-c/input-password',["require", "exports", "./input-password/input-password"], function (require, exports, input_password_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputPassword = void 0;
    Object.defineProperty(exports, "InputPassword", { enumerable: true, get: function () { return input_password_1.InputPassword; } });
});

define('oj-c/input-text/useInputTextPreact',["require", "exports", "oj-c/editable-value/utils/utils", "oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue"], function (require, exports, utils_1, useEditableValue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useInputTextPreact = void 0;
    function useInputTextPreact({ autocomplete = 'on', autofocus, clearIcon = 'never', converter, disabled, displayOptions, end, inputPrefix, inputSuffix, labelEdge, labelHint, labelStartWidth, length, messagesCustom, placeholder, readonly, required, requiredMessageDetail, start, textAlign, userAssistanceDensity, validators, value: propValue, virtualKeyboard, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        const { methods, textFieldProps, value, setValue } = (0, useEditableValue_1.useEditableValue)({
            ariaDescribedBy: otherProps['aria-describedby'],
            converter,
            disabled,
            displayOptions,
            messagesCustom,
            readonly,
            required,
            requiredMessageDetail,
            validators,
            value: propValue,
            addBusyState,
            onMessagesCustomChanged,
            onRawValueChanged,
            onValidChanged,
            onValueChanged
        });
        const hasNoValue = value === null || (typeof value === 'string' && value === '');
        const hasClearIcon = clearIcon === 'conditional' ? 'conditionally' : clearIcon;
        return {
            value,
            setValue,
            methods,
            inputTextProps: {
                autoComplete: autocomplete,
                autoFocus: autofocus,
                hasClearIcon,
                endContent: end,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                maxLength: (0, utils_1.treatNull)(length?.max),
                maxLengthUnit: length?.countBy,
                placeholder,
                prefix: inputPrefix,
                startContent: start,
                suffix: inputSuffix,
                textAlign,
                userAssistanceDensity,
                virtualKeyboard,
                ...textFieldProps
            }
        };
    }
    exports.useInputTextPreact = useInputTextPreact;
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/input-text/input-text',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_InputText", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "ojs/ojvcomponent", "ojs/ojvcomponent-binding", "preact", "preact/compat", "preact/hooks", "./useInputTextPreact", "css!oj-c/input-text/input-text-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_useAccessibleContext_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_InputText_1, useAssistiveText_1, ojcontext_1, ojvcomponent_1, ojvcomponent_binding_1, preact_1, compat_1, hooks_1, useInputTextPreact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputText = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    const FunctionalInputText = (0, compat_1.forwardRef)((props, ref) => {
        const { busyContextRef, converter, displayOptions, help, helpHints, validators } = props;
        const inputTextRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-input-text id=${props.id} is ${desc}`
            });
        }, [busyContextRef, props.id]);
        const { inputTextProps, methods } = (0, useInputTextPreact_1.useInputTextPreact)(props, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => inputTextRef.current?.blur(),
            focus: () => {
                inputTextRef.current?.focus();
            },
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            converter,
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: inputTextProps.userAssistanceDensity,
            validators
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        return ((0, jsx_runtime_1.jsx)(UNSAFE_InputText_1.InputText, { ref: inputTextRef, ...assistiveTextProps, ...inputTextProps, variant: variant }));
    });
    let InputText = class InputText extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.busyContextRef = (0, preact_1.createRef)();
            this.inputTextRef = (0, preact_1.createRef)();
            this.rootRef = (0, preact_1.createRef)();
        }
        componentDidMount() {
            this.busyContextRef.current = ojcontext_1.default.getContext(this.rootRef.current).getBusyContext();
        }
        render(props) {
            const containerProps = {
                isFormLayout: props.containerReadonly !== undefined,
                isReadonly: props.containerReadonly,
                labelWrapping: props.labelWrapping
            };
            const accessibleProps = {
                UNSAFE_ariaLabelledBy: props.unsafe_labelledBy
            };
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: this.rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(FunctionalInputText, { busyContextRef: this.busyContextRef, ref: this.inputTextRef, ...props }) }) }) }));
        }
        componentWillUnmount() {
            this.busyContextRef.current = null;
        }
        reset() {
            this.inputTextRef.current?.reset();
        }
        showMessages() {
            this.inputTextRef.current?.showMessages();
        }
        validate() {
            return this.inputTextRef.current?.validate();
        }
        blur() {
            this.inputTextRef.current?.blur();
        }
        focus() {
            this.inputTextRef.current?.focus();
        }
    };
    InputText.defaultProps = {
        autocomplete: 'on',
        clearIcon: 'never',
        converter: null,
        disabled: false,
        displayOptions: {
            converterHint: 'display',
            messages: 'display',
            validatorHint: 'display'
        },
        help: {
            instruction: ''
        },
        helpHints: {
            definition: '',
            source: '',
            sourceText: undefined
        },
        length: {
            countBy: 'codePoint',
            max: null
        },
        messagesCustom: [],
        readonly: false,
        required: false,
        userAssistanceDensity: 'reflow',
        validators: [],
        value: null,
        virtualKeyboard: 'auto'
    };
    InputText._metadata = { "properties": { "autocomplete": { "type": "string" }, "clearIcon": { "type": "string", "enumValues": ["always", "never", "conditional"] }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "converter": { "type": "object|null" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "converterHint": { "type": "string", "enumValues": ["display", "none"] }, "messages": { "type": "string", "enumValues": ["display", "none"] }, "validatorHint": { "type": "string", "enumValues": ["display", "none"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "inputPrefix": { "type": "string" }, "inputSuffix": { "type": "string" }, "labelEdge": { "type": "string", "enumValues": ["start", "none", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["wrap", "truncate"], "binding": { "consume": { "name": "labelWrapping" } } }, "length": { "type": "object", "properties": { "countBy": { "type": "string", "enumValues": ["codePoint", "codeUnit"] }, "max": { "type": "number|null" } } }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "placeholder": { "type": "string" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["start", "right", "end"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "efficient", "reflow"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "validators": { "type": "Array<object>|null" }, "value": { "type": "any", "writeback": true }, "virtualKeyboard": { "type": "string", "enumValues": ["number", "text", "auto", "search", "email", "tel", "url"] }, "rawValue": { "type": "string", "readOnly": true, "writeback": true }, "valid": { "type": "string", "enumValues": ["valid", "pending", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "slots": { "end": {}, "start": {} }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "rawValue", "valid", "value"], "_READ_ONLY_PROPS": ["rawValue", "valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id", "autofocus"] }, "methods": { "reset": {}, "showMessages": {}, "validate": {}, "blur": {}, "focus": {} } };
    InputText._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    InputText._consumedContexts = [UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext];
    InputText = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-input-text')
    ], InputText);
    exports.InputText = InputText;
});

define('oj-c/input-text',["require", "exports", "./input-text/input-text"], function (require, exports, input_text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputText = void 0;
    Object.defineProperty(exports, "InputText", { enumerable: true, get: function () { return input_text_1.InputText; } });
});

define('oj-c/hooks/UNSAFE_useDataProvider/utils',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getUpdatedItemsFromMutationDetail = void 0;
    async function getUpdatedItemsFromMutationDetail(detail, currentData, dataProvider) {
        const { add, remove, update } = detail ?? {};
        const keyIndexMap = new Map();
        for (const [index, item] of currentData.entries()) {
            keyIndexMap.set(item.key, index);
        }
        let mutatedData = [...currentData];
        if (remove) {
            mutatedData = removeItemsFromDetail(remove, mutatedData, keyIndexMap);
        }
        if (add) {
            mutatedData = await addItemsFromDetail(add, mutatedData, keyIndexMap, dataProvider);
        }
        if (update) {
            mutatedData = await updateItemsFromDetail(update, mutatedData, keyIndexMap, dataProvider);
        }
        return mutatedData;
    }
    exports.getUpdatedItemsFromMutationDetail = getUpdatedItemsFromMutationDetail;
    function addItemsAtEnd(itemsToAdd, itemMetadataToAdd, items) {
        const indices = new Array(itemsToAdd.length).fill(-1);
        return addItemsAtIndices(indices, itemsToAdd, itemMetadataToAdd, items);
    }
    function addItemsAtIndices(indices, itemsToAdd, itemMetadataToAdd, items) {
        const returnItems = [...items];
        indices.forEach((addAtIndex, index) => {
            const addItem = {
                data: itemsToAdd[index],
                key: itemMetadataToAdd[index]?.key,
                metadata: itemMetadataToAdd[index]
            };
            if (addAtIndex >= 0) {
                returnItems.splice(addAtIndex, 0, addItem);
            }
            else {
                returnItems.push(addItem);
            }
        });
        return returnItems;
    }
    function addItemsBeforeKeys(beforeKeys, itemsToAdd, items, keyIndexMap) {
        const addIndices = [];
        const itemMetadataToAdd = [];
        beforeKeys.forEach((key) => {
            addIndices.push(getIndexByKey(keyIndexMap, key));
            itemMetadataToAdd.push({ key });
        });
        return addItemsAtIndices(addIndices, itemsToAdd, itemMetadataToAdd, items);
    }
    async function addItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
        const { addBeforeKeys, data, indexes, keys, metadata } = detail;
        let mutatedData = [...items];
        let treatedData = data || [];
        let treatedMetaData = metadata || [];
        if (treatedData.length === 0 && keys?.size) {
            const fetchResults = (await fetchDataByKeys(dataProvider, keys)) ?? [];
            treatedData = fetchResults.map((itemContext) => itemContext.data);
            treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
        }
        if (treatedMetaData.length === 0 && keys?.size) {
            treatedMetaData = [...keys].map((key) => ({ key }));
        }
        if (treatedData.length) {
            if (indexes?.length) {
                mutatedData = addItemsAtIndices(indexes, treatedData, treatedMetaData, mutatedData);
            }
            else if (addBeforeKeys?.length) {
                mutatedData = addItemsBeforeKeys(addBeforeKeys, treatedData, mutatedData, keyIndexMap);
            }
            else {
                mutatedData = addItemsAtEnd(treatedData, treatedMetaData, mutatedData);
            }
        }
        return mutatedData;
    }
    async function fetchDataByKeys(dataProvider, keys) {
        const fetchedData = [];
        const results = (await dataProvider.fetchByKeys({ keys })).results;
        for (const key of keys) {
            if (results.has(key)) {
                const result = results.get(key);
                fetchedData.push({ ...result, key });
            }
        }
        return fetchedData;
    }
    function getIndexByKey(keyIndexMap, key) {
        if (keyIndexMap.has(key)) {
            return keyIndexMap.get(key);
        }
        return -1;
    }
    function removeItemsAtIndices(indices, items) {
        const returnItems = [...items];
        indices.sort((a, b) => b - a);
        indices.forEach((index) => {
            if (index < returnItems.length) {
                returnItems.splice(index, 1);
            }
        });
        return returnItems;
    }
    function removeItemsAtKeys(keys, items, keyIndexMap) {
        const indicesToRemove = [];
        keys.forEach((key) => {
            const index = getIndexByKey(keyIndexMap, key);
            if (index !== -1) {
                indicesToRemove.push(index);
            }
        });
        return removeItemsAtIndices(indicesToRemove, items);
    }
    function removeItemsFromDetail(detail, items, keyIndexMap) {
        const { indexes, keys } = detail;
        let mutatedData = [...items];
        if (indexes?.length) {
            mutatedData = removeItemsAtIndices(indexes, mutatedData);
        }
        else if (keys?.size) {
            mutatedData = removeItemsAtKeys(keys, mutatedData, keyIndexMap);
        }
        return mutatedData;
    }
    function updateItemsAtIndices(indices, itemsToUpdate, itemMetadataToUpdate, items) {
        const returnItems = [...items];
        indices.forEach((updateAtIndex, index) => {
            if (returnItems[updateAtIndex]) {
                const addItem = {
                    data: itemsToUpdate[index],
                    key: itemMetadataToUpdate[index]?.key,
                    metadata: itemMetadataToUpdate[index]
                };
                returnItems.splice(updateAtIndex, 1, addItem);
            }
        });
        return returnItems;
    }
    function updateItemsAtKeys(keys, itemsToUpdate, itemMetadataToUpdate, items, keyIndexMap) {
        const returnItems = [...items];
        keys.forEach((key) => {
            const index = getIndexByKey(keyIndexMap, key);
            const addItem = {
                data: itemsToUpdate[index],
                key: itemMetadataToUpdate[index]?.key,
                metadata: itemMetadataToUpdate[index]
            };
            if (index >= 0) {
                returnItems.splice(index, 1, addItem);
            }
        });
        return returnItems;
    }
    async function updateItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
        const { data, indexes, keys, metadata } = detail;
        let mutatedData = [...items];
        let treatedData = data || [];
        let treatedMetaData = metadata || [];
        if (treatedData.length === 0 && keys?.size) {
            const fetchResults = (await fetchDataByKeys(dataProvider, keys)) ?? [];
            treatedData = fetchResults.map((itemContext) => itemContext.data);
            treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
        }
        if (treatedMetaData.length === 0 && keys?.size) {
            treatedMetaData = [...keys].map((key) => ({ key }));
        }
        if (treatedData.length) {
            if (indexes?.length) {
                mutatedData = updateItemsAtIndices(indexes, treatedData, treatedMetaData, mutatedData);
            }
            else if (keys?.size) {
                mutatedData = updateItemsAtKeys(keys, treatedData, treatedMetaData, mutatedData, keyIndexMap);
            }
        }
        return mutatedData;
    }
});

define('oj-c/hooks/UNSAFE_useDataProvider/DataProviderHandler',["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataProviderHandler = void 0;
    class DataProviderHandler {
        constructor(dataProvider, addBusyState, callback) {
            this.handleMutateEvent = async (event) => {
                const { detail } = event;
                const resolver = this.addBusyState('updating data from mutation event');
                const updatedData = await (0, utils_1.getUpdatedItemsFromMutationDetail)(detail, this.currentData, this.dataProvider);
                resolver?.();
                this.currentData = updatedData;
                this.callback?.onDataUpdated?.(updatedData);
            };
            this.handleRefreshEvent = () => {
                this._fetchDataAndNotify();
            };
            this.addBusyState = addBusyState;
            this.callback = callback;
            this.dataProvider = dataProvider;
            this.currentData = [];
            dataProvider.addEventListener('refresh', this.handleRefreshEvent);
            dataProvider.addEventListener('mutate', this.handleMutateEvent);
            this._fetchDataAndNotify();
        }
        destroy() {
            this.callback = undefined;
            this.currentData = [];
            this.dataProvider.removeEventListener('refresh', this.handleRefreshEvent);
            this.dataProvider.removeEventListener('mutate', this.handleMutateEvent);
        }
        async _fetchData() {
            const fetchedData = [];
            const asyncIterable = this.dataProvider.fetchFirst({ size: -1 });
            for await (const results of asyncIterable) {
                const contextArray = results.data.map((item, index) => {
                    return {
                        data: item,
                        key: results.metadata[index].key,
                        metadata: results.metadata[index]
                    };
                });
                fetchedData.push(...contextArray);
            }
            this.currentData = fetchedData.slice();
            return fetchedData;
        }
        async _fetchDataAndNotify() {
            const resolver = this.addBusyState('fetching data');
            const fetchedData = await this._fetchData();
            this.callback?.onDataUpdated?.(fetchedData);
            resolver();
        }
    }
    exports.DataProviderHandler = DataProviderHandler;
});

define('oj-c/hooks/UNSAFE_useDataProvider/useDataProvider',["require", "exports", "preact/hooks", "./DataProviderHandler"], function (require, exports, hooks_1, DataProviderHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDataProvider = void 0;
    function useDataProvider({ addBusyState, data }) {
        const [fetchedData, setFetchedData] = (0, hooks_1.useState)([]);
        const dataProviderHandler = (0, hooks_1.useRef)();
        (0, hooks_1.useEffect)(() => {
            if (data !== undefined) {
                dataProviderHandler.current = new DataProviderHandler_1.DataProviderHandler(data, addBusyState, {
                    onDataUpdated: setFetchedData
                });
            }
            return () => {
                dataProviderHandler.current?.destroy();
                dataProviderHandler.current = undefined;
            };
        }, [data, addBusyState]);
        return {
            data: fetchedData
        };
    }
    exports.useDataProvider = useDataProvider;
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/message-toast/message-toast',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/hooks/UNSAFE_useMessagesContext", "@oracle/oraclejet-preact/UNSAFE_MessageToast", "oj-c/hooks/UNSAFE_useDataProvider/useDataProvider", "ojs/ojvcomponent", "preact/hooks", "ojs/ojcontext", "css!oj-c/message-toast/message-toast-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_useMessagesContext_1, UNSAFE_MessageToast_1, useDataProvider_1, ojvcomponent_1, hooks_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageToast = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    function MessageToastImpl({ data, detailTemplateValue, iconTemplateValue, messageTemplates, offset = 0, position = 'bottom', onOjClose }) {
        const uniqueId = (0, hooks_1.useRef)((0, ojvcomponent_1.getUniqueId)());
        const rootRef = (0, hooks_1.useRef)();
        const [prevData, setPrevData] = (0, hooks_1.useState)(data);
        const [dpKey, setDpKey] = (0, hooks_1.useState)(0);
        const addBusyState = (0, hooks_1.useCallback)((description = 'MessageToast: busyState') => {
            return rootRef.current
                ? Context.getContext(rootRef.current).getBusyContext().addBusyState({ description })
                : () => { };
        }, []);
        if (data != prevData) {
            setPrevData(data);
            setDpKey((dpKey) => dpKey + 1);
        }
        const { data: dataArr } = (0, useDataProvider_1.useDataProvider)({
            data,
            addBusyState
        });
        const UNSAFE_messagesLayerId = `messageToastLayer_${uniqueId.current}`;
        const messagesContext = (0, hooks_1.useMemo)(() => ({ addBusyState, UNSAFE_messagesLayerId }), [addBusyState, UNSAFE_messagesLayerId]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, "data-oj-messages-layer-id": UNSAFE_messagesLayerId, children: (0, jsx_runtime_1.jsx)(UNSAFE_useMessagesContext_1.MessagesContext.Provider, { value: messagesContext, children: (0, jsx_runtime_1.jsx)(UNSAFE_MessageToast_1.MessageToast, { data: dataArr, detailRendererKey: detailTemplateValue, iconRendererKey: iconTemplateValue, offset: offset, onClose: onOjClose, position: position, renderers: messageTemplates }, dpKey) }) }));
    }
    exports.MessageToast = (0, ojvcomponent_1.registerCustomElement)('oj-c-message-toast', MessageToastImpl, "MessageToast", { "properties": { "data": { "type": "DataProvider" }, "detailTemplateValue": { "type": "string|function" }, "iconTemplateValue": { "type": "string|function" }, "offset": { "type": "number|object" }, "position": { "type": "string", "enumValues": ["bottom", "top", "top-start", "top-end", "bottom-start", "bottom-end", "top-left", "bottom-left", "top-right", "bottom-right"] } }, "extension": { "_DYNAMIC_SLOT": { "prop": "messageTemplates", "isTemplate": 1 } }, "events": { "ojClose": {} } }, { "offset": 0, "position": "bottom" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/message-toast',["require", "exports", "./message-toast/message-toast"], function (require, exports, message_toast_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageToast = void 0;
    Object.defineProperty(exports, "MessageToast", { enumerable: true, get: function () { return message_toast_1.MessageToast; } });
});

define('oj-c/text-area/useTextAreaAutosizePreact',["require", "exports", "oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue"], function (require, exports, useEditableValue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useTextAreaAutosizePreact = void 0;
    function useTextAreaAutosizePreact({ autocomplete = 'on', autofocus, converter, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, length, maxRows, messagesCustom, placeholder, readonly, required, requiredMessageDetail, resizeBehavior, rows, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValidChanged, onValueChanged, ...otherProps }, addBusyState) {
        const { methods, textFieldProps, value, setValue } = (0, useEditableValue_1.useEditableValue)({
            ariaDescribedBy: otherProps['aria-describedby'],
            converter,
            disabled,
            displayOptions,
            messagesCustom,
            readonly,
            required,
            requiredMessageDetail,
            validators,
            value: propValue,
            addBusyState,
            onMessagesCustomChanged,
            onRawValueChanged,
            onValidChanged,
            onValueChanged
        });
        const hasNoValue = value === null || (typeof value === 'string' && value === '');
        return {
            value,
            setValue,
            methods,
            textAreaProps: {
                autoComplete: autocomplete,
                autoFocus: autofocus,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                maxLength: length?.max ? length.max : undefined,
                maxLengthCounter: length?.counter,
                maxLengthUnit: length?.countBy,
                maxRows: maxRows === -1 ? undefined : maxRows,
                minRows: rows,
                placeholder,
                resize: resizeBehavior,
                textAlign,
                userAssistanceDensity,
                ...textFieldProps
            }
        };
    }
    exports.useTextAreaAutosizePreact = useTextAreaAutosizePreact;
});

define('oj-c/text-area/useTextAreaPreact',["require", "exports", "oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue"], function (require, exports, useEditableValue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useTextAreaPreact = void 0;
    function useTextAreaPreact({ autocomplete = 'on', autofocus, converter, disabled, displayOptions, labelEdge, labelHint, labelStartWidth, length, messagesCustom, placeholder, readonly, required, requiredMessageDetail, resizeBehavior, rows, textAlign, userAssistanceDensity, validators, value: propValue, onMessagesCustomChanged, onRawValueChanged, onValueChanged, onValidChanged, ...otherProps }, addBusyState) {
        const { methods, textFieldProps, value, setValue } = (0, useEditableValue_1.useEditableValue)({
            ariaDescribedBy: otherProps['aria-describedby'],
            converter,
            disabled,
            displayOptions,
            messagesCustom,
            readonly,
            required,
            requiredMessageDetail,
            validators,
            value: propValue,
            addBusyState,
            onMessagesCustomChanged,
            onRawValueChanged,
            onValidChanged,
            onValueChanged
        });
        const hasNoValue = value === null || (typeof value === 'string' && value === '');
        return {
            value,
            setValue,
            methods,
            textAreaProps: {
                autoComplete: autocomplete,
                autoFocus: autofocus,
                isDisabled: disabled,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                label: labelHint,
                labelEdge,
                labelStartWidth,
                maxLength: length?.max ? length.max : undefined,
                maxLengthUnit: length?.countBy,
                maxLengthCounter: length?.counter,
                resize: resizeBehavior != 'none' ? resizeBehavior : undefined,
                rows,
                placeholder,
                textAlign,
                userAssistanceDensity,
                ...textFieldProps
            }
        };
    }
    exports.useTextAreaPreact = useTextAreaPreact;
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/text-area/text-area',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_TextArea", "@oracle/oraclejet-preact/UNSAFE_TextAreaAutosize", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "ojs/ojvcomponent", "ojs/ojvcomponent-binding", "preact", "preact/compat", "preact/hooks", "./useTextAreaAutosizePreact", "./useTextAreaPreact", "css!oj-c/text-area/text-area-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_useAccessibleContext_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_TextArea_1, UNSAFE_TextAreaAutosize_1, useAssistiveText_1, ojcontext_1, ojvcomponent_1, ojvcomponent_binding_1, preact_1, compat_1, hooks_1, useTextAreaAutosizePreact_1, useTextAreaPreact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextArea = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    const FunctionalTextArea = (0, compat_1.forwardRef)((props, ref) => {
        const { busyContextRef, converter, displayOptions, help, helpHints, validators } = props;
        const textAreaRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-text-area id=${props.id} is ${desc}`
            });
        }, []);
        const { textAreaProps, methods } = (0, useTextAreaPreact_1.useTextAreaPreact)(props, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => textAreaRef.current?.blur(),
            focus: () => textAreaRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            converter,
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: textAreaProps.userAssistanceDensity,
            validators
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        return ((0, jsx_runtime_1.jsx)(UNSAFE_TextArea_1.TextArea, { ref: textAreaRef, ...assistiveTextProps, ...textAreaProps, variant: variant }));
    });
    const FunctionalTextAreaAutosize = (0, compat_1.forwardRef)((props, ref) => {
        const { busyContextRef, converter, help, helpHints, validators } = props;
        const textAreaAutosizeRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-text-area id=${props.id} is ${desc}`
            });
        }, []);
        const { textAreaProps, methods } = (0, useTextAreaAutosizePreact_1.useTextAreaAutosizePreact)(props, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => textAreaAutosizeRef.current?.blur(),
            focus: () => textAreaAutosizeRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            converter,
            help,
            helpHints,
            userAssistanceDensity: textAreaProps.userAssistanceDensity,
            validators
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        return ((0, jsx_runtime_1.jsx)(UNSAFE_TextAreaAutosize_1.TextAreaAutosize, { ref: textAreaAutosizeRef, ...assistiveTextProps, ...textAreaProps, variant: variant }));
    });
    let TextArea = class TextArea extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.busyContextRef = (0, preact_1.createRef)();
            this.textAreaRef = (0, preact_1.createRef)();
            this.rootRef = (0, preact_1.createRef)();
        }
        componentDidMount() {
            this.busyContextRef.current = ojcontext_1.default.getContext(this.rootRef.current).getBusyContext();
        }
        render(props) {
            const containerProps = {
                isFormLayout: props.containerReadonly !== undefined,
                isReadonly: props.containerReadonly,
                labelWrapping: props.labelWrapping
            };
            const FunctionalComp = props.maxRows ? FunctionalTextAreaAutosize : FunctionalTextArea;
            const accessibleProps = {
                UNSAFE_ariaLabelledBy: props.unsafe_labelledBy
            };
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: this.rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(FunctionalComp, { busyContextRef: this.busyContextRef, ref: this.textAreaRef, ...props }) }) }) }));
        }
        componentWillUnmount() {
            this.busyContextRef.current = null;
        }
        reset() {
            this.textAreaRef.current?.reset();
        }
        showMessages() {
            this.textAreaRef.current?.showMessages();
        }
        validate() {
            return this.textAreaRef.current?.validate();
        }
        blur() {
            this.textAreaRef.current?.blur();
        }
        focus() {
            this.textAreaRef.current?.focus();
        }
    };
    TextArea.defaultProps = {
        autocomplete: 'on',
        converter: null,
        disabled: false,
        displayOptions: {
            converterHint: 'display',
            messages: 'display',
            validatorHint: 'display'
        },
        help: {
            instruction: ''
        },
        helpHints: {
            definition: '',
            source: '',
            sourceText: undefined
        },
        length: {
            countBy: 'codePoint',
            max: null
        },
        messagesCustom: [],
        readonly: false,
        required: false,
        resizeBehavior: 'none',
        userAssistanceDensity: 'reflow',
        validators: [],
        value: null
    };
    TextArea._metadata = { "properties": { "autocomplete": { "type": "string" }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "converter": { "type": "object|null" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "converterHint": { "type": "string", "enumValues": ["display", "none"] }, "messages": { "type": "string", "enumValues": ["display", "none"] }, "validatorHint": { "type": "string", "enumValues": ["display", "none"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "labelEdge": { "type": "string", "enumValues": ["start", "none", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["wrap", "truncate"], "binding": { "consume": { "name": "labelWrapping" } } }, "length": { "type": "object", "properties": { "countBy": { "type": "string", "enumValues": ["codePoint", "codeUnit"] }, "counter": { "type": "string", "enumValues": ["none", "remaining"] }, "max": { "type": "number|null" } } }, "maxRows": { "type": "number" }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "placeholder": { "type": "string" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "resizeBehavior": { "type": "string", "enumValues": ["none", "both", "horizontal", "vertical"] }, "rows": { "type": "number" }, "textAlign": { "type": "string", "enumValues": ["start", "right", "end"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "efficient", "reflow"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "validators": { "type": "Array<object>|null" }, "value": { "type": "any", "writeback": true }, "rawValue": { "type": "string", "readOnly": true, "writeback": true }, "valid": { "type": "string", "enumValues": ["valid", "pending", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "rawValue", "valid", "value"], "_READ_ONLY_PROPS": ["rawValue", "valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id", "autofocus"] }, "methods": { "reset": {}, "showMessages": {}, "validate": {}, "blur": {}, "focus": {} } };
    TextArea._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    TextArea._consumedContexts = [UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext];
    TextArea = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-text-area')
    ], TextArea);
    exports.TextArea = TextArea;
});

define('oj-c/text-area',["require", "exports", "./text-area/text-area"], function (require, exports, text_area_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextArea = void 0;
    Object.defineProperty(exports, "TextArea", { enumerable: true, get: function () { return text_area_1.TextArea; } });
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/progress-bar/progress-bar',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_ProgressBar", "ojs/ojvcomponent", "css!oj-c/progress-bar/progress-bar-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_ProgressBar_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgressBar = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.ProgressBar = (0, ojvcomponent_1.registerCustomElement)('oj-c-progress-bar', ({ max = 100, value = 0, edge = 'none', ...otherProps }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_ProgressBar_1.ProgressBar, { value: value === -1 ? 'indeterminate' : value, max: max, edge: edge, "aria-valuetext": otherProps['aria-valuetext'] }) }));
    }, "ProgressBar", { "properties": { "max": { "type": "number" }, "value": { "type": "number" }, "edge": { "type": "string", "enumValues": ["none", "top"] } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-valuetext"] } }, { "max": 100, "value": 0, "edge": "none" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/progress-bar',["require", "exports", "./progress-bar/progress-bar"], function (require, exports, progress_bar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgressBar = void 0;
    Object.defineProperty(exports, "ProgressBar", { enumerable: true, get: function () { return progress_bar_1.ProgressBar; } });
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/progress-circle/progress-circle',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_ProgressCircle", "ojs/ojvcomponent", "css!oj-c/progress-circle/progress-circle-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_ProgressCircle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgressCircle = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.ProgressCircle = (0, ojvcomponent_1.registerCustomElement)('oj-c-progress-circle', ({ max = 100, value = 0, size = 'md', ...otherProps }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_ProgressCircle_1.ProgressCircle, { value: value === -1 ? 'indeterminate' : value, max: max, size: size, "aria-valuetext": otherProps['aria-valuetext'] }) }));
    }, "ProgressCircle", { "properties": { "max": { "type": "number" }, "value": { "type": "number" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-valuetext"] } }, { "max": 100, "value": 0, "size": "md" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/progress-circle',["require", "exports", "./progress-circle/progress-circle"], function (require, exports, progress_circle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgressCircle = void 0;
    Object.defineProperty(exports, "ProgressCircle", { enumerable: true, get: function () { return progress_circle_1.ProgressCircle; } });
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/avatar/avatar',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Avatar", "ojs/ojvcomponent", "css!oj-c/avatar/avatar-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Avatar_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Avatar = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.Avatar = (0, ojvcomponent_1.registerCustomElement)('oj-c-avatar', ({ src, iconClass, initials, shape = 'square', background = 'neutral', size = 'md', ...otherProps }) => {
        const icon = iconClass ? (0, jsx_runtime_1.jsx)("span", { class: iconClass }) : null;
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_Avatar_1.Avatar, { src: src ?? undefined, background: background, size: size, initials: initials ?? undefined, shape: shape, "aria-label": otherProps['aria-label'], children: icon }) }));
    }, "Avatar", { "properties": { "background": { "type": "string", "enumValues": ["neutral", "orange", "green", "teal", "blue", "slate", "pink", "purple", "lilac", "gray"] }, "initials": { "type": "string|null" }, "size": { "type": "string", "enumValues": ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] }, "src": { "type": "string|null" }, "iconClass": { "type": "string" }, "shape": { "type": "string", "enumValues": ["circle", "square"] } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, { "shape": "square", "background": "neutral", "size": "md" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/avatar',["require", "exports", "./avatar/avatar"], function (require, exports, avatar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Avatar = void 0;
    Object.defineProperty(exports, "Avatar", { enumerable: true, get: function () { return avatar_1.Avatar; } });
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/button/button',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Button", "@oracle/oraclejet-preact/UNSAFE_IconButton", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "preact", "preact/hooks", "preact/compat", "@oracle/oraclejet-preact/hooks/UNSAFE_useTooltip", "ojs/ojvcomponent-binding", "ojs/ojvcomponent", "css!oj-c/button/button-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Button_1, UNSAFE_IconButton_1, UNSAFE_useTabbableMode_1, preact_1, hooks_1, compat_1, UNSAFE_useTooltip_1, ojvcomponent_binding_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Button = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    const FunctionalButton = (0, compat_1.forwardRef)((props, ref) => {
        const buttonRef = (0, hooks_1.useRef)();
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => buttonRef.current?.focus(),
            blur: () => buttonRef.current?.blur()
        }), []);
        return (0, jsx_runtime_1.jsx)(UNSAFE_Button_1.Button, { ref: buttonRef, ...props });
    });
    const FunctionalIconButton = (0, compat_1.forwardRef)((props, ref) => {
        const iconButtonRef = (0, hooks_1.useRef)();
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => iconButtonRef.current?.focus(),
            blur: () => iconButtonRef.current?.blur()
        }), []);
        return (0, jsx_runtime_1.jsx)(UNSAFE_IconButton_1.IconButton, { ref: iconButtonRef, ...props });
    });
    let Button = class Button extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.buttonRef = (0, preact_1.createRef)();
        }
        render(props) {
            const widthSize = { width: props.edge === 'bottom' ? '100%' : props.width };
            const { tooltipContent, tooltipProps } = (0, UNSAFE_useTooltip_1.useTooltip)({
                text: props.tooltip
            });
            const { chroming: variant, disabled: isDisabled, onOjAction: onAction, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, width: throwAwayWidth, display: display, label: label, ...otherProps } = { ...props };
            if (props.display != 'icons' ||
                (props.startIcon && props.endIcon && props.display == 'icons') ||
                (!props.startIcon && !props.endIcon && props.display == 'icons')) {
                const buttonContent = () => ((0, jsx_runtime_1.jsx)(FunctionalButton, { ref: this.buttonRef, variant: variant, isDisabled: isDisabled, width: '100%', onAction: onAction, "aria-label": accessibleLabel, "aria-describedby": ariaDescribedBy, startIcon: props.startIcon, endIcon: props.endIcon, size: props.size, label: props.display == 'icons'
                        ? !props.startIcon && !props.endIcon
                            ? props.label
                            : ''
                        : props.label, display: props.display != 'icons' ? props.display : 'all', ...tooltipProps, ...otherProps }));
                return props.width || props.edge !== 'none' ? ((0, jsx_runtime_1.jsxs)(ojvcomponent_1.Root, { style: widthSize, children: [buttonContent(), tooltipContent] })) : ((0, jsx_runtime_1.jsxs)(ojvcomponent_1.Root, { children: [buttonContent(), tooltipContent] }));
            }
            else {
                return ((0, jsx_runtime_1.jsx)(FunctionalIconButton, { ref: this.buttonRef, variant: variant, isDisabled: isDisabled, tooltip: props.tooltip && props.tooltip !== '' ? props.tooltip : props.label, onAction: onAction, "aria-label": accessibleLabel && accessibleLabel !== '' ? accessibleLabel : props.label, "aria-describedby": ariaDescribedBy, size: props.size, ...otherProps, children: props.startIcon ?? props.endIcon }));
            }
        }
        blur() {
            this.buttonRef.current?.blur();
        }
        focus() {
            this.buttonRef.current?.focus();
        }
    };
    Button.defaultProps = {
        chroming: 'outlined',
        disabled: false,
        size: 'md',
        display: 'all',
        endIcon: null,
        startIcon: null,
        edge: 'none',
        tooltip: ''
    };
    Button._metadata = { "properties": { "label": { "type": "string" }, "tooltip": { "type": "string" }, "disabled": { "type": "boolean" }, "width": { "type": "number|string" }, "display": { "type": "string", "enumValues": ["label", "all", "icons"] }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "edge": { "type": "string", "enumValues": ["none", "bottom"] }, "chroming": { "type": "string", "enumValues": ["ghost", "borderless", "outlined", "solid", "callToAction", "danger"], "binding": { "consume": { "name": "containerChroming" } } } }, "slots": { "startIcon": {}, "endIcon": {} }, "events": { "ojAction": { "bubbles": true } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "aria-label"] }, "methods": { "blur": {}, "focus": {} } };
    Button._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    Button._consumedContexts = [UNSAFE_useTabbableMode_1.TabbableModeContext];
    Button = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-button')
    ], Button);
    exports.Button = Button;
});

define('oj-c/button',["require", "exports", "./button/button"], function (require, exports, button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Button = void 0;
    Object.defineProperty(exports, "Button", { enumerable: true, get: function () { return button_1.Button; } });
});

define('oj-c/utils/UNSAFE_meterUtils/meterUtils',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getThresholdColorByIndex = void 0;
    const THRESHOLD_COLORS = ['danger', 'warning', 'success'];
    const getThresholdColorByIndex = (threshold, index) => {
        if (threshold.color)
            return threshold.color;
        return THRESHOLD_COLORS[index % THRESHOLD_COLORS.length];
    };
    exports.getThresholdColorByIndex = getThresholdColorByIndex;
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/rating-gauge/rating-gauge',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_RatingGauge", "ojs/ojvcomponent", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "../utils/UNSAFE_meterUtils/meterUtils", "css!oj-c/rating-gauge/rating-gauge-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_RatingGauge_1, ojvcomponent_1, hooks_1, UNSAFE_useTabbableMode_1, meterUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RatingGauge = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.RatingGauge = (0, ojvcomponent_1.registerCustomElement)('oj-c-rating-gauge', ({ max = 5, value = 0, size = 'md', color = 'neutral', step = 1, readonly = false, disabled = false, changed = false, ...otherProps }) => {
        const [hoveredVal, setHoveredVal] = (0, hooks_1.useState)();
        const inputHandler = (detail) => {
            setHoveredVal(detail.value);
            otherProps.onTransientValueChanged?.(detail.value);
        };
        const commitHandler = (detail) => {
            otherProps.onValueChanged?.(detail.value);
            if (!changed) {
                otherProps.onChangedChanged?.(true);
            }
        };
        const thresholds = otherProps.thresholds?.map((threshold, index) => {
            return {
                ...threshold,
                color: (0, meterUtils_1.getThresholdColorByIndex)(threshold, index)
            };
        });
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_RatingGauge_1.RatingGauge, { isReadonly: readonly, isDisabled: disabled, value: (hoveredVal != undefined ? hoveredVal : value), step: step, max: max, size: size, color: color, thresholds: thresholds, tooltip: otherProps.tooltip, datatip: otherProps.datatip?.({
                    value: hoveredVal != undefined ? hoveredVal : value
                }), onCommit: commitHandler, onInput: inputHandler, "aria-label": otherProps['aria-label'], "aria-labelledby": otherProps.labelledBy ?? undefined, "aria-describedby": otherProps.describedBy ?? undefined }) }));
    }, "RatingGauge", { "properties": { "max": { "type": "number" }, "readonly": { "type": "boolean" }, "disabled": { "type": "boolean" }, "changed": { "type": "boolean", "writeback": true }, "value": { "type": "number|null", "writeback": true }, "step": { "type": "number" }, "describedBy": { "type": "string|null" }, "labelledBy": { "type": "string|null" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "color": { "type": "string", "enumValues": ["neutral", "gold"] }, "thresholds": { "type": "Array<object>" }, "datatip": { "type": "function" }, "tooltip": { "type": "string" }, "transientValue": { "type": "number", "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["changed", "value", "transientValue"], "_READ_ONLY_PROPS": ["transientValue"], "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, { "max": 5, "value": 0, "size": "md", "color": "neutral", "step": 1, "readonly": false, "disabled": false, "changed": false }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});

define('oj-c/rating-gauge',["require", "exports", "./rating-gauge/rating-gauge"], function (require, exports, rating_gauge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RatingGauge = void 0;
    Object.defineProperty(exports, "RatingGauge", { enumerable: true, get: function () { return rating_gauge_1.RatingGauge; } });
});

define('oj-c/hooks/UNSAFE_useListData/useListData',["require", "exports", "ojs/ojdataproviderfactory", "preact/hooks"], function (require, exports, ojdataproviderfactory_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useListData = void 0;
    const initialState = Object.freeze({
        status: 'loading',
        data: null
    });
    const defaultOptions = {
        isInitialFetchDeferred: false
    };
    const DEFAULT_FETCH_SIZE = 25;
    const useListData = (data, options = defaultOptions) => {
        const fetchNextRef = (0, hooks_1.useRef)(null);
        const totalSizeRef = (0, hooks_1.useRef)(0);
        const isDoneRef = (0, hooks_1.useRef)(false);
        const iteratorRef = (0, hooks_1.useRef)(null);
        const abortControllerRef = (0, hooks_1.useRef)(null);
        const fetchSize = options.fetchSize && options.fetchSize > 0 ? options.fetchSize : DEFAULT_FETCH_SIZE;
        if (!data) {
            const emptyListState = getEmptyState('exact');
            return [emptyListState, (_) => Promise.resolve()];
        }
        const dataProvider = (0, hooks_1.useMemo)(() => wrapData(data), [data]);
        const [state, dispatch] = (0, hooks_1.useReducer)(reducer, initialState);
        const fetchRange = (0, hooks_1.useCallback)(async (range, resultsCallback) => {
            const fetchOptions = {
                attributes: options.attributes,
                sortCriteria: options.sortCriteria,
                filterCriterion: options.filterCriterion,
                offset: range.offset,
                size: range.count
            };
            const sizePrecision = isDoneRef.current === true ? 'exact' : 'atLeast';
            if (range.count === 0) {
                dispatch({
                    status: 'success',
                    data: {
                        offset: range.offset,
                        data: [],
                        totalSize: totalSizeRef.current,
                        sizePrecision: sizePrecision
                    }
                });
                return;
            }
            try {
                const result = await dataProvider.fetchByOffset(fetchOptions);
                const results = result['results'];
                if (resultsCallback) {
                    resultsCallback(results);
                }
                dispatch({
                    status: 'success',
                    data: {
                        offset: range.offset,
                        data: results,
                        totalSize: totalSizeRef.current,
                        sizePrecision: sizePrecision
                    }
                });
            }
            catch (error) {
                dispatch({
                    status: 'error',
                    error: error
                });
            }
        }, [dataProvider, options.attributes, options.filterCriterion, options.sortCriteria]);
        const loadInitial = (0, hooks_1.useCallback)(async () => {
            dispatch({ status: 'loading', data: null });
            const controller = new AbortController();
            abortControllerRef.current = controller;
            const iterator = dataProvider
                .fetchFirst({
                attributes: options.attributes,
                sortCriteria: options.sortCriteria,
                filterCriterion: options.filterCriterion,
                size: fetchSize,
                signal: controller.signal
            })[Symbol.asyncIterator]();
            iteratorRef.current = iterator;
            try {
                const result = await iterator.next();
                const fetchParameters = result.value.fetchParameters;
                if (fetchParameters.signal && fetchParameters.signal.aborted) {
                    return;
                }
                totalSizeRef.current = result.value.data.length;
                if (result.done !== undefined) {
                    isDoneRef.current = result.done;
                }
                const initialFetchSize = options.initialRowsFetched && options.initialRowsFetched > 0
                    ? options.initialRowsFetched
                    : fetchSize;
                fetchRange({ offset: 0, count: Math.min(totalSizeRef.current, initialFetchSize) });
            }
            catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return;
                }
                dispatch({
                    status: 'error',
                    error: error
                });
                iteratorRef.current = null;
            }
        }, [
            dataProvider,
            fetchRange,
            options.attributes,
            options.filterCriterion,
            options.sortCriteria,
            options.fetchSize
        ]);
        const loadRange = (0, hooks_1.useCallback)(async (range) => {
            if (iteratorRef.current === null) {
                loadInitial();
            }
            else {
                const endIndex = range.offset + range.count;
                if (endIndex > totalSizeRef.current) {
                    if (fetchNextRef.current == null) {
                        const promise = fetchNextUntilThresholdOrDone(iteratorRef, totalSizeRef.current, endIndex);
                        fetchNextRef.current = promise;
                        try {
                            const value = await promise;
                            if (value.done !== undefined) {
                                isDoneRef.current = value.done;
                            }
                            const total = value.total;
                            if (total > 0) {
                                totalSizeRef.current = total;
                                fetchRange({
                                    offset: range.offset,
                                    count: Math.min(totalSizeRef.current - range.offset, range.count)
                                });
                            }
                            fetchNextRef.current = null;
                        }
                        catch (error) {
                            dispatch({
                                status: 'error',
                                error: error
                            });
                            fetchNextRef.current = null;
                        }
                    }
                }
                else {
                    fetchRange(range);
                }
            }
        }, [state, loadInitial, fetchRange]);
        const resetAndLoad = (0, hooks_1.useCallback)(() => {
            iteratorRef.current = null;
            fetchNextRef.current = null;
            totalSizeRef.current = 0;
            isDoneRef.current = false;
            if (options.initialRowsFetched === 0) {
                dispatch(getEmptyState('atLeast'));
            }
            else if (!options.isInitialFetchDeferred) {
                loadInitial();
            }
            else {
                dispatch({ status: 'loading', data: null });
            }
        }, [loadInitial, options.isInitialFetchDeferred, options.initialRowsFetched]);
        (0, hooks_1.useEffect)(() => {
            resetAndLoad();
        }, [resetAndLoad]);
        const handleMutation = (0, hooks_1.useCallback)((event) => {
            if (state.status === 'success' && state.data) {
                const dataState = state.data;
                let shouldUpdate = false;
                if (event.detail.add) {
                    const itemsInserted = handleAddRemoveMutation(event.detail.add, dataState, options, true);
                    totalSizeRef.current = totalSizeRef.current + itemsInserted;
                    shouldUpdate = itemsInserted > 0 || dataState.sizePrecision === 'exact';
                    if (itemsInserted === 0) {
                        isDoneRef.current = false;
                    }
                }
                if (event.detail.remove) {
                    const itemsRemoved = handleAddRemoveMutation(event.detail.remove, dataState, options, false);
                    totalSizeRef.current = totalSizeRef.current - itemsRemoved;
                    shouldUpdate = shouldUpdate || itemsRemoved > 0;
                }
                let callback;
                const updateDetail = event.detail.update;
                if (updateDetail) {
                    shouldUpdate = shouldUpdate || handleUpdateMutation(updateDetail, dataState, options);
                    callback = (results) => {
                        processDataAfterUpdate(updateDetail, dataState, results);
                    };
                }
                if (shouldUpdate) {
                    fetchRange({ offset: dataState.offset, count: dataState.data.length }, callback);
                }
            }
        }, [state, options, fetchRange]);
        const handleRefresh = (0, hooks_1.useCallback)((event) => {
            let adjustment = -1;
            const disregardAfterKey = event.detail?.disregardAfterKey;
            if (disregardAfterKey && state.status === 'success') {
                const index = state.data.data.findIndex((value) => {
                    return value.metadata.key === disregardAfterKey;
                });
                if (index > -1) {
                    adjustment = state.data.data.length - index - 1;
                }
                if (adjustment === 0 && state.data.data.length >= fetchSize) {
                    return;
                }
            }
            if (adjustment > -1 && state.status === 'success') {
                totalSizeRef.current = totalSizeRef.current - adjustment;
                loadRange({
                    offset: state.data.offset,
                    count: Math.max(state.data.data.length, fetchSize)
                });
            }
            else {
                if (state.status === 'loading') {
                    abortControllerRef.current?.abort();
                }
                resetAndLoad();
            }
        }, [state, resetAndLoad]);
        (0, hooks_1.useEffect)(() => {
            dataProvider.addEventListener('refresh', handleRefresh);
            dataProvider.addEventListener('mutate', handleMutation);
            return () => {
                dataProvider.removeEventListener('refresh', handleRefresh);
                dataProvider.removeEventListener('mutate', handleMutation);
            };
        }, [dataProvider, resetAndLoad, handleMutation]);
        return [state, loadRange];
    };
    exports.useListData = useListData;
    const wrapData = (data) => {
        const configuration = {
            fetchFirst: { caching: 'visitedByCurrentIterator' }
        };
        return (0, ojdataproviderfactory_1.getEnhancedDataProvider)(data, configuration);
    };
    const reducer = (state, action) => {
        if (state.status === action.status && action.status === 'loading') {
            return state;
        }
        return action;
    };
    const fetchNextUntilThresholdOrDone = async (iteratorRef, current, threshold) => {
        return await fetchNextRecursive(iteratorRef, current, threshold);
    };
    const fetchNextRecursive = async (iteratorRef, currentCount, threshold) => {
        const currentIterator = iteratorRef.current;
        if (currentIterator === null) {
            return { total: -1, done: undefined };
        }
        const result = await currentIterator.next();
        if (currentIterator === iteratorRef.current) {
            currentCount += result.value.data.length;
            if (currentCount >= threshold || result.done) {
                return { total: currentCount, done: result.done };
            }
            return fetchNextRecursive(iteratorRef, currentCount, threshold);
        }
        return { total: -1, done: undefined };
    };
    const getEmptyState = (precision) => {
        return {
            status: 'success',
            data: {
                offset: 0,
                data: [],
                totalSize: 0,
                sizePrecision: precision
            }
        };
    };
    const handleAddRemoveMutation = (detail, dataState, options, isAdd) => {
        let itemCount = 0;
        if (isIndexesAvailable(detail, options)) {
            const indexes = isAdd ? detail.indexes?.sort() : detail.indexes;
            let endIndex = dataState.totalSize - 1;
            indexes?.forEach((index) => {
                if (index <= endIndex) {
                    itemCount = itemCount += 1;
                    if (isAdd) {
                        endIndex = endIndex += 1;
                    }
                }
            });
        }
        else {
        }
        return itemCount;
    };
    const handleUpdateMutation = (detail, dataState, options) => {
        if (isIndexesAvailable(detail, options)) {
            const indexes = detail.indexes ? detail.indexes : [];
            const startIndex = dataState.offset;
            const endIndex = startIndex + dataState.data.length;
            for (let i = 0; i < indexes.length; i++) {
                if (indexes[i] >= startIndex && indexes[i] < endIndex) {
                    return true;
                }
            }
        }
        else {
        }
        return false;
    };
    const processDataAfterUpdate = (detail, dataState, results) => {
        detail.keys.forEach((key) => {
            const updatedData = results.find((item) => {
                return item.metadata.key == key;
            });
            const currentData = dataState.data.find((item) => {
                return item.metadata.key == key;
            });
            if (currentData && updatedData && currentData.data === updatedData.data) {
                updatedData.data = new Proxy(updatedData.data, {});
            }
        });
    };
    const isIndexesAvailable = (detail, options) => {
        return detail.indexes && options.sortCriteria == null && options.filterCriterion == null;
    };
});

define('oj-c/select-common/utils/utils',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isSetEqual = exports.isEmpty = exports.DEFAULT_VALUE_ITEMS = exports.DEFAULT_VALUE_ITEM = exports.DEFAULT_VALUE = exports.DEFAULT_ITEM_CONTEXT = void 0;
    exports.DEFAULT_ITEM_CONTEXT = null;
    exports.DEFAULT_VALUE = null;
    exports.DEFAULT_VALUE_ITEM = null;
    exports.DEFAULT_VALUE_ITEMS = null;
    function isEmpty(value) {
        if (!value)
            return true;
        if (Array.isArray(value))
            return value.length === 0;
        if (value instanceof Set || value instanceof Map)
            return value.size === 0;
        return false;
    }
    exports.isEmpty = isEmpty;
    function isSetEqual(a, b) {
        if (a === b)
            return true;
        if (a?.size !== b?.size)
            return false;
        const aArray = Array.from(a);
        const bArray = Array.from(b);
        return aArray.every((value, index) => value === bArray[index]);
    }
    exports.isSetEqual = isSetEqual;
});

define('oj-c/select-common/UNSAFE_useDataProviderListeners/useDataProviderListeners',["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_logger", "preact/hooks", "../utils/utils"], function (require, exports, UNSAFE_logger_1, hooks_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDataProviderListeners = void 0;
    function cloneValue(value) {
        return value instanceof Set ? new Set(value.values()) : value;
    }
    function cloneValueItem(valueItem) {
        return valueItem instanceof Map ? new Map(valueItem.entries()) : Object.assign({}, valueItem);
    }
    function compareValues(value, valueToCompare) {
        if ((value instanceof Set && valueToCompare instanceof Set) ||
            (value instanceof Map && valueToCompare instanceof Map)) {
            return value.size === valueToCompare.size;
        }
        if (typeof value === 'object' && typeof valueToCompare === 'object') {
            return value.key === valueToCompare.key;
        }
        return value === valueToCompare;
    }
    function containsValue(value, query) {
        return value instanceof Set ? value.has(query) : value != null && value === query;
    }
    function deleteFromValue(value, toDelete) {
        if (value instanceof Set || value instanceof Map) {
            value.delete(toDelete);
            return value;
        }
        if (typeof value === 'number' || typeof value === 'string') {
            if (value === toDelete) {
                return utils_1.DEFAULT_VALUE;
            }
            return value;
        }
        if (typeof value === 'object' && value.key === toDelete) {
            return utils_1.DEFAULT_VALUE_ITEMS;
        }
        return value;
    }
    function useDataProviderListeners({ dataProvider, setValue, setValueToSync, setValueItemsToSync, value, valueItems }) {
        const isSelectMultiple = value instanceof Set;
        const handleRefresh = (0, hooks_1.useCallback)(() => {
            if (!(0, utils_1.isEmpty)(value)) {
                setValueToSync(cloneValue(value));
                setValueItemsToSync(utils_1.DEFAULT_VALUE_ITEMS);
            }
        }, [value]);
        const handleMutation = (0, hooks_1.useCallback)((event) => {
            if ((0, utils_1.isEmpty)(value)) {
                return;
            }
            let newVal = cloneValue(value);
            if (event.detail.remove != null) {
                const keys = event.detail.remove.keys;
                keys.forEach((key) => {
                    if (containsValue(newVal, key)) {
                        newVal = deleteFromValue(newVal, key);
                        UNSAFE_logger_1.Logger.warn(`
              ${isSelectMultiple ? 'SelectMultiple' : 'SelectSingle'}: selected value removed from data provider: ${key}`);
                    }
                });
                if (!compareValues(newVal, value)) {
                    setValue(!(0, utils_1.isEmpty)(newVal) ? newVal : utils_1.DEFAULT_VALUE);
                    setValueToSync(!(0, utils_1.isEmpty)(newVal) ? newVal : utils_1.DEFAULT_VALUE);
                }
            }
            if ((0, utils_1.isEmpty)(newVal)) {
                return;
            }
            if (event.detail.update != null) {
                const keys = event.detail.update.keys;
                let newValueItems = (0, utils_1.isEmpty)(valueItems)
                    ? valueItems
                    : cloneValueItem(valueItems);
                keys.forEach((key) => {
                    if (containsValue(newVal, key)) {
                        newValueItems = deleteFromValue(newValueItems, key);
                    }
                });
                if (!compareValues(newValueItems, valueItems)) {
                    setValueToSync(newVal);
                    setValueItemsToSync(!(0, utils_1.isEmpty)(newValueItems) ? newValueItems : utils_1.DEFAULT_VALUE_ITEMS);
                }
            }
        }, [value, valueItems]);
        (0, hooks_1.useEffect)(() => {
            dataProvider?.addEventListener('refresh', handleRefresh);
            dataProvider?.addEventListener('mutate', handleMutation);
            return () => {
                dataProvider?.removeEventListener('refresh', handleRefresh);
                dataProvider?.removeEventListener('mutate', handleMutation);
            };
        }, [dataProvider, handleMutation, handleRefresh]);
    }
    exports.useDataProviderListeners = useDataProviderListeners;
});

define('oj-c/select-common/UNSAFE_useWrapDataProvider/useWrapDataProvider',["require", "exports", "ojs/ojdataproviderfactory", "preact/hooks"], function (require, exports, ojdataproviderfactory_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useWrapDataProvider = void 0;
    function useWrapDataProvider(data) {
        const dataProvider = (0, hooks_1.useMemo)(() => {
            return data
                ? (0, ojdataproviderfactory_1.getEnhancedDataProvider)(data, {
                    fetchFirst: { caching: 'visitedByCurrentIterator' }
                })
                : data;
        }, [data]);
        return dataProvider;
    }
    exports.useWrapDataProvider = useWrapDataProvider;
});

define('oj-c/select-common/UNSAFE_useWrapValueState/useWrapValueState',["require", "exports", "preact/hooks", "../utils/utils"], function (require, exports, hooks_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useWrapValueState = void 0;
    function useWrapValueState({ arItemContexts, isLoading, preactValueItems, setPreactValueItems }) {
        const getValueForValidationFunc = (0, hooks_1.useCallback)((valueForValidation) => {
            return (valid) => {
                if (valid === 'invalidShown' && !isLoading) {
                    return (0, utils_1.isEmpty)(preactValueItems) ? null : valueForValidation;
                }
                return valueForValidation;
            };
        }, [isLoading, preactValueItems]);
        const refreshDisplayValue = (0, hooks_1.useCallback)(() => {
            setPreactValueItems(arItemContexts);
        }, [arItemContexts]);
        const wrapValueState = (0, hooks_1.useCallback)((valueState) => {
            return {
                ...valueState,
                getValueForValidation: getValueForValidationFunc(valueState.value),
                refreshDisplayValue
            };
        }, [getValueForValidationFunc, refreshDisplayValue]);
        return { wrapValueState };
    }
    exports.useWrapValueState = useWrapValueState;
});

define('oj-c/utils/UNSAFE_keyUtils/keySetUtils',["require", "exports", "ojs/ojkeyset"], function (require, exports, ojkeyset_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.keysToKeySet = exports.keySetToKeys = void 0;
    const keySetToKeys = (keySet) => {
        if (!keySet) {
            return { all: false, keys: new Set() };
        }
        let keys = {};
        if (keySet.isAddAll()) {
            const deletedValues = new Set(keySet.deletedValues());
            keys = { all: true, deletedKeys: deletedValues };
        }
        else if (!keySet.isAddAll()) {
            const values = new Set(keySet.values());
            keys = { all: false, keys: values };
        }
        return keys;
    };
    exports.keySetToKeys = keySetToKeys;
    const keysToKeySet = (keys) => {
        let keySet;
        if (keys.all) {
            keySet = new ojkeyset_1.AllKeySetImpl();
            keySet = keySet.delete(new Set(keys.deletedKeys.values()));
        }
        else if (!keys.all) {
            keySet = new ojkeyset_1.KeySetImpl(new Set(keys.keys.values()));
        }
        return keySet;
    };
    exports.keysToKeySet = keysToKeySet;
});

define('oj-c/select-multiple/useSyncValueAndValueItems',["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_logger", "oj-c/select-common/utils/utils", "preact/hooks"], function (require, exports, UNSAFE_logger_1, utils_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSyncValueAndValueItems = void 0;
    function useSyncValueAndValueItems({ addBusyState, dataProvider, setIsLoading, setValue, setValueItems, value, valueItems }) {
        const prevValueRef = (0, hooks_1.useRef)(value);
        const prevValueItemsRef = (0, hooks_1.useRef)(valueItems);
        const hasValue = value && value instanceof Set && value.size > 0;
        const hasValueItems = valueItems && valueItems.size > 0;
        const latestFetchRef = (0, hooks_1.useRef)(null);
        const syncValueItemsToValue = (0, hooks_1.useCallback)(() => {
            if (!hasValue) {
                if (hasValueItems) {
                    setValueItems(utils_1.DEFAULT_VALUE_ITEMS);
                }
                return;
            }
            const arValues = Array.from(value.keys());
            const valuesToFetch = arValues.reduce((accum, currKey) => {
                if (!hasValueItems || !valueItems.has(currKey)) {
                    accum.push(currKey);
                }
                return accum;
            }, []);
            if (valuesToFetch.length === 0) {
                const newValItems = new Map();
                value.forEach((currKey) => {
                    newValItems.set(currKey, valueItems.get(currKey));
                });
                setValueItems(newValItems);
                return;
            }
            setIsLoading(true);
            const resolveBusyState = addBusyState('useSyncValueItems: calling fetchByKeys');
            const latestFetch = {};
            latestFetchRef.current = latestFetch;
            dataProvider
                .fetchByKeys({ keys: new Set(valuesToFetch) })
                .then((fbkResults) => {
                if (latestFetch === latestFetchRef.current) {
                    const newValueItems = handleFetchByKeysResults(value, valueItems, fbkResults.results);
                    setValueItems(newValueItems);
                }
            })
                .catch((reason) => {
                if (latestFetch === latestFetchRef.current) {
                    UNSAFE_logger_1.Logger.error(`SelectMultiple: fetchByKeys promise rejected: ${reason}`);
                }
            })
                .finally(() => {
                if (latestFetch === latestFetchRef.current) {
                    setIsLoading(false);
                }
                resolveBusyState();
            });
        }, [dataProvider, hasValue, hasValueItems, value, valueItems]);
        const syncValueToValueItems = (0, hooks_1.useCallback)(() => {
            if (!hasValueItems) {
                if (hasValue) {
                    setValue(utils_1.DEFAULT_VALUE);
                }
                return;
            }
            const arValueItemsKeys = Array.from(valueItems.keys());
            const valueItemsKeys = new Set(arValueItemsKeys);
            if (!value || !(value instanceof Set) || value.size !== valueItemsKeys.size) {
                setValue(valueItemsKeys);
                return;
            }
            const arValueKeys = Array.from(value.keys());
            const isDifferent = arValueItemsKeys.some((key, index) => key !== arValueKeys[index]);
            if (isDifferent) {
                setValue(valueItemsKeys);
            }
        }, [hasValue, hasValueItems, value, valueItems]);
        (0, hooks_1.useEffect)(() => {
            if (hasValue) {
                syncValueItemsToValue();
            }
            else if (hasValueItems) {
                syncValueToValueItems();
            }
        }, []);
        (0, hooks_1.useEffect)(() => {
            if (value !== prevValueRef.current && valueItems !== prevValueItemsRef.current) {
                prevValueRef.current = value;
                prevValueItemsRef.current = valueItems;
                if (value) {
                    syncValueItemsToValue();
                }
                else {
                    syncValueToValueItems();
                }
            }
            else if (value !== prevValueRef.current) {
                prevValueRef.current = value;
                syncValueItemsToValue();
            }
            else if (valueItems !== prevValueItemsRef.current) {
                prevValueItemsRef.current = valueItems;
                syncValueToValueItems();
            }
        }, [value, valueItems]);
    }
    exports.useSyncValueAndValueItems = useSyncValueAndValueItems;
    function handleFetchByKeysResults(value, valueItems, fetchByKeysResults) {
        const arKeys = Array.from(value.keys());
        return arKeys.reduce((accumMap, currKey) => {
            if (valueItems && valueItems.has(currKey)) {
                accumMap.set(currKey, valueItems.get(currKey));
                return accumMap;
            }
            const item = fetchByKeysResults.get(currKey);
            if (!item) {
                throw new Error(`oj-c-select-multiple: could not fetch data for key ${currKey}`);
            }
            accumMap.set(currKey, {
                key: currKey,
                data: item.data,
                metadata: item.metadata ? item.metadata : { currKey }
            });
            return accumMap;
        }, new Map());
    }
});

define('oj-c/select-multiple/useValueItems',["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useUncontrolledState", "preact/hooks"], function (require, exports, UNSAFE_useUncontrolledState_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useValueItems = void 0;
    function useValueItems(propValueItems, onValueItemsChanged) {
        const [valueItems, setValueItems] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(propValueItems, onValueItemsChanged);
        (0, hooks_1.useEffect)(() => {
            if (valueItems !== propValueItems) {
                setValueItems(propValueItems);
            }
        }, [propValueItems]);
        const preactValueItems = (0, hooks_1.useMemo)(() => {
            return valueItems ? Array.from(valueItems.values()) : undefined;
        }, [valueItems]);
        return {
            valueItems,
            setValueItems,
            preactValueItems
        };
    }
    exports.useValueItems = useValueItems;
});

define('oj-c/select-multiple/useSelectMultiplePreact',["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue", "oj-c/editable-value/UNSAFE_useValidators/useValidators", "oj-c/hooks/UNSAFE_useListData/useListData", "oj-c/select-common/UNSAFE_useDataProviderListeners/useDataProviderListeners", "oj-c/select-common/UNSAFE_useWrapDataProvider/useWrapDataProvider", "oj-c/select-common/UNSAFE_useWrapValueState/useWrapValueState", "oj-c/select-common/utils/utils", "oj-c/utils/UNSAFE_keyUtils/keySetUtils", "ojs/ojdataprovider", "preact/hooks", "./useSyncValueAndValueItems", "./useValueItems"], function (require, exports, UNSAFE_useTranslationBundle_1, useEditableValue_1, useValidators_1, useListData_1, useDataProviderListeners_1, useWrapDataProvider_1, useWrapValueState_1, utils_1, keySetUtils_1, ojdataprovider_1, hooks_1, useSyncValueAndValueItems_1, useValueItems_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSelectMultiplePreact = void 0;
    function useSelectMultiplePreact({ data: propData, disabled, displayOptions, itemTemplate, itemText, labelEdge, labelHint, labelStartWidth, messagesCustom, placeholder, readonly, required, requiredMessageDetail: propRequiredMessageDetail, textAlign, userAssistanceDensity, value: propValue, valueItems: propValueItems, virtualKeyboard, onMessagesCustomChanged, onValidChanged, onValueChanged, onValueItemsChanged, ...otherProps }, addBusyState) {
        const [filterCriterion, setFilterCriterion] = (0, hooks_1.useState)(undefined);
        const [isLoading, setIsLoading] = (0, hooks_1.useState)(propData != null &&
            propValue != null &&
            propValue.size > 0 &&
            (propValueItems == null || propValueItems.size === 0));
        const { valueItems, setValueItems, preactValueItems: arItemContexts } = (0, useValueItems_1.useValueItems)(propValueItems, onValueItemsChanged);
        const [preactValueItems, setPreactValueItems] = (0, hooks_1.useState)(arItemContexts);
        (0, hooks_1.useEffect)(() => {
            setPreactValueItems(arItemContexts);
        }, [arItemContexts]);
        const { wrapValueState } = (0, useWrapValueState_1.useWrapValueState)({
            arItemContexts,
            isLoading,
            preactValueItems,
            setPreactValueItems
        });
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const requiredMessageDetail = propRequiredMessageDetail || translations.select_requiredMessageDetail();
        const { methods, onCommitValue, setValue, textFieldProps, value } = (0, useEditableValue_1.useEditableValue)({
            ariaDescribedBy: otherProps['aria-describedby'],
            disabled,
            displayOptions,
            messagesCustom,
            readonly,
            required,
            requiredMessageDetail,
            value: propValue,
            addBusyState,
            onMessagesCustomChanged,
            onValidChanged,
            onValueChanged,
            wrapValueState
        });
        const { 'aria-describedby': ariaDescribedBy, messages } = textFieldProps;
        const hasNoValue = value === null || (value instanceof Set && value.size === 0);
        const dataProvider = (0, useWrapDataProvider_1.useWrapDataProvider)(propData);
        const [valueToSync, setValueToSync] = (0, hooks_1.useState)(value);
        const [valueItemsToSync, setValueItemsToSync] = (0, hooks_1.useState)(valueItems);
        (0, hooks_1.useEffect)(() => {
            setValueToSync(value);
        }, [value]);
        (0, hooks_1.useEffect)(() => {
            setValueItemsToSync(valueItems);
        }, [valueItems]);
        (0, useDataProviderListeners_1.useDataProviderListeners)({
            dataProvider,
            setValue: setValue,
            setValueToSync: setValueToSync,
            setValueItemsToSync,
            value: value,
            valueItems
        });
        (0, useSyncValueAndValueItems_1.useSyncValueAndValueItems)({
            addBusyState,
            dataProvider: dataProvider,
            setIsLoading,
            setValue: setValue,
            setValueItems,
            value: valueToSync,
            valueItems: valueItemsToSync
        });
        const [listDataState, onLoadRange] = (0, useListData_1.useListData)(dataProvider, {
            filterCriterion,
            initialRowsFetched: 0
        });
        const onCommit = (0, hooks_1.useCallback)(async (detail) => {
            const validationResult = await onCommitValue((detail.value && detail.value.size > 0 ? detail.value : utils_1.DEFAULT_VALUE));
            if (validationResult === useValidators_1.ValidationResult.INVALID) {
                setPreactValueItems(undefined);
            }
        }, [onCommitValue]);
        const onFilter = (0, hooks_1.useCallback)(({ searchText }) => {
            const fc = searchText && searchText.length > 0
                ? ojdataprovider_1.FilterFactory.getFilter({ filterDef: { text: searchText } })
                : undefined;
            setFilterCriterion(fc);
        }, []);
        const prevSelectedKeysRef = (0, hooks_1.useRef)((0, keySetUtils_1.keysToKeySet)({ all: false, keys: new Set() }));
        const itemRenderer = (0, hooks_1.useCallback)(({ data, metadata, searchText, selectedKeys: preactSelectedKeys, onSelectionChange: preactOnSelectionChange }) => {
            const newPreactSelectedKeys = preactSelectedKeys ?? new Set();
            const prevPreactSelectedKeys = prevSelectedKeysRef.current.keys.keys ?? new Set();
            const selectedKeys = (0, utils_1.isSetEqual)(prevPreactSelectedKeys, newPreactSelectedKeys)
                ? prevSelectedKeysRef.current
                : (0, keySetUtils_1.keysToKeySet)({ all: false, keys: newPreactSelectedKeys });
            prevSelectedKeysRef.current = selectedKeys;
            const onSelectedKeysChanged = ((arg) => {
                const immutableKeySet = (arg instanceof CustomEvent ? arg.detail.value : arg);
                const immutableSet = immutableKeySet.keys.keys;
                preactOnSelectionChange?.({
                    target: arg instanceof CustomEvent ? arg.target : null,
                    value: new Set(immutableSet?.values())
                });
            });
            return itemTemplate
                ? itemTemplate({
                    selectedKeys,
                    onSelectedKeysChanged,
                    item: {
                        data,
                        metadata
                    },
                    searchText
                })
                : undefined;
        }, [itemTemplate]);
        const _selectItemsByValue = (0, hooks_1.useCallback)(async (value) => {
            return onCommit({
                value: value ?? undefined,
                previousValue: propValue ?? undefined
            });
        }, [onCommit]);
        return {
            methods,
            selectMultipleProps: {
                'aria-describedby': ariaDescribedBy,
                data: listDataState.data,
                isDisabled: disabled,
                isLoading,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                itemRenderer: itemTemplate ? itemRenderer : undefined,
                itemText,
                label: labelHint,
                labelEdge,
                labelStartWidth,
                messages,
                onCommit,
                onFilter,
                onLoadRange,
                placeholder,
                textAlign,
                userAssistanceDensity,
                valueItems: preactValueItems,
                virtualKeyboard
            },
            _selectItemsByValue
        };
    }
    exports.useSelectMultiplePreact = useSelectMultiplePreact;
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/select-multiple/select-multiple',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_SelectMultiple", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "ojs/ojcontext", "ojs/ojvcomponent", "ojs/ojvcomponent-binding", "preact", "preact/compat", "preact/hooks", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "./useSelectMultiplePreact", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "css!oj-c/select-multiple/select-multiple-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_SelectMultiple_1, UNSAFE_useTabbableMode_1, ojcontext_1, ojvcomponent_1, ojvcomponent_binding_1, preact_1, compat_1, hooks_1, useAssistiveText_1, useSelectMultiplePreact_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useAccessibleContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectMultiple = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    const FunctionalSelectMultiple = (0, compat_1.forwardRef)((props, ref) => {
        const { busyContextRef, displayOptions, help, helpHints } = props;
        const selectMultipleRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-select-multiple id=${props.id}: ${desc}`
            });
        }, []);
        const { selectMultipleProps, methods, _selectItemsByValue } = (0, useSelectMultiplePreact_1.useSelectMultiplePreact)(props, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => selectMultipleRef.current?.blur(),
            focus: () => selectMultipleRef.current?.focus(),
            _selectItemsByValue,
            ...methods
        }), [methods, _selectItemsByValue]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: selectMultipleProps.userAssistanceDensity
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        return ((0, jsx_runtime_1.jsx)(UNSAFE_SelectMultiple_1.SelectMultiple, { ref: selectMultipleRef, ...assistiveTextProps, ...selectMultipleProps, variant: variant }));
    });
    let SelectMultiple = class SelectMultiple extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.busyContextRef = (0, preact_1.createRef)();
            this.selectMultipleRef = (0, preact_1.createRef)();
            this.rootRef = (0, preact_1.createRef)();
        }
        componentDidMount() {
            this.busyContextRef.current = ojcontext_1.default.getContext(this.rootRef.current).getBusyContext();
        }
        render(props) {
            const containerProps = {
                isFormLayout: props.containerReadonly !== undefined,
                isReadonly: props.containerReadonly,
                labelWrapping: props.labelWrapping
            };
            const accessibleProps = {
                UNSAFE_ariaLabelledBy: props.unsafe_labelledBy
            };
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: this.rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(FunctionalSelectMultiple, { busyContextRef: this.busyContextRef, ref: this.selectMultipleRef, ...props }) }) }) }));
        }
        componentWillUnmount() {
            this.busyContextRef.current = null;
        }
        reset() {
            this.selectMultipleRef.current?.reset();
        }
        showMessages() {
            this.selectMultipleRef.current?.showMessages();
        }
        validate() {
            return this.selectMultipleRef.current?.validate();
        }
        blur() {
            this.selectMultipleRef.current?.blur();
        }
        focus() {
            this.selectMultipleRef.current?.focus();
        }
        _selectItemsByValue(value) {
            return this.selectMultipleRef.current?._selectItemsByValue(value);
        }
    };
    SelectMultiple.defaultProps = {
        data: null,
        disabled: false,
        displayOptions: {
            messages: 'display'
        },
        help: {
            instruction: ''
        },
        helpHints: {
            definition: '',
            source: '',
            sourceText: undefined
        },
        messagesCustom: [],
        readonly: false,
        required: false,
        userAssistanceDensity: 'reflow',
        value: null,
        valueItems: null,
        virtualKeyboard: 'auto'
    };
    SelectMultiple._metadata = { "properties": { "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "data": { "type": "DataProvider|null" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["display", "none"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "itemText": { "type": "string|number|function" }, "labelEdge": { "type": "string", "enumValues": ["start", "none", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["wrap", "truncate"], "binding": { "consume": { "name": "labelWrapping" } } }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "placeholder": { "type": "string" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["start", "right", "end"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "efficient", "reflow"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "value": { "type": "object|null", "writeback": true }, "valueItems": { "type": "object|null", "writeback": true }, "virtualKeyboard": { "type": "string", "enumValues": ["number", "text", "auto", "search", "email", "tel", "url"] }, "valid": { "type": "string", "enumValues": ["valid", "pending", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "slots": { "itemTemplate": { "data": {} } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "valid", "value", "valueItems"], "_READ_ONLY_PROPS": ["valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "reset": {}, "showMessages": {}, "validate": {}, "blur": {}, "focus": {}, "_selectItemsByValue": {} } };
    SelectMultiple._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    SelectMultiple._consumedContexts = [UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext];
    SelectMultiple = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-select-multiple')
    ], SelectMultiple);
    exports.SelectMultiple = SelectMultiple;
});

define('oj-c/select-multiple',["require", "exports", "./select-multiple/select-multiple"], function (require, exports, select_multiple_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectMultiple = void 0;
    Object.defineProperty(exports, "SelectMultiple", { enumerable: true, get: function () { return select_multiple_1.SelectMultiple; } });
});

define('oj-c/select-single/useSyncValueAndValueItem',["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_logger", "oj-c/editable-value/UNSAFE_useStaleIdentity/useStaleIdentity", "oj-c/select-common/utils/utils", "preact/hooks"], function (require, exports, UNSAFE_logger_1, useStaleIdentity_1, utils_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSyncValueAndValueItem = void 0;
    function useSyncValueAndValueItem({ addBusyState, dataProvider, setIsLoading, setValue, setValueItem, value, valueItem }) {
        const prevValueRef = (0, hooks_1.useRef)(value);
        const prevValueItemsRef = (0, hooks_1.useRef)(valueItem);
        const { setStaleIdentity } = (0, useStaleIdentity_1.useStaleIdentity)();
        const hasValue = value != null;
        const hasValueItem = valueItem != null;
        const syncValueItemToValue = (0, hooks_1.useCallback)(async () => {
            if (!hasValue) {
                if (hasValueItem) {
                    setValueItem(utils_1.DEFAULT_VALUE_ITEM);
                }
                return;
            }
            if (value != null && valueItem != null && valueItem.key === value) {
                setValueItem(Object.assign({}, valueItem));
                return;
            }
            if (!dataProvider) {
                return;
            }
            setIsLoading(true);
            const resolveBusyState = addBusyState('useSyncValueItem: calling fetchByKeys');
            const { isStale } = setStaleIdentity('useSyncValueItem:fetchByKeys');
            try {
                const fetchResults = await dataProvider.fetchByKeys({ keys: new Set([value]) });
                if (!isStale()) {
                    const newValueItems = handleFetchByKeysResults(value, valueItem, fetchResults.results);
                    setValueItem(newValueItems);
                }
            }
            catch (reason) {
                if (!isStale()) {
                    UNSAFE_logger_1.Logger.error(`SelectMultiple: fetchByKeys promise rejected: ${reason}`);
                }
            }
            if (!isStale()) {
                setIsLoading(false);
            }
            resolveBusyState();
        }, [dataProvider, hasValue, hasValueItem, value, valueItem]);
        const syncValueToValueItem = (0, hooks_1.useCallback)(() => {
            if (!hasValueItem) {
                if (hasValue) {
                    setValue(utils_1.DEFAULT_VALUE);
                }
                return;
            }
            if (valueItem.key !== value) {
                setValue(valueItem.key);
                return;
            }
        }, [hasValue, hasValueItem, value, valueItem]);
        (0, hooks_1.useEffect)(() => {
            if (hasValue) {
                syncValueItemToValue();
            }
            else if (hasValueItem) {
                syncValueToValueItem();
            }
        }, []);
        (0, hooks_1.useEffect)(() => {
            if (value !== prevValueRef.current && valueItem !== prevValueItemsRef.current) {
                prevValueRef.current = value;
                prevValueItemsRef.current = valueItem;
                if (value) {
                    syncValueItemToValue();
                }
                else {
                    syncValueToValueItem();
                }
            }
            else if (value !== prevValueRef.current) {
                prevValueRef.current = value;
                syncValueItemToValue();
            }
            else if (valueItem !== prevValueItemsRef.current) {
                prevValueItemsRef.current = valueItem;
                syncValueToValueItem();
            }
        }, [value, valueItem]);
    }
    exports.useSyncValueAndValueItem = useSyncValueAndValueItem;
    function handleFetchByKeysResults(value, valueItem, fetchByKeysResults) {
        if (valueItem && valueItem.key === value) {
            return valueItem;
        }
        const item = fetchByKeysResults.get(value);
        if (!item) {
            throw new Error(`oj-c-select-single: could not fetch data for key ${value}`);
        }
        return {
            key: value,
            data: item.data,
            metadata: item.metadata ? item.metadata : { key: value }
        };
    }
});

define('oj-c/select-single/useValueItem',["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useUncontrolledState", "preact/hooks"], function (require, exports, UNSAFE_useUncontrolledState_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useValueItem = void 0;
    function useValueItem(propValueItem, onValueItemsChanged) {
        const [valueItem, setValueItem] = (0, UNSAFE_useUncontrolledState_1.useUncontrolledState)(propValueItem, onValueItemsChanged);
        (0, hooks_1.useEffect)(() => {
            if (valueItem !== propValueItem) {
                setValueItem(propValueItem);
            }
        }, [propValueItem]);
        return {
            valueItem,
            setValueItem
        };
    }
    exports.useValueItem = useValueItem;
});

define('oj-c/select-single/useSelectSinglePreact',["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "oj-c/editable-value/UNSAFE_useEditableValue/useEditableValue", "oj-c/editable-value/UNSAFE_useValidators/useValidators", "oj-c/editable-value/utils/utils", "oj-c/hooks/UNSAFE_useListData/useListData", "oj-c/select-common/UNSAFE_useDataProviderListeners/useDataProviderListeners", "oj-c/select-common/UNSAFE_useWrapDataProvider/useWrapDataProvider", "oj-c/select-common/UNSAFE_useWrapValueState/useWrapValueState", "oj-c/select-common/utils/utils", "ojs/ojdataprovider", "preact/hooks", "./useSyncValueAndValueItem", "./useValueItem"], function (require, exports, UNSAFE_useTranslationBundle_1, useEditableValue_1, useValidators_1, utils_1, useListData_1, useDataProviderListeners_1, useWrapDataProvider_1, useWrapValueState_1, utils_2, ojdataprovider_1, hooks_1, useSyncValueAndValueItem_1, useValueItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSelectSinglePreact = void 0;
    function useSelectSinglePreact({ data: propData, disabled, displayOptions, itemText, labelEdge, labelHint, labelStartWidth, messagesCustom, placeholder, readonly, requiredMessageDetail: propRequiredMessageDetail, required, textAlign, userAssistanceDensity, value: propValue, valueItem: propValueItem, virtualKeyboard, onMessagesCustomChanged, onOjValueAction, onValidChanged, onValueChanged, onValueItemChanged, ...otherProps }, addBusyState) {
        const [filterCriterion, setFilterCriterion] = (0, hooks_1.useState)(undefined);
        const [isLoading, setIsLoading] = (0, hooks_1.useState)(propData != null && propValue != null && propValueItem == null);
        const { valueItem, setValueItem } = (0, useValueItem_1.useValueItem)(propValueItem, onValueItemChanged);
        const [preactValueItem, setPreactValueItem] = (0, hooks_1.useState)(valueItem);
        (0, hooks_1.useEffect)(() => {
            setPreactValueItem(valueItem);
        }, [valueItem]);
        const { wrapValueState } = (0, useWrapValueState_1.useWrapValueState)({
            arItemContexts: valueItem,
            isLoading,
            preactValueItems: preactValueItem,
            setPreactValueItems: setPreactValueItem
        });
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const requiredMessageDetail = propRequiredMessageDetail || translations.select_requiredMessageDetail();
        const { methods, onCommitValue, setValue, textFieldProps, value } = (0, useEditableValue_1.useEditableValue)({
            ariaDescribedBy: otherProps['aria-describedby'],
            disabled,
            displayOptions,
            messagesCustom,
            readonly,
            required,
            requiredMessageDetail,
            value: propValue,
            addBusyState,
            onMessagesCustomChanged,
            onValidChanged,
            onValueChanged,
            wrapValueState
        });
        const { 'aria-describedby': ariaDescribedBy, messages } = textFieldProps;
        const hasNoValue = value === null;
        const dataProvider = (0, useWrapDataProvider_1.useWrapDataProvider)(propData);
        const [valueToSync, setValueToSync] = (0, hooks_1.useState)(value);
        const [valueItemToSync, setValueItemToSync] = (0, hooks_1.useState)(valueItem);
        (0, hooks_1.useEffect)(() => {
            setValueToSync(value);
        }, [value]);
        (0, hooks_1.useEffect)(() => {
            setValueItemToSync(valueItem);
        }, [valueItem]);
        (0, useDataProviderListeners_1.useDataProviderListeners)({
            dataProvider,
            setValue,
            setValueToSync,
            setValueItemsToSync: setValueItemToSync,
            value,
            valueItems: valueItem
        });
        (0, useSyncValueAndValueItem_1.useSyncValueAndValueItem)({
            addBusyState,
            dataProvider: dataProvider,
            setIsLoading,
            setValue,
            setValueItem,
            value: valueToSync,
            valueItem: valueItemToSync
        });
        const [listDataState, onLoadRange] = (0, useListData_1.useListData)(dataProvider, {
            filterCriterion,
            initialRowsFetched: 0
        });
        const onCommit = (0, hooks_1.useCallback)(async ({ previousValue, value }) => {
            const validationResult = await onCommitValue(value != null ? value : utils_2.DEFAULT_VALUE);
            if (validationResult === useValidators_1.ValidationResult.INVALID) {
                setPreactValueItem(undefined);
            }
            else if (validationResult === useValidators_1.ValidationResult.VALID && listDataState.status === 'success') {
                if (value == null) {
                    onOjValueAction?.({
                        itemContext: utils_2.DEFAULT_ITEM_CONTEXT,
                        previousValue: previousValue ?? utils_2.DEFAULT_VALUE,
                        value: utils_2.DEFAULT_VALUE
                    });
                }
                else if (value === valueItem?.key) {
                    onOjValueAction?.({
                        itemContext: valueItem,
                        previousValue: previousValue ?? utils_2.DEFAULT_VALUE,
                        value
                    });
                }
                else {
                    const data = listDataState.data.data;
                    let item = data.find((item) => item.metadata.key === value);
                    if (item === undefined) {
                        const fetchResults = await dataProvider.fetchByKeys({ keys: new Set([value]) });
                        item = fetchResults.results.get(value);
                    }
                    const itemContext = {
                        data: item.data,
                        key: item.metadata.key,
                        metadata: item.metadata
                    };
                    onOjValueAction?.({
                        itemContext: itemContext,
                        previousValue: previousValue ?? utils_2.DEFAULT_VALUE,
                        value: value ?? utils_2.DEFAULT_VALUE
                    });
                }
            }
        }, [dataProvider, listDataState, valueItem, onCommitValue, onOjValueAction]);
        const onFilter = (0, hooks_1.useCallback)(({ searchText }) => {
            const fc = searchText && searchText.length > 0
                ? ojdataprovider_1.FilterFactory.getFilter({ filterDef: { text: searchText } })
                : undefined;
            setFilterCriterion(fc);
        }, []);
        return {
            methods,
            selectSingleProps: {
                'aria-describedby': ariaDescribedBy,
                data: listDataState.data,
                isDisabled: disabled,
                isLoading,
                isReadonly: readonly,
                isRequired: required,
                isRequiredShown: required && (userAssistanceDensity === 'compact' || hasNoValue),
                itemText,
                label: labelHint,
                labelEdge,
                labelStartWidth,
                messages,
                onCommit,
                onFilter,
                onLoadRange,
                placeholder,
                textAlign,
                userAssistanceDensity,
                valueItem: (0, utils_1.treatNull)(preactValueItem, undefined),
                virtualKeyboard
            }
        };
    }
    exports.useSelectSinglePreact = useSelectSinglePreact;
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/select-single/select-single',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_SelectSingle", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "ojs/ojvcomponent", "ojs/ojvcomponent-binding", "preact", "preact/compat", "preact/hooks", "./useSelectSinglePreact", "css!oj-c/select-single/select-single-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_useAccessibleContext_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_SelectSingle_1, useAssistiveText_1, ojcontext_1, ojvcomponent_1, ojvcomponent_binding_1, preact_1, compat_1, hooks_1, useSelectSinglePreact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectSingle = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    const FunctionalSelectSingle = (0, compat_1.forwardRef)((props, ref) => {
        const { busyContextRef, displayOptions, help, helpHints } = props;
        const selectSingleRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-select-single id=${props.id}: ${desc}`
            });
        }, []);
        const { selectSingleProps, methods } = (0, useSelectSinglePreact_1.useSelectSinglePreact)(props, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => selectSingleRef.current?.blur(),
            focus: () => selectSingleRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: selectSingleProps.userAssistanceDensity
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        return ((0, jsx_runtime_1.jsx)(UNSAFE_SelectSingle_1.SelectSingle, { ref: selectSingleRef, ...assistiveTextProps, ...selectSingleProps, variant: variant }));
    });
    let SelectSingle = class SelectSingle extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.busyContextRef = (0, preact_1.createRef)();
            this.selectSingleRef = (0, preact_1.createRef)();
            this.rootRef = (0, preact_1.createRef)();
        }
        componentDidMount() {
            this.busyContextRef.current = ojcontext_1.default.getContext(this.rootRef.current).getBusyContext();
        }
        render(props) {
            const containerProps = {
                isFormLayout: props.containerReadonly !== undefined,
                isReadonly: props.containerReadonly,
                labelWrapping: props.labelWrapping
            };
            const accessibleProps = {
                UNSAFE_ariaLabelledBy: props.unsafe_labelledBy
            };
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: this.rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(FunctionalSelectSingle, { busyContextRef: this.busyContextRef, ref: this.selectSingleRef, ...props }) }) }) }));
        }
        componentWillUnmount() {
            this.busyContextRef.current = null;
        }
        reset() {
            this.selectSingleRef.current?.reset();
        }
        showMessages() {
            this.selectSingleRef.current?.showMessages();
        }
        validate() {
            return this.selectSingleRef.current?.validate();
        }
        blur() {
            this.selectSingleRef.current?.blur();
        }
        focus() {
            this.selectSingleRef.current?.focus();
        }
    };
    SelectSingle.defaultProps = {
        data: null,
        disabled: false,
        displayOptions: {
            messages: 'display'
        },
        help: {
            instruction: ''
        },
        helpHints: {
            definition: '',
            source: '',
            sourceText: undefined
        },
        messagesCustom: [],
        readonly: false,
        required: false,
        userAssistanceDensity: 'reflow',
        value: null,
        valueItem: null,
        virtualKeyboard: 'auto'
    };
    SelectSingle._metadata = { "properties": { "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "data": { "type": "DataProvider|null" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["display", "none"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "itemText": { "type": "string|number|function" }, "labelEdge": { "type": "string", "enumValues": ["start", "none", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["wrap", "truncate"], "binding": { "consume": { "name": "labelWrapping" } } }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "placeholder": { "type": "string" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["start", "right", "end"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "efficient", "reflow"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "value": { "type": "any", "writeback": true }, "valueItem": { "type": "object|null", "properties": { "data": { "type": "any" }, "key": { "type": "any" }, "metadata": { "type": "object", "properties": { "indexFromParent": { "type": "number" }, "isLeaf": { "type": "boolean" }, "key": { "type": "any" }, "message": { "type": "object", "properties": { "detail": { "type": "string" }, "severity": { "type": "number|string" }, "summary": { "type": "string" } } }, "parentKey": { "type": "any" }, "suggestion": { "type": "object" }, "treeDepth": { "type": "number" } } } }, "writeback": true }, "virtualKeyboard": { "type": "string", "enumValues": ["number", "text", "auto", "search", "email", "tel", "url"] }, "valid": { "type": "string", "enumValues": ["valid", "pending", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "events": { "ojValueAction": {} }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "valid", "value", "valueItem"], "_READ_ONLY_PROPS": ["valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "reset": {}, "showMessages": {}, "validate": {}, "blur": {}, "focus": {} } };
    SelectSingle._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    SelectSingle._consumedContexts = [UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext];
    SelectSingle = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-select-single')
    ], SelectSingle);
    exports.SelectSingle = SelectSingle;
});

define('oj-c/select-single',["require", "exports", "./select-single/select-single"], function (require, exports, select_single_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectSingle = void 0;
    Object.defineProperty(exports, "SelectSingle", { enumerable: true, get: function () { return select_single_1.SelectSingle; } });
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/collapsible/collapsible',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Collapsible", "ojs/ojvcomponent", "preact/hooks", "ojs/ojcontext", "css!oj-c/collapsible/collapsible-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Collapsible_1, ojvcomponent_1, hooks_1, ojcontext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collapsible = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    exports.Collapsible = (0, ojvcomponent_1.registerCustomElement)('oj-c-collapsible', (props) => {
        const { id, children, disabled, expanded, iconPosition, variant, header } = props;
        const rootRef = (0, hooks_1.useRef)(null);
        const didMountRef = (0, hooks_1.useRef)(false);
        const resolveBusyState = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return ojcontext_1.default.getContext(rootRef.current)
                .getBusyContext()
                ?.addBusyState({
                description: `oj-c-collapsible: id='${id}' is ${desc}.`
            });
        }, []);
        (0, hooks_1.useEffect)(() => {
            if (!didMountRef.current) {
                didMountRef.current = true;
                return;
            }
            if (resolveBusyState.current) {
                resolveBusyState.current();
            }
            resolveBusyState.current = addBusyState('animating');
        }, [expanded]);
        const toggleHandler = async (event) => {
            let target = event.target;
            for (; target && target !== rootRef?.current; target = target.parentElement) {
                if (target.getAttribute('data-oj-clickthrough') === 'disabled') {
                    return;
                }
            }
            const beforeProp = event.value ? props.onOjBeforeExpand : props.onOjBeforeCollapse;
            try {
                await beforeProp?.(event);
                props.onExpandedChanged?.(event.value);
            }
            catch (_) {
            }
        };
        const transitionEndHandler = (event) => {
            const expandedProp = event.value ? props.onOjExpand : props.onOjCollapse;
            expandedProp?.(event);
            if (resolveBusyState.current) {
                resolveBusyState.current();
                resolveBusyState.current = undefined;
            }
        };
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_Collapsible_1.Collapsible, { header: header, iconPosition: iconPosition, variant: variant, isExpanded: expanded, isDisabled: disabled, onToggle: toggleHandler, onTransitionEnd: transitionEndHandler, children: children }) }));
    }, "Collapsible", { "slots": { "": {}, "header": {} }, "properties": { "disabled": { "type": "boolean" }, "expanded": { "type": "boolean", "writeback": true }, "iconPosition": { "type": "string", "enumValues": ["start", "end"] }, "variant": { "type": "string", "enumValues": ["basic", "horizontal-rule"] } }, "events": { "ojBeforeCollapse": { "cancelable": true }, "ojBeforeExpand": { "cancelable": true }, "ojCollapse": {}, "ojExpand": {} }, "extension": { "_WRITEBACK_PROPS": ["expanded"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["id"] } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/collapsible',["require", "exports", "./collapsible/collapsible"], function (require, exports, collapsible_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collapsible = void 0;
    Object.defineProperty(exports, "Collapsible", { enumerable: true, get: function () { return collapsible_1.Collapsible; } });
});

define('oj-c/utils/UNSAFE_focusTabUtils/focusUtils',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getFirstTabStop = exports.focusFirstTabStop = void 0;
    const focusFirstTabStop = (element) => {
        if (!element)
            return;
        const focusElement = (0, exports.getFirstTabStop)(element);
        if (focusElement) {
            focusElement.focus();
        }
        return focusElement;
    };
    exports.focusFirstTabStop = focusFirstTabStop;
    const getFirstTabStop = (element) => {
        const tabbable = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (tabbable && tabbable.length > 0) {
            return tabbable[0];
        }
        return null;
    };
    exports.getFirstTabStop = getFirstTabStop;
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/file-picker/file-picker',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_FilePicker", "preact/hooks", "preact/compat", "ojs/ojvcomponent", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "../utils/UNSAFE_focusTabUtils/focusUtils", "css!oj-c/file-picker/file-picker-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_FilePicker_1, hooks_1, compat_1, ojvcomponent_1, UNSAFE_useTabbableMode_1, focusUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FilePicker = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    const getPrimaryText = (primaryText) => {
        if (typeof primaryText === 'function') {
            return primaryText();
        }
        return primaryText;
    };
    const getSecondaryText = (secondaryText, selectionMode) => {
        if (typeof secondaryText === 'function') {
            return secondaryText({ selectionMode: selectionMode });
        }
        return secondaryText;
    };
    exports.FilePicker = (0, ojvcomponent_1.registerCustomElement)('oj-c-file-picker', (0, compat_1.forwardRef)(({ capture = 'none', disabled = false, selectionMode = 'multiple', ...otherProps }, ref) => {
        let elementPromiseResolver;
        const onCommit = (0, hooks_1.useCallback)((event) => {
            otherProps.onOjBeforeSelect?.({ files: event.files }).then(() => {
                resolveTestPromise();
                otherProps.onOjSelect?.({ files: event.files });
            }, (messages) => {
                resolveTestPromise();
                otherProps.onOjInvalidSelect?.({ messages: messages, until: null });
            });
        }, [otherProps.onOjBeforeSelect, otherProps.onOjSelect, otherProps.onOjInvalidSelect]);
        const onReject = (0, hooks_1.useCallback)((event) => {
            resolveTestPromise();
            otherProps.onOjInvalidSelect?.(event);
        }, [otherProps.onOjBeforeSelect, otherProps.onOjSelect, otherProps.onOjInvalidSelect]);
        const resolveTestPromise = function () {
            if (elementPromiseResolver) {
                elementPromiseResolver();
                elementPromiseResolver = null;
            }
        };
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => (0, focusUtils_1.focusFirstTabStop)(rootRef.current),
            blur: () => {
                const focusElement = document.activeElement;
                if (rootRef.current?.contains(focusElement)) {
                    focusElement.blur();
                }
            },
            _doSelectHelper: (fileList) => {
                const promise = new Promise((resolve) => {
                    elementPromiseResolver = resolve;
                });
                const ref = preactRef.current;
                ref.onClickSelected(fileList);
                return promise;
            }
        }));
        const rootRef = (0, hooks_1.useRef)(null);
        const preactRef = (0, hooks_1.useRef)(null);
        const BaseFilePicker = UNSAFE_FilePicker_1.FilePicker;
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, class: otherProps.trigger ? 'oj-c-file-picker-with-trigger' : undefined, children: (0, jsx_runtime_1.jsx)(BaseFilePicker, { __testHandlerSymbol: preactRef, capture: capture, isDisabled: disabled, selectionMode: selectionMode, onCommit: onCommit, onReject: onReject, accept: otherProps.accept, primaryText: getPrimaryText(otherProps.primaryText), secondaryText: getSecondaryText(otherProps.secondaryText, selectionMode), "aria-label": otherProps['aria-label'], width: "100%", children: otherProps.trigger }) }));
    }), "FilePicker", { "properties": { "accept": { "type": "Array<string>" }, "capture": { "type": "string", "enumValues": ["none", "user", "environment", "implementation"] }, "disabled": { "type": "boolean" }, "primaryText": { "type": "string|function" }, "secondaryText": { "type": "string|function" }, "selectionMode": { "type": "string", "enumValues": ["multiple", "single"] } }, "slots": { "trigger": {} }, "events": { "ojBeforeSelect": { "cancelable": true }, "ojInvalidSelect": {}, "ojSelect": {} }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-label"] }, "methods": { "focus": {}, "blur": {}, "_doSelectHelper": {} } }, { "capture": "none", "disabled": false, "selectionMode": "multiple" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});

define('oj-c/file-picker',["require", "exports", "./file-picker/file-picker"], function (require, exports, file_picker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FilePicker = void 0;
    Object.defineProperty(exports, "FilePicker", { enumerable: true, get: function () { return file_picker_1.FilePicker; } });
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/meter-bar/meter-bar',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_MeterBar", "ojs/ojvcomponent", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "../utils/UNSAFE_meterUtils/meterUtils", "css!oj-c/meter-bar/meter-bar-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_MeterBar_1, ojvcomponent_1, hooks_1, UNSAFE_useTabbableMode_1, meterUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeterBar = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.MeterBar = (0, ojvcomponent_1.registerCustomElement)('oj-c-meter-bar', ({ max = 100, value = 0, min = 0, size = 'md', orientation = 'horizontal', step = 1, indicatorSize = 1, readonly = false, thresholdDisplay = 'indicator', ...props }) => {
        const [hoveredVal, setHoveredVal] = (0, hooks_1.useState)();
        const inputHandler = (detail) => {
            setHoveredVal(detail.value);
            props.onTransientValueChanged?.(detail.value);
        };
        const commitHandler = (detail) => {
            props.onValueChanged?.(detail.value);
        };
        const thresholds = props.thresholds?.map((threshold, index) => {
            return {
                ...threshold,
                color: (0, meterUtils_1.getThresholdColorByIndex)(threshold, index)
            };
        });
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { class: `oj-c-meter-bar-${orientation}`, children: (0, jsx_runtime_1.jsx)(UNSAFE_MeterBar_1.MeterBar, { value: (hoveredVal != undefined ? hoveredVal : value), step: step, max: max, min: min, size: size, orientation: orientation, indicatorSize: indicatorSize, datatip: props.datatip
                    ? props.datatip({
                        value: hoveredVal != undefined ? hoveredVal : value
                    })
                    : props.datatip, onCommit: readonly ? undefined : commitHandler, onInput: readonly ? undefined : inputHandler, length: '100%', thresholds: thresholds, referenceLines: props.referenceLines, thresholdDisplay: thresholdDisplay === 'plotArea' ? 'track' : thresholdDisplay, indicatorColor: props.color, trackColor: props.plotArea?.color, isTrackRendered: props.plotArea?.rendered !== 'off', "aria-label": props['aria-label'], "aria-labelledby": props.labelledBy ?? undefined, "aria-describedby": props.describedBy ?? undefined }) }));
    }, "MeterBar", { "properties": { "max": { "type": "number" }, "min": { "type": "number" }, "readonly": { "type": "boolean" }, "value": { "type": "number|null", "writeback": true }, "step": { "type": "number" }, "color": { "type": "string" }, "indicatorSize": { "type": "number" }, "plotArea": { "type": "object", "properties": { "color": { "type": "string" }, "rendered": { "type": "string", "enumValues": ["off", "on"] } } }, "orientation": { "type": "string", "enumValues": ["horizontal", "vertical"] }, "referenceLines": { "type": "Array<object>" }, "thresholdDisplay": { "type": "string", "enumValues": ["all", "plotArea", "indicator"] }, "thresholds": { "type": "Array<object>" }, "describedBy": { "type": "string|null" }, "labelledBy": { "type": "string|null" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "datatip": { "type": "function" }, "transientValue": { "type": "number", "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["value", "transientValue"], "_READ_ONLY_PROPS": ["transientValue"], "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, { "max": 100, "value": 0, "min": 0, "size": "md", "orientation": "horizontal", "step": 1, "indicatorSize": 1, "readonly": false, "thresholdDisplay": "indicator" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});

define('oj-c/meter-bar',["require", "exports", "./meter-bar/meter-bar"], function (require, exports, meter_bar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeterBar = void 0;
    Object.defineProperty(exports, "MeterBar", { enumerable: true, get: function () { return meter_bar_1.MeterBar; } });
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/meter-circle/meter-circle',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_MeterCircle", "ojs/ojvcomponent", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "../utils/UNSAFE_meterUtils/meterUtils", "css!oj-c/meter-circle/meter-circle-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_MeterCircle_1, ojvcomponent_1, hooks_1, UNSAFE_useTabbableMode_1, meterUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeterCircle = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.MeterCircle = (0, ojvcomponent_1.registerCustomElement)('oj-c-meter-circle', ({ max = 100, value = 0, min = 0, size = 'md', step = 1, readonly = false, startAngle = 90, indicatorSize = 1, angleExtent = 360, thresholdDisplay = 'indicator', ...props }) => {
        const [hoveredVal, setHoveredVal] = (0, hooks_1.useState)();
        const inputHandler = (detail) => {
            setHoveredVal(detail.value);
            props.onTransientValueChanged?.(detail.value);
        };
        const commitHandler = (detail) => {
            props.onValueChanged?.(detail.value);
        };
        const thresholds = props.thresholds?.map((threshold, index) => {
            return {
                ...threshold,
                color: (0, meterUtils_1.getThresholdColorByIndex)(threshold, index)
            };
        });
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_MeterCircle_1.MeterCircle, { value: (hoveredVal != undefined ? hoveredVal : value), step: step, max: max, min: min, size: size, angleExtent: angleExtent, startAngle: startAngle, indicatorSize: indicatorSize, innerRadius: props.innerRadius, datatip: props.datatip
                    ? props.datatip({
                        value: hoveredVal != undefined ? hoveredVal : value
                    })
                    : props.datatip, onCommit: readonly ? undefined : commitHandler, onInput: readonly ? undefined : inputHandler, thresholds: thresholds, trackColor: props.plotArea?.color, indicatorColor: props.color, isTrackRendered: props.plotArea?.rendered !== 'off', referenceLines: props.referenceLines, thresholdDisplay: thresholdDisplay === 'plotArea' ? 'track' : thresholdDisplay, "aria-label": props['aria-label'], "aria-labelledby": props.labelledBy ?? undefined, "aria-describedby": props.describedBy ?? undefined, children: (context) => {
                    return props.centerTemplate?.({ value, ...context });
                } }) }));
    }, "MeterCircle", { "properties": { "max": { "type": "number" }, "min": { "type": "number" }, "readonly": { "type": "boolean" }, "value": { "type": "number|null", "writeback": true }, "step": { "type": "number" }, "color": { "type": "string" }, "indicatorSize": { "type": "number" }, "innerRadius": { "type": "number" }, "plotArea": { "type": "object", "properties": { "color": { "type": "string" }, "rendered": { "type": "string", "enumValues": ["off", "on"] } } }, "angleExtent": { "type": "number" }, "startAngle": { "type": "number" }, "referenceLines": { "type": "Array<object>" }, "thresholdDisplay": { "type": "string", "enumValues": ["all", "plotArea", "indicator"] }, "thresholds": { "type": "Array<object>" }, "describedBy": { "type": "string|null" }, "labelledBy": { "type": "string|null" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "datatip": { "type": "function" }, "transientValue": { "type": "number", "readOnly": true, "writeback": true } }, "slots": { "centerTemplate": { "data": {} } }, "extension": { "_WRITEBACK_PROPS": ["value", "transientValue"], "_READ_ONLY_PROPS": ["transientValue"], "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, { "max": 100, "value": 0, "min": 0, "size": "md", "step": 1, "readonly": false, "startAngle": 90, "indicatorSize": 1, "angleExtent": 360, "thresholdDisplay": "indicator" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});

define('oj-c/meter-circle',["require", "exports", "./meter-circle/meter-circle"], function (require, exports, meter_circle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MeterCircle = void 0;
    Object.defineProperty(exports, "MeterCircle", { enumerable: true, get: function () { return meter_circle_1.MeterCircle; } });
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/list-item-layout/list-item-layout',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_ListItemLayout", "ojs/ojvcomponent", "css!oj-c/list-item-layout/list-item-layout-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_ListItemLayout_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListItemLayout = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.ListItemLayout = (0, ojvcomponent_1.registerCustomElement)('oj-c-list-item-layout', ({ children, ...otherProps }) => {
        const primary = children;
        const insetStyle = { padding: otherProps.inset === 'none' ? '0' : '12px 16px' };
        const actionSlot = otherProps.action ? ((0, jsx_runtime_1.jsx)("div", { "data-oj-clickthrough": "disabled", children: otherProps.action })) : undefined;
        const navSlot = otherProps.navigation ? ((0, jsx_runtime_1.jsx)("div", { "data-oj-clickthrough": "disabled", children: otherProps.navigation })) : undefined;
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)("div", { style: insetStyle, children: (0, jsx_runtime_1.jsx)(UNSAFE_ListItemLayout_1.ListItemLayout, { primary: primary, overline: otherProps.overline, selector: otherProps.selector, leading: otherProps.leading, secondary: otherProps.secondary, tertiary: otherProps.tertiary, metadata: otherProps.metadata, trailing: otherProps.trailing, action: actionSlot, quaternary: otherProps.quaternary, navigation: navSlot }) }) }));
    }, "ListItemLayout", { "slots": { "": {}, "overline": {}, "selector": {}, "leading": {}, "secondary": {}, "tertiary": {}, "metadata": {}, "trailing": {}, "action": {}, "quaternary": {}, "navigation": {} }, "properties": { "inset": { "type": "string", "enumValues": ["none", "listInset"] } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/list-item-layout',["require", "exports", "./list-item-layout/list-item-layout"], function (require, exports, list_item_layout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListItemLayout = void 0;
    Object.defineProperty(exports, "ListItemLayout", { enumerable: true, get: function () { return list_item_layout_1.ListItemLayout; } });
});

define('oj-c/list-view/useListViewPreact',["require", "exports", "preact/hooks", "../utils/UNSAFE_keyUtils/keySetUtils", "../hooks/UNSAFE_useListData/useListData"], function (require, exports, hooks_1, keySetUtils_1, useListData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useListViewPreact = void 0;
    const useListViewPreact = ({ 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, data: propData, gridlines, onCurrentItemChanged, selectionMode, selected, scrollPolicyOptions, onSelectedChanged, onOjItemAction }, addBusyState, isClickthroughDisabled) => {
        const resolveBusyState = (0, hooks_1.useRef)();
        const [listDataState, onLoadRange] = (0, useListData_1.useListData)(propData, {
            fetchSize: scrollPolicyOptions?.fetchSize
        });
        const selectedKeys = (0, keySetUtils_1.keySetToKeys)(selected);
        const listData = listDataState.status !== 'error' ? listDataState.data : null;
        const [currentItem, setCurrentItem] = (0, hooks_1.useState)();
        (0, hooks_1.useEffect)(() => {
            if (listDataState.status === 'loading') {
                resolveBusyState.current = addBusyState('list data is in fetch state');
            }
            else {
                if (resolveBusyState.current) {
                    resolveBusyState.current();
                    resolveBusyState.current = undefined;
                }
            }
        }, [listDataState.status]);
        const handleOnCurrentItemChanged = (detail) => {
            setCurrentItem(detail.value);
            onCurrentItemChanged && onCurrentItemChanged(detail.value);
        };
        const viewportConfig = scrollPolicyOptions?.scroller
            ? {
                scroller: () => {
                    if (scrollPolicyOptions.scroller) {
                        return document.querySelector(scrollPolicyOptions.scroller);
                    }
                    return null;
                }
            }
            : undefined;
        const suggestions = (0, hooks_1.useMemo)(() => getSuggestionsInfo(listDataState), [listDataState]);
        const getRowKey = (data) => {
            return data.metadata.key;
        };
        const onLoadMore = (0, hooks_1.useCallback)(() => {
            if (listData) {
                const fetchSize = scrollPolicyOptions && scrollPolicyOptions.fetchSize ? scrollPolicyOptions.fetchSize : 25;
                onLoadRange({ offset: 0, count: listData.data.length + fetchSize });
            }
        }, [listDataState, scrollPolicyOptions, onLoadRange]);
        return {
            status: listDataState.status,
            listViewProps: {
                'aria-label': ariaLabel,
                'aria-labelledby': ariaLabelledBy,
                data: listData ? listData.data : null,
                currentKey: currentItem,
                getRowKey,
                gridlines,
                onCurrentKeyChange: handleOnCurrentItemChanged,
                hasMore: listData ? listData.sizePrecision === 'atLeast' : false,
                onLoadMore,
                onSelectionChange: (detail) => {
                    onSelectedChanged &&
                        !isClickthroughDisabled(detail.target) &&
                        onSelectedChanged((0, keySetUtils_1.keysToKeySet)(detail.value));
                },
                selectedKeys,
                selectionMode,
                promotedSection: suggestions,
                onItemAction: (detail) => {
                    const item = detail.context.data;
                    const itemActionDetail = { context: { item, data: item.data } };
                    onOjItemAction && onOjItemAction(itemActionDetail);
                },
                viewportConfig
            }
        };
    };
    exports.useListViewPreact = useListViewPreact;
    function getSuggestionsInfo(listDataState) {
        if (listDataState.status !== 'success') {
            return { count: 0 };
        }
        const data = listDataState.data.data;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].metadata.suggestion == null) {
                break;
            }
            count += 1;
        }
        return { count };
    }
});

define('oj-c/list-view/listViewItem',["require", "exports", "preact/jsx-runtime", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle"], function (require, exports, jsx_runtime_1, UNSAFE_useTabbableMode_1, UNSAFE_useTranslationBundle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListItem = void 0;
    const ListItem = ({ context, itemTemplate }) => {
        const { isTabbable } = (0, UNSAFE_useTabbableMode_1.useTabbableMode)();
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const itemContext = {
            isTabbable,
            data: context.data.data,
            item: context.data
        };
        return ((0, jsx_runtime_1.jsxs)(UNSAFE_useTabbableMode_1.TabbableModeContext.Provider, { value: { isTabbable }, children: [itemTemplate && itemTemplate(itemContext), itemContext.item.metadata?.suggestion && ((0, jsx_runtime_1.jsx)("span", { class: "oj-helper-hidden-accessible", children: translations.list_suggestion() }))] }));
    };
    exports.ListItem = ListItem;
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/list-view/list-view',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojcontext", "ojs/ojvcomponent", "preact/compat", "preact/hooks", "@oracle/oraclejet-preact/UNSAFE_EmptyList", "@oracle/oraclejet-preact/UNSAFE_ListView", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "./useListViewPreact", "./listViewItem", "css!oj-c/list-view/list-view-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojcontext_1, ojvcomponent_1, compat_1, hooks_1, UNSAFE_EmptyList_1, UNSAFE_ListView_1, UNSAFE_useTranslationBundle_1, useListViewPreact_1, listViewItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListView = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    const ListViewPreactWrapper = ({ addBusyState, isClickthroughDisabled, itemTemplate, noData, ...rest }) => {
        const { status, listViewProps } = (0, useListViewPreact_1.useListViewPreact)(rest, addBusyState, isClickthroughDisabled);
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        if (status === 'success' && !listViewProps.hasMore && listViewProps.data?.length === 0) {
            if (noData) {
                return (0, jsx_runtime_1.jsx)(UNSAFE_EmptyList_1.EmptyList, { children: noData(compat_1.Children) });
            }
            else {
                const noDataContent = translations.noData_message();
                return (0, jsx_runtime_1.jsx)(UNSAFE_EmptyList_1.EmptyList, { children: noDataContent });
            }
        }
        return ((0, jsx_runtime_1.jsx)(UNSAFE_ListView_1.ListView, { ...listViewProps, children: (context) => {
                return (0, jsx_runtime_1.jsx)(listViewItem_1.ListItem, { context: context, itemTemplate: itemTemplate });
            } }));
    };
    const ListViewImpl = ({ selectionMode = 'none', ...rest }) => {
        const rootRef = (0, hooks_1.useRef)();
        const busyContextRef = (0, hooks_1.useRef)(ojcontext_1.default.getContext(rootRef.current).getBusyContext());
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return busyContextRef.current?.addBusyState({
                description: `oj-c-list-view: ${desc}`
            });
        }, []);
        const isClickthroughDisabled = (0, hooks_1.useCallback)((target) => {
            if (target === null || rootRef.current === undefined) {
                return false;
            }
            return isEventClickthroughDisabled({ target }, rootRef.current);
        }, []);
        const props = {
            selectionMode,
            ...rest
        };
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: rootRef, children: (0, jsx_runtime_1.jsx)(ListViewPreactWrapper, { addBusyState: addBusyState, isClickthroughDisabled: isClickthroughDisabled, ...props }) }));
    };
    exports.ListView = (0, ojvcomponent_1.registerCustomElement)('oj-c-list-view', ListViewImpl, "ListView", { "properties": { "currentItem": { "type": "any", "readOnly": true, "writeback": true }, "data": { "type": "DataProvider|null" }, "gridlines": { "type": "object", "properties": { "item": { "type": "string", "enumValues": ["hidden", "visible"] }, "top": { "type": "string", "enumValues": ["hidden", "visible"] }, "bottom": { "type": "string", "enumValues": ["hidden", "visible"] } } }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number" }, "scroller": { "type": "string" } } }, "selected": { "type": "object", "writeback": true }, "selectionMode": { "type": "string", "enumValues": ["multiple", "none", "single"] } }, "slots": { "itemTemplate": { "data": {} }, "noData": { "data": {} } }, "events": { "ojItemAction": {} }, "extension": { "_WRITEBACK_PROPS": ["currentItem", "selected"], "_READ_ONLY_PROPS": ["currentItem"], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "id"] } }, { "selectionMode": "none" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
    const isEventClickthroughDisabled = function (event, rootElement) {
        let node = event.target;
        while (node != null && node !== rootElement) {
            if (isClickthroughDisabled(node)) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    const isClickthroughDisabled = function (element) {
        return element.dataset['ojClickthrough'] === 'disabled';
    };
});

define('oj-c/list-view',["require", "exports", "./list-view/list-view"], function (require, exports, list_view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListView = void 0;
    Object.defineProperty(exports, "ListView", { enumerable: true, get: function () { return list_view_1.ListView; } });
});


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/split-menu-button/split-menu-button',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_SplitMenuButton", "@oracle/oraclejet-preact/UNSAFE_Menu", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "preact", "preact/hooks", "preact/compat", "ojs/ojvcomponent", "css!oj-c/split-menu-button/split-menu-button-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_SplitMenuButton_1, UNSAFE_Menu_1, UNSAFE_useTabbableMode_1, preact_1, hooks_1, compat_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SplitMenuButton = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    const FunctionalSplitMenuButton = (0, compat_1.forwardRef)((props, ref) => {
        const buttonRef = (0, hooks_1.useRef)(null);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => buttonRef.current?.focus(),
            blur: () => buttonRef.current?.blur(),
            doAction: () => buttonRef.current?.dispatchEvent(new Event('ojAction', { bubbles: true }))
        }), []);
        return (0, jsx_runtime_1.jsx)(UNSAFE_SplitMenuButton_1.SplitMenuButton, { ref: buttonRef, ...props });
    });
    let SplitMenuButton = class SplitMenuButton extends preact_1.Component {
        constructor() {
            super(...arguments);
            this.buttonRef = (0, preact_1.createRef)();
            this.renderMenu = (items) => {
                return items.map((item) => {
                    if (item && item.type === 'divider') {
                        return (0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.MenuDivider, {});
                    }
                    else if (item.label) {
                        return ((0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.MenuItem, { label: item.label, isDisabled: item.disabled, onAction: item.onAction }));
                    }
                    else {
                        return;
                    }
                });
            };
        }
        render(props) {
            const { chroming, label, disabled, size, onOjAction: onAction, items } = { ...props };
            const widthSize = { width: props.width };
            return props.width ? ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { style: widthSize, children: (0, jsx_runtime_1.jsx)(FunctionalSplitMenuButton, { label: label, ref: this.buttonRef, variant: chroming, size: size, width: '100%', isDisabled: disabled, onAction: onAction, children: this.renderMenu(items) }) })) : ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(FunctionalSplitMenuButton, { label: label, ref: this.buttonRef, variant: chroming, size: size, width: '100%', isDisabled: disabled, onAction: onAction, children: this.renderMenu(items) }) }));
        }
        blur() {
            this.buttonRef.current?.blur();
        }
        focus() {
            this.buttonRef.current?.focus();
        }
        doAction() {
            this.buttonRef.current?.doAction();
        }
    };
    SplitMenuButton.defaultProps = {
        label: '',
        chroming: 'outlined',
        disabled: false,
        size: 'md',
        items: []
    };
    SplitMenuButton._metadata = { "properties": { "label": { "type": "string" }, "items": { "type": "Array<object>" }, "disabled": { "type": "boolean" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "width": { "type": "number|string" }, "chroming": { "type": "string", "enumValues": ["outlined", "solid", "callToAction"] } }, "events": { "ojAction": { "bubbles": true } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["title"] }, "methods": { "blur": {}, "focus": {}, "doAction": {} } };
    SplitMenuButton._translationBundleMap = {
        '@oracle/oraclejet-preact': translationBundle_1.default
    };
    SplitMenuButton._consumedContexts = [UNSAFE_useTabbableMode_1.TabbableModeContext];
    SplitMenuButton = __decorate([
        (0, ojvcomponent_1.customElement)('oj-c-split-menu-button')
    ], SplitMenuButton);
    exports.SplitMenuButton = SplitMenuButton;
});

define('oj-c/split-menu-button',["require", "exports", "./split-menu-button/split-menu-button"], function (require, exports, split_menu_button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SplitMenuButton = void 0;
    Object.defineProperty(exports, "SplitMenuButton", { enumerable: true, get: function () { return split_menu_button_1.SplitMenuButton; } });
});

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/selector/selector',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Selector", "ojs/ojvcomponent", "../utils/UNSAFE_keyUtils/keySetUtils", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Selector_1, ojvcomponent_1, keySetUtils_1, UNSAFE_useTabbableMode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selector = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    const SelectorImpl = ({ rowKey, selectedKeys, indeterminate = false, selectionMode = 'multiple', onSelectedKeysChanged, ...otherProps }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_Selector_1.Selector, { isPartial: indeterminate, rowKey: rowKey, selectedKeys: (0, keySetUtils_1.keySetToKeys)(selectedKeys), selectionMode: selectionMode, "aria-label": otherProps['aria-label'], onChange: (detail) => {
                    onSelectedKeysChanged?.((0, keySetUtils_1.keysToKeySet)(detail.value));
                } }, rowKey) }));
    };
    exports.Selector = (0, ojvcomponent_1.registerCustomElement)('oj-c-selector', SelectorImpl, "Selector", { "properties": { "rowKey": { "type": "any" }, "selectedKeys": { "type": "object", "writeback": true }, "indeterminate": { "type": "boolean" }, "selectionMode": { "type": "string", "enumValues": ["multiple", "single"] } }, "extension": { "_WRITEBACK_PROPS": ["selectedKeys"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, { "indeterminate": false, "selectionMode": "multiple" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});

define('oj-c/selector',["require", "exports", "./selector/selector"], function (require, exports, selector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selector = void 0;
    Object.defineProperty(exports, "Selector", { enumerable: true, get: function () { return selector_1.Selector; } });
});

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/selector-all/selector-all',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_SelectorAll", "ojs/ojvcomponent", "../utils/UNSAFE_keyUtils/keySetUtils"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_SelectorAll_1, ojvcomponent_1, keySetUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectorAll = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    const SelectorAllImpl = ({ selectedKeys, onSelectedKeysChanged }) => {
        let selected = 'partial';
        if (selectedKeys.keys.all && selectedKeys.keys.deletedKeys.size === 0) {
            selected = 'all';
        }
        else if (!selectedKeys.keys.all && selectedKeys.keys.keys.size === 0) {
            selected = 'none';
        }
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_SelectorAll_1.SelectorAll, { selected: selected, onChange: (detail) => {
                    onSelectedKeysChanged?.((0, keySetUtils_1.keysToKeySet)(detail.value));
                } }) }));
    };
    exports.SelectorAll = (0, ojvcomponent_1.registerCustomElement)('oj-c-selector-all', SelectorAllImpl, "SelectorAll", { "properties": { "selectedKeys": { "type": "object", "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["selectedKeys"], "_READ_ONLY_PROPS": [] } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/selector-all',["require", "exports", "./selector-all/selector-all"], function (require, exports, selector_all_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectorAll = void 0;
    Object.defineProperty(exports, "SelectorAll", { enumerable: true, get: function () { return selector_all_1.SelectorAll; } });
});

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/legend-item/legend-item',["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegendItem = exports.LegendItemDefaults = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.LegendItemDefaults = {
        markerShape: 'square',
        symbolType: 'marker',
        borderColor: '',
        categories: [],
        lineStyle: 'solid'
    };
    exports.LegendItem = (0, ojvcomponent_1.registerCustomElement)('oj-c-legend-item', ({ markerShape = exports.LegendItemDefaults.markerShape, symbolType = exports.LegendItemDefaults.symbolType, borderColor = exports.LegendItemDefaults.borderColor, categories = exports.LegendItemDefaults.categories, lineStyle = exports.LegendItemDefaults.lineStyle, ...props }) => {
        return null;
    }, "LegendItem", { "properties": { "text": { "type": "string" }, "categories": { "type": "Array<string>" }, "symbolType": { "type": "string", "enumValues": ["image", "line", "marker", "lineWithMarker"] }, "source": { "type": "string" }, "color": { "type": "string" }, "borderColor": { "type": "string" }, "lineStyle": { "type": "string", "enumValues": ["solid", "dashed", "dotted"] }, "lineWidth": { "type": "number" }, "markerShape": { "type": "string", "enumValues": ["circle", "ellipse", "square", "human", "star", "triangleUp", "triangleDown", "diamond", "plus", "rectangle"] }, "markerColor": { "type": "string" }, "shortDesc": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/legend-section/legend-section',["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegendSection = exports.LegendSectionDefaults = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.LegendSectionDefaults = {
        text: ''
    };
    exports.LegendSection = (0, ojvcomponent_1.registerCustomElement)('oj-c-legend-section', ({ text = exports.LegendSectionDefaults.text, ...props }) => {
        return null;
    }, "LegendSection", { "properties": { "text": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/legend/utils',["require", "exports", "../legend-item/legend-item", "../legend-section/legend-section"], function (require, exports, legend_item_1, legend_section_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDefaultSymbolDims = exports.isTreeDataProvider = exports.transformSection = exports.transformItem = exports.parseItemId = exports.isLegendInteractive = exports.getSectionStyles = exports.getTextStyles = void 0;
    function getTextStyles(styles) {
        return {
            textFontStyle: styles?.fontStyle,
            textFontSize: styles?.fontSize,
            textFontColor: styles?.color,
            textFontWeight: styles?.fontWeight,
            textDecoration: styles?.textDecoration,
            textFontFamily: styles?.fontFamily
        };
    }
    exports.getTextStyles = getTextStyles;
    function getSectionStyles(styles) {
        return {
            sectionTitleColor: styles?.color,
            sectionTitleFontFamily: styles?.fontFamily,
            sectionTitleFontSize: styles?.fontSize,
            sectionTitleFontStyle: styles?.fontStyle,
            sectionTitleFontWeight: styles?.fontWeight,
            sectionTitleTextDecoration: styles?.textDecoration
        };
    }
    exports.getSectionStyles = getSectionStyles;
    function isLegendInteractive(drilling, hideAndShowBehavior, hoverBehavior) {
        return drilling === 'on' || hideAndShowBehavior === 'on' || hoverBehavior === 'dim';
    }
    exports.isLegendInteractive = isLegendInteractive;
    function parseItemId(id) {
        return id.split(';').map((i) => parseInt(i, 10));
    }
    exports.parseItemId = parseItemId;
    function transformItem(dataItem, sectionIndex, itemIndex, ariaLabelSuffix) {
        const item = { ...legend_item_1.LegendItemDefaults, ...dataItem };
        return {
            borderColor: item.borderColor,
            lineWidth: item.lineWidth,
            markerColor: item.markerColor || item.color || undefined,
            lineColor: item.color || undefined,
            markerShape: item.symbolType !== 'line' ? item.markerShape : 'none',
            lineStyle: item.symbolType !== 'marker' ? item.lineStyle : 'none',
            'aria-label': [item.shortDesc, ariaLabelSuffix].filter(Boolean).join(' ') || undefined,
            datatip: item.shortDesc,
            source: item.source,
            text: item.text,
            id: `${sectionIndex};${itemIndex}`
        };
    }
    exports.transformItem = transformItem;
    function transformSection(dataSection, ariaLabelSuffix, sectionIndex) {
        const section = { ...legend_section_1.LegendSectionDefaults, ...dataSection };
        return {
            items: section.items.map((item, itemIndex) => transformItem(item, sectionIndex, itemIndex, ariaLabelSuffix)),
            title: section.text || section.title,
            id: `${sectionIndex}`
        };
    }
    exports.transformSection = transformSection;
    function isTreeDataProvider(dataprovider) {
        if (dataprovider && dataprovider['getChildDataProvider']) {
            return true;
        }
        return false;
    }
    exports.isTreeDataProvider = isTreeDataProvider;
    const getDefaultSymbolDims = (symbolHeight, symbolWidth) => {
        if (!symbolHeight && !symbolWidth) {
            return { width: undefined, height: undefined };
        }
        if (!symbolHeight) {
            return { width: symbolWidth, height: symbolWidth };
        }
        if (!symbolWidth) {
            return { width: symbolHeight, height: symbolHeight };
        }
        return { width: symbolWidth, height: symbolHeight };
    };
    exports.getDefaultSymbolDims = getDefaultSymbolDims;
});

define('oj-c/utils/UNSAFE_vizUtils/TemplateHandler',["require", "exports", "preact/compat"], function (require, exports, compat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.processTemplate = exports.processNodeTemplate = void 0;
    const getValidProp = (prop) => {
        return prop[0].toLowerCase() !== prop[0]
            ? prop.toLowerCase().replace(/-./g, (c) => c[1].toUpperCase())
            : prop;
    };
    const resolveProps = (props) => {
        return Object.keys(props).reduce((resolvedProps, prop) => {
            if (prop === 'children')
                return resolvedProps;
            resolvedProps[getValidProp(prop)] = props[prop];
            return resolvedProps;
        }, {});
    };
    const processNodeTemplate = (datum, template, context, templateName) => {
        const children = template(context);
        const node = compat_1.Children.toArray(children).find((child) => {
            if (!child || !child.props) {
                return;
            }
            return (child.props?.children).type === templateName;
        });
        const props = (node?.props?.children).props;
        const key = datum.key || datum.metadata?.key;
        return props ? { ...resolveProps(props), key } : { key };
    };
    exports.processNodeTemplate = processNodeTemplate;
    const processTemplate = (data, template, getContext, templateName) => {
        return data.map((datum, index) => (0, exports.processNodeTemplate)(datum, template, getContext(datum, index), templateName));
    };
    exports.processTemplate = processTemplate;
});

define('oj-c/hooks/UNSAFE_useVizCategories/useVizCategories',["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useCategories"], function (require, exports, UNSAFE_useCategories_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useVizCategories = void 0;
    function useVizCategories(categoriesItems, getCategoriesFromItem, hiddenCategories, highlightedCategories, highlightMatch = 'all', hiddenMatch = 'any', onHiddenCategoriesChanged, onHighlightedCategoriesChanged) {
        const { ids: hiddenIds, updateCategories: updateHidden } = (0, UNSAFE_useCategories_1.useCategories)(categoriesItems, getCategoriesFromItem, hiddenCategories, hiddenMatch, false, onHiddenCategoriesChanged);
        const { ids: highlightedIds, updateCategories: updateHighlighted } = (0, UNSAFE_useCategories_1.useCategories)(categoriesItems, getCategoriesFromItem, highlightedCategories, highlightMatch, true, onHighlightedCategoriesChanged);
        return {
            hiddenIds,
            updateHidden,
            highlightedIds,
            updateHighlighted
        };
    }
    exports.useVizCategories = useVizCategories;
});

define('oj-c/legend/events',["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getLegendEventsHandler = void 0;
    const getLegendEventsHandler = (isHideShowOn, isHighlightOn, updateHidden, updateHighlighted, getDrillDetail, drilling = 'off', onOjDrill) => {
        const itemActionHandler = (detail) => {
            if (isHideShowOn) {
                updateHidden(detail.itemId);
            }
            else if (drilling === 'on') {
                onOjDrill?.({ id: getDrillDetail((0, utils_1.parseItemId)(detail.itemId)) });
            }
        };
        const inputHandler = (detail) => {
            if (isHighlightOn) {
                updateHighlighted(detail.itemId);
            }
        };
        return {
            itemActionHandler,
            inputHandler
        };
    };
    exports.getLegendEventsHandler = getLegendEventsHandler;
});

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/legend/useSectionData',["require", "exports", "preact/compat", "../utils/UNSAFE_vizUtils/TemplateHandler", "../hooks/UNSAFE_useDataProvider/useDataProvider", "ojs/ojflattenedtreedataproviderview", "ojs/ojkeyset"], function (require, exports, compat_1, TemplateHandler_1, useDataProvider_1, ojflattenedtreedataproviderview_1, ojkeyset_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSectionData = void 0;
    ojflattenedtreedataproviderview_1 = __importDefault(ojflattenedtreedataproviderview_1);
    function useSectionData(dataProvider, addBusyState, sectionTemplate, itemTemplate) {
        const dpRef = (0, compat_1.useRef)(dataProvider);
        const flatDpRef = (0, compat_1.useRef)(new ojflattenedtreedataproviderview_1.default(dataProvider, {
            expanded: new ojkeyset_1.AllKeySetImpl()
        }));
        if (dpRef.current != dataProvider) {
            dpRef.current = dataProvider;
            flatDpRef.current = new ojflattenedtreedataproviderview_1.default(dpRef.current, {
                expanded: new ojkeyset_1.AllKeySetImpl()
            });
        }
        const { data } = (0, useDataProvider_1.useDataProvider)({
            data: flatDpRef.current,
            addBusyState
        });
        const sections = [];
        if (data.length > 0) {
            let currentSection;
            for (const item of data) {
                const context = {
                    key: item.metadata?.key,
                    data: item.data,
                    index: item.metadata.indexFromParent
                };
                const isSection = item?.metadata?.treeDepth === 0;
                if (isSection) {
                    currentSection = item;
                    let sectionData = item.data;
                    const items = [];
                    if (sectionTemplate) {
                        sectionData = (0, TemplateHandler_1.processNodeTemplate)(item, sectionTemplate, context, 'oj-c-legend-section');
                    }
                    sections.push({ ...sectionData, items });
                }
                else {
                    const itemContext = {
                        ...context,
                        parentKey: item.metadata?.parentKey,
                        parentData: currentSection?.data
                    };
                    const processedItem = itemTemplate
                        ? (0, TemplateHandler_1.processNodeTemplate)(item, itemTemplate, itemContext, 'oj-c-legend-item')
                        : item.data;
                    sections[sections.length - 1]['items'].push({
                        key: item.metadata?.key,
                        ...processedItem
                    });
                }
            }
        }
        return sections;
    }
    exports.useSectionData = useSectionData;
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/legend/legend',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "@oracle/oraclejet-preact/UNSAFE_Legend", "ojs/ojcontext", "ojs/ojvcomponent", "./utils", "../hooks/UNSAFE_useDataProvider/useDataProvider", "../utils/UNSAFE_vizUtils/TemplateHandler", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "preact/compat", "../hooks/UNSAFE_useVizCategories/useVizCategories", "./events", "./useSectionData", "css!oj-c/legend/legend-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, UNSAFE_Legend_1, ojcontext_1, ojvcomponent_1, utils_1, useDataProvider_1, TemplateHandler_1, UNSAFE_useTranslationBundle_1, compat_1, useVizCategories_1, events_1, useSectionData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LinearLegend = exports.Legend = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    function LegendComp({ data = null, drilling = 'off', halign = 'start', valign = 'top', hiddenCategories = [], hideAndShowBehavior = 'off', highlightedCategories = [], hoverBehavior = 'none', orientation = 'vertical', symbolHeight = 0, symbolWidth = 0, textStyle = {}, sectionTitleStyle = {}, sectionTitleHalign = 'start', ...props }) {
        const rootRef = (0, hooks_1.useRef)(null);
        const addBusyState = (0, hooks_1.useCallback)((description) => {
            return rootRef.current
                ? ojcontext_1.default.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-legend: ${description}` })
                : () => { };
        }, []);
        const isTreeData = (0, utils_1.isTreeDataProvider)(data);
        const { width: symWidth, height: symHeight } = (0, utils_1.getDefaultSymbolDims)(symbolHeight, symbolWidth);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, class: `oj-c-legend-${halign} oj-c-legend-${valign}`, children: isTreeData ? ((0, jsx_runtime_1.jsx)(SectionalLegend, { data: data, ...props, addBusyState: addBusyState, drilling: drilling, hiddenCategories: hiddenCategories, hideAndShowBehavior: hideAndShowBehavior, highlightedCategories: highlightedCategories, hoverBehavior: hoverBehavior, orientation: orientation, symbolHeight: symHeight, symbolWidth: symWidth, textStyle: textStyle, sectionTitleStyle: sectionTitleStyle, sectionTitleHalign: sectionTitleHalign })) : ((0, jsx_runtime_1.jsx)(LinearLegend, { ...props, data: data, drilling: drilling, hiddenCategories: hiddenCategories, hideAndShowBehavior: hideAndShowBehavior, highlightedCategories: highlightedCategories, hoverBehavior: hoverBehavior, orientation: orientation, symbolHeight: symHeight, symbolWidth: symHeight, addBusyState: addBusyState, textStyle: textStyle })) }));
    }
    exports.Legend = (0, ojvcomponent_1.registerCustomElement)('oj-c-legend', LegendComp, "Legend", { "properties": { "data": { "type": "DataProvider|null" }, "drilling": { "type": "string", "enumValues": ["off", "on"] }, "halign": { "type": "string", "enumValues": ["start", "end", "center"] }, "hiddenCategories": { "type": "Array<string>", "writeback": true }, "hideAndShowBehavior": { "type": "string", "enumValues": ["off", "on"] }, "highlightedCategories": { "type": "Array<string>", "writeback": true }, "hoverBehavior": { "type": "string", "enumValues": ["none", "dim"] }, "orientation": { "type": "string", "enumValues": ["horizontal", "vertical"] }, "symbolHeight": { "type": "number" }, "symbolWidth": { "type": "number" }, "textStyle": { "type": "object", "properties": { "color": { "type": "string" }, "fontFamily": { "type": "string" }, "fontSize": { "type": "string" }, "fontStyle": { "type": "string" }, "fontWeight": { "type": "string" }, "textDecoration": { "type": "string" } } }, "valign": { "type": "string", "enumValues": ["bottom", "top", "middle"] }, "sectionTitleStyle": { "type": "object", "properties": { "color": { "type": "string" }, "fontFamily": { "type": "string" }, "fontSize": { "type": "string" }, "fontStyle": { "type": "string" }, "fontWeight": { "type": "string" }, "textDecoration": { "type": "string" } } }, "sectionTitleHalign": { "type": "string", "enumValues": ["start", "end", "center"] } }, "slots": { "itemTemplate": { "data": {} }, "sectionTemplate": { "data": {} } }, "events": { "ojDrill": {} }, "extension": { "_WRITEBACK_PROPS": ["hiddenCategories", "highlightedCategories"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, { "data": null, "drilling": "off", "halign": "start", "valign": "top", "hiddenCategories": [], "hideAndShowBehavior": "off", "highlightedCategories": [], "hoverBehavior": "none", "orientation": "vertical", "symbolHeight": 0, "symbolWidth": 0, "textStyle": {}, "sectionTitleStyle": {}, "sectionTitleHalign": "start" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
    function LinearLegend({ hoverBehavior, hideAndShowBehavior, hiddenCategories, highlightedCategories, onHiddenCategoriesChanged, onHighlightedCategoriesChanged, drilling, itemTemplate, sectionTemplate, textStyle, orientation, symbolHeight, symbolWidth, ...props }) {
        const { data } = (0, useDataProvider_1.useDataProvider)({
            data: props.data ? props.data : undefined,
            addBusyState: props.addBusyState
        });
        const isHighlightOn = hoverBehavior === 'dim';
        const isHideShowOn = hideAndShowBehavior === 'on';
        const isInteractive = (0, utils_1.isLegendInteractive)(drilling, hideAndShowBehavior, hoverBehavior);
        const getItemContext = (context, index) => {
            return {
                data: context.data,
                key: context.key,
                index
            };
        };
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const items = itemTemplate
            ? (0, TemplateHandler_1.processTemplate)(data, itemTemplate, getItemContext, 'oj-c-legend-item')
            : data.map((item) => item.data);
        const preactItems = (0, compat_1.useMemo)(() => {
            return items.map((value, itemIndex) => (0, utils_1.transformItem)(value, 0, itemIndex, drilling === 'on' ? translations.viz_drillable() : ''));
        }, [items, drilling]);
        const categoriesItems = (0, compat_1.useMemo)(() => {
            const categoriesItems = [];
            if (isHideShowOn || isHighlightOn) {
                items.forEach((item, itemIndex) => {
                    categoriesItems.push({ id: preactItems[itemIndex].id, categories: item.categories || [] });
                });
            }
            return categoriesItems;
        }, [preactItems, items, isHideShowOn, isHighlightOn]);
        const { hiddenIds, updateHidden, highlightedIds, updateHighlighted } = (0, useVizCategories_1.useVizCategories)(categoriesItems, (item) => item.categories, hiddenCategories, highlightedCategories, 'any', 'any', onHiddenCategoriesChanged, onHighlightedCategoriesChanged);
        const getDrillDetail = (id) => {
            const [_, itemIdx] = id;
            const item = items[itemIdx];
            if (item['categories']?.length > 0)
                return item['categories'];
            return data[itemIdx].metadata?.key;
        };
        const { itemActionHandler, inputHandler } = (0, events_1.getLegendEventsHandler)(isHideShowOn, isHighlightOn, updateHidden, updateHighlighted, getDrillDetail, drilling, props.onOjDrill);
        const textStyles = (0, utils_1.getTextStyles)(textStyle);
        return ((0, jsx_runtime_1.jsx)(UNSAFE_Legend_1.Legend, { orientation: orientation, symbolHeight: symbolHeight, symbolWidth: symbolWidth, isReadOnly: !isInteractive, hiddenIds: isHideShowOn ? hiddenIds : undefined, highlightedIds: isHighlightOn ? highlightedIds : undefined, items: preactItems, onItemAction: itemActionHandler, onInput: inputHandler, ...props, ...textStyles }));
    }
    exports.LinearLegend = LinearLegend;
    function SectionalLegend({ hoverBehavior, hideAndShowBehavior, hiddenCategories, highlightedCategories, onHiddenCategoriesChanged, onHighlightedCategoriesChanged, drilling, itemTemplate, sectionTemplate, textStyle, sectionTitleStyle, orientation, symbolHeight, symbolWidth, data, ...props }) {
        const isHighlightOn = hoverBehavior === 'dim';
        const isHideShowOn = hideAndShowBehavior === 'on';
        const isInteractive = (0, utils_1.isLegendInteractive)(drilling, hideAndShowBehavior, hoverBehavior);
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const sections = (0, useSectionData_1.useSectionData)(data, props.addBusyState, sectionTemplate, itemTemplate);
        const preactSections = (0, compat_1.useMemo)(() => {
            const preactSections = sections.map((section, sectionIdx) => (0, utils_1.transformSection)(section, drilling === 'on' ? translations.viz_drillable() : '', sectionIdx));
            return preactSections;
        }, [sections, drilling]);
        const categoriesItems = (0, compat_1.useMemo)(() => {
            const categoriesItems = [];
            if (isHideShowOn || isHighlightOn) {
                sections.forEach((section, sectionIndex) => {
                    section.items.forEach((item, itemIndex) => {
                        categoriesItems.push({
                            id: preactSections[sectionIndex].items[itemIndex].id,
                            categories: item.categories || []
                        });
                    });
                });
            }
            return categoriesItems;
        }, [sections, isHideShowOn, isHighlightOn]);
        const { hiddenIds, updateHidden, highlightedIds, updateHighlighted } = (0, useVizCategories_1.useVizCategories)(categoriesItems, (item) => item.categories, hiddenCategories, highlightedCategories, 'any', 'any', onHiddenCategoriesChanged, onHighlightedCategoriesChanged);
        const getDillDetail = (id) => {
            const [sectionIdx, itemIdx] = id;
            const item = sections[sectionIdx].items[itemIdx];
            if (item.categories)
                return item.categories;
            return item.key;
        };
        const { itemActionHandler, inputHandler } = (0, events_1.getLegendEventsHandler)(isHideShowOn, isHighlightOn, updateHidden, updateHighlighted, getDillDetail, drilling, props.onOjDrill);
        const textStyles = (0, utils_1.getTextStyles)(textStyle);
        const sectionTitleStyles = (0, utils_1.getSectionStyles)(sectionTitleStyle);
        return ((0, jsx_runtime_1.jsx)(UNSAFE_Legend_1.SectionalLegend, { sections: preactSections, orientation: orientation, sectionTitleHAlign: props.sectionTitleHalign, symbolHeight: symbolHeight, symbolWidth: symbolWidth, isReadOnly: !isInteractive, "aria-label": props['aria-label'], hiddenIds: isHideShowOn ? hiddenIds : undefined, highlightedIds: isHighlightOn ? highlightedIds : undefined, onItemAction: itemActionHandler, onInput: inputHandler, ...textStyles, ...sectionTitleStyles }));
    }
});

define('oj-c/legend',["require", "exports", "./legend/legend"], function (require, exports, legend_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Legend = void 0;
    Object.defineProperty(exports, "Legend", { enumerable: true, get: function () { return legend_1.Legend; } });
});

define('oj-c/legend-item',["require", "exports", "./legend-item/legend-item"], function (require, exports, legend_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegendItem = void 0;
    Object.defineProperty(exports, "LegendItem", { enumerable: true, get: function () { return legend_item_1.LegendItem; } });
});

define('oj-c/legend-section',["require", "exports", "./legend-section/legend-section"], function (require, exports, legend_section_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegendSection = void 0;
    Object.defineProperty(exports, "LegendSection", { enumerable: true, get: function () { return legend_section_1.LegendSection; } });
});

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/tag-cloud-item/tag-cloud-item',["require", "exports", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent"], function (require, exports, translationBundle_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagCloudItem = exports.TagCloudItemDefaults = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    exports.TagCloudItemDefaults = {
        categories: []
    };
    exports.TagCloudItem = (0, ojvcomponent_1.registerCustomElement)('oj-c-tag-cloud-item', ({ categories = exports.TagCloudItemDefaults.categories, ...props }) => {
        return null;
    }, "TagCloudItem", { "properties": { "categories": { "type": "Array<string>" }, "color": { "type": "string" }, "label": { "type": "string" }, "value": { "type": "number|null" }, "url": { "type": "string" }, "shortDesc": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/tag-cloud/utils',["require", "exports", "../tag-cloud-item/tag-cloud-item"], function (require, exports, tag_cloud_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeLink = exports.transformItem = void 0;
    function transformItem(dataItem) {
        const item = { ...tag_cloud_item_1.TagCloudItemDefaults, ...dataItem };
        return {
            color: item.color,
            accessibleLabel: item.shortDesc,
            value: item.value,
            label: item.label,
            id: item.key != null ? item?.key : item.id,
            role: (item.url ? 'link' : undefined)
        };
    }
    exports.transformItem = transformItem;
    function executeLink(dest) {
        const newWindow = window.open(dest, '_blank');
        if (newWindow)
            newWindow.focus();
    }
    exports.executeLink = executeLink;
});


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('oj-c/tag-cloud/tag-cloud',["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "preact/compat", "@oracle/oraclejet-preact/UNSAFE_TagCloud", "ojs/ojcontext", "./utils", "@oracle/oraclejet-preact/UNSAFE_VisStatusMessage", "../hooks/UNSAFE_useVizCategories/useVizCategories", "ojs/ojvcomponent", "./utils", "../hooks/UNSAFE_useDataProvider/useDataProvider", "../utils/UNSAFE_vizUtils/TemplateHandler", "css!oj-c/tag-cloud/tag-cloud-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, compat_1, UNSAFE_TagCloud_1, ojcontext_1, utils_1, UNSAFE_VisStatusMessage_1, useVizCategories_1, ojvcomponent_1, utils_2, useDataProvider_1, TemplateHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagCloud = void 0;
    translationBundle_1 = __importDefault(translationBundle_1);
    ojcontext_1 = __importDefault(ojcontext_1);
    function TagCloudComp({ hiddenCategories = [], data = null, highlightedCategories = [], hoverBehavior = 'none', layout = 'rectangular', selection = [], selectionMode = 'none', highlightMatch = 'all', ...props }) {
        const rootRef = (0, hooks_1.useRef)(null);
        const addBusyState = (0, hooks_1.useCallback)((description) => {
            return rootRef.current
                ? ojcontext_1.default.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: description })
                : () => { };
        }, []);
        const [hoveredId, setHoveredId] = (0, hooks_1.useState)();
        const { data: compData } = (0, useDataProvider_1.useDataProvider)({
            data: data ? data : undefined,
            addBusyState: addBusyState
        });
        const isHighlightOn = hoverBehavior === 'dim';
        const getItemContext = (context, index) => {
            return {
                data: context.data,
                key: context.key,
                index
            };
        };
        const items = (0, compat_1.useMemo)(() => {
            const items = props.itemTemplate
                ? (0, TemplateHandler_1.processTemplate)(compData, props.itemTemplate, getItemContext, 'oj-c-tag-cloud-item')
                : compData.map((item) => item.data);
            return items;
        }, [props.itemTemplate, compData]);
        const [idItemMap, preactItems] = (0, compat_1.useMemo)(() => {
            const idItemMap = new Map();
            const preactItems = items.map((item) => {
                if (item.id != null || item.key != null)
                    idItemMap.set(item.id || item.key, item);
                return (0, utils_2.transformItem)(item);
            });
            return [idItemMap, preactItems];
        }, [items]);
        const [hasUrl, categoriesItems] = (0, compat_1.useMemo)(() => {
            let hasUrl = false;
            const categories = items.map((item, itemIndex) => {
                hasUrl = hasUrl || item.url != null;
                return { id: preactItems[itemIndex].id, categories: item.categories || [] };
            });
            return [hasUrl, categories];
        }, [preactItems]);
        const { hiddenIds, highlightedIds, updateHighlighted } = (0, useVizCategories_1.useVizCategories)(categoriesItems, (item) => item.categories, hiddenCategories, highlightedCategories, highlightMatch, 'any', props.onHiddenCategoriesChanged, props.onHighlightedCategoriesChanged);
        const itemActionHandler = (detail) => {
            const item = idItemMap.get(detail.id);
            if (item?.url) {
                (0, utils_1.executeLink)(item.url);
            }
        };
        const selectionChangeHandler = (detail) => {
            props.onSelectionChanged?.(detail.ids);
        };
        const inputHandler = (detail) => {
            if (isHighlightOn)
                updateHighlighted(detail.id);
            setHoveredId(detail.id);
        };
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, children: !data || items.length === 0 ? ((0, jsx_runtime_1.jsx)(UNSAFE_VisStatusMessage_1.VisNoData, { "aria-label": props['aria-label'] })) : ((0, jsx_runtime_1.jsx)(UNSAFE_TagCloud_1.TagCloud, { layout: layout, datatip: props.datatip?.({
                    id: hoveredId
                }), highlightedIds: isHighlightOn ? highlightedIds : undefined, hiddenIds: hiddenIds, accessibleLabel: props['aria-label'], items: preactItems, selectionMode: selectionMode, onSelectionChange: selectionChangeHandler, onItemAction: hasUrl ? itemActionHandler : undefined, onItemInput: inputHandler, selectedIds: selectionMode === 'none' ? undefined : selection, width: "100%", height: "100%" })) }));
    }
    exports.TagCloud = (0, ojvcomponent_1.registerCustomElement)('oj-c-tag-cloud', TagCloudComp, "TagCloud", { "properties": { "data": { "type": "DataProvider|null" }, "datatip": { "type": "function" }, "hiddenCategories": { "type": "Array<string>", "writeback": true }, "touchResponse": { "type": "string", "enumValues": ["auto", "touchStart"] }, "highlightMatch": { "type": "string", "enumValues": ["all", "any"] }, "highlightedCategories": { "type": "Array<string>", "writeback": true }, "hoverBehavior": { "type": "string", "enumValues": ["none", "dim"] }, "layout": { "type": "string", "enumValues": ["cloud", "rectangular"] }, "selectionMode": { "type": "string", "enumValues": ["multiple", "none", "single"] }, "selection": { "type": "Array<any>", "writeback": true } }, "slots": { "itemTemplate": { "data": {} } }, "extension": { "_WRITEBACK_PROPS": ["hiddenCategories", "highlightedCategories", "selection"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label"] } }, { "hiddenCategories": [], "data": null, "highlightedCategories": [], "hoverBehavior": "none", "layout": "rectangular", "selection": [], "selectionMode": "none", "highlightMatch": "all" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});

define('oj-c/tag-cloud',["require", "exports", "./tag-cloud/tag-cloud"], function (require, exports, tag_cloud_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagCloud = void 0;
    Object.defineProperty(exports, "TagCloud", { enumerable: true, get: function () { return tag_cloud_1.TagCloud; } });
});

define('oj-c/tag-cloud-item',["require", "exports", "./tag-cloud-item/tag-cloud-item"], function (require, exports, tag_cloud_item_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagCloudItem = void 0;
    Object.defineProperty(exports, "TagCloudItem", { enumerable: true, get: function () { return tag_cloud_item_1.TagCloudItem; } });
});

require(["oj-c/highlight-text","oj-c/input-date-text","oj-c/input-number","oj-c/input-password","oj-c/input-text","oj-c/message-toast","oj-c/text-area","oj-c/progress-bar","oj-c/progress-circle","oj-c/avatar","oj-c/button","oj-c/rating-gauge","oj-c/select-multiple","oj-c/select-single","oj-c/collapsible","oj-c/file-picker","oj-c/meter-bar","oj-c/meter-circle","oj-c/list-item-layout","oj-c/list-view","oj-c/split-menu-button","oj-c/selector","oj-c/selector-all","oj-c/legend","oj-c/legend-item","oj-c/legend-section","oj-c/tag-cloud","oj-c/tag-cloud-item"], function(){});
define("corepackbundle", function(){});

