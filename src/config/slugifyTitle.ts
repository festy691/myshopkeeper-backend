import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique slug from a given title.
 * @param title - The title to be converted into a slug.
 * @param checkSlugExists - A function that checks if the generated slug already exists.
 * @returns A unique slug.
 */
async function slugifyTitle(
    title: string,
    checkSlugExists: (slug: string) => Promise<boolean>
): Promise<string> {
    let baseSlug = slugify(title, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check if the slug already exists and generate a new one if necessary
    while (await checkSlugExists(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

export { slugifyTitle }