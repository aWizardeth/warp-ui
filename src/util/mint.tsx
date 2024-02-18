import { offerToSpendBundle } from "./offer";
import * as GreenWeb from 'greenwebjs';
import { SExp, Tuple, Bytes } from "clvm";

/*
>>> from chia.wallet.trading.offer import OFFER_MOD
>>> OFFER_MOD.get_tree_hash()
<bytes32: cfbfdeed5c4ca2de3d0bf520b9cb4bb7743a359bd2e6a188d19ce7dffc21d3e7>
>>> 
*/
const OFFER_MOD_HASH = "cfbfdeed5c4ca2de3d0bf520b9cb4bb7743a359bd2e6a188d19ce7dffc21d3e7";

/*
>>> from chia.wallet.trading.offer import OFFER_MOD
>>> bytes(OFFER_MOD).hex()
'ff02ffff01ff02ff0affff04ff02ffff04ff03ff80808080ffff04ffff01ffff333effff02ffff03ff05ffff01ff04ffff04ff0cffff04ffff02ff1effff04ff02ffff04ff09ff80808080ff808080ffff02ff16ffff04ff02ffff04ff19ffff04ffff02ff0affff04ff02ffff04ff0dff80808080ff808080808080ff8080ff0180ffff02ffff03ff05ffff01ff02ffff03ffff15ff29ff8080ffff01ff04ffff04ff08ff0980ffff02ff16ffff04ff02ffff04ff0dffff04ff0bff808080808080ffff01ff088080ff0180ffff010b80ff0180ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff1effff04ff02ffff04ff09ff80808080ffff02ff1effff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080
*/
const OFFER_MOD = "ff02ffff01ff02ff0affff04ff02ffff04ff03ff80808080ffff04ffff01ffff333effff02ffff03ff05ffff01ff04ffff04ff0cffff04ffff02ff1effff04ff02ffff04ff09ff80808080ff808080ffff02ff16ffff04ff02ffff04ff19ffff04ffff02ff0affff04ff02ffff04ff0dff80808080ff808080808080ff8080ff0180ffff02ffff03ff05ffff01ff02ffff03ffff15ff29ff8080ffff01ff04ffff04ff08ff0980ffff02ff16ffff04ff02ffff04ff0dffff04ff0bff808080808080ffff01ff088080ff0180ffff010b80ff0180ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff1effff04ff02ffff04ff09ff80808080ffff02ff1effff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080";

/*
>>> from chia.wallet.puzzles.singleton_top_layer_v1_1 import SINGLETON_MOD_HASH
>>> from chia.wallet.puzzles.singleton_top_layer_v1_1 import SINGLETON_LAUNCHER_HASH
>>> SINGLETON_MOD_HASH.hex()
'7faa3253bfddd1e0decb0906b2dc6247bbc4cf608f58345d173adb63e8b47c9f'
>>> SINGLETON_LAUNCHER_HASH.hex()
'eff07522495060c066f66f32acc2a77e3a3e737aca8baea4d1a64ea4cdc13da9'
*/
const SINGLETON_MOD_HASH = "7faa3253bfddd1e0decb0906b2dc6247bbc4cf608f58345d173adb63e8b47c9f";
const SINGLETON_LAUNCHER_HASH = "eff07522495060c066f66f32acc2a77e3a3e737aca8baea4d1a64ea4cdc13da9";

const MESSAGE_COIN_PUZZLE_MOD = "ff02ffff01ff02ffff03ffff09ff8202bfff2f80ffff01ff02ff16ffff04ff02ffff04ff05ffff04ff82017fffff04ff8202ffffff04ffff0bffff02ffff03ffff09ffff0dff82013f80ffff012080ffff0182013fffff01ff088080ff0180ffff02ffff03ffff09ffff0dff8202bf80ffff012080ffff018202bfffff01ff088080ff0180ff8203bf80ff80808080808080ffff01ff088080ff0180ffff04ffff01ffffff3d46ff473cffff02ffffa04bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459aa09dcf97a184f32623d11a73124ceb99a5709b083721e878a16d78f596718ba7b2ffa102a12871fee210fb8619291eaea194581cbd2531e4b23759d225f6806923f63222a102a8d5dd63fba471ebcb1f3e8f7c1e1879b7152a6e7298a91ce119a63400ade7c5ffff04ffff04ff18ffff04ff17ff808080ffff04ffff04ff14ffff04ffff0bff13ffff0bff5affff0bff12ffff0bff12ff6aff0980ffff0bff12ffff0bff7affff0bff12ffff0bff12ff6affff02ff1effff04ff02ffff04ff05ff8080808080ffff0bff12ffff0bff7affff0bff12ffff0bff12ff6aff1b80ffff0bff12ff6aff4a808080ff4a808080ff4a808080ffff010180ff808080ffff04ffff04ff1cffff04ff2fff808080ffff04ffff04ff10ffff04ffff0bff2fff1780ff808080ff8080808080ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff1effff04ff02ffff04ff09ff80808080ffff02ff1effff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080"
const PORTAL_RECEIVER_LAUNCHER_ID = process.env.NEXT_PUBLIC_PORTAL_LAUNCHER_ID!;
const BRIDGING_PUZZLE_HASH = process.env.NEXT_PUBLIC_BRIDGING_PUZZLE_HASH!;

