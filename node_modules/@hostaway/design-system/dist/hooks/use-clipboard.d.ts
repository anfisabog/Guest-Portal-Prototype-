type UseClipboardReturnType = {
    /**
     * The state indicating whether the text has been copied.
     * If a string is provided, it will be used as the identifier for the copied state.
     */
    copied: string | boolean;
    /**
     * Function to copy text to the clipboard using the modern clipboard API.
     * Falls back to the fallback function if the modern API fails.
     *
     * @param {string} text - The text to be copied.
     * @param {string} [id] - Optional identifier to set the copied state.
     * @returns {Promise<Object>} - A promise that resolves to an object containing:
     *  - `success` (boolean): Whether the copy operation was successful.
     *  - `error` (Error | undefined): The error object if the copy operation failed.
     */
    copy: (text: string, id?: string) => Promise<{
        success: boolean;
        error?: Error;
    }>;
};
/**
 * Custom hook to copy text to the clipboard.
 *
 * @returns {UseClipboardReturnType} - An object containing the copied state and the copy function.
 */
export declare const useClipboard: () => UseClipboardReturnType;
export {};
