const axios = require("axios");


const COMMUNITY_DRAGON_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/tftchampions-teamplanner.json";

const TEAMCODE_REGEX = /^(..)(.*?)(TFTSet\d+(?:_Act\d+)?)$/i;


class ChampionMappingBuilder {
  #champions = [];

  from(champions) {
    this.#champions = champions;
    return this;
  }

  #toChampion(raw) {
    return {
      championId: raw.character_id,
      name: raw.display_name,
      cost: raw.tier,
    };
  }

  #buildV1() {
    return Object.fromEntries(
      [...this.#champions]
        .sort((a, b) => a.character_id.localeCompare(b.character_id))
        .map((c, i) => [i + 1, this.#toChampion(c)])
    );
  }

  #buildV2() {
    return Object.fromEntries(
      this.#champions
        .filter((c) => c.team_planner_code)
        .map((c) => [c.team_planner_code, this.#toChampion(c)])
    );
  }

  build() {
    if (!this.#champions.length) {
      throw new Error("No champions provided. Call .from() first.");
    }

    return {
      v1: this.#buildV1(),
      v2: this.#buildV2(),
    };
  }
}


class TFTTeamCode {
  #teamcode = null;
  #url = COMMUNITY_DRAGON_URL;

  setTeamcode(teamcode) {
    this.#teamcode = teamcode;
    return this;
  }

  setDataSource(url) {
    this.#url = url;
    return this;
  }

  #parse() {
    if (!this.#teamcode?.trim()) {
      throw new Error("teamcode is required. Call .setTeamcode() first.");
    }

    const match = this.#teamcode.match(TEAMCODE_REGEX);
    if (!match) {
      throw new Error(`Invalid teamcode format: "${this.#teamcode}"`);
    }

    const [, prefix, hexString, setId] = match;
    const isV2 = prefix === "02";

    return { hexString, setId, isV2 };
  }

  async #fetchMapping(setId) {
    const { data, status, statusText } = await axios.get(this.#url);

    if (!data) {
      throw new Error(`Request failed: ${status} ${statusText}`);
    }
    if (!data[setId]) {
      throw new Error(`No champion data found for "${setId}"`);
    }

    return new ChampionMappingBuilder().from(data[setId]).build();
  }

  #resolveTeam(hexString, isV2, mapping) {
    const chunkSize = isV2 ? 3 : 2;

    return (
      hexString
        .match(new RegExp(`.{1,${chunkSize}}`, "g"))
        ?.map((hex) => parseInt(hex, 16))
        .filter((code) => code !== 0)
        .map((code) => (isV2 ? mapping.v2[code] : mapping.v1[code]))
        .filter(Boolean) ?? []
    );
  }

  async build() {
    const { hexString, setId, isV2 } = this.#parse();
    const mapping = await this.#fetchMapping(setId);
    const team = this.#resolveTeam(hexString, isV2, mapping);

    return { setId, teamLength: team.length, team };
  }
}

module.exports = TFTTeamCode;
