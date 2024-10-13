module counter::cookie {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::option;
    use sui::object::{Self, UID};

    public struct COOKIE has drop {}

    fun init(witness: COOKIE, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            witness, 
            0, 
            b"COOKIE", 
            b"Cookie Token", 
            b"A delicious token for the SUI x BSA Hackathon", 
            option::none(), 
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_share_object(treasury_cap);
    }

    public entry fun mint(
        treasury_cap: &mut TreasuryCap<COOKIE>, 
        amount: u64, 
        recipient: address, 
        ctx: &mut TxContext
    ) {
        let cookie = coin::mint(treasury_cap, amount, ctx);
        transfer::public_transfer(cookie, recipient);
    }

    public fun get_coin(
        treasury_cap: &mut TreasuryCap<COOKIE>,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<COOKIE> {
        coin::mint(treasury_cap, amount, ctx)
    }

    public entry fun burn(
        treasury_cap: &mut TreasuryCap<COOKIE>,
        coin: &mut Coin<COOKIE>,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let burned_coin = coin::split(coin, amount, ctx);
        coin::burn(treasury_cap, burned_coin);
    }
}
