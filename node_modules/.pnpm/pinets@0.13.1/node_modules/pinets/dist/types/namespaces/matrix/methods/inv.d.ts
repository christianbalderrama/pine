import { PineMatrixObject } from '../PineMatrixObject';
import { Context } from '../../../Context.class';
/**
 * Gauss-Jordan elimination to compute the inverse of an NxN matrix.
 * Uses partial pivoting for numerical stability.
 * Returns a matrix of NaN if the matrix is singular.
 */
declare function inverse(matrix: number[][]): number[][];
export { inverse };
export declare function inv(context: Context): (id: PineMatrixObject) => PineMatrixObject;