const PORTAL_MOD = "ff02ffff01ff02ffff03ff81bfffff01ff02ffff03ffff09ffff02ff2effff04ff02ffff04ff82013fff80808080ff1780ffff01ff02ff82013fff8201bf80ffff01ff088080ff0180ffff01ff04ffff04ff10ffff04ffff02ff12ffff04ff02ffff04ff2fffff04ffff0bffff0101ff2f80ffff04ffff02ff2effff04ff02ffff04ff82017fff80808080ff808080808080ffff01ff01808080ffff02ff16ffff04ff02ffff04ff05ffff04ff0bffff04ff82017fffff04ff8202ffff808080808080808080ff0180ffff04ffff01ffffff3302ffff02ffff03ff05ffff01ff0bff7cffff02ff1affff04ff02ffff04ff09ffff04ffff02ff14ffff04ff02ffff04ff0dff80808080ff808080808080ffff016c80ff0180ffffa04bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459aa09dcf97a184f32623d11a73124ceb99a5709b083721e878a16d78f596718ba7b2ffa102a12871fee210fb8619291eaea194581cbd2531e4b23759d225f6806923f63222a102a8d5dd63fba471ebcb1f3e8f7c1e1879b7152a6e7298a91ce119a63400ade7c5ffffff0bff5cffff02ff1affff04ff02ffff04ff05ffff04ffff02ff14ffff04ff02ffff04ff07ff80808080ff808080808080ff0bff18ffff0bff18ff6cff0580ffff0bff18ff0bff4c8080ffff02ff3effff04ff02ffff04ff09ffff04ff80ffff04ff0dffff04ff818fffff04ffff02ff2effff04ff02ffff04ffff04ff27ffff04ff82014fffff04ff8202cfffff04ff8205cfffff04ff820bcfff808080808080ff80808080ffff04ffff04ffff04ff10ffff04ffff02ff12ffff04ff02ffff04ff0bffff04ffff0bffff0101ff2780ffff04ffff0bffff0102ffff0bffff0101ff82014f80ffff0bffff0101ff8202cf8080ffff04ffff0bffff0101ff8205cf80ffff04ffff0bffff0101ffff02ff2effff04ff02ffff04ff820bcfff8080808080ff8080808080808080ffff01ff80808080ffff02ffff03ff37ffff01ff02ff16ffff04ff02ffff04ff05ffff04ff0bffff04ff37ffff04ff6fff80808080808080ff8080ff018080ff808080808080808080ffff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff2effff04ff02ffff04ff09ff80808080ffff02ff2effff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff02ffff03ff37ffff01ff02ff3effff04ff02ffff04ff05ffff04ffff10ff0bffff06ffff14ff2fffff0102808080ffff04ff37ffff04ffff05ffff14ff2fffff01028080ffff04ff5fffff04ffff02ffff03ffff09ffff06ffff14ff2fffff01028080ff8080ffff0181bfffff01ff04ffff04ffff0132ffff04ff27ffff04ff5fff80808080ff81bf8080ff0180ff808080808080808080ffff01ff02ffff03ffff15ff05ff0b80ffff01ff0880ffff0181bf80ff018080ff0180ff018080";
const PORTAL_THRESHOLD = 1;
const PORTAL_KEYS = [
  "a60bffc4d51fa503ea6f12053a956de4cbb27a343453643e07eacddde06e7262e4fcd32653d61a731407a1d7e2d6ab2c",
  "b38dc1238afb47296ea89d57c9355be08fa7cf6e732d9d234f234a20473c8576c1cb851d7e756a75c2af0b7fb3110e30",
  "9796fa4b1fa20600e1ab44f5ff77aec6d48ab27e0af89009f269cb918fa2afd2b4bb00dc2560f643cd7e53d786d69c65"
]
const MULTISIG_THRESHOLD = 1;
const MULTISIG_KEYS = [
  "b93c773fd448927ad5a77d543aa9a2043dad8ab9d8a8ac505317d6542ffdb1b6b74e9e85e734b8ca8264de49b6231a38",
  "b38dc1238afb47296ea89d57c9355be08fa7cf6e732d9d234f234a20473c8576c1cb851d7e756a75c2af0b7fb3110e30",
  "9796fa4b1fa20600e1ab44f5ff77aec6d48ab27e0af89009f269cb918fa2afd2b4bb00dc2560f643cd7e53d786d69c65"
]
const P2_M_OF_N_DELEGATE_DIRECT_MOD = "ff02ffff01ff02ffff03ffff09ff05ffff02ff16ffff04ff02ffff04ff17ff8080808080ffff01ff02ff0cffff04ff02ffff04ffff02ff0affff04ff02ffff04ff17ffff04ff0bff8080808080ffff04ffff02ff1effff04ff02ffff04ff2fff80808080ffff04ff2fffff04ff5fff80808080808080ffff01ff088080ff0180ffff04ffff01ffff31ff02ffff03ff05ffff01ff04ffff04ff08ffff04ff09ffff04ff0bff80808080ffff02ff0cffff04ff02ffff04ff0dffff04ff0bffff04ff17ffff04ff2fff8080808080808080ffff01ff02ff17ff2f8080ff0180ffff02ffff03ff05ffff01ff02ffff03ff09ffff01ff04ff13ffff02ff0affff04ff02ffff04ff0dffff04ff1bff808080808080ffff01ff02ff0affff04ff02ffff04ff0dffff04ff1bff808080808080ff0180ff8080ff0180ffff02ffff03ff05ffff01ff10ffff02ff16ffff04ff02ffff04ff0dff80808080ffff02ffff03ff09ffff01ff0101ff8080ff018080ff8080ff0180ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff1effff04ff02ffff04ff09ff80808080ffff02ff1effff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080";

