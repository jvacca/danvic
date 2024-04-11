const Config = {
  DEV_MODE: true,
  TEST_ONBOARDING: !process.env.NODE_ENV,
  DATAPROVIDER_TESTENV: '',           // expecting something like https://www.mcom-xxx.tbe.zeus.fds.com"
  DATAPROVIDER_GET_MACYS_NFTS_ENDPOINT: 'https://storage.googleapis.com/assets.mcomnyapps.net/john-vacca-test/web3/data/collection.json',   // anticipating making calls to db for NFT metadata
  //PROVIDER_RPC_SERVER: 'https://smart-holy-sound.ethereum-goerli.discover.quiknode.pro/8a09d6a15c27c858b31223834c2cab27a7e613cc/',
  //PROVIDER_RPC_SERVER: "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78",
  CONTRACT_ADDRESS: "0x986a47CEE9ca2dB721930516f1F7D0CcfBFcaD72",
  //CONTRACT_ADDRESS: "0x5a6FBA58a5e33574A8b3509d1408639202B31f8F",
  SUPPORTED_NETWORK_ID: "0x5",
  CAMPAIGNROOT: 'https://storage.googleapis.com/imp-projects-c/nft/assets2/',
  API_KEY: 'AIzaSyDwWdAwtgUVdkzr8wqWIG1rySnEtv39yl0'
};
export default Config;
