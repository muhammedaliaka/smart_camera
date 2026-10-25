# Anti-copy: what slows reverse engineering and what does not

Read only when the user asks to protect a shipped product from copying or from AI reverse-engineering tools. Not an audit: a decision aid. Labels: [official] vendor page or package text read on 2026-10-25, [reasoning] my inference, [common practice] not tested here. Full study and plan: `.pusula/build-shield/` (findings.md has every source).

## Start from the truth
- Anything that runs on the user's machine can be read, given time. No tool makes copying impossible; each layer only raises the cost. OWASP says the same of obfuscation. [official]
- The tool people mean is **REA** (`morluto/rea`, npm `rea-agents`, MIT): an MCP server and CLI that lets a coding agent inspect a build. Targets include JavaScript and Electron (modules, imports, source maps, routes), websites, .NET (metadata and CIL), Unity IL2CPP metadata, APKs, Flutter, native code through Ghidra, IDA or Hopper. It can also build an "agent environment" from recorded web traffic (HAR). It does not claim to recover original source. [official] ReVa is a different tool (Ghidra only). Many repos copy REA's README: use only `morluto/rea`.
- Decide the threat first: a casual cloner with an agent, a studio, or a cheater. Ask the user which one.

## Layers, best value first
1. **Do not ship free gifts.** Source maps, `*.pdb`, plain `global-metadata.dat`, `.env`. REA reads source maps explicitly; Next.js leaves them out unless `productionBrowserSourceMaps` is true. Check the release folder before anything else. [official]
2. **Keep value off the client.** Accounts, purchases, ranked results, balance data, anti-cheat checks and every secret live on a server that validates each action. [reasoning]
3. **Know what the design forces to ship.** A deterministic lockstep RTS runs the full simulation on each client, so its rules ship with the game. Protect what can be protected: services, content, data, brand, terms. [reasoning]
4. **Unity.** Mono ships managed DLLs that decompile to readable C#. IL2CPP raises the cost, but `global-metadata.dat` is a plain file that Il2CppDumper and Cpp2IL read, and REA decodes versions 24, 27, 29, 31 and 39; it says unrecognized (possibly encrypted) magic is unsupported. BitMono documents a protection that encrypts the file. Runtime memory and native-code analysis still remain. [official, untested here]
5. **JavaScript.** Minify, no source maps. Free obfuscation is a speed bump: in our test webcrack undid both javascript-obfuscator presets and a coding agent rebuilt all three test functions from every build, paying only 16-71% more; on a harder 8-function fixture 11 of 12 runs were perfect (`.pusula/build-shield/findings.md`; small fixtures we wrote, no game-sized code yet). javascript-obfuscator (BSD-2) states 15-80% slower code and larger files, control-flow flattening up to 1.5x slower; its VM options are paid and need an API token. Wakaru (used by REA for source recovery) says heavy control-flow or VM obfuscation needs a different approach; webcrack deobfuscates obfuscator.io output. [official]
6. **Flutter.** `--obfuscate --split-debug-info` only renames symbols; it does not encrypt resources. [official]
7. **Behavior cannot be hidden.** Traffic and runtime behavior can be recorded and replayed. Defend the API: auth on every request, per-user scoping, rate limits, minimal responses. Measured on a toy API: REA copied a whole open balance table and all players from six recorded requests; with login, scoping and minimal answers it copied only the recorder's own data, and server-side validation never showed. Data a client must receive is still copied. [official for the capability, measured for the defense]
8. **Terms and law.** An EULA clause against reverse engineering, plus a takedown process. A lawyer decides; REA's README itself excludes unauthorized analysis. [common practice]
9. **Make copies provable.** A private build ID in several places shows where a leak came from. [common practice]

## Measure, do not guess
Vendors give no resilience numbers and OWASP has no standard metric. Run the same REA commands on the plain and the protected build. Raw counts rise under obfuscation (measured), so compare recall: how many of the plain build's names, strings, routes and constants are still found. Run the deobfuscator an attacker would use as well. Record the REA version; it ships almost daily. Leak check: `pusula_check.py --only shield` (opt-in; needs `.pusula/shield.config.json`). See `.pusula/build-shield/plan.md`.

## Do not
- Promise "unbreakable". Say "recovers X% fewer" and name the attacker it stops.
- Put keys, tokens or admin endpoints in client code, encrypted or not. The key ships too.
- Add obfuscation before layers 1 and 2 are done. It protects the least valuable part.
- Install REA with `setup` or from a look-alike repo. Use the CLI, `--ignore-scripts`, and scan first.