/*
>>> from drivers.wrapped_assets import CAT_BURNER_MOD
>>> bytes(CAT_BURNER_MOD).hex()
*/
const CAT_BURNER_MOD = "ff02ffff01ff02ff2affff04ff02ffff04ff825fffffff04ffff0bffff02ffff03ffff09ffff0dff81bf80ffff012080ffff0181bfffff01ff088080ff0180ffff02ff2effff04ff02ffff04ff05ffff04ffff0bffff0101ff0580ffff04ff82017fffff04ffff02ff2effff04ff02ffff04ffff02ff2effff04ff02ffff04ff0bffff04ffff0bffff0101ff822fff80ffff04ffff0bffff0101ff8205ff80ff808080808080ffff04ffff0bffff0101ff820bff80ffff04ffff0bffff0101ff8217ff80ff808080808080ff80808080808080ff8202ff80ffff04ffff04ffff04ff38ffff04ff825fffff808080ffff04ffff04ff28ffff04ff8217ffff808080ffff04ffff04ff14ffff04ff822fffff808080ffff04ffff04ff2cffff04ff17ffff04ff8217ffffff04ffff04ff2fffff04ff5fffff04ff8205ffffff04ff820bffffff04ff8202ffff808080808080ff8080808080ff8080808080ff808080808080ffff04ffff01ffffff3dff4946ff48ff333cffff02ffff04ffff04ff10ffff04ffff0bff0bff0580ff808080ffff04ffff04ff3cffff04ff0bff808080ff178080ff02ffff03ff05ffff01ff0bff76ffff02ff3effff04ff02ffff04ff09ffff04ffff02ff3affff04ff02ffff04ff0dff80808080ff808080808080ffff016680ff0180ffffffa04bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459aa09dcf97a184f32623d11a73124ceb99a5709b083721e878a16d78f596718ba7b2ffa102a12871fee210fb8619291eaea194581cbd2531e4b23759d225f6806923f63222a102a8d5dd63fba471ebcb1f3e8f7c1e1879b7152a6e7298a91ce119a63400ade7c5ffff0bff56ffff02ff3effff04ff02ffff04ff05ffff04ffff02ff3affff04ff02ffff04ff07ff80808080ff808080808080ff0bff12ffff0bff12ff66ff0580ffff0bff12ff0bff468080ff018080";

/*
>>> from drivers.wrapped_assets import CAT_MINTER_MOD
>>> bytes(CAT_MINTER_MOD).hex()
*/
const CAT_MINTER_MOD = "ff02ffff01ff02ff12ffff04ff02ffff04ffff0bffff02ffff03ffff09ffff0dff822fff80ffff012080ffff01822fffffff01ff088080ff0180ffff02ff16ffff04ff02ffff04ff05ffff04ffff0bffff0101ff8202ff80ffff04ff82017fffff04ffff0bffff0101ff820bff80ffff04ffff0bffff0101ffff02ff3effff04ff02ffff04ff8205ffff8080808080ff8080808080808080ff8080ffff04ff8217ffffff04ffff04ffff04ff28ffff04ff8217ffff808080ffff04ffff04ff38ffff04ff820bffff808080ffff04ffff04ff14ffff04ffff02ff16ffff04ff02ffff04ff0bffff04ffff0bffff0101ff0b80ffff04ffff0bffff0101ffff02ff16ffff04ff02ffff04ff17ffff04ffff0bffff0101ff820bff80ffff04ffff0bffff0101ffff02ff16ffff04ff02ffff04ff81bfffff04ff5fffff04ffff0bffff0101ff8209ff80ff80808080808080ff80808080808080ffff04ffff02ff16ffff04ff02ffff04ff2fffff04ffff0bffff0101ff8215ff80ff8080808080ff80808080808080ffff04ff822dffff80808080ff80808080ff808080808080ffff04ffff01ffffff3dff4648ff33ff3c02ffffff04ffff04ff10ffff04ffff0bff05ff0b80ff808080ffff04ffff04ff2cffff04ff05ff808080ff178080ffff02ffff03ff05ffff01ff0bff81faffff02ff2effff04ff02ffff04ff09ffff04ffff02ff2affff04ff02ffff04ff0dff80808080ff808080808080ffff0181da80ff0180ffffa04bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459aa09dcf97a184f32623d11a73124ceb99a5709b083721e878a16d78f596718ba7b2ffa102a12871fee210fb8619291eaea194581cbd2531e4b23759d225f6806923f63222a102a8d5dd63fba471ebcb1f3e8f7c1e1879b7152a6e7298a91ce119a63400ade7c5ffff0bff81baffff02ff2effff04ff02ffff04ff05ffff04ffff02ff2affff04ff02ffff04ff07ff80808080ff808080808080ffff0bff3cffff0bff3cff81daff0580ffff0bff3cff0bff819a8080ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff3effff04ff02ffff04ff09ff80808080ffff02ff3effff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080";

/*
>>> from drivers.wrapped_assets import CAT_MINT_AND_PAYOUT_MOD, CAT_MINT_AND_PAYOUT_MOD_HASH
>>> bytes(CAT_MINT_AND_PAYOUT_MOD).hex()
>>> CAT_MINT_AND_PAYOUT_MOD_HASH.hex()
*/
const CAT_MINT_AND_PAYOUT_MOD = "ff02ffff01ff04ffff04ff04ffff04ff17ff808080ffff04ffff04ff06ffff04ff05ffff04ff17ff80808080ffff04ffff04ff06ffff04ff80ffff04ffff01818fffff04ff0bffff04ff2fff808080808080ff80808080ffff04ffff01ff4933ff018080";
const CAT_MINT_AND_PAYOUT_MOD_HASH = "b7da6592ca3d94e4cd02cb83ca646e55e9b084a4e870db970d6b34b161116df8";

