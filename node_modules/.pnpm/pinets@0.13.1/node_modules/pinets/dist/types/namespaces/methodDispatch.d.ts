/**
 * Whether a user `method` declared on `fn.__pineReceiverType__` applies to `recv`, judged from the
 * runtime value. `udtName` is set when the declared receiver is a user type (the transpiler passes
 * it), which is how two user types with the same method name are told apart.
 * `int[]` and `float[]` cannot be told apart at runtime; both are just arrays.
 */
export declare function receiverMatchesMethod(fn: any, udtName: string | null, recv: any): boolean;
