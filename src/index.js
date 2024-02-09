import "dotenv/config";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

(async () => {
    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet("1ZuYgCXHIZkpd3rT3InlOeferXP5c5XOB40oCM8E8HoY", serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow(3)
    
    const rows = await sheet.getRows();
    await sheet.loadCells('A1:H27');

    for(var i=0; i< 24 ;i++){
        var miss = parseInt(rows[i].get('Faltas'));

        if(miss > 15){
            sheet.getCell(i+3,6).value = "Reprovado por Falta";
            sheet.getCell(i+3,7).value = 0;
        }
        else{
            var first = parseInt(rows[i].get('P1'));
            var second = parseInt(rows[i].get('P2'));
            var third = parseInt(rows[i].get('P3'));
            var average = Math.ceil((first+second+third)/3).toFixed(0);

            if(average >= 70){
                sheet.getCell(i+3,6).value ="Aprovado";
                sheet.getCell(i+3,7).value = 0;
                
            }
            else if(average < 50){
                sheet.getCell(i+3,6).value ="Reprovado por Nota";
                sheet.getCell(i+3,7).value = 0;
            }
            else{
                var nfa = 2*70 - average;
                sheet.getCell(i+3,6).value ="Exame Final";
                sheet.getCell(i+3,7).value = nfa;
            }
        }
    }
    await sheet.saveUpdatedCells();

})();
