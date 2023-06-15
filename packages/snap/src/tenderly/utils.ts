import { Panel } from '@metamask/snaps-ui';
import { Json } from '@metamask/utils';

/**
 *
 * @param hex
 */
export function hex2int(hex: string | Json): number | null {
  return hex ? parseInt(hex.toString(), 16) : null;
}

/**
 *
 * @param o
 * @param s
 * @param r
 */
export function strReplaceAll(o: string, s: string, r: string): string {
  return o.replace(new RegExp(s, 'g'), r);
}

/**
 *
 * @param arr
 */
export function arrMakeUnique(arr: any[]): any[] {
  return [...new Set(arr)];
}

/**
 *
 * @param content
 * @param placeholder
 */
export async function requestSnapPrompt(
  content: Panel,
  placeholder: string,
): Promise<string | null> {
  const res = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'prompt',
      content,
      placeholder,
    },
  });
  return res ? res.toString() : null;
}

/**
 *
 * @param data
 */
export function makeAddressFormatters(data: any) {
  const { transaction } = data;
  const accountLabels = new Map<string, string>();

  accountLabels.set(transaction.from.toLowerCase(), 'TxOrigin');
  for (const contract of data.contracts) {
    accountLabels.set(contract.address.toLowerCase(), contract.contract_name);
  }

  if (transaction.to) {
    const recvLabel = accountLabels.get(transaction.to.toLowerCase());
    accountLabels.set(
      transaction.to.toLowerCase(),
      `${recvLabel ? `${recvLabel}|` : ''}TxRecipient`,
    );
  }

  const formatAddress = (a: string) => accountLabels.get(a.toLowerCase()) || a;
  const formatAddressesWithinStr = (val: string) => {
    val = val.toLowerCase();
    for (const [address, label] of accountLabels.entries()) {
      val = strReplaceAll(val, address, label);
    }
    return val;
  };

  return { formatAddress, formatAddressesWithinStr };
}