/*
>>> from drivers.wrapped_assets import WRAPPED_TAIL_MOD, WRAPPED_TAIL_MOD_HASH
>>> bytes(WRAPPED_TAIL_MOD).hex()
>>> WRAPPED_TAIL_MOD_HASH.hex()
*/
const WRAPPED_TAIL_MOD = "ff02ffff01ff02ffff03ff2fffff01ff02ffff03ffff22ffff09ffff11ff80ff81bf80ff8202f780ffff09ff47ffff0bff16ffff0bff04ffff0bff04ff1aff0b80ffff0bff04ffff0bff1effff0bff04ffff0bff04ff1aff8204ff80ffff0bff04ffff0bff1effff0bff04ffff0bff04ff1aff8206ff80ffff0bff04ff1aff12808080ff12808080ff128080808080ff80ffff01ff088080ff0180ffff01ff02ffff03ffff22ffff09ff81bfff8080ffff09ffff0dff8202ff80ffff012080ffff09ff81b7ffff0bff8202ffff05ff8202f7808080ff80ffff01ff088080ff018080ff0180ffff04ffff01ff02ffffa04bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459aa09dcf97a184f32623d11a73124ceb99a5709b083721e878a16d78f596718ba7b2ffa102a12871fee210fb8619291eaea194581cbd2531e4b23759d225f6806923f63222a102a8d5dd63fba471ebcb1f3e8f7c1e1879b7152a6e7298a91ce119a63400ade7c5ff018080";
const WRAPPED_TAIL_MOD_HASH = "2d7e6fd2e8dd27536ebba2cf6b9fde09493fa10037aa64e14b201762c902f013";

/*
>>> from drivers.wrapped_assets import BURN_INNER_PUZZLE_MOD, BURN_INNER_PUZZLE_MOD_HASH
>>> bytes(BURN_INNER_PUZZLE_MOD).hex()
>>> BURN_INNER_PUZZLE_MOD_HASH.hex()
*/
const BURN_INNER_PUZZLE_MOD = "ff02ffff01ff04ffff04ff0cffff04ff81bfff808080ffff04ffff04ff0affff04ff80ffff04ffff01818fffff04ff82017fffff04ffff04ffff0bffff0101ff1780ffff0bffff0101ff2f8080ff808080808080ffff02ff1effff04ff02ffff04ff81bfffff04ffff0bffff02ffff03ffff09ffff0dff5f80ffff012080ffff015fffff01ff088080ff0180ff05ff2f80ff80808080808080ffff04ffff01ffff3d46ff33ff3cff04ffff04ff08ffff04ffff0bff0bff0580ff808080ffff04ffff04ff16ffff04ff0bff808080ff808080ff018080";
const BURN_INNER_PUZZLE_MOD_HASH = "69b9ac68db61a9941ff537cbb69158a7e1015ad44c42cff905159909cd8e1f90";
                                    // nice

// allows debugging via mixch.dev
function sbToString(sb: any): string {
  return JSON.stringify({
    coin_spends: sb.coinSpends.map((coinSpend: any) => ({
      coin: {
        parent_coin_info: "0x" + coinSpend.coin.parentCoinInfo.replace("0x", ""),
        puzzle_hash: "0x" + coinSpend.coin.puzzleHash.replace("0x", ""),
        amount: parseInt(coinSpend.coin.amount.toString())
      },
      puzzle_reveal: GreenWeb.util.sexp.toHex(coinSpend.puzzleReveal),
      solution: GreenWeb.util.sexp.toHex(coinSpend.solution)
    })),
    aggregated_signature: sb.aggregatedSignature
  });

}

function getSingletonStruct(
  launcher_id: string,
): GreenWeb.clvm.SExp {
  return SExp.to(new Tuple<SExp, SExp>(// SINGLETON_STRUCT
      GreenWeb.util.sexp.bytesToAtom(SINGLETON_MOD_HASH),
      SExp.to(new Tuple<SExp, SExp>(
          GreenWeb.util.sexp.bytesToAtom(launcher_id),
          GreenWeb.util.sexp.bytesToAtom(SINGLETON_LAUNCHER_HASH),
      )),
  ));
}

/*
def get_message_coin_puzzle_1st_curry(portal_receiver_launcher_id: bytes32) -> Program:
    return MESSAGE_COIN_MOD.curry(
       (SINGLETON_MOD_HASH, (portal_receiver_launcher_id, SINGLETON_LAUNCHER_HASH))
    )
*/
function getMessageCoinPuzzle1stCurry(
  portal_receiver_launcher_id: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(MESSAGE_COIN_PUZZLE_MOD),
    [
      getSingletonStruct(portal_receiver_launcher_id),
    ]
  );
}

/*
def get_message_coin_puzzle(
    portal_receiver_launcher_id: bytes32,
    source_chain: bytes,
    source: bytes32,
    nonce: int,
    destination: bytes32,
    message_hash: bytes32,
) -> Program:
  return get_message_coin_puzzle_1st_curry(portal_receiver_launcher_id).curry(
    nonce,
    (source_chain, source),
    destination,
    message_hash
  )
*/
function getMessageCoinPuzzle(
  portal_receiver_launcher_id: string,
  source_chain: string,
  source: string,
  nonce: string,
  destination: string,
  message_hash: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    getMessageCoinPuzzle1stCurry(portal_receiver_launcher_id),
    [
      GreenWeb.util.sexp.bytesToAtom(nonce),
      SExp.to(new Tuple<SExp, SExp>(
          GreenWeb.util.sexp.bytesToAtom(source_chain),
          GreenWeb.util.sexp.bytesToAtom(source),
      )),
      GreenWeb.util.sexp.bytesToAtom(destination),
      GreenWeb.util.sexp.bytesToAtom(message_hash)
    ]
  );
}

