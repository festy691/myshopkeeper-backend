function toTitleCase(input: string): string {
    if (!input) return input; // Return if the input is empty or null

    const exceptions = ['is', 'of', 'to', 'and'];

    return input.trim().split(/\s+/).map((word, index) => {
        // Always capitalize the first word
        if (index === 0 || !exceptions.includes(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
            return word.toLowerCase();
        }
    }).join(' ');
}

export {toTitleCase}