/**
 * Generates a unique ID from a given staff.
 * @param initial - The initial to be added to the ID.
 * @param checkIDExists - A function that checks if the generated ID already exists.
 * @returns A unique ID.
 */
async function genStaffId(
    initial: string,
    checkIDExists: (employeeId: string) => Promise<boolean>
): Promise<string> {
    let baseId = `${initial}-000001`;
    let uniqueId = baseId;
    let counter = 1;

    // Check if the slug already exists and generate a new one if necessary
    while (await checkIDExists(uniqueId)) {
        uniqueId = `${baseId.split("-")[0]}-${(Number(baseId.split("-")[1]) + counter).toString().padStart(6, '0')}`;
        counter++;
    }

    return uniqueId;
}

export {genStaffId}