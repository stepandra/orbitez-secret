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
type storage = {

    players: register,
    start_block: nat,
    counter: nat,
};
    
type returnType = ( list (operation), storage );



let addr_to_contract = (addr: address) => {
    let maybe_contract: option(contract(unit)) = Tezos.get_contract_opt(addr);
    switch (maybe_contract) {
        | Some (contract) => contract
        | None => (failwith ("Contract not found.") : contract (unit))
        };
    }

let get_fa20_transfer_entrypoint = (contract: address) :contract(transfer_fa20_parameters) => {
    switch (Tezos.get_entrypoint_opt("%transfer", contract): option(contract(transfer_fa20_parameters))) {
        | Some (contract) => contract
        | None => failwith("Not FA 2.0 contract")
    };
}


let transfer_fa20_asset = ((result, i): (list(operation), address)) : list(operation) => {
    let reward_amount: jackpotAmountType = (3000000n, 1500000n);
    let third_place: nat = abs(reward_amount[0] - reward_amount[1]);
    let amount_send = (length: nat) => { 
        if (length < 1n) {
            reward_amount[0]
        } else {
            if (length == 1n) {
                reward_amount[1]
            } else {
                if (length == 2n) {
                    third_place
                } else {
                    if (length > 2n) {
                        300000n
                    } else {
                        (failwith("Wrong length"): nat)
                    }
                }
            }
        }
    };
    let mutez_to_natural = (a: tez) => {  a / 1mutez };
    let natural_to_mutez = (a: nat) => { a * 1mutez };
    
    let tezos_amount = (amount: tez) => {
        if (amount < 300000mutez) {
            (failwith("Error with tez amount"): tez)
        } else {
            if (amount == 300000mutez) {
                    (0tez);
                } else {
                    amount
                }
            }
    };
    let leng: nat = List.length(result);
    let reward_nat: tez = natural_to_mutez(amount_send(leng));
    let token_amount: nat = amount_send(leng) * 1000n;
    let orb_address: address = ("KT1VSEeZZ5SiKeUGmEf7Drh4tRinNzEUBEJg": address);
    let tok_contract: contract(transfer_fa20_parameters) = get_fa20_transfer_entrypoint(orb_address);
    let owner: address = Tezos.self_address;
    let dest = addr_to_contract(i);
    let param: transfer_fa20_parameters = [{
            from_: owner, 
            txs: [{
                to_: i,
                token_id: 0n,
                amount: token_amount,
            }],
        }];

    let op_tez = Tezos.transaction(
        unit,
        tezos_amount(reward_nat),
        dest);

    let op_token = Tezos.transaction(
        param,
        0mutez,
        tok_contract);

    

   [op_token, ...[op_tez, ...result]];

};

// type endGameParameter = map(address)
// type modifySetupParameter = {
//     mod_blocks_in_round: nat, 
//     mod_orb_rewards: map(nat), 
//     mod_player_max: nat, 
//     mod_acccepted_tokens: set(address)
// }

let removePlayer = ( store : storage ): map(address, nat) => {
    let player_refund: option (nat) = Map.find_opt(Tezos.sender, store.players);
    switch (player_refund) {
        | Some (entrys) => Map.remove(Tezos.sender, store.players)
        | None => (failwith ("Nothing to refund!"): map(address, nat))
    };
}

let start_block_level = ((s, block): (storage, nat)): nat => {
    if(Map.size(s.players) == 9n) { 
        s.start_block + 1n + block
    } else {
       0n
    }
}

let refund  = ((action, store): (refundParameter, storage)) : returnType => {

    if (Map.size(store.players) == 10n) {
        (failwith ("Game already started! Play or die!"): returnType);
    } else {
    let dest = addr_to_contract(Tezos.sender);
    let op = Tezos.transaction((), 1tez, dest);
    (([op]: list(operation)), {...store, players: removePlayer(store)})
    }
} 


let addPlayer = ( store : storage ): map(address,nat) => {
    let  player_points: option (nat) = Map.find_opt(Tezos.sender, store.players);
    switch (player_points) {
        | Some(points) => 
            (failwith("You are already"): map(address, nat));
        | None => 
            Map.add(Tezos.sender, store.counter, store.players)
    };
};

[@inline]
let add = ((s, counter): (storage, nat)): storage => {...s, counter: s.counter + counter};
let enter_room = ((param, store): (enterRoomParameter, storage)) : returnType => {

    let is_lp = param.is_lp;
    let bank = param.bank;
    let players = store.players;
    let start_block = store.start_block;
    let current_player : address = Tezos.sender;
    let enter_price: tez = 1tez;
    let entries = Map.size(players);

    if (Tezos.amount == enter_price) {
        if (entries > 9n) {
            failwith("Room is full, try again later!")
            } else {       
                    ();
            }
    } else {
        failwith("Incorrect amount of 1tez.");
    };
    let block: nat = Tezos.level;
    let prod_block: nat = start_block_level(store, block);
    let store = add({players: addPlayer(store), counter: store.counter, start_block: prod_block}, 1n);
     (([]: list(operation)), store);
};


let endgame = ((leader_list, store): ( endgameParameter, storage )) : returnType => {
    let convert = (i : address) : contract(unit) => addr_to_contract( i );
    let contract_leader_list : list (contract(unit)) = List.map (convert, leader_list);
    let all_op_list : list(operation) = List.fold_left(transfer_fa20_asset, []:list(operation), leader_list);
    let room_reset: register = Map.empty;
   ((all_op_list: list(operation)), { ...store, players:room_reset, counter: 0n });  
};

let main = ((action, store): (roomEntrypoints, storage)) : returnType =>
    switch (action) {
    | EnterRoom(param) => enter_room(param, store)
    | Refund(param) => refund(param, store)
    | EndGame(param) => endgame(param,store)
    };