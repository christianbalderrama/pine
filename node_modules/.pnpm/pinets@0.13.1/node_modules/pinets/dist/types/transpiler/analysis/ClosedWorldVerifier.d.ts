/** Thrown when the verifier rejects a node. Carries no host detail. */
export declare class ClosedWorldViolation extends Error {
    constructor(message: string);
}
/**
 * Verify that `ast` (a fully-transformed program) describes a closed world:
 * no free host identifiers, no reserved-property or runtime-internal access,
 * no dynamic member access or other realm escapes. Throws ClosedWorldViolation
 * on the first offending node.
 */
export declare function verifyClosedWorld(ast: any): void;
