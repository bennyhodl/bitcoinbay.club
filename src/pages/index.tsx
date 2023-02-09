import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import logo from "../../public/logo.png"

export default function Home() {
  const [pubkey, setPubkey] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const doTheThing = async (name: string, pubkey:string) => {
    const nostr = await axios.post(process.env.API_URL as string, {name: name, pubkey: pubkey})
    if (nostr.data.status === "failed") setSuccess(`It failed. Tell Ben he sucks.`)
    setSuccess(`Welcome to the club! Add ${name}@bitcoinbay.club to your nostr client.`) 
  }
  return (
    <>
      <Head>
        <title>Bitcoin Bay Club</title>
        <meta name="description" content="Join the Bitcoin Bay NIP-05 Club!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet"></link>
      </Head>
      <div style={{textAlign: "center", width: "50%", height: "100vh", margin: "auto", fontFamily: "Roboto Mono"}}>
        <h1>Join the Bitcoin Bay Club!</h1>
        <Image src={logo} alt="Bitcoin Bay Logo" width={320} height={250} />
        <form style={{textAlign: "start"}}>
          <label>Name: </label>
          <input title='Name' value={name} onChange={(e) => setName(e.target.value)}/>
          <br/>
          <label>Pubkey: </label>
          <input title='Pubkey' value={pubkey} onChange={(e) => setPubkey(e.target.value)}/>
        </form>
        <button onClick={() => doTheThing(name, pubkey)}>Add nip</button>
        {success !== "" && <p>{success}</p>}
      </div>
    </>
  )
}