/*
def get_portal_receiver_inner_puzzle(
      launcher_id: bytes32,
      signature_treshold: int,
      signature_pubkeys: list[G1Element],
      update_puzzle_hash: bytes32,
      last_nonces: List[int] = [],
) -> Program:
    first_curry = PORTAL_RECEIVER_MOD.curry(
       (signature_treshold, signature_pubkeys), # VALIDATOR_INFO
       get_message_coin_puzzle_1st_curry(launcher_id).get_tree_hash(),
       update_puzzle_hash
    )
    return first_curry.curry(
       first_curry.get_tree_hash(), # SELF_HASH
       last_nonces
    )
*/

function getPortalReceiverInnerPuzzle(
  launcher_id: string,
  signature_treshold: number,
  signature_pubkeys: string[],
  update_puzzle_hash: string,
  last_nonces: string[] = [],
): GreenWeb.clvm.SExp {
  const first_curry = GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(PORTAL_MOD),
    [
      SExp.to(new Tuple<SExp, SExp>(
          GreenWeb.util.sexp.bytesToAtom(
            GreenWeb.util.coin.amountToBytes(signature_treshold)
          ),
          SExp.to(signature_pubkeys.map((pubkey) => GreenWeb.util.sexp.bytesToAtom(pubkey)))
      )),
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(getMessageCoinPuzzle1stCurry(launcher_id))
      ),
      GreenWeb.util.sexp.bytesToAtom(update_puzzle_hash)
    ]
  );

  return GreenWeb.util.sexp.curry(
    first_curry,
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(first_curry)
      ),
      SExp.to(last_nonces.map((nonce) => GreenWeb.util.sexp.bytesToAtom(nonce)))
    ]
  );
}

/*
def get_message_coin_solution(
    receiver_coin: Coin,
    parent_parent_info: bytes32,
    parent_inner_puzzle_hash: bytes32,
    message_coin_id: bytes32,
) -> Program:
    return Program.to([
      (receiver_coin.parent_coin_info, (receiver_coin.puzzle_hash, receiver_coin.amount)),
      (parent_parent_info, parent_inner_puzzle_hash),
      message_coin_id
    ])
*/
function getMessageCoinSolution(
  receiverCoin: any,
  parent_parent_info: string,
  parent_inner_puzzle_hash: string,
  message_coin_id: string,
): GreenWeb.clvm.SExp {
  return SExp.to([
    SExp.to(new Tuple<SExp, SExp>(
        GreenWeb.util.sexp.bytesToAtom(receiverCoin.parentCoinInfo),
        SExp.to(new Tuple<SExp, SExp>(
            GreenWeb.util.sexp.bytesToAtom(receiverCoin.puzzleHash),
            GreenWeb.util.sexp.bytesToAtom(
              GreenWeb.util.coin.amountToBytes(receiverCoin.amount)
            )
        )),
    )),
    SExp.to(new Tuple<SExp, SExp>(
        GreenWeb.util.sexp.bytesToAtom(parent_parent_info),
        GreenWeb.util.sexp.bytesToAtom(parent_inner_puzzle_hash),
    )),
    GreenWeb.util.sexp.bytesToAtom(message_coin_id)
  ]);
}

/*
def get_sigs_switch(sig_switches: List[bool]) -> int:
   return int(
       "".join(["1" if x else "0" for x in sig_switches])[::-1],
       2
    )
*/
function getSigsSwitch(
  sig_switches: boolean[]
): number {
  return parseInt(
    sig_switches.map((x) => x ? "1" : "0").join("").split("").reverse().join(""),
    2
  );
}

/*
def get_portal_receiver_inner_solution(
    messages: List[PortalMessage],
    update_puzzle_reveal: Program | None = None,
    update_puzzle_solution: Program | None = None
) -> Program:
    return Program.to([
       0 if update_puzzle_reveal is None or update_puzzle_solution is None else (update_puzzle_reveal, update_puzzle_solution),
       [messages.nonce for messages in messages],
       [
          [
            get_sigs_switch(msg.validator_sig_switches),
            msg.source_chain,
            msg.source,
            msg.destination,
            msg.message
          ] for msg in messages
       ]
    ])
*/
// BUT we are only doing this for one message :green_heart:
function getPortalReceiverInnerSolution(
  validator_sig_switches: boolean[],
  nonce: string,
  source_chain: string,
  source: string,
  destination: string,
  contents: string[],
): GreenWeb.clvm.SExp {
  return SExp.to([
    0,
    [GreenWeb.util.sexp.bytesToAtom(nonce)],
    [
      [
        GreenWeb.util.sexp.bytesToAtom(
          GreenWeb.util.coin.amountToBytes(
            getSigsSwitch(validator_sig_switches)
          )
        ),
        GreenWeb.util.sexp.bytesToAtom(source_chain),
        GreenWeb.util.sexp.bytesToAtom(source),
        GreenWeb.util.sexp.bytesToAtom(destination),
        contents.map(contentPart => GreenWeb.util.sexp.bytesToAtom(contentPart))
      ]
    ]
  ]);
}

function getMOfNDelegateDirectPuzzle(
  key_threshold: number,
  keys: string[]
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(P2_M_OF_N_DELEGATE_DIRECT_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.coin.amountToBytes(key_threshold)
      ),
      SExp.to(keys.map((key) => GreenWeb.util.sexp.bytesToAtom(key)))
    ]
  );
}

