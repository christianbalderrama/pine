import { PineMatrixObject } from '../PineMatrixObject';
import { Context } from '../../../Context.class';
/**
 * Moore-Penrose pseudoinverse.
 * - Square matrix: pinv(A) = inv(A)
 * - Tall matrix (m > n): pinv(A) = (A^T A)^-1 A^T
 * - Wide matrix (m < n): pinv(A) = A^T (A A^T)^-1
 */
export declare function pinv(context: Context): (id: PineMatrixObject) => PineMatrixObject;
