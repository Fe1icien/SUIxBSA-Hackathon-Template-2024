module counter::simple_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::url::{Self, Url};
    use sui::coin::{Self, Coin};
    use counter::cookie::COOKIE;

    /// A simple NFT
    public struct SimpleNFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
    }

    /// Mint a new SimpleNFT
    public entry fun mint(
        payment: &mut Coin<COOKIE>,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Check if the payment is sufficient (1 COOKIE)
        assert!(coin::value(payment) >= 1, 0);

        // Deduct 1 COOKIE from the payment
        let fee = coin::split(payment, 1, ctx);
        // You can transfer the fee to a specific address or burn it
        transfer::public_transfer(fee, @0x0); // Example: burning the fee

        let nft = SimpleNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url)
        };

        transfer::transfer(nft, tx_context::sender(ctx));
    }
}
