pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract SupplyContract {
    // Supplies table
    struct Supply {
        string id;
        string name;
        uint quantity;
        string unit;
        bool isActive;
    }
    Supply[] public supplies; 
    function CheckSupplyExist(string memory id) private view returns (bool) {
        uint i = 0;
        for (i = 0; i < supplies.length; i++){
            if (keccak256(abi.encodePacked(supplies[i].id)) == keccak256(abi.encodePacked(id))) return true;
        }
        return false;
    }
    function CreateSupply (string memory id, string memory name, uint quantity, string memory unit) public returns (bool) {
        if (CheckSupplyExist(id)) return false;
        Supply memory newSupply = Supply(id, name, quantity, unit, true);
        supplies.push(newSupply);
        return true;
    }

    function GetSupplyCount() public view returns (uint){
        return supplies.length;
    }

    function GetAllSupplies()  public view returns (string[] memory, string[] memory, uint[] memory, string[] memory, bool[] memory) {
        string[] memory ids = new string[](supplies.length);
        string[] memory names = new string[](supplies.length);
        uint[] memory quantities = new uint[](supplies.length);
        string[] memory units = new string[](supplies.length);
        bool[] memory actives = new bool[](supplies.length);
        for (uint i = 0; i < supplies.length; i++) {
            ids[i] = (supplies[i].id);
            names[i] = (supplies[i].name);
            quantities[i] = (supplies[i].quantity);
            units[i] = (supplies[i].unit);
            actives[i] = (supplies[i].isActive);
        }
        return (ids, names, quantities, units, actives);
    }
    function GetSuppliesByID(string memory id)  public view returns (Supply memory) {
        uint i = 0;
        for (i = 0; i < supplies.length; i++){
            if (keccak256(abi.encodePacked(supplies[i].id)) == keccak256(abi.encodePacked(id))) return supplies[i];
        }
    }
    function UpdateSupply(string memory id, string memory name, uint quantity, string memory unit)  public returns (bool) {
        Supply memory newInfo =  Supply(id, name, quantity, unit, true);
        uint i = 0;
        for (i = 0; i < supplies.length; i++){
            if (keccak256(abi.encodePacked(supplies[i].id)) == keccak256(abi.encodePacked(id))) {
                supplies[i].isActive = false;
                supplies[i] = newInfo;
                return true;
            }
        }
        return false;
    }
    function DeleteSupply(string memory id)  public returns (bool) {
        uint i = 0;
        for (i = 0; i < supplies.length; i++){
            if (keccak256(abi.encodePacked(supplies[i].id)) == keccak256(abi.encodePacked(id))) {
                supplies[i].isActive = false;
                return true;
            }
        }
        return false;
    }
    
    // UserSupplies table
    struct UserTrans {
        string supplyId;
        uint quantity;
    }
    mapping (address => UserTrans[]) tblUserTrans;
    function GetTransactions()  public view returns (UserTrans[] memory) {
        return tblUserTrans[msg.sender];
    }
    function Transact(string memory id, uint quantity)  public returns (bool) {
        uint i = 0;
        bool exists = false;
        for (i = 0; i < tblUserTrans[msg.sender].length; i++){
            if ((keccak256(abi.encodePacked(tblUserTrans[msg.sender][i].supplyId))) == keccak256(abi.encodePacked(id))) {
                exists = true;
                tblUserTrans[msg.sender][i].quantity += quantity;
            }
        }
        for (i = 0; i < supplies.length; i++){
            if (keccak256(abi.encodePacked(supplies[i].id)) == keccak256(abi.encodePacked(id))) {
                supplies[i].quantity -= quantity;
            }
        }
        if (!exists) {
            UserTrans memory newUserTrans = UserTrans(id, quantity);
            tblUserTrans[msg.sender].push(newUserTrans);
        }
        return true;
    }
}