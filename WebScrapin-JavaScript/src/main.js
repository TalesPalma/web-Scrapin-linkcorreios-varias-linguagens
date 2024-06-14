
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchContent(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);


  const regex = /[A-Z]{2}\d{9}[A-Z]{2}/;
  const codigo = $('h2:contains("Útimo Status do Objeto:")').text().trim().match(regex);
  const dataHora = []
  const statusEntrega = []
  const local = []
  $('li:contains("Status:")').each(function() {
    const status = $(this).find('b').text().trim();
    const data = $(this).next('li').text().trim().replace('Data : ', '');
    const localt = $(this).next('li').next('li').text().trim().replace('Local: ', '');
    statusEntrega.push(status);
    local.push(localt);
    dataHora.push(data);
  })

  return {
    codigo,
    statusEntrega,
    dataHora,
    local
  };
}

function saveCSV({ codigo, statusEntrega, dataHora, local }, fileName) {
  const headers = ['codigo', 'Status', 'Data e Hora', 'Local'];

  let content = [""];



  for (let i = 0; i < statusEntrega.length; i++) {
    content.push(`\n${codigo},${statusEntrega[i]},${dataHora[i]},${local[i]}`)
  }




  const csvContent =
    `${headers}\n` +
    content.map(item => item);

  console.log(csvContent)

  fs.writeFileSync(fileName, csvContent, 'utf-8');
}



async function main() {
  const id = "DO+740+707+842+BR"
  const url = `https://www.linkcorreios.com.br/?id=${id}`;
  const content = await fetchContent(url);
  saveCSV(content, 'output.csv');
  console.log(`As informações foram salvas em output.csv`);
}

main();


