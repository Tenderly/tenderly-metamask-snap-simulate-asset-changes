import {
  Component,
  divider,
  heading,
  panel,
  Panel,
  text,
} from '@metamask/snaps-ui';
import { arrMakeUnique, makeAddressFormatters } from './utils';
import { TenderlyCredentials } from './credentials-access';

/**
 *
 * @param data
 * @param credentials
 */
export function formatResponse(
  data: any,
  credentials: TenderlyCredentials,
): Panel {
  const formatters = makeAddressFormatters(data);

  const panelOutputs = [
    ...formatSimulationUrl(data, credentials),
    divider(),
    ...formatAssetChanges(data),
    divider(),
    ...formatBalanceDiff(data, formatters),
    divider(),
    ...formatOutputValue(data, formatters),
    divider(),
    ...formatStorageChanges(data, formatters),
    divider(),
    ...formatEventLogs(data, formatters),
    divider(),
    ...formatCallTrace(data),
  ];

  return panel(panelOutputs);
}

/**
 *
 * @param data
 * @param options0
 * @param options0.formatAddress
 */
function formatBalanceDiff(data: any, { formatAddress }: any): Component[] {
  const panelOutputs: Component[] = [heading('Balance changes:')];
  const callTrace = data.transaction.transaction_info.call_trace;

  if (!callTrace.balance_diff) {
    panelOutputs.push(text('No balance changes'));
    return panelOutputs;
  }

  callTrace.balance_diff.forEach((balance: any) => {
    const accountLabel = balance.is_miner
      ? 'BlockProducer'
      : formatAddress(balance.address);
    panelOutputs.push(
      text(
        `**${accountLabel}**: ${(balance.dirty - balance.original) / 1e18} ETH`,
      ),
    );
  });

  return panelOutputs;
}

/**
 *
 * @param data
 * @param options0
 * @param options0.formatAddressesWithinStr
 */
function formatOutputValue(
  data: any,
  { formatAddressesWithinStr }: any,
): Component[] {
  const panelOutputs: Component[] = [heading('Output value:')];
  const callTrace = data.transaction.transaction_info.call_trace;

  if (!callTrace.output) {
    panelOutputs.push(text('No output value'));
    return panelOutputs;
  }

  if (callTrace.decoded_output) {
    callTrace.decoded_output.forEach((output: any) => {
      const formattedValue = formatAddressesWithinStr(
        JSON.stringify(output.value),
      );
      panelOutputs.push(
        text(
          `${output.soltype.name}[${output.soltype.type}] = ${formattedValue}`,
        ),
      );
    });
  } else {
    panelOutputs.push(text(callTrace.output));
  }

  return panelOutputs;
}

/**
 *
 * @param data
 */
function formatAssetChanges(data: any): Component[] {
  const panelOutputs: Component[] = [heading('Asset Changes:')];
  const assetChanges = data.transaction.transaction_info?.asset_changes;

  if (!assetChanges) {
    panelOutputs.push(text('No asset changes'));
    return panelOutputs;
  }

  const erc20Outputs: Component[] = [text('🪙 **ERC20 Changes:**')];
  const erc721Outputs: Component[] = [text('🖼️ **ERC721 Changes:**')];
  const otherOutputs: Component[] = [text('**Other Changes:**')];

  assetChanges.forEach((assetChange: any) => {
    if (assetChange.token_info.standard === 'ERC20') {
      erc20Outputs.push(text(`**${assetChange.token_info.name}**`));
      erc20Outputs.push(text(`Change Type: ${assetChange.type}`));
      erc20Outputs.push(
        text(
          `Amount: ${assetChange.amount} **($${Number(
            assetChange.dollar_value,
          ).toFixed(2)})**`,
        ),
      );
      erc20Outputs.push(divider());
    } else if (assetChange.token_info.standard === 'ERC721') {
      // Don't show dollar value since it's not supported (always $0)
      erc721Outputs.push(text(`**${assetChange.token_info.name}**`));
      erc721Outputs.push(text(`Change Type: ${assetChange.type}`));
      erc721Outputs.push(text(`Amount: ${assetChange.amount}`));
      erc721Outputs.push(divider());
    } else {
      otherOutputs.push(
        text(
          `**${assetChange.token_info.name}** ($${Number(
            assetChange.token_info.dollar_value,
          ).toFixed(2)})`,
        ),
      );
      otherOutputs.push(text(`Change Type: ${assetChange.type}`));
      otherOutputs.push(
        text(
          `Amount: ${assetChange.amount} **($${Number(
            assetChange.dollar_value,
          ).toFixed(2)})**`,
        ),
      );
      otherOutputs.push(divider());
    }
  });

  panelOutputs.push(
    ...(erc20Outputs.length > 1 ? erc20Outputs : []),
    ...(erc721Outputs.length > 1 ? erc721Outputs : []),
    ...(otherOutputs.length > 1 ? otherOutputs : []),
  );
  return panelOutputs;
}

