const { ethers } = require("hardhat");

//Constantes
const EivissaProject_ADDRESS = "0x7b89a3198F76a7729C764dBB2AE08FCf99eCC218";
const STANDART = 0;
const VIP = 1;
const MCYC = 2;

async function main() {
  const EivissaProject_CONTRACT = await ethers.getContractAt(
    "EivissaProject",
    EivissaProject_ADDRESS
  );

  // Número de contratos de Autions y Sales
  let totalAuctions = await EivissaProject_CONTRACT.totalAuctions();
  let totalSales = await EivissaProject_CONTRACT.totalSales();
  totalAuctions = totalAuctions.toNumber();
  totalSales = totalSales.toNumber();

  // Direcciones de los contratos
  let auctionsAddress = [];
  let salesAddress = [];
  // Obteción de las direcciones
  for (let i = 0; i < totalAuctions; i++) {
    auctionsAddress.push(await EivissaProject_CONTRACT.auctions(i));
  }
  for (let i = 0; i < totalSales; i++) {
    salesAddress.push(await EivissaProject_CONTRACT.sales(i));
  }

  // Contratos de los Auction y Sales
  let auctionsContracts = auctionsAddress.map(
    async (auctionAddress) =>
      await ethers.getContractAt("Auction", auctionAddress)
  );
  let salesContracts = salesAddress.map(
    async (saleAddress) => await ethers.getContractAt("Sale", saleAddress)
  );
  await Promise.all(auctionsContracts).then((result) => {
    auctionsContracts = result;
  });
  await Promise.all(salesContracts).then((result) => {
    salesContracts = result;
  });

  // Nombres de los Auction y Sales
  let auctionsName = auctionsContracts.map(
    async (auctionsContract) => await auctionsContract.name()
  );
  let salesName = salesContracts.map(
    async (salesContract) => await salesContract.name()
  );
  await Promise.all(auctionsName).then((result) => {
    auctionsName = result;
  });
  await Promise.all(salesName).then((result) => {
    salesName = result;
  });

  let Autions = {};
  let Sales = {};
  let GlobalSupply = 0;
  let GlobalBids = 0;
  let GlobalSales = 0;

  for (var i = 0; i < totalAuctions; i++) {
    let contract = auctionsContracts[i];

    if (auctionsName[i] == "prueba" || i == 3) {
      continue;
    }

    let standart_max_supply = (await contract.maxSupplies(STANDART)).toNumber();
    let vip_max_supply = (await contract.maxSupplies(VIP)).toNumber();
    let mcyc_max_supply = (await contract.maxSupplies(MCYC)).toNumber();

    let standart_bid = (await contract.biddersAmount(STANDART)).toNumber();
    let vip_bid = (await contract.biddersAmount(VIP)).toNumber();
    let mcyc_bid = (await contract.biddersAmount(MCYC)).toNumber();

    Autions[auctionsName[i]] = {
      standart_max: standart_max_supply,
      standart_bid: standart_bid,
      vip_max: vip_max_supply,
      vip_bid: vip_bid,
      mcyc_max: mcyc_max_supply,
      mcyc_bid: mcyc_bid,
      total_max: standart_max_supply + vip_max_supply + mcyc_max_supply,
      total_bid: standart_bid + vip_bid + mcyc_bid,
    };
    GlobalBids += standart_bid + vip_bid + mcyc_bid;
    GlobalSupply += standart_max_supply + vip_max_supply + mcyc_max_supply;
  }

  for (var i = 0; i < totalSales; i++) {
    let contract = salesContracts[i];

    let standart_max_supply = (await contract.maxSupplies(STANDART)).toNumber();
    let vip_max_supply = (await contract.maxSupplies(VIP)).toNumber();
    let mcyc_max_supply = (await contract.maxSupplies(MCYC)).toNumber();

    let standart_sale = (await contract.currentSupply(STANDART)).toNumber();
    let vip_sale = (await contract.currentSupply(VIP)).toNumber();
    let mcyc_sale = (await contract.currentSupply(MCYC)).toNumber();

    Sales[salesName[i]] = {
      standart_max: standart_max_supply,
      standart_sale: standart_sale,
      vip_max: vip_max_supply,
      vip_sale: vip_sale,
      mcyc_max: mcyc_max_supply,
      mcyc_bid: mcyc_sale,
      total_max: standart_max_supply + vip_max_supply + mcyc_max_supply,
      total_sale: standart_sale + vip_sale + mcyc_sale,
    };
    GlobalSales += standart_sale + vip_sale + mcyc_sale;
    GlobalSupply += standart_max_supply + vip_max_supply + mcyc_max_supply;
  }

  console.log(Autions);

  console.log();

  console.log(Sales);

  console.log();

  console.log("Total Bids: " + GlobalBids);
  console.log("Total Sales: " + GlobalSales);
  console.log("Total Supply: " + GlobalSupply);

  console.log();

  console.log(
    "Total STANDAR claimed: " +
      (await EivissaProject_CONTRACT.totalSupply(STANDART)).toNumber()
  );
  console.log(
    "Total VIP claimed: " +
      (await EivissaProject_CONTRACT.totalSupply(VIP)).toNumber()
  );
  console.log(
    "Total MCYC claimed: " +
      (await EivissaProject_CONTRACT.totalSupply(MCYC)).toNumber()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
