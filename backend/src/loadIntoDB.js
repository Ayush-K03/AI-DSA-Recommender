import { parseCSV,convertAndSend } from "./sendToDataBase";


export async function loadData() {
    console.log("Start parsing CSV...");
    const quesDataset = await parseCSV();
    await convertAndSend(quesDataset)
    console.log("Finally Done")
}

loadData().catch(console.error);