/**
 *
 * @param data
 * @param formatters
 */
function formatStorageChanges(data: any, formatters: any): Component[] {
  const { formatAddress, formatAddressesWithinStr } = formatters;
  const panelOutputs: Component[] = [heading('Storage Changes:')];
  const stateDiff = data.transaction.transaction_info.state_diff;

  if (!stateDiff) {
    panelOutputs.push(text('No storage changes'));
    return panelOutputs;
  }

  const uniqueContracts = arrMakeUnique(stateDiff.map((d: any) => d.address));
  uniqueContracts.forEach((contract) => {
    panelOutputs.push(divider());
    panelOutputs.push(text(`**➤ ${formatAddress(contract)}**`));

    const storageChanges = stateDiff.filter((d: any) => d.address === contract);

    storageChanges.forEach((diff: any) => {
      // todo: support raw format here!
      if (diff.soltype) {
        panelOutputs.push(
          text(`▸ **${diff.soltype.name}[${diff.soltype.type}]:**`),
        );
      }
      const formattedOriginal = formatAddressesWithinStr(
        JSON.stringify(diff.original),
      );

      const formattedDirty = formatAddressesWithinStr(
        JSON.stringify(diff.dirty),
      );

      panelOutputs.push(text(`${formattedOriginal} => ${formattedDirty}`));
    });
  });

  return panelOutputs;
}

/**
 *
 * @param data
 * @param formatters
 */
function formatEventLogs(data: any, formatters: any): Component[] {
  const { formatAddress, formatAddressesWithinStr } = formatters;
  const panelOutputs: Component[] = [heading('Event logs:')];
  const logs = data.transaction.transaction_info.call_trace?.logs;

  if (!logs) {
    panelOutputs.push(text('No event logs'));
    return panelOutputs;
  }

  logs.forEach((log: any) => {
    if (log.name) {
      panelOutputs.push(divider());
      panelOutputs.push(
        text(`**➤ ${formatAddress(log.raw.address)}::${log.name}**`),
      );

      log.inputs.forEach((input: any) => {
        panelOutputs.push(
          text(
            `▸ **${input.soltype.name}[${
              input.soltype.type
            }]:** ${formatAddressesWithinStr(JSON.stringify(input.value))}`,
          ),
        );
      });
    } else {
      panelOutputs.push(text(`**Address:** ${log.raw.address}`));
      panelOutputs.push(text(`**Topics:** ${log.raw.topics}`));
      panelOutputs.push(text(`**Data:** ${log.raw.data}`));
    }
  });

  return panelOutputs;
}

/**
 *
 * @param data
 */
function formatCallTrace(data: any): Component[] {
  /**
   *
   * @param calls
   * @param iter
   */
  function formatCallsRecursive(calls: any, iter = 0): Component[] {
    let lines: Component[] = [];

    calls.forEach((call: any) => {
      const tab = '|'.repeat(iter);
      const contract = call.contract_name || call.to;
      const method = call.function_name || call.input.slice(0, 10);
      const line = text(`|${tab}↳  **${contract}::${method}**`);

      lines = call.calls
        ? [...lines, line, ...formatCallsRecursive(call.calls, iter + 4)]
        : [...lines, line];
    });

    return lines;
  }

  const calls = data.transaction.transaction_info.call_trace?.calls;

  if (!calls) {
    return [heading('Call trace:'), text('No call trace')];
  }

  return [heading('Call trace:'), ...formatCallsRecursive(calls)];
}

/**
 *
 * @param data
 * @param credentials
 */
export function formatSimulationUrl(
  data: any,
  credentials: TenderlyCredentials,
): Component[] {
  const simulationUrl = `https://dashboard.tenderly.co/${credentials.userId}/${credentials.projectId}/simulator/${data.simulation?.id}`;

  return [
    heading('Tenderly Dashboard:'),
    text('See full simulation details in Tenderly.'),
    text(
      `**Status:** ${data.transaction?.status ? 'Success ✅' : 'Failed ❌'}`,
    ),
    text(`**${simulationUrl}**`),
  ];
}
