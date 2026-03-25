# tft-teamcode-decoder

A lightweight Node.js library for decoding TFT team codes into structured champion data, powered by the [Community Dragon](https://www.communitydragon.org/) API.

---

## Overview

TFT team codes (e.g. `0235801a03435d35b332025336331000TFTSet16`) are compact hex strings that encode an entire team composition. This library parses and decodes them into human-readable champion data — including names, costs, and internal IDs — with no API key required.

---
---

## Author 

<div align="center">
  <a href="https://github.com/ttkienn">
    <img src="https://github.com/ttkienn.png" width="110" height="110" style="border-radius: 50%; border: 2px solid #e1e4e8;" alt="Thiệu Trung Kiên"/>
  </a>
  
  <h3><b>Thiệu Trung Kiên</b></h3>
  <a href="https://github.com/ttkienn">
    <img src="https://img.shields.io/badge/GitHub-ttkienn-181717?style=flat-square&logo=github" alt="GitHub"/>
  </a>
  &nbsp;
  <a href="https://www.facebook.com/ttkiennn">
    <img src="https://img.shields.io/badge/Facebook-Thiệu_Trung_Kiên-1877F2?style=flat-square&logo=facebook&logoColor=white" alt="Facebook"/>
  </a>
</div>

---
## Features

- Supports both **v1** (2-byte chunks) and **v2** (3-byte chunks) team code formats
- Compatible with any TFT set — `TFTSet16`, `TFTSet14_Act2`, and beyond
- Zero configuration — uses Community Dragon's public API out of the box

---

## Installation

```bash
npm install
```

---

## Usage

```js
const TFTTeamCode = require('./TFT.js');

async function getTeam() {
  const result = await new TFTTeamCode()
    .setTeamcode("0235801a03435d35b332025336331000TFTSet16")
    .build();

  console.log(`Set: ${result.setId}`);
  console.log(`Champions: ${result.teamLength}`);
  console.table(result.team);
}

getTeam();
```

### Example Output

```json
{
  "setId": "TFTSet16",
  "teamLength": 9,
  "team": [
    { "championId": "TFT16_Kindred",      "name": "Kindred",        "cost": 5 },
    { "championId": "TFT16_Skarner",      "name": "Skarner",        "cost": 4 },
    { "championId": "TFT16_Lucian",       "name": "Lucian & Senna", "cost": 5 },
    { "championId": "TFT16_Shyvana",      "name": "Shyvana",        "cost": 5 },
    { "championId": "TFT16_Fiddlesticks", "name": "Fiddlesticks",   "cost": 5 },
    { "championId": "TFT16_Ambessa",      "name": "Ambessa",        "cost": 4 },
    { "championId": "TFT16_Swain",        "name": "Swain",          "cost": 4 },
    { "championId": "TFT16_Taric",        "name": "Taric",          "cost": 4 },
    { "championId": "TFT16_Draven",       "name": "Draven",         "cost": 3 }
  ]
}
```

---

## Return Value

### `DecodeResult`

| Field        | Type          | Description                        |
|--------------|---------------|------------------------------------|
| `setId`      | `string`      | TFT set identifier (e.g. `TFTSet16`) |
| `teamLength` | `number`      | Number of champions decoded        |
| `team`       | `Champion[]`  | Array of decoded champion objects  |

### `Champion`

| Field         | Type     | Description                    |
|---------------|----------|--------------------------------|
| `championId`  | `string` | Riot's internal champion ID    |
| `name`        | `string` | Display name                   |
| `cost`        | `number` | Gold cost (1–5)                |

---

## API Reference

### `TFTTeamCode`

| Method               | Required | Description                                              |
|----------------------|----------|----------------------------------------------------------|
| `.setTeamcode(code)` | ✅        | Provide the team code string to decode                   |
| `.setDataSource(url)`| ❌        | Override the data source URL (useful for testing)        |
| `.build()`           | ✅        | Fetches champion data and decodes — returns `Promise<DecodeResult>` |

### `ChampionMappingBuilder`

Internal builder responsible for constructing v1/v2 index maps from raw Community Dragon data.

| Method           | Description                                  |
|------------------|----------------------------------------------|
| `.from(champions)` | Accepts a raw champion array as input      |
| `.build()`         | Returns a `{ v1, v2 }` index object       |

---

## Team Code Format

```
0235801a03435d35b332025336331000TFTSet16
│└─────────────────────────────┘└───────┘
│           hexString             setId
└─ prefix
```

| Segment     | Example     | Description                                                  |
|-------------|-------------|--------------------------------------------------------------|
| `prefix`    | `02`        | Encoding version — `02` = v2 (3-byte chunks), otherwise v1 (2-byte) |
| `hexString` | `35801a03…` | Hex-encoded champion data                                    |
| `setId`     | `TFTSet16`  | Determines which champion pool to reference                  |


## License

[MIT](./LICENSE) — free to use, modify, and distribute.
