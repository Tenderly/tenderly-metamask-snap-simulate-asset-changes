# Tenderly Simulate Asset Changes Snap

<img width="1680" alt="image" src="https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes/assets/26412515/9ab7d12b-bc93-4d64-a688-41a850ce6b78">

# Introduction

The Tenderly Simulate Asset Changes Snap is an innovative collaboration that merges the robust simulation capabilities of Tenderly with the extensive features of MetaMask Snaps. Our main objective is to augment the transparency and visibility of dApp contract calls, giving users a comprehensive overview before they confirm a transaction.

Upon setting up a transaction, the user is presented with the following data points to assist in making an informed decision:

| Feature | Description |
|---------|-------------|
| **Link to Simulation in Tenderly Dashboard** | For a more in-depth analysis, users can follow a link to view the full contract simulation on the Tenderly Dashboard. |
| **Asset Changes with Dollar Value** | To assist in understanding the financial implications of the transaction, users are shown any changes in asset quantities along with their corresponding dollar value. The most commonly used token standards are supported: **ERC20** and **ERC721**. |
| **Native-asset Balance Changes** | This feature enables users to track the modifications in their native-asset balance during the execution of the contract. |
| **Output Value** | The output value provides the result of the contract call, displaying what the contract is set to return. |
| **Storage Changes** | Users can see any alterations made to the contract's storage during execution, allowing them to understand how their contract interacts with the blockchain's state. |
| **Event Logs** | Event logs show all the events that were emitted during the contract's execution, offering valuable insights into the contract's internal operations. |
| **Call Traces** | Call traces provide a step-by-step breakdown of the contract execution, helping users to debug and understand the behavior of their contract. |

By providing these features, our project aims to enhance the user experience, reduce transaction risks, and increase the understanding of blockchain transactions.

More info about asset changes can be found on our official docs:

- **Simulation API** - https://docs.tenderly.co/simulations-and-forks/simulation-api
- **Asset Changes** - https://docs.tenderly.co/simulations-and-forks/asset-changes

# Setup

Welcome to the setup guide for the Tenderly Simulate Asset Changes Snap. In this tutorial, we will guide you through each step to ensure that you are set up correctly. Follow the instructions below to get started.

## 1. MetaMask Snap Development

- **Disable the Production Version of MetaMask**: If you have the production version of MetaMask installed, you'll need to disable it. Navigate to `chrome://extensions` in your browser. Locate MetaMask from the list of your installed extensions, and toggle it off. Alternatively, you can start a new profile in Chrome or Brave, which will allow you to use different extensions for different purposes.

- **Install MetaMask Flask Development Plugin**: The next step is to install the MetaMask Flask development plugin. This is a specific version of MetaMask designed for development purposes. You can install it from the [Chrome Web Store](https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk). Simply click the link and follow the instructions to add the plugin to your browser.

## 2. Tenderly Access

- **Open a Tenderly Account**: To use the Tenderly MetaMask snap, you'll need a Tenderly account. If you don't have one already, visit the [Tenderly website](https://dashboard.tenderly.co/register) and create a new account.

- **Create an Access Key**: Once you've logged into your Tenderly account, you will need to create an `access-key`. This is a unique identifier that allows the Tenderly MetaMask snap to interact with your Tenderly account. You can generate it on the following link https://dashboard.tenderly.co/account/authorization.

<img width="577" alt="image" src="https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes/assets/26412515/0abb39b3-dd2b-4af6-98c4-73c00f4f70f0">

## 3. App Setup

- **Clone the Repository**: Now, you'll need to get the code for the app onto your local machine. You can do this by cloning this repository. If you're not sure how to do this, you can find detailed instructions in the GitHub documentation.

- **Start the App**: After you've cloned the repository, navigate to the root directory of the project in your terminal. Once you're in the correct location, run the command `yarn start`. This will start the app, and it should be accessible on http://localhost:8000.

To clone the repository, use the following command:

```
git clone https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes.git
```

Then navigate to the root directory of the project:

```
cd tenderly-metamask-snap-simulate-asset-changes
```

Start the app with:

```
yarn start
```

## 4. Connection & Credentials

- **Install the Snap**: With the app running, you can now install the Tenderly MetaMask snap. To do this, click on **Reconnect** button within the app.

- **Add Tenderly Credentials**: Finally, you'll need to add your Tenderly credentials to the snap. Click on **Add access key** button within the app. You'll need to enter your credentials in the following format: `{user_id}@{project_id}@{access_key}`.

That's it! You've successfully set up the Tenderly MetaMask snap. If you encounter any issues during the setup process, don't hesitate to reach out to our support team at support@tenderly.co. We're here to help! 💜

# Examples

In this section, we provide examples of how the Tenderly MetaMask snap works with both successful and failed transactions. These examples include ERC20 and NFT transfers.

## Successful Transactions ✅

### ERC20 Transfer - send 1 USDC to demo.eth

The images below show a successful ERC20 token transfer of 1 USDC to `demo.eth`. The first image shows the asset changes, while the second image provides a detailed breakdown of the transaction.

<img width="419" alt="image" src="https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes/assets/26412515/e8bee0ce-4a37-4ae8-a9a9-c3d074d56245">
<img width="413" alt="image" src="https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes/assets/26412515/b88995b2-5c6a-4484-b976-0c609ce49c44">

### NFT Transfer - send 1 NFT to other address

The images below show a successful ERC721 (NFT) token transfer of 1 Crypto Bull to other address. The first image shows the asset changes, while the second image provides a detailed breakdown of the transaction.

<img width="420" alt="image" src="https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes/assets/26412515/1fc50ec1-0f34-430a-b1ef-5d4a9eeedade">
<img width="420" alt="image" src="https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes/assets/26412515/534a49b3-d015-44b5-b0c5-279a75b5af64">

## Failed Transaction ❌

### ERC20 Transfer - send 1,000,000 USDC to demo.eth

The image below shows a failed ERC20 token transfer of 1,000,000 USDC to `demo.eth`.

<img width="425" alt="image" src="https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes/assets/26412515/5be3bbf0-7ac9-4d6d-8927-7aa5d9c045a4">

# Contributors

<a href="https://github.com/Tenderly/tenderly-metamask-snap-simulate-asset-changes/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Tenderly/tenderly-metamask-snap-simulate-asset-changes&max=100&columns=20" alt="tenderly-contributors" />
</a>

The repo is made using [@metamask/template-snap-monorepo](https://github.com/MetaMask/template-snap-monorepo).