/*
def get_cat_burner_puzzle(
    bridging_puzzle_hash: bytes32,
    destination_chain: bytes,
    destination: bytes, # address of contract that receives message
) -> Program:
  return CAT_BURNER_MOD.curry(
    CAT_MOD_HASH,
    BURN_INNER_PUZZLE_MOD_HASH,
    bridging_puzzle_hash,
    destination_chain,
    destination
  )
*/
function getCATBurnerPuzzle(
  bridging_puzzle_hash: string,
  destination_chain: string,
  destination: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(CAT_BURNER_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(GreenWeb.util.sexp.CAT_PROGRAM_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(BURN_INNER_PUZZLE_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(bridging_puzzle_hash),
      GreenWeb.util.sexp.bytesToAtom(destination_chain),
      GreenWeb.util.sexp.bytesToAtom(destination)
    ]
  );
}

/*
def get_cat_minter_puzzle(
    portal_receiver_launcher_id: bytes32,
    bridging_puzzle_hash: bytes32,
    source_chain: bytes,
    source: bytes
) -> Program:
  return CAT_MINTER_MOD.curry(
    get_message_coin_puzzle_1st_curry(portal_receiver_launcher_id).get_tree_hash(),
    CAT_MOD_HASH,
    WRAPPED_TAIL_MOD_HASH,
    CAT_MINT_AND_PAYOUT_MOD_HASH,
    raw_hash([
      b'\x01',
      get_cat_burner_puzzle(bridging_puzzle_hash, source_chain, source).get_tree_hash()
    ]), # CAT_BURNER_PUZZLE_HASH_HASH = (sha256 1 CAT_BURNER_PUZZLE_HASH_HASH)
    BURN_INNER_PUZZLE_MOD_HASH,
    raw_hash([
      b'\x02',
      raw_hash([b'\x01', source_chain]),
      raw_hash([b'\x01', source]),
    ]), # SOURCE_STUFF_HASH
  )
*/
function getCATMinterPuzzle(
  portal_receiver_launcher_id: string,
  bridging_puzzle_hash: string,
  source_chain: string,
  source: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(CAT_MINTER_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          getMessageCoinPuzzle1stCurry(portal_receiver_launcher_id)
        )
      ),
      GreenWeb.util.sexp.bytesToAtom(GreenWeb.util.sexp.CAT_PROGRAM_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(WRAPPED_TAIL_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(CAT_MINT_AND_PAYOUT_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          SExp.to(
            GreenWeb.util.sexp.sha256tree(
              getCATBurnerPuzzle(bridging_puzzle_hash, source_chain, source)
            )
          )
        )
      ),
      GreenWeb.util.sexp.bytesToAtom(BURN_INNER_PUZZLE_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          SExp.to(new Tuple<SExp, SExp>(
            GreenWeb.util.sexp.bytesToAtom(source_chain),
            GreenWeb.util.sexp.bytesToAtom(source),
          ))
        )
      )
    ]
  );
}

/*
def get_cat_mint_and_payout_inner_puzzle(
    receiver: bytes32
) -> Program:
  return CAT_MINT_AND_PAYOUT_MOD.curry(
    receiver
  )
*/
function getCATMintAndPayoutInnerPuzzle(
  receiver: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(CAT_MINT_AND_PAYOUT_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(receiver)
    ]
  );
}

/*
def get_cat_burn_inner_puzzle_first_curry(
    bridging_puzzle_hash: bytes32,
    destination_chain: bytes,
    destination: bytes,
    source_chain_token_contract_address: bytes,
) -> Program:
  return BURN_INNER_PUZZLE_MOD.curry(
    get_cat_burner_puzzle(bridging_puzzle_hash, destination_chain, destination).get_tree_hash(),
    source_chain_token_contract_address
  )
*/
function getCATBurnInnerPuzzleFirstCurry(
  bridging_puzzle_hash: string,
  destination_chain: string,
  destination: string,
  source_chain_token_contract_address: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(BURN_INNER_PUZZLE_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          getCATBurnerPuzzle(bridging_puzzle_hash, destination_chain, destination)
        )
      ),
      GreenWeb.util.sexp.bytesToAtom(source_chain_token_contract_address)
    ]
  );
}

/*
def get_cat_burn_inner_puzzle(
    bridging_puzzle_hash: bytes32,
    destination_chain: bytes,
    destination: bytes, # e.g., ETH token bridge
    source_chain_token_contract_address: bytes,
    target_receiver: bytes,
    bridge_fee: int
) -> Program:
  return get_cat_burn_inner_puzzle_first_curry(
    bridging_puzzle_hash,
    destination_chain,
    destination,
    source_chain_token_contract_address
  ).curry(
    target_receiver,
    bridge_fee
  )
*/
function getCATBurnInnerPuzzle(
  bridging_puzzle_hash: string,
  destination_chain: string,
  destination: string,
  source_chain_token_contract_address: string,
  target_receiver: string,
  bridge_fee: number,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    getCATBurnInnerPuzzleFirstCurry(
      bridging_puzzle_hash,
      destination_chain,
      destination,
      source_chain_token_contract_address
    ),
    [
      GreenWeb.util.sexp.bytesToAtom(target_receiver),
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.coin.amountToBytes(bridge_fee)
      )
    ]
  );
}

/*
def get_wrapped_tail(
    portal_receiver_launcher_id: bytes32,
    bridging_puzzle_hash: bytes32,
    source_chain: bytes,
    source: bytes,
    source_chain_token_contract_address: bytes,
) -> Program:
  return WRAPPED_TAIL_MOD.curry(
    get_cat_minter_puzzle(
      portal_receiver_launcher_id, bridging_puzzle_hash, source_chain, source
    ).get_tree_hash(),
    get_cat_burn_inner_puzzle_first_curry(
      bridging_puzzle_hash, source_chain, source, source_chain_token_contract_address
    ).get_tree_hash(),
  )
*/
function getWrappedTAIL(
  portal_receiver_launcher_id: string,
  bridging_puzzle_hash: string,
  source_chain: string,
  source: string,
  source_chain_token_contract_address: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(WRAPPED_TAIL_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          getCATMinterPuzzle(portal_receiver_launcher_id, bridging_puzzle_hash, source_chain, source)
        )
      ),
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          getCATBurnInnerPuzzleFirstCurry(
            bridging_puzzle_hash, source_chain, source, source_chain_token_contract_address
          )
        )
      ),
    ]
  );
}

