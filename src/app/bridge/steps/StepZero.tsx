"use client"

import { useAccount, useAccountEffect } from "wagmi"
import { Network, NETWORKS, NetworkType, TOKENS } from "./../config"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Token } from "../config"
import { getStepOneURL } from "./urls"
import { useWallet } from "../ChiaWalletManager/WalletContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"


export default function StepZero() {
  const router = useRouter()
  const [
    tokenSymbol, setTokenSymbol
  ] = useState(TOKENS[0].symbol)

  const token = TOKENS.find((t: Token) => t.symbol === tokenSymbol)!
  const networks: Network[] = Array.from(new Set(
    token.supported.flatMap(info => [info.evmNetworkId, info.coinsetNetworkId])
  )).map((id: string) => NETWORKS.find((n: Network) => n.id === id)!)

  const [
    sourceNetworkId, setSourceNetworkId
  ] = useState(
    token.sourceNetworkType !== NetworkType.EVM ? token.supported[0].coinsetNetworkId : token.supported[0].evmNetworkId
  )
  const [
    destinationNetworkId, setDestinationNetworkId
  ] = useState(
    token.sourceNetworkType === NetworkType.EVM ? token.supported[0].coinsetNetworkId : token.supported[0].evmNetworkId
  )
  const [
    amount, setAmount
  ] = useState("")
  const [
    destinationAddress, setDestinationAddress
  ] = useState("")
  const account = useAccount()

  useAccountEffect({
    onConnect: (account) => {
      if (account?.address !== undefined && NETWORKS.find((n: Network) => n.id === destinationNetworkId)?.type === NetworkType.EVM) {
        setDestinationAddress(account!.address)
      }
    }
  })

  const goToFirstStep = async () => {
    router.push(getStepOneURL({
      sourceNetworkId,
      destinationNetworkId,
      tokenSymbol,
      recipient: destinationAddress,
      amount
    }))
  }

  const { walletConnected, address } = useWallet()

  const updateDestinationAddress = (destNetworkId: string) => {
    if (account?.address !== undefined && NETWORKS.find((n: Network) => n.id === destNetworkId)?.type === NetworkType.EVM) {
      setDestinationAddress(account!.address)
    } else {
      if (walletConnected && address && NETWORKS.find((n: Network) => n.id === destNetworkId)?.type === NetworkType.COINSET) {
        setDestinationAddress(address)
      } else {
        setDestinationAddress("")
      }
    }
  }

  const [sourceNetworks, setSourceNetworks] = useState(networks.filter(opt => opt.displayName !== "Chia"))
  const [destinationNetworks, setDestinationNetworks] = useState(networks.filter(opt => opt.displayName === "Chia"))

  const swapNetworks = () => {
    const newSourceNetworks = [...destinationNetworks]
    const newDestinationNetworks = [...sourceNetworks]
    setSourceNetworks(newSourceNetworks)
    setDestinationNetworks(newDestinationNetworks)

    const temp = sourceNetworkId
    setSourceNetworkId(destinationNetworkId)
    setDestinationNetworkId(temp)

    updateDestinationAddress(temp)
  }


  useEffect(() => {
    if (!address) {
      setDestinationAddress("")
    }
    if (walletConnected && address && NETWORKS.find((n: Network) => n.id === destinationNetworkId)?.type === NetworkType.COINSET) {
      setDestinationAddress(address)
    }
  }, [walletConnected, address, destinationNetworkId])

  const onTokenChange = (newValue: string) => {
    const newToken = TOKENS.find((t: Token) => t.symbol === newValue)!
    setTokenSymbol(newValue)

    if (newToken.sourceNetworkType !== sourceNetworks[0].type) {
      swapNetworks()
    }

    setSourceNetworkId(
      newToken.sourceNetworkType !== NetworkType.EVM ?
        newToken.supported[0].coinsetNetworkId : newToken.supported[0].evmNetworkId
    )

    const destNetworkId = newToken.sourceNetworkType === NetworkType.EVM ?
      newToken.supported[0].coinsetNetworkId : newToken.supported[0].evmNetworkId
    setDestinationNetworkId(destNetworkId)
    updateDestinationAddress(destNetworkId)
  }

  return (
    <>
      <div className="max-w-md mx-auto w-full grow flex flex-col justify-center py-8">
        <div className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">


              {/* <div className="flex justify-right items-center">
                <div className="flex items-center h-[74px] bg-accent border rounded-lg w-full p-1 pl-4">
                  <label htmlFor="tokenSelector" className="text-2xl pr-4 mr-auto">Token</label>
                  <Select defaultValue={tokenSymbol} onValueChange={onTokenChange}>
                    <SelectTrigger id="tokenSelector" className="text-2xl w-[130px] h-full pr-4 border-0 bg-theme-purple hover:opacity-80 rounded-sm">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((t: Token) => (
                        <SelectItem key={t.symbol} value={t.symbol} className="text-2xl">{t.symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div> */}


              {/* Chain Selector/Switcher */}
              <div className="bg-accent border border-input rounded-lg p-2 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-500">
                <BlockchainDropdown
                  label="From"
                  options={networks.filter(i => i.id !== destinationNetworkId)}
                  selectedValue={sourceNetworkId}
                  updateSelectedValue={setSourceNetworkId}
                />
                <Button
                  variant="ghost"
                  type="button"
                  className="mx-2 p-2 border-0 text-neutral-500 hover:opacity-80 rounded-xl"
                  onClick={swapNetworks}
                >
                  <ChevronRight />
                  {/* <ArrowRight /> */}
                  {/* <ChangeArrow /> */}
                </Button>
                <BlockchainDropdown
                  label="To"
                  options={networks.filter(i => i.id !== sourceNetworkId)}
                  selectedValue={destinationNetworkId}
                  updateSelectedValue={setDestinationNetworkId}
                />
              </div>




              {/* Amount Input & Token Selector */}
              <div className="flex flex-col gap-4 bg-accent border rounded-lg p-2 animate-[delayed-fade-in_0.7s_ease_forwards]">

                <div className="flex items-center h-16 w-full gap-2">
                  <label htmlFor="tokenSelector" className="text-2xl pr-4 mr-auto sr-only">Token amount</label>
                  <Input
                    type="text"
                    placeholder="Amount"
                    className="text-2xl h-full border-0"
                    pattern="^\d*(\.\d{0,8})?$"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <Select defaultValue={tokenSymbol} value={tokenSymbol} onValueChange={onTokenChange}>
                    <SelectTrigger id="tokenSelector" className="text-2xl w-[180px] h-full pr-4 border-0 bg-theme-purple hover:opacity-80 rounded-sm">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TOKENS.map((t: Token) => (
                        <SelectItem key={t.symbol} value={t.symbol} className="text-2xl">{t.symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={cn("flex justify-center", !walletConnected || account?.address == undefined || !Boolean(amount) && 'cursor-not-allowed')}>
                  {
                    <Button
                      type="submit"
                      className="w-full h-16 bg-theme-purple hover:bg-theme-purple text-primary hover:opacity-80 text-2xl"
                      onClick={goToFirstStep}
                      disabled={Boolean(!amount) || !walletConnected || account?.address == undefined}
                    >
                      {
                        (!walletConnected || account?.address == undefined) ? "Connect Wallets First"
                          :
                          Boolean(amount) ? "Bridge" : "Enter an Amount"
                      }
                    </Button>
                  }
                </div>


              </div>


              {/* <div className="flex relative h-16">
                <Input
                  type="text"
                  placeholder="Amount"
                  className="text-2xl h-full"
                  pattern="^\d*(\.\d{0,8})?$"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div> */}
              {/* <Input
                type="text"
                disabled
                placeholder="Receive Address"
                className="w-full px-2 py-2 border border-zinc-700 rounded outline-none bg-zinc-800 text-zinc-300 placeholder-zinc-500 text-lg"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
              /> */}

            </div>


          </div>
        </div>
      </div>
    </>
  )
}


type BlockchainDropdownProps = {
  label: string
  options: Network[]
  selectedValue: string
  updateSelectedValue: (value: string) => void
}
function BlockchainDropdown({ label, options, selectedValue, updateSelectedValue }: BlockchainDropdownProps) {
  return (
    <Select onValueChange={updateSelectedValue} value={selectedValue} defaultValue={selectedValue}>
      <SelectTrigger className="text-2xl border-0 rounded-sm hover:opacity-80 h-16">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        {options.map((n) => (
          <SelectItem className="text-2xl" key={n.id} value={n.id}>{n.displayName}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


// https://heroicons.com/ 
function ChangeArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  )
}
