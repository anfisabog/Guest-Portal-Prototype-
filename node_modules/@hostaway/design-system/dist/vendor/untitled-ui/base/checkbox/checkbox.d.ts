import type { ReactNode, Ref } from "react";
import { type CheckboxProps as AriaCheckboxProps } from "react-aria-components";
export interface CheckboxBaseProps {
    size?: "sm" | "md";
    className?: string;
    isFocusVisible?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
    isIndeterminate?: boolean;
}
export declare const CheckboxBase: {
    ({ className, isSelected, isDisabled, isIndeterminate, size, isFocusVisible }: CheckboxBaseProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
interface CheckboxProps extends AriaCheckboxProps {
    ref?: Ref<HTMLLabelElement>;
    size?: "sm" | "md";
    label?: ReactNode;
    hint?: ReactNode;
}
export declare const Checkbox: {
    ({ label, hint, size, className, ...ariaCheckboxProps }: CheckboxProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export {};
