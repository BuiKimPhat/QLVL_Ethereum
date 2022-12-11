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
    //     it("Get paper supply by id", async () => {
    //         const value = await supplyContract.GetSuppliesByID("OF002", { from: accounts[0] });
    //     });
        it("Create new pencil supply", async () => {
            const result = await supplyContract.CreateSupply.sendTransaction("OF003", "Bút chì", "300", "cái");
        });
        it("Create new pencil 2 supply", async () => {
            const result = await supplyContract.CreateSupply.sendTransaction("OF004", "Bút chì 2", "200", "cái", {from: "0xDD4FE9040a87Db5d33662324a3A41197F3f337F3"});
        });
        it("Check count", async () => {
            const result = await supplyContract.GetSupplyCount();
            console.log(Number(result))
            assert(result >= 2);
        });
        it("Get all supplies", async () => {
            const result = await supplyContract.GetAllSupplies.call();
            console.log(result);
        });
    //     it("Update pencil supply", async () => {
    //         const value = await supplyContract.UpdateSupply("OF003", "Bút chì kim", 200, "cái", { from: accounts[0] });
    //     });
    //     it("Delete pencil supply", async () => {
    //         const value = await supplyContract.DeleteSupply("OF003", { from: accounts[0] });
    //     });
    });

    // describe("User transactions", async () => {
    //     it("Get all user transactions", async () => {
    //         const supplies = await supplyContract.GetTransactions({ from: accounts[0] });
    //     });
    //     it("Perform paper transaction", async () => {
    //         const value = await supplyContract.Transact("OF002", 10, { from: accounts[0] });
    //     });
    // });
});
