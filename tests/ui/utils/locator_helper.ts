export function getLabelLocator(text: string): string {
    return `//div[normalize-space(.)="${text}:"]`;
}

export function getValueLocator(text: string): string {
    return `//div[normalize-space(.)="${text}:"]//following-sibling::div[1]`;
}
