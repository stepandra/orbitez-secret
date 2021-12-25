type enterRoomParameter = {
    is_lp: bool,
    bank: tez
};

type refundParameter = (address);

type endgameParameter = list(address);

type transfer_fa20_txs_item = [@layout:comb] {
    to_: address,
    token_id: nat,
    amount: nat
};

type transfer_fa20_parameter_item = [@layout:comb] {
    from_: address,
    txs: list(transfer_fa20_txs_item)
};

type transfer_fa20_parameters = list(transfer_fa20_parameter_item);

type jackpotAmountType = (nat, nat);

type roomEntrypoints = 
| EnterRoom(enterRoomParameter)
| Refund(refundParameter)
| EndGame(endgameParameter);
// | EndGame(endGameParameter);
// | PauseEntry(bool)
// | ModifySetup(modifySetupParameter);
type register = map (address, nat);
type tezRewardAmount = (tez, tez);
type storage = {
    players: register,
    start_block: nat,
    end_block: nat,
};
    
type returnType = ( list (operation), storage );