/*
def get_burn_inner_puzzle_solution(
    cat_burner_parent_id: bytes32,
    my_coin_id: bytes32,
    tail_reveal: Program
) -> Program:
  return Program.to([
    cat_burner_parent_id,
    my_coin_id,
    tail_reveal
  ])
*/
function getBurnInnerPuzzleSolution(
  cat_burner_parent_id: string,
  my_coin_id: string,
  tail_reveal: GreenWeb.clvm.SExp,
): GreenWeb.clvm.SExp {
  return SExp.to([
    GreenWeb.util.sexp.bytesToAtom(cat_burner_parent_id),
    GreenWeb.util.sexp.bytesToAtom(my_coin_id),
    tail_reveal
  ]);
}

/*
def get_cat_mint_and_payout_inner_puzzle_solution(
    tail_puzzle: Program,
    my_amount: int,
    parent_parent_info: bytes32,
) -> Program:
  return Program.to([
    tail_puzzle,
    my_amount,
    parent_parent_info
  ])
*/
function getCATMintAndPayoutInnerPuzzleSolution(
  tail_puzzle: GreenWeb.clvm.SExp,
  my_amount: number,
  parent_parent_info: string,
): GreenWeb.clvm.SExp {
  return SExp.to([
    tail_puzzle,
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.coin.amountToBytes(my_amount)
    ),
    GreenWeb.util.sexp.bytesToAtom(parent_parent_info)
  ]);
}

/*
def get_cat_minter_puzzle_solution(
    nonce: int,
    message: Program,
    my_puzzle_hash: bytes32,
    my_coin_id: bytes32,
    message_coin_parent_info: bytes32,
) -> Program:
  return Program.to([
    nonce,
    message,
    my_puzzle_hash,
    my_coin_id,
    message_coin_parent_info
  ])
*/
function getCATMinterPuzzleSolution(
  nonce: string,
  message_contents: any,
  my_puzzle_hash: string,
  my_coin_id: string,
  message_coin_parent_info: string,
): GreenWeb.clvm.SExp {
  return SExp.to([
    GreenWeb.util.sexp.bytesToAtom(nonce),
    message_contents.map((content: string) => GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.unhexlify(content)!
    )),
    GreenWeb.util.sexp.bytesToAtom(my_puzzle_hash),
    GreenWeb.util.sexp.bytesToAtom(my_coin_id),
    GreenWeb.util.sexp.bytesToAtom(message_coin_parent_info)
  ]);
}

/*
def get_cat_burner_puzzle_solution(
    cat_parent_info: bytes32,
    tail_hash: bytes32,
    cat_amount: int,
    source_chain_token_contract_address: bytes,
    destination_receiver_address: bytes,
    my_coin: Coin
) -> Program:
  return Program.to([
    cat_parent_info,
    raw_hash([b'\x01', tail_hash]),
    cat_amount,
    source_chain_token_contract_address,
    destination_receiver_address,
    my_coin.amount,
    my_coin.puzzle_hash,
    my_coin.name()
  ])
*/
function getCATBurnerPuzzleSolution(
  cat_parent_info: string,
  tail_hash: string,
  cat_amount: number,
  source_chain_token_contract_address: string,
  destination_receiver_address: string,
  my_coin: any,
): GreenWeb.clvm.SExp {
  return SExp.to([
    GreenWeb.util.sexp.bytesToAtom(cat_parent_info),
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.sexp.sha256tree(
        SExp.to(GreenWeb.util.sexp.bytesToAtom(tail_hash))
      )
    ),
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.coin.amountToBytes(cat_amount)
    ),
    GreenWeb.util.sexp.bytesToAtom(source_chain_token_contract_address),
    GreenWeb.util.sexp.bytesToAtom(destination_receiver_address),
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.coin.amountToBytes(my_coin.amount)
    ),
    GreenWeb.util.sexp.bytesToAtom(my_coin.puzzle_hash),
    GreenWeb.util.sexp.bytesToAtom(my_coin.name())
  ]);
}

