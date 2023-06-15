import {
  OnRpcRequestHandler,
  OnTransactionHandler,
} from '@metamask/snaps-types';
import { isObject, hasProperty } from '@metamask/utils';
import { NodeType } from '@metamask/snaps-ui';
import {
  handleUpdateTenderlyCredentials,
  handleSendTenderlyTransaction,
  simulate,
} from './tenderly';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'update_tenderly_credentials':
      return handleUpdateTenderlyCredentials(origin);
    case 'send_tenderly_transaction':
      return handleSendTenderlyTransaction(origin);
    default:
      throw new Error(`Method ${request.method} not supported.`);
  }
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  transactionOrigin,
}) => {
  if (!isObject(transaction) || !hasProperty(transaction, 'to')) {
    return {
      content: {
        value: 'Unknown transaction type',
        type: NodeType.Text,
      },
    };
  }

  const simulationResponse = await simulate(transaction, transactionOrigin);

  return {
    content: {
      children: simulationResponse.children,
      type: NodeType.Panel,
    },
  };
};
