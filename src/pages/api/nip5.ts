// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { readFileSync, writeFileSync } from 'fs'
import {bech32} from "bech32"

function npubToHex(npub: string) {
  const { prefix, words } = bech32.decode(npub);
  if (prefix === 'npub') {
    const bytes = bech32.fromWords(words).slice(0, 32);
    const pubkey = Buffer.from(bytes).toString('hex');
    return pubkey;
  }
  throw new Error('not an npub key');
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const {name, pubkey} = req.body
    if (name === "" || pubkey === "") return res.status(400).json({status: "failed"})
    const path = process.env.FILE_PATH
    const currentWellKnown = readFileSync(path as string).toString()
    const currentWellKnownJson = JSON.parse(currentWellKnown)

    const hexPubkey = npubToHex(pubkey)
    
    const newWellKnown = {names: {...currentWellKnownJson.names, [name]: hexPubkey}}
    const writeBuffer = Buffer.from(JSON.stringify(newWellKnown))
    
    writeFileSync(path as string, writeBuffer)

    return res.status(200).json({status: "success"})
  } catch (e) {
    return res.status(400).json({status: "failed"})
  }
}