export function mintCATs(
  message: any,
  portalCoinRecord: any,
  portalParentSpend: any,
  nonces: any,
  nonces_used_last_spend: string[],
  offer: string,
  sigs: string[],
  sig_switches: boolean[],
  source_chain: string,
  source_contract: string,
) {
  const {
    nonce,
    destination_chain,
    destination,
    contents
  } = message;

  const [ethAssetContract, xchReceiverPh, tokenAmount] = contents;
  const tokenAmountInt: number = parseInt(tokenAmount, 16);
  const offer_sb = offerToSpendBundle(offer);

  /* find source coin = coin with OFFER_MOD that will create CAT minter */
  var source_coin = new GreenWeb.Coin();

  for(var i = 0; i < offer_sb.coinSpends.length; ++i) {
    const coinSpend = offer_sb.coinSpends[i];

    var [_, conditionsDict, __] = GreenWeb.util.sexp.conditionsDictForSolution(
      coinSpend.puzzleReveal,
      coinSpend.solution,
      GreenWeb.util.sexp.MAX_BLOCK_COST_CLVM
    );
    var createCoinConds = conditionsDict!.get("33") ?? [];

    for(var j = 0; j < createCoinConds.length; ++j) {
      const cond = createCoinConds[j];

      if(tokenAmount.endsWith(cond.vars[1]) && cond.vars[0] === OFFER_MOD_HASH) {
        source_coin.parentCoinInfo = GreenWeb.util.coin.getName(coinSpend.coin);
        source_coin.puzzleHash = OFFER_MOD_HASH;
        source_coin.amount = tokenAmountInt;
        break;
      }
    }
  }

  /* beign building spend bundle */
  var coin_spends = offer_sb.coinSpends;
  var sigs = [
    offer_sb.aggregatedSignature
  ];

  /* spend portal to create message */
  const portalCoin = portalCoinRecord.coin;

  const updatePuzzle = getMOfNDelegateDirectPuzzle(
    MULTISIG_THRESHOLD,
    MULTISIG_KEYS
  );
  const portalInnerPuzzle = getPortalReceiverInnerPuzzle(
    PORTAL_RECEIVER_LAUNCHER_ID,
    PORTAL_THRESHOLD,
    PORTAL_KEYS,
    GreenWeb.util.sexp.sha256tree(updatePuzzle),
    nonces_used_last_spend
  );
  const portalPuzzle = GreenWeb.util.sexp.singletonPuzzle(PORTAL_RECEIVER_LAUNCHER_ID, portalInnerPuzzle);

  var portalParentInnerPuzHash = null;
  const parentPuzzle = GreenWeb.util.sexp.fromHex(
    GreenWeb.util.unhexlify(portalParentSpend.puzzle_reveal)!
  );
  if(GreenWeb.util.sexp.sha256tree(parentPuzzle ) !== SINGLETON_LAUNCHER_HASH) {
    const [_, args] = GreenWeb.util.sexp.uncurry(parentPuzzle)!;
    const innerPuzzle = args[1];
    portalParentInnerPuzHash = GreenWeb.util.sexp.sha256tree(innerPuzzle);
  }
  const portalLineageProof = portalParentInnerPuzHash !== null ? SExp.to([
    Bytes.from(portalParentSpend.coin.parent_coin_info, "hex"),
    Bytes.from(portalParentInnerPuzHash, "hex"),
    Bytes.from("01", "hex"),
  ]) : SExp.to([
    Bytes.from(portalParentSpend.coin.parent_coin_info, "hex"),
    Bytes.from("01", "hex"),
  ]);

  const portalInnerSolution = getPortalReceiverInnerSolution(
    sig_switches,
    nonce,
    source_chain,
    GreenWeb.util.unhexlify(source_contract)!,
    destination,
    contents
  );
  const portalSolution = GreenWeb.util.sexp.singletonSolution(
    portalLineageProof,
    1,
    portalInnerSolution
  );

  const portalCoinSpend = new GreenWeb.util.serializer.types.CoinSpend();
  portalCoinSpend.coin = GreenWeb.util.goby.parseGobyCoin(portalCoin)!;
  portalCoinSpend.puzzleReveal = portalPuzzle;
  portalCoinSpend.solution = portalSolution;
  coin_spends.push(portalCoinSpend);

  /* spend source coin to create minter */
  const minterPuzzle = getCATMinterPuzzle(
    PORTAL_RECEIVER_LAUNCHER_ID,
    BRIDGING_PUZZLE_HASH,
    source_chain,
    GreenWeb.util.unhexlify(source_contract)!
  );
  const minterPuzzleHash = GreenWeb.util.sexp.sha256tree(minterPuzzle);
  const sourceCoinSolution = SExp.to([
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.unhexlify(nonce)!
      ),
      [
        GreenWeb.util.sexp.bytesToAtom(minterPuzzleHash),
        tokenAmountInt
      ]
    ],
  ]);

  const sourceCoinSpend = new GreenWeb.util.serializer.types.CoinSpend();
  sourceCoinSpend.coin = source_coin;
  sourceCoinSpend.puzzleReveal = GreenWeb.util.sexp.fromHex(OFFER_MOD);
  sourceCoinSpend.solution = sourceCoinSolution;
  coin_spends.push(sourceCoinSpend);

  /* spend minter coin */
  const minterCoin = new GreenWeb.Coin();
  minterCoin.parentCoinInfo = GreenWeb.util.coin.getName(source_coin);
  minterCoin.puzzleHash = minterPuzzleHash;
  minterCoin.amount = tokenAmountInt;

  const minterSolution = getCATMinterPuzzleSolution(
    GreenWeb.util.unhexlify(nonce)!,
    contents,
    xchReceiverPh,
    GreenWeb.util.coin.getName(minterCoin),
    GreenWeb.util.coin.getName(portalCoinSpend.coin)
  );

  const minterCoinSpend = new GreenWeb.util.serializer.types.CoinSpend();
  minterCoinSpend.coin = minterCoin;
  minterCoinSpend.puzzleReveal = minterPuzzle;
  minterCoinSpend.solution = minterSolution;
  coin_spends.push(minterCoinSpend);
  
  /* spend message coin */
  const messagePuzzle = getMessageCoinPuzzle();

  const messageCoin = new GreenWeb.Coin();
  messageCoin.parentCoinInfo = GreenWeb.util.coin.getName(portalCoinSpend.coin);
  messageCoin.puzzleHash = GreenWeb.util.sexp.sha256tree(messagePuzzle);
  messageCoin.amount = 0;

  /* spend eve CAT coin */
  // todo

  /* lastly, aggregate sigs  and build spend bundle */

  const sb = new GreenWeb.util.serializer.types.SpendBundle();
  sb.coinSpends = coin_spends;
  sb.aggregatedSignature = sigs[0]; // todo
  console.log( sbToString(sb) );
}
