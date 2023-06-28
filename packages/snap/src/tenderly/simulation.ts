import { panel, text, Panel, divider, heading } from '@metamask/snaps-ui';
import { Json } from '@metamask/utils';
import { TenderlyCredentials, fetchCredentials } from './credentials-access';
import { formatResponse, formatSimulationUrl } from './formatter';
import { hex2int, requestSnapPrompt } from './utils';

/**
 * Updates the credentials associated with Tenderly project.
 *
 * @param origin - The origin of the request
 */
export async function handleSendTenderlyTransaction(origin: string) {
  return requestSnapPrompt(
    panel([
      heading(`${origin} wants to send the transaction`),
      text('Enter your transaction payload:'),
    ]),
    '{ "data": "0x..." }',
  );
}

/**
 *
 * @param transactionOrigin
 */
export async function simulate(
  transaction: { [key: string]: Json },
  transactionOrigin: string,
): Promise<Panel> {
  const credentials = await fetchCredentials(transactionOrigin);

  if (!credentials) {
    return panel([text('🚨 Tenderly access key updated. Please try again.')]);
  }

  const simulationResponse = await submitSimulation(transaction, credentials);
  const err = catchError(simulationResponse, credentials);

  return err || formatResponse(simulationResponse, credentials);
}

/**
 *
 * @param credentials
 */
async function submitSimulation(
  transaction: { [key: string]: Json },
  credentials: TenderlyCredentials,
) {
  const chainId = await ethereum.request({ method: 'eth_chainId' });
  const response = await fetch(
    `https://api.tenderly.co/api/v1/account/${credentials.userId}/project/${credentials.projectId}/simulate`,
    {
      method: 'POST',
      body: JSON.stringify({
        from: transaction.from,
        to: transaction.to,
        input: transaction.data,
        gas: hex2int(transaction.gas),
        // gas_price: hex2int(transaction.maxFeePerGas),
        value: hex2int(transaction.value),
        network_id: hex2int(chainId as string),
        save: true,
        save_if_fails: true,
        simulation_type: 'full',
        generate_access_list: false,
        source: 'metamask-snap',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': credentials.accessKey,
      },
    },
  );

  const parsedResponse = await response.json();

  // Make the simulation publicly accessible
  if (parsedResponse?.simulation?.id) {
    await fetch(
      `https://api.tenderly.co/api/v1/account/${credentials.userId}/project/${credentials.projectId}/simulations/${parsedResponse.simulation.id}/share`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': credentials.accessKey,
        },
      },
    );
  }

  return parsedResponse;
}

/**
 *
 * @param data
 * @param credentials
 */
function catchError(data: any, credentials: TenderlyCredentials): Panel | null {
  if (!data.transaction) {
    if (data.error) {
      return panel([
        heading('❌ Transaction Error'),
        text(`**${data.error.slug}**`),
        divider(),
        text(data.error.message),
      ]);
    }

    return panel([
      heading('❌ Invalid response'),
      divider(),
      text(JSON.stringify(data)),
    ]);
  } else if (data.transaction.error_info) {
    return panel([
      heading(`❌ Error in ${data.transaction.error_info.address}:`),
      divider(),
      text(data.transaction.error_info.error_message),
      divider(),
      ...formatSimulationUrl(data, credentials),
    ]);
  }

  return null;
}
