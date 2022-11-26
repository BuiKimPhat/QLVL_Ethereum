const SupplyContract = artifacts.require("SupplyContract");

contract("SupplyContract", (accounts) => {
    let supplyContract;
    let accId;

    before(async () => {
        supplyContract = await SupplyContract.deployed();
    });

    describe("CRUD Supplies", async () => {
        it("Get all supplies", async () => {
            const supplies = await supplyContract.GetAllSupplies({ from: accounts[0] });
        });
        it("Get paper supply by id", async () => {
            const value = await supplyContract.GetSuppliesByID("OF002", { from: accounts[0] });
        });
        it("Create new pencil supply", async () => {
            const value = await supplyContract.CreateSupply("OF003", "Bút chì", 300, "cái", { from: accounts[0] });
        });
        it("Update pencil supply", async () => {
            const value = await supplyContract.UpdateSupply("OF003", "Bút chì kim", 200, "cái", { from: accounts[0] });
        });
        it("Delete pencil supply", async () => {
            const value = await supplyContract.DeleteSupply("OF003", { from: accounts[0] });
        });
    });

    describe("User transactions", async () => {
        it("Get all user transactions", async () => {
            const supplies = await supplyContract.GetAllSupplies({ from: accounts[0] });
        });
        it("Perform paper transaction", async () => {
            const value = await supplyContract.Transact("OF002", 10, { from: accounts[0] });
        });
    });
});
