var TFTTeamCode = require("./TFT.js");

(async () => {
    var result = await new TFTTeamCode().setTeamcode("0235801a03435d35b332025336331000TFTSet16").build();
    console.log(`Set: ${result.setId}`);
    console.log(`Số lượng tướng: ${result.teamLength}`);
    console.table(result.team);
})()
