import { before, after } from 'mocha';
import * as sinon from 'sinon';
import * as cmr from 'util/cmr';

type CmrMethodName = 'cmrSearchBase' | 'fetchPost' | 'cmrPostSearchBase' | 'getCollectionsByIds' | 'getVariablesByIds' | 'getVariablesForCollection' | 'queryGranulesForCollection' | 'belongsToGroup' | 'cmrApiConfig';

/**
 * Replace a function in the `cmr` module with a given function. This is needed because
 * `replay` does not handle POSTs to the CMR correctly.
 *
 * @param functionName - The name of the function to be stubbed
 * @param response - The response the function should return
 */
function stubCmr(functionName: CmrMethodName, response: object): void {
  sinon.stub(cmr, functionName)
    .callsFake(async () => response);
}

/**
 * Remove a stub from the `cmr` module
 *
 * @param functionName - The name of the function to reset
 */
function unStubCmr(functionName: string): void {
  if (cmr[functionName].restore) cmr[functionName].restore();
}

/**
 * Adds before / after hooks in mocha to replace a function in the
 * `cmr` module with a function that generates the given response
 *
 * Example: (`cmrPostSearchBase` returns a 400 status with error message)
 * ```
* hookCmr('cmrPostSearchBase',
  { status: 400,
    data: { errors: ['Corrupt zip file'] }
  });
 * ```
 * @param functionName - The name of the function to stub
 * @param response - The desired response
 */
export default function hookCmr(functionName: CmrMethodName, response: object): void {
  before(async function () {
    stubCmr(functionName, response);
  });
  after(async function () {
    unStubCmr(functionName);
  });
}
