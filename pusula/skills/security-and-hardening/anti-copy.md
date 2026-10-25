# Anti-copy: what slows reverse engineering and what does not

Read only when the user asks to protect a shipped product from copying or from AI reverse-engineering tools. Not an audit: a decision aid. Labels: [official] vendor page read on 2026-10-25, [reasoning] my inference, [common practice] not tested here.

## Start from the truth
- Anything that runs on the user's machine can be read, given time. No tool makes copying impossible; each layer only raises the cost. [reasoning]
- AI tools lower that cost. ReVa is a Ghidra extension and MCP server that lets a model read decompiled code, strings and cross references; its README says it handles large binaries and firmware. [official: github.com/cyberkaida/reverse-engineering-assistant, README says Ghidra 12+]
- So decide the threat first: a casual cheater, a cloner, or a studio. Ask the user which one before adding anything.

## Layers, best value first
1. **Keep value off the client.** Accounts, purchases, ranked results, balance data, anti-cheat checks and every secret live on a server that validates each action. A client cannot leak what it never held. [reasoning]
2. **Know what the design forces to ship.** A deterministic lockstep RTS runs the full simulation on each client, so its rules ship with the game. Protect what can be protected: server-side services, content and data, brand, terms. [reasoning]
3. **Unity builds.** A Mono build ships managed DLLs that decompile to readable C#. IL2CPP compiles to C++ ahead of time (Unity manual), which raises the cost. But `global-metadata.dat` is a plain parseable file, and Il2CppDumper and Cpp2IL read names and strings from it. [official: BitMono 0.41.1 docs]
4. **Obfuscation is a cost, not a lock.** BitMono (renaming, string encryption, and a protection that encrypts `global-metadata.dat`, per its docs) targets Unity. It can break reflection and slow builds; test every release. Not installed and not run here. [official docs, untested]
5. **Terms and law.** An EULA clause against reverse engineering, plus a takedown process. Rules differ by country; a lawyer decides. [common practice]
6. **Make copies provable.** A unique marker per build or per asset pack (canary strings, near-invisible watermarks) shows where a leak came from. [common practice]

## Do not
- Promise "unbreakable". Say "raises the cost" and name the attacker it stops.
- Put keys, tokens or admin endpoints in client code, encrypted or not. The decryption key ships too.
- Add obfuscation before layer 1 is done. It protects the least valuable part.
