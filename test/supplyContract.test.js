const SupplyContract = artifacts.require("SupplyContract");

contract("SupplyContract", (accounts) => {
    let supplyContract;
    let accId;

    before(async () => {
        supplyContract = await SupplyContract.deployed();
    });

    describe("Runnable", async () => {
        it("GetSupplyCount", async () => {
            const result = await supplyContract.GetSupplyCount();
            console.log(result);
            assert.equal(result, 0);
        });
    });

    describe("CRUD Supplies", async () => {
        it("Create new pencil supply", async () => {
            const result = await supplyContract.CreateSupply.sendTransaction("OF003", "Bút chì", "300", "cái");
        });
        it("Create new pencil 2 supply", async () => {
            const result = await supplyContract.CreateSupply.sendTransaction("OF004", "Bút chì 2", "200", "cái", {from: "0xDD4FE9040a87Db5d33662324a3A41197F3f337F3"});
        });
        it("Check count after creation", async () => {
            const result = await supplyContract.GetSupplyCount();
            assert.equal(Number(result), 2);
        });
        it("Get all supplies", async () => {
            const result = await supplyContract.GetAllSupplies.call();
            console.log(result);
        });
        it("Get pencil supply by id, check name", async () => {
            const result = await supplyContract.GetSuppliesByID("OF003", { from: accounts[0] });
            assert.equal(result.name, "Bút chì");
        });
        it("Update pencil supply and check if changed", async () => {
            const result = await supplyContract.UpdateSupply("OF003", "Bút chì kim", 200, "cái", { from: accounts[0] });
            const result2 = await supplyContract.GetSuppliesByID("OF003", { from: accounts[0] });
            assert(result2.name == "Bút chì kim" && Number(result2.quantity) == 200);
        });
    });

    describe("User transactions", async () => {
        it("Perform pencil 2 transaction", async () => {
            const result = await supplyContract.Transfer("OF004", 30, { from: accounts[0] });
            const result2 = await supplyContract.GetSuppliesByID("OF004", { from: accounts[0] });
            assert.equal(result2.quantity, 170);
        });
        it("Get all user transactions", async () => {
            const result = await supplyContract.GetTransactions({ from: accounts[0] });
            const {0: ids, 1: quantities} = result;
            console.log(result);
            assert.equal(ids.length, 1);
        });
    });
});
