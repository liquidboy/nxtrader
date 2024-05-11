export function extractErrorAsString(context, onerrorEvent) {
    try {
        return context + `. ${onerrorEvent.target.error}`;
    } catch {
        return context + ". Error converting indexdb error event to string";
    }
